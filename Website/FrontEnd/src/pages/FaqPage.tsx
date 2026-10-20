import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { Reveal } from '@/components/ui';
import { faqs } from '@/data/faq';
import { getService } from '@/data/services';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Commercial', 'Process', 'Technical', 'Commercial terms'] as const;

export default function FaqPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return faqs.filter((faq) => {
      if (category !== 'All' && faq.category !== category) return false;
      if (!needle) return true;
      return (
        faq.question.toLowerCase().includes(needle) ||
        faq.answer.toLowerCase().includes(needle)
      );
    });
  }, [category, query]);

  return (
    <>
      <PageHero
        eyebrow="Questions"
        title={
          <>
            What people ask <span className="text-gradient">before the first call</span>
          </>
        }
        description="Including the ones about money, which is where most procurement processes actually stall. If yours is not here, ask the assistant on any page or write to us directly."
        primary={{ label: 'Ask us directly', to: '/contact' }}
        secondary={{ label: 'Request a consultation', to: '/request-consultation' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'FAQ', to: '/faq' }]}
      />

      <section className="section">
        <div className="shell">
          {/* Filter + search */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  aria-pressed={category === option}
                  className={cn(
                    'rounded-full border px-4 py-2 text-[0.85rem] font-medium transition-colors duration-200',
                    category === option
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-line bg-white text-ink-muted hover:border-emerald-500/40 hover:text-emerald-700',
                  )}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="relative lg:w-80">
              <label htmlFor="faq-search" className="sr-only">
                Search questions
              </label>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
                aria-hidden="true"
              />
              <input
                id="faq-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search questions"
                className="field pl-10"
              />
            </div>
          </div>

          {/* List */}
          <div className="mt-8 space-y-3">
            {filtered.map((faq, index) => {
              const service = faq.relatedService ? getService(faq.relatedService) : undefined;

              return (
                <Reveal key={faq.question} delay={Math.min(index, 6) * 0.04} as="div">
                  <details className="group card [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-start justify-between gap-5 p-5 sm:p-6">
                      <span className="min-w-0 flex-1">
                        <span className="block text-[1.05rem] font-semibold text-ink">
                          {faq.question}
                        </span>
                        <span className="mt-1.5 inline-block rounded-full bg-mist px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                          {faq.category}
                        </span>
                      </span>
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-ink-muted transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>

                    <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                      <p className="max-w-3xl text-[0.95rem] leading-relaxed text-ink-muted">
                        {faq.answer}
                      </p>

                      {service && (
                        <p className="mt-4 text-[0.85rem] text-ink-faint">
                          Related:{' '}
                          <a
                            href={`/services/${service.slug}`}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            {service.title}
                          </a>
                        </p>
                      )}
                    </div>
                  </details>
                </Reveal>
              );
            })}

            {filtered.length === 0 && (
              <div className="card p-10 text-center">
                <p className="text-[0.95rem] text-ink-muted">
                  Nothing matches “{query}”. That usually means it is a good
                  question rather than a missing one.
                </p>
                <a href="/contact" className="btn-primary mt-6">
                  Ask us instead
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      <CtaBand
        title="Two pages of answers beats one phone call"
        body="But if you have read these and still have a question about your specific site, that is exactly the conversation worth having."
        primary={{ label: 'Request a consultation', to: '/request-consultation' }}
        secondary={{ label: 'See the process', to: '/process' }}
      />
    </>
  );
}