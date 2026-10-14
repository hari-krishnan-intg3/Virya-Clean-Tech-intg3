import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal, SectionHeading } from '@/components/ui';
import { ServiceCard } from '@/components/ui';
import { services } from '@/data/services';
import { trackEvent } from '@/lib/utils';

/**
 * Services grid for the home page.
 *
 * The full comparison table lives on `/services`; this is the scannable
 * summary that earns the click through.
 */
export function ServicesContainer() {
  return (
    <section id="services" aria-labelledby="services-title" className="section relative overflow-hidden">
      <div className="grid-lines mask-fade-b pointer-events-none absolute inset-x-0 top-0 h-64 opacity-60" aria-hidden="true" />

      <div className="shell relative">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <SectionHeading
              id="services-title"
              eyebrow="Services"
              title={
                <>
                  Comprehensive energy solutions, <span className="text-gradient">in the right order</span>
                </>
              }
              description="Solar, EV charging, storage and the software that ties them together — plus the audit that tells you which two you actually need."
              as="h2"
            />
          </div>

          <Link
            to="/services"
            onClick={() => trackEvent('cta_click', { placement: 'services-heading', target: '/services' })}
            className="btn-outline"
          >
            Compare all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 0.06} as="div">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.28} className="mt-12 flex justify-center">
          <Link
            to="/request-consultation"
            onClick={() => trackEvent('cta_click', { placement: 'services-grid', target: '/request-consultation' })}
            className="btn-primary-lg"
          >
            Discuss your energy requirements
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}