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

interface VisibleSurface {
  key: string;
  title: string;
  summary: string;
}

function describeSurface(surface: Element, path: string): VisibleSurface | null {
  const title =
    surface.querySelector('h1, h2, h3, summary, dt')?.textContent?.trim() ||
    Array.from(surface.querySelectorAll('p'))
      .map((paragraph) => paragraph.textContent?.trim() ?? '')
      .find((text) => text.length > 3);
  if (!title) return null;

  const summary = Array.from(surface.querySelectorAll('p'))
    .map((paragraph) => paragraph.textContent?.trim() ?? '')
    .find((text) => text.length > 30) ?? '';
  const anchor = (surface as HTMLElement).id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return { key: `${path}:${anchor}`, title, summary: summary.slice(0, 520) };
}

function readVisibleSurface(path: string): VisibleSurface | null {
  const main = document.querySelector('main');
  if (!main) return null;

  const focusY = Math.max(90, Math.min(window.innerHeight - 90, window.innerHeight * 0.52));
  const focusXs = [0.32, 0.5, 0.68].map((portion) => window.innerWidth * portion);
  let section: Element | null = null;

  for (const x of focusXs) {
    const point = document.elementFromPoint(x, focusY);
    const card = point?.closest('main details, main article, main .card') ?? null;
    if (card && main.contains(card)) {
      const description = describeSurface(card, path);
      if (description) return description;
    }
    const candidate = point?.closest('main section') ?? null;
    if (candidate && main.contains(candidate)) section ??= candidate;
  }

  return section ? describeSurface(section, path) : null;
}

function useVisibleSurface(path: string, enabled: boolean): VisibleSurface | null {
  const [surface, setSurface] = useState<VisibleSurface | null>(null);

  useEffect(() => {
    const update = () => {
      const next = readVisibleSurface(path);
      setSurface((previous) =>
        previous?.key === next?.key &&
        previous?.title === next?.title &&
        previous?.summary === next?.summary
          ? previous
          : next,
      );
    };

    update();
    if (!enabled) return;

    const timer = window.setInterval(update, 400);
    window.addEventListener('resize', update);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('resize', update);
    };
  }, [enabled, path]);

  return surface;
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
  const activeSurface = useVisibleSurface(location.pathname, open);
  const [messages, setMessages] = useState<Message[]>(() =>
    readChatHistory().map((message) => ({ id: nextId(), ...message })),
  );
  const [resumePromptDismissed, setResumePromptDismissed] = useState(false);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(true);
  const [input, setInput] = useState('');
  const [conversationService, setConversationService] = useState<ServiceSlug | undefined>();

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const autoOpenedRef = useRef(false);
  const promptedSurface = useRef<string | null>(null);

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
          conversationService ?? rememberedService ?? seenServices[seenServices.length - 1] ?? activeService,
        sectionTitle: activeSurface?.title,
        sectionSummary: activeSurface?.summary,
      };
    },
    [location.pathname, activeService, seenServices, messages.length, returningVisitor, activeSurface, conversationService],
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

    const visibleSurface = readVisibleSurface(location.pathname) ?? activeSurface;
    const pageContext: BotContext = {
      ...context,
      sectionTitle: visibleSurface?.title,
      sectionSummary: visibleSurface?.summary,
    };
    const pageChips = openingChips(pageContext);

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
              chips: openingChips({ ...pageContext, greeted: false }),
            },
          ];

      const withPageContext = prev.length && visibleSurface && promptedSurface.current !== visibleSurface.key
        ? [
            ...initial,
            {
              id: nextId(),
              role: 'assistant' as const,
              text: `You're viewing ${visibleSurface.title}. Here are questions that may help.`,
              chips: pageChips,
            },
          ]
        : initial;

      if (visibleSurface) promptedSurface.current = visibleSurface.key;

      if (returningVisitor && !resumePromptDismissed && !prev.some((message) => message.resumePath)) {
        const interest = returningVisitor.primaryInterest
          ? getService(returningVisitor.primaryInterest as ServiceSlug)?.label
          : undefined;
        return [
          ...withPageContext,
          {
            id: nextId(),
            role: 'assistant',
            text: `${greeting.salutation}, welcome back${interest ? ` — you were exploring ${interest}` : ''}. Would you like to continue where you left off?`,
            resumePath: returningVisitor.lastPath,
          },
        ];
      }

      return withPageContext;
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
      if (reply.service) setConversationService(reply.service);
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

  // Refresh suggestions when the visitor moves to a new page section or card.
  useEffect(() => {
    if (!open || !activeSurface) return;
    if (promptedSurface.current === activeSurface.key) return;

    const previous = promptedSurface.current;
    promptedSurface.current = activeSurface.key;
    const chips = openingChips({ ...context, greeted: true });

    setMessages((prev) => {
      if (!previous) {
        const lastIndex = prev.length - 1;
        const last = prev[lastIndex];
        if (last?.role === 'assistant' && !last.resumePath) {
          const next = [...prev];
          next[lastIndex] = { ...last, chips };
          return next;
        }
      }

      return [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          text: previous
            ? `You're viewing ${activeSurface.title}. What would you like to understand about this part?`
            : `You're viewing ${activeSurface.title}. Here are some questions that may help.`,
          chips,
        },
      ];
    });
  }, [activeSurface, open, context]);

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
                {activeSurface?.title && (
                  <p className="mt-1 truncate text-[0.68rem] text-ink-faint">
                    Viewing: {activeSurface.title}
                  </p>
                )}
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