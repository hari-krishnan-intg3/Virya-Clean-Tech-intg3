import { BookingFormContainer } from '@/components/sections/BookingFormContainer';
import { CardImage } from '@/components/ui';
import { INSURANCE_HONESTS } from '@/data/consultationContent';
import { visualAssets } from '@/data/visuals';

/**
 * The consultation form, given its own page rather than living at the bottom
 * of a scroll. It is the single most important conversion on the site and it
 * deserved an address people can be sent to directly.
 */
export default function ConsultationPage() {
  return (
    <>
      <BookingFormContainer />

      {/* What happens next — reduces the "what am I committing to" hesitation. */}
      <section className="section bg-mist">
        <div className="shell">
          <div className="grid gap-6 sm:grid-cols-3">
            {INSURANCE_HONESTS.map((item, index) => (
              <div key={item.title} className="card h-full overflow-hidden">
                <CardImage
                  image={[visualAssets.industrial, visualAssets.engineering, visualAssets.solar][index]}
                  className="aspect-[16/9]"
                />
                <div className="p-7">
                  <h2 className="text-[1.05rem] font-bold text-ink">{item.title}</h2>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink-muted">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}