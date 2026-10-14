import { ArrowRight } from 'lucide-react';
import { services } from '@/data/services';
import { Reveal, SectionHeading, ServiceCard } from '@/components/ui';
import { scrollToSection, trackEvent } from '@/lib/utils';

export function ServicesContainer() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="section relative overflow-hidden bg-mist"
    >
      <div aria-hidden="true" className="grid-lines mask-fade-b absolute inset-0" />

      <div className="shell relative">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              Comprehensive Clean Energy Solutions for a{' '}
              <span className="text-gradient">Sustainable Tomorrow</span>
            </>
          }
          description="From renewable power generation to intelligent energy infrastructure, we help turn clean-energy ambitions into practical solutions."
          decorate
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.07}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-14 flex flex-col items-center gap-4 text-center">
          <button
            type="button"
            onClick={() => {
              trackEvent('cta_click', { placement: 'services', target: 'booking' });
              scrollToSection('booking');
            }}
            className="btn-primary-lg group"
          >
            Discuss Your Energy Requirements
            <ArrowRight
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
          <p className="text-sm text-ink-faint">
            Not sure which solution fits? Send us your requirements and we&apos;ll advise.
          </p>
        </Reveal>
      </div>
    </section>
  );
}