import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronDown, MessageCircle, Send, X } from 'lucide-react';
import { CONTACT } from '@/app/siteConfig';
import { cn, scrollToSection, trackEvent } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type Role = 'user' | 'bot';

interface Message {
  id: number;
  role: Role;
  text: string;
  /** Optional action chips rendered under the message. */
  actions?: { label: string; prompt?: string; scrollTo?: string }[];
}

interface Topic {
  id: string;
  /** Shown as a quick-reply chip. */
  chip: string;
  /** Canonical answer shown when the topic is selected. */
  answer: string;
}

const TOPICS: Topic[] = [
  {
    id: 'solar',
    chip: 'Solar solutions',
    answer:
      'We design and build solar power plants for residential rooftops, commercial sites and larger installations — from load assessment and system design through to installation and integration.',
  },
  {
    id: 'ev',
    chip: 'EV charging',
    answer:
      'Our EV charging work covers fast, reliable charging stations for both private setups and public networks, including load management for sites with limited grid capacity.',
  },
  {
    id: 'battery',
    chip: 'Battery technology',
    answer:
      'We work with advanced battery technology for energy storage — useful for shifting peak demand, maintaining continuity and making better use of on-site generation.',
  },
  {
    id: 'iot',
    chip: 'IoT & software',
    answer:
      'Our tech team builds energy-focused software and IoT systems for real-time monitoring, smart energy management and predictive maintenance.',
  },
  {
    id: 'audit',
    chip: 'Energy consulting',
    answer:
      'Our consulting service covers feasibility studies, detailed energy audits and guidance through your clean-energy journey, so you can make an informed decision.',
  },
];

const GREETING: Message = {
  id: 0,
  role: 'bot',
  text: `Hi — I'm Virya's virtual guide. Tell me which area you're interested in and I'll point you in the right direction.

Just so you know: I'm a demo assistant using pre-written answers. I can't give live engineering advice, quotes, or book appointments.`,
  actions: TOPICS.map((topic) => ({ label: topic.chip, prompt: topic.id })),
};

const BOOKING_ACTIONS = [
  { label: 'Book a consultation', scrollTo: 'booking' },
  { label: 'View contact details', scrollTo: 'contact' },
];

const ANSWER_TOPICS = [...TOPICS, { id: 'booking', chip: 'Booking a consultation', answer: '' }];

let messageId = 0;
const nextId = () => ++messageId;

export function ChatAssistantContainer() {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (open) setUnread(false);
  }, [open]);

  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  const pushBotReply = (text: string, actions?: Message['actions']) => {
    setTyping(true);
    const t = window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: nextId(), role: 'bot', text, actions }]);
    }, reduced ? 0 : 520);
    timers.current.push(t);
  };

  const selectTopic = (topicId: string) => {
    const topic = ANSWER_TOPICS.find((t) => t.id === topicId);
    if (!topic) return;

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: 'user', text: topic.chip },
    ]);
    trackEvent('assistant_topic', { topic: topicId });

    if (topicId === 'booking') {
      pushBotReply(
        'Head to the consultation form and send us your requirements — our team will follow up. You can also call or email us directly.',
        BOOKING_ACTIONS,
      );
      return;
    }

    pushBotReply(topic.answer, [
      ...TOPICS.filter((t) => t.id !== topicId)
        .slice(0, 3)
        .map((t) => ({ label: t.chip, prompt: t.id })),
      ...BOOKING_ACTIONS,
    ]);
  };

  const handleScrollTo = (id: string) => {
    setOpen(false);
    trackEvent('assistant_action', { target: id });
    requestAnimationFrame(() => scrollToSection(id));
  };

  return (
    <>
      {/* Launcher */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-label="Virya Cleantech website assistant"
              className="flex h-[min(32rem,calc(100vh-8rem))] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-lift"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-line bg-mist px-4 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Bot className="h-4.5 w-4.5 text-emerald-600" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-heading text-sm font-bold text-ink">
                      Virya Assistant
                    </p>
                    <p className="flex items-center gap-1.5 text-[0.7rem] text-ink-faint">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                      Demo — pre-written answers
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close assistant"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-white hover:text-ink"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={listRef}
                className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
                aria-live="polite"
                aria-atomic="false"
              >
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[0.85rem] leading-relaxed',
                        message.role === 'bot'
                          ? 'bg-mist text-ink'
                          : 'ml-auto bg-emerald-500 text-white',
                      )}
                    >
                      {message.text}
                    </div>

                    {message.actions && message.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {message.actions.map((action) => (
                          <button
                            key={action.label}
                            type="button"
                            onClick={() =>
                              action.scrollTo
                                ? handleScrollTo(action.scrollTo)
                                : selectTopic(action.prompt!)
                            }
                            className="rounded-full border border-line bg-white px-3 py-1.5 text-[0.78rem] font-medium text-ink transition-colors hover:border-emerald-500/40 hover:text-emerald-700"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {typing && (
                  <div
                    className="flex w-14 items-center gap-1 rounded-2xl bg-mist px-3.5 py-3"
                    aria-label="Assistant is typing"
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint"
                        style={{ animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-line bg-mist px-4 py-3">
                <p className="mb-2 text-[0.7rem] leading-relaxed text-ink-faint">
                  Demo assistant. For live advice, use the{' '}
                  <button
                    type="button"
                    onClick={() => handleScrollTo('booking')}
                    className="underline underline-offset-2"
                  >
                    enquiry form
                  </button>{' '}
                  or{' '}
                  <a href={CONTACT.emailHref} className="underline underline-offset-2">
                    email us
                  </a>
                  .
                </p>
                <div className="flex items-center gap-2">
                  <span className="flex h-9 flex-1 items-center rounded-xl border border-line bg-white px-3 text-[0.8rem] text-ink-faint">
                    Pick a topic above
                    <Send className="ml-auto h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMessages([GREETING]);
                      trackEvent('assistant_reset');
                    }}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-ink-muted transition-colors hover:text-ink"
                    aria-label="Reset conversation"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => {
            const next = !open;
            setOpen(next);
            if (next) {
              setUnread(false);
              trackEvent('assistant_open');
            }
          }}
          aria-expanded={open}
          aria-label={open ? 'Close Virya Assistant' : 'Open Virya Assistant'}
          className="group relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-900"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <MessageCircle className="h-6 w-6" aria-hidden="true" />
              </motion.span>
            )}
          </AnimatePresence>

          {unread && !open && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-sky-500"
            />
          )}
        </button>
      </div>
    </>
  );
}