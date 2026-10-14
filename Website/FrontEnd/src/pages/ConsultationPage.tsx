import { BookingFormContainer } from '@/components/sections/BookingFormContainer';
import { PageHero } from '@/components/sections/PageHero';
import { INSURANCE_HONESTS } from '@/data/consultationContent';

/**
 * The consultation form, given its own page rather than living at the bottom
 * of a scroll. It is the single most important conversion on the site and it
 * deserved an address people can be sent to directly.
 */
export default function ConsultationPage() {
  return (
    <>
      <PageHero
        eyebrow="Request a consultation"
        title={
          <>
            Thirty minutes, <span className="text-gradient">and a straight answer</span>
          </>
        }
        description="This goes straight to a person, not a queue. Tell us what is driving it and we will come back with what we would need to look at — including when the answer is that you do not need us."
        primary={undefined}
        trail={[{ label: 'Home', to: '/' }, { label: 'Request a consultation', to: '/request-consultation' }]}
      />

      <BookingFormContainer />

      {/* What happens next — reduces the "what am I committing to" hesitation. */}
      <section className="section bg-mist">
        <div className="shell">
          <div className="grid gap-6 sm:grid-cols-3">
            {INSURANCE_HONESTS.map((item, index) => (
              <div key={item.title} className="card p-7">
                <span className="font-mono text-[0.8rem] font-bold text-ink-faint">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="mt-4 text-[1.05rem] font-bold text-ink">{item.title}</h2>
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}