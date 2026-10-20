import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { services } from '@/data/services';
import { CardImage } from '@/components/ui';
import { visualAssets } from '@/data/visuals';

export default function NotFoundPage() {
  return (
    <section className="section pt-36">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-10 overflow-hidden rounded-2xl border border-line">
            <CardImage image={visualAssets.renewable} className="aspect-[16/7]" />
          </div>
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Compass className="h-6 w-6" />
          </span>

          <p className="eyebrow mt-8 justify-center">
            <span className="rule-accent" />
            404
          </p>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            That page does not exist
          </h1>

          <p className="mt-6 text-base leading-relaxed text-ink-muted">
            Which is either our fault or a mistyped URL. Either way, here is
            everything that does exist.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="btn-primary-lg">
              Back to home
            </Link>
            <Link to="/services" className="btn-outline-lg">
              See all services
            </Link>
          </div>

          <ul className="mt-12 flex flex-wrap justify-center gap-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  to={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[0.85rem] font-medium text-ink-muted transition-colors hover:border-emerald-500/40 hover:text-emerald-700"
                >
                  <service.icon className="h-4 w-4" />
                  {service.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}