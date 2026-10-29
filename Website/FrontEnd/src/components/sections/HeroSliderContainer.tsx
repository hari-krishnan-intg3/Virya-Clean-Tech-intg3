import { useCallback, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import {
  ArrowRight,
  Play,
  Pause,
  Zap,
  Sun,
  BatteryCharging,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { heroSlides } from '@/data/content';
import { trackEvent } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SmartImage } from '@/components/ui';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const AUTOPLAY_DELAY = 7000;

export function HeroSliderContainer() {
  const reduced = usePrefersReducedMotion();
  const swiperRef = useRef<SwiperRef | null>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(!reduced);

  /** SwiperRef wraps the real instance as `.swiper`. */
  const swiper = (): SwiperClass | undefined => swiperRef.current?.swiper;

  // Respect the visitor's motion preference: no autoplay, no transition animation.
  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);

  // Pause autoplay while the tab is hidden or the pointer is over the hero.
  const hoverRef = useRef(false);
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) swiper()?.autoplay?.stop();
      else if (playing && !hoverRef.current) swiper()?.autoplay?.start();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [playing]);

  const togglePlay = useCallback(() => {
    const next = !playing;
    setPlaying(next);
    if (next) swiper()?.autoplay?.start();
    else swiper()?.autoplay?.stop();
  }, [playing]);

  return (
    <section
      id="home"
      aria-label="Introduction"
      aria-roledescription="carousel"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink"
      onMouseEnter={() => {
        hoverRef.current = true;
        if (playing) swiper()?.autoplay?.stop();
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
        if (playing) swiper()?.autoplay?.start();
      }}
    >
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination, Navigation, Keyboard, A11y]}
        slidesPerView={1}
        loop
        speed={reduced ? 0 : 900}
        grabCursor
        watchSlidesProgress
        spaceBetween={0}
        keyboard={{ enabled: true }}
        a11y={{
          enabled: true,
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          paginationBulletMessage: 'Go to slide {{index}}',
        }}
        autoplay={reduced ? false : { delay: AUTOPLAY_DELAY, disableOnInteraction: false, pauseOnMouseEnter: false }}
        pagination={{ clickable: true }}
        navigation={{ nextEl: '#hero-next', prevEl: '#hero-prev' }}
        onSlideChange={(instance) => setActive(instance.realIndex)}
        onSwiper={(instance) => {
          swiperRef.current = instance as unknown as SwiperRef;
        }}
        className="hero-swiper !absolute inset-0 h-full w-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <SmartImage
                src={slide.image}
                alt={slide.imageAlt}
                width={1920}
                height={1080}
                fill
                priority={slide.id === 'future'}
                focal={slide.focal}
                sizes="100vw"
                className={reduced ? '' : 'transition-transform duration-[8000ms] ease-out motion-safe:scale-105'}
              />

              {/* Pure clean gradients for text contrast — no blur smudges */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_100%,rgba(16,185,129,0.22),transparent_60%)]"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Content layer — fixed clean layout so text position never shifts between slides */}
      <div className="shell relative z-10 w-full py-28 sm:py-36 lg:py-40">
        <div className="mx-auto max-w-5xl text-center">
          <p
            key={`eyebrow-${active}`}
            className="hero-stagger flex justify-center"
            style={{ animationDelay: reduced ? undefined : '0ms' }}
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {heroSlides[active].eyebrow}
            </span>
          </p>

          <h1
            key={`title-${active}`}
            className="hero-stagger mx-auto mt-7 max-w-5xl text-balance font-heading text-[2.5rem] font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-[4.75rem]"
            style={{ animationDelay: reduced ? undefined : '90ms' }}
          >
            {heroSlides[active].headline}
          </h1>

          <p
            key={`body-${active}`}
            className="hero-stagger mx-auto mt-6 max-w-3xl text-pretty text-base leading-relaxed text-white/85 sm:text-xl lg:text-2xl"
            style={{ animationDelay: reduced ? undefined : '180ms' }}
          >
            {heroSlides[active].subtext}
          </p>

          {/* Primary Action Buttons */}
          <div
            key={`cta-${active}`}
            className="hero-stagger mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
            style={{ animationDelay: reduced ? undefined : '270ms' }}
          >
            <Link
              to="/request-consultation"
              onClick={() => trackEvent('hero_cta_click', { target: '/request-consultation', label: 'Request Consultation' })}
              className="btn-primary-lg"
            >
              Request Site Feasibility Review
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>

            <Link
              to="/services"
              onClick={() => trackEvent('hero_cta_click', { target: '/services', label: 'Explore Solutions' })}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 py-4 font-heading text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              Explore Solutions
            </Link>
          </div>

          {/* Clean inline highlights strip — neat, transparent badges */}
          <div
            key={`badges-${active}`}
            className="hero-stagger mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-2.5 sm:gap-3"
            style={{ animationDelay: reduced ? undefined : '360ms' }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white/90 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              <span><strong>3.3–350 kW</strong> EV Charging</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white/90 backdrop-blur-sm">
              <Sun className="h-3.5 w-3.5 text-amber-400" />
              <span><strong>22.5%+</strong> Multi-MW Solar PV</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white/90 backdrop-blur-sm">
              <BatteryCharging className="h-3.5 w-3.5 text-cyan-400" />
              <span><strong>Containerized</strong> LFP Storage</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white/90 backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span><strong>OCPP 2.0.1 & ISO 15118</strong> Telemetry</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white/90 backdrop-blur-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span><strong>10 Hubs</strong> Across India</span>
            </span>
          </div>
        </div>
      </div>

      {/* Slide Navigation & Controls */}
      <div className="shell absolute inset-x-0 bottom-8 z-20 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="sr-only" aria-live="polite">
            Slide {active + 1} of {heroSlides.length}
          </span>

          <div className="hidden gap-2 sm:flex" role="tablist" aria-label="Slides">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-label={`Go to slide ${index + 1}: ${slide.headline}`}
                onClick={() => swiper()?.slideToLoop(index)}
                className="group py-2"
              >
                <span
                  className={
                    active === index
                      ? 'block h-[3px] w-8 rounded-full bg-emerald-500'
                      : 'block h-[3px] w-4 rounded-full bg-white/30 transition-all group-hover:bg-white/60'
                  }
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            type="button"
            id="hero-prev"
            aria-label="Previous slide"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            id="hero-next"
            aria-label="Next slide"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
