import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Phone, RotateCcw, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { openingChips, respond, type BotContext, type Chip, type Reply } from '@/lib/intent';
import { buildGreeting, visitorClock } from '@/lib/time';
import { getService, type ServiceSlug } from '@/data/services';
import { CONTACT } from '@/app/siteConfig';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';
import { flush, recordChatbotMessage, recordChatbotOpened } from '@/lib/session';
import { readChatHistory, saveChatHistory, type VisitorMemory } from '@/lib/visitorMemory';
import { trackEvent } from '@/lib/utils';

interface Message {
  id: number;
  role: 'visitor' | 'assistant';
  text: string;
  chips?: Chip[];
  /** Rendered as a muted footnote under the bubble. */
  footnote?: string;
  resumePath?: string;
}

export interface ChatAssistantProps {
  /** Service slug from the current route, used to bias every answer. */
  activeService?: ServiceSlug;
  /** Services opened this session, in order. */
  seenServices: ServiceSlug[];
  returningVisitor: VisitorMemory | null;
}

let messageCounter = 0;
const nextId = () => ++messageCounter;

/** After this many substantive exchanges we offer to get a human involved. */
const HANDOVER_AFTER = 4;

export function ChatAssistant({ activeService, seenServices, returningVisitor }: ChatAssistantProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() =>
    readChatHistory().map((message) => ({ id: nextId(), ...message })),
  );
  const [resumePromptDismissed, setResumePromptDismissed] = useState(false);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(true);
  const [input, setInput] = useState('');

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const autoOpenedRef = useRef(false);

  /* ── Context ─────────────────────────────────────────────────── */

  const context: BotContext = useMemo(
    () => {
      const rememberedInterest = returningVisitor?.primaryInterest;
      const rememberedService = rememberedInterest && getService(rememberedInterest as ServiceSlug)
        ? (rememberedInterest as ServiceSlug)
        : undefined;

      return {
        path: location.pathname,
        activeService,
        seenServices: [
          ...new Set<ServiceSlug>([
            ...(returningVisitor?.servicesViewed ?? []).filter((service): service is ServiceSlug =>
              Boolean(getService(service as ServiceSlug)),
            ),
            ...seenServices,
          ]),
        ],
        greeted: messages.length > 0,
        leadInterest: false,
        primaryInterestHint:
          rememberedService ?? seenServices[seenServices.length - 1] ?? activeService,
      };
    },
    [location.pathname, activeService, seenServices, messages.length, returningVisitor],
  );

  const [greeting] = useState(() => buildGreeting());

  /* ── Message plumbing ────────────────────────────────────────── */

  const pushAssistant = useCallback(
    (reply: Reply) => {
      setTyping(true);
      const delay = reduced ? 120 : 420;

      const timer = window.setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: 'assistant',
            text: reply.text,
            chips: reply.chips,
            footnote: reply.noted.length
              ? `Noted: ${reply.noted.join(' · ')} — we'll carry that into the enquiry.`
              : undefined,
          },
        ]);
      }, delay);

      timers.current.push(timer);
    },
    [reduced],
  );

  const openPanel = useCallback(() => {
    setOpen(true);
    setUnread(false);

    setMessages((prev) => {
      const fresh = buildGreeting({
        service: activeService ? getService(activeService)?.label : undefined,
      });

      const initial = prev.length
        ? prev
        : returningVisitor
          ? []
          : [
            {
              id: nextId(),
              role: 'assistant' as const,
              text: `${fresh.line}\n\n${fresh.lead}`,
              chips: openingChips({ ...context, greeted: false }),
            },
          ];

      if (returningVisitor && !resumePromptDismissed && !prev.some((message) => message.resumePath)) {
        const interest = returningVisitor.primaryInterest
          ? getService(returningVisitor.primaryInterest as ServiceSlug)?.label
          : undefined;
        return [
          ...initial,
          {
            id: nextId(),
            role: 'assistant',
            text: `${greeting.salutation}, welcome back${interest ? ` — you were exploring ${interest}` : ''}. Would you like to continue where you left off?`,
            resumePath: returningVisitor.lastPath,
          },
        ];
      }

      return initial;
    });

    recordChatbotOpened();
    trackEvent('assistant_open', { path: location.pathname, service: activeService ?? 'none' });
  }, [activeService, context, greeting.salutation, location.pathname, returningVisitor, resumePromptDismissed]);

  useEffect(() => {
    if (!returningVisitor || autoOpenedRef.current) return;

    const key = 'virya.returning-welcome';
    try {
      if (sessionStorage.getItem(key) === returningVisitor.visitorId) {
        autoOpenedRef.current = true;
        return;
      }
      sessionStorage.setItem(key, returningVisitor.visitorId);
    } catch {
      // Auto-open once in this component lifetime if storage is unavailable.
    }

    autoOpenedRef.current = true;
    openPanel();
  }, [openPanel, returningVisitor]);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || typing) return;

      setInput('');
      setMessages((prev) => [...prev, { id: nextId(), role: 'visitor', text: trimmed }]);
      recordChatbotMessage(activeService ?? null);
      trackEvent('assistant_message', {
        path: location.pathname,
        service: activeService ?? 'none',
        length: trimmed.length,
      });

      const reply = respond(trimmed, { ...context, greeted: true });
      pushAssistant(reply);

      // Persistent engagement across the site, not just in this panel.
      window.dispatchEvent(new CustomEvent('virya:assistant-interest', { detail: reply.service ?? null }));
    },
    [activeService, context, location.pathname, pushAssistant, typing],
  );

  const handleChip = useCallback(
    (chip: Chip) => {
      trackEvent('assistant_chip', { label: chip.label, service: activeService ?? 'none' });

      if (chip.to) {
        setOpen(false);
        navigate(chip.to);
        void flush('manual');
        return;
      }
      if (chip.prompt) send(chip.prompt);
    },
    [activeService, navigate, send],
  );

  /* ── Effects ─────────────────────────────────────────────────── */

  // Keep the panel in step with the page: if the visitor navigates to a
  // service page while the chat is open, offer that service's questions.
  useEffect(() => {
    if (!open) return;
    const service = activeService ? getService(activeService) : undefined;
    if (!service) return;

    setMessages((prev) => {
      const alreadyMentioned = prev.some((m) => m.text.includes(service.title));
      if (alreadyMentioned) return prev;

      return [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          text: `You have moved to ${service.title}. Anything specific about that one?`,
          chips: openingChips({ ...context, greeted: true }),
        },
      ];
    });
  }, [activeService, open, context]);

  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    saveChatHistory(messages.filter((message) => !message.resumePath));
  }, [messages]);

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), reduced ? 0 : 300);
    return () => window.clearTimeout(timer);
  }, [open, reduced]);

  // Offer a human once the conversation has clearly been useful.
  const visitorTurns = messages.filter((m) => m.role === 'visitor').length;
  const showHandover = visitorTurns >= HANDOVER_AFTER;
  const lastMessage = messages[messages.length - 1];

  const officeLabel = greeting.officeClosed
    ? `Team offline · back ${greeting.nextOpenLabel}`
    : 'Team online now';
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="Virya Clean Tech energy assistant"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="panel flex h-[min(36rem,calc(100vh-8rem))] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden"
          >
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-line bg-mist px-4 py-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Bot className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-[0.92rem] font-bold text-ink">
                  Virya Energy Assistant
                </p>
                <p className="flex items-center gap-1.5 text-[0.72rem] text-ink-muted">
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      greeting.officeClosed ? 'bg-amber-400' : 'animate-dot-pulse bg-emerald-500',
                    )}
                  />
                  {officeLabel}
                  <span className="text-ink-faint">·</span>
                  <span className="tabular-nums">{visitorClock()}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-white hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Transcript */}
            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
              aria-live="polite"
              aria-atomic="false"
            >
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={cn(
                      'max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[0.86rem] leading-relaxed',
                      message.role === 'assistant'
                        ? 'bg-mist text-ink'
                        : 'ml-auto bg-emerald-500 text-white',
                    )}
                  >
                    {message.text}
                  </div>

                  {message.footnote && (
                    <p className="mt-1 max-w-[88%] text-[0.7rem] italic text-ink-faint">
                      {message.footnote}
                    </p>
                  )}

                  {message.chips && message.chips.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {message.chips.map((chip) => (
                        <li key={`${message.id}-${chip.label}`}>
                          <button
                            type="button"
                            onClick={() => handleChip(chip)}
                            className={cn(
                              'rounded-full border px-3 py-1.5 text-left text-[0.78rem] font-medium transition-colors duration-200',
                              chip.to
                                ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white'
                                : 'border-line bg-white text-ink-muted hover:border-emerald-500/40 hover:text-emerald-700',
                            )}
                          >
                            {chip.to && <ArrowRight className="mr-1 inline h-3 w-3" />}
                            {chip.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {message.resumePath && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setResumePromptDismissed(true);
                          setOpen(false);
                          navigate(message.resumePath ?? '/');
                        }}
                        className="btn-primary btn-sm"
                      >
                        Continue where I left off
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setResumePromptDismissed(true);
                          const fresh = buildGreeting({
                            service: activeService ? getService(activeService)?.label : undefined,
                          });
                          setMessages([
                            {
                              id: nextId(),
                              role: 'assistant',
                              text: `${fresh.line}\n\n${fresh.lead}`,
                              chips: openingChips({ ...context, greeted: false }),
                            },
                          ]);
                        }}
                        className="btn-outline btn-sm"
                      >
                        Start fresh
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div
                  className="flex items-center gap-1 rounded-2xl bg-mist px-3.5 py-3"
                  aria-label="Assistant is typing"
                >
                  {[0, 1, 2].map((index) => (
                    <span
                      key={index}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint"
                      style={{ animationDelay: `${index * 120}ms` }}
                    />
                  ))}
                </div>
              )}

              {/* Handover offer, once the conversation has earned it. */}
              {showHandover && lastMessage?.role === 'assistant' && (
                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-50 p-3.5">
                  <p className="text-[0.84rem] font-semibold text-emerald-900">
                    This is worth thirty minutes with an engineer.
                  </p>
                  <p className="mt-1 text-[0.78rem] leading-relaxed text-emerald-800">
                    Everything you have told me goes on the ticket — you will not have to repeat
                    yourself.
                  </p>
                  <Link
                    to={
                      activeService
                        ? `/request-consultation?service=${activeService}`
                        : '/request-consultation'
                    }
                    onClick={() => {
                      setOpen(false);
                      void flush('submit');
                    }}
                    className="btn-primary btn-sm mt-3 w-full"
                  >
                    Request a consultation
                  </Link>
                </div>
              )}
            </div>

            {/* Composer */}
            <footer className="border-t border-line bg-mist px-4 py-3">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2"
              >
                <label htmlFor="virya-chat-input" className="sr-only">
                  Ask about solar, EV charging, storage or audits
                </label>
                <input
                  id="virya-chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about cost, timelines, capacity…"
                  autoComplete="off"
                  maxLength={400}
                  className="h-10 flex-1 rounded-xl border border-line bg-white px-3.5 text-[0.88rem] text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  aria-label="Send message"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResumePromptDismissed(true);
                    setMessages([]);
                    setInput('');
                    openPanel();
                    trackEvent('assistant_reset');
                  }}
                  aria-label="Reset conversation"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-white text-ink-muted transition-colors hover:text-emerald-700"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-2 flex items-center justify-between gap-3 text-[0.7rem] text-ink-faint">
                <p className="truncate">
                  Answers are drawn from our published scope — no guesses.
                </p>
                <a href={CONTACT.phoneHref} className="shrink-0 hover:text-emerald-700">
                  <Phone className="mr-1 inline h-3 w-3" />
                  {CONTACT.phoneDisplay}
                </a>
              </div>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-label={open ? 'Close energy assistant' : 'Open energy assistant'}
        aria-expanded={open}
        className="group relative inline-grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500 text-white shadow-lift transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-emerald-600"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -45 }}
              transition={{ duration: 0.15 }}
            >
              <Bot className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>

        {unread && !open && (
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-signal-500 ring-2 ring-white">
            <span className="sr-only">New assistant available</span>
          </span>
        )}
      </button>
    </div>
  );
}