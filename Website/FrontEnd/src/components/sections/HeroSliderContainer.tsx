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
  Activity,
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

const AUTOPLAY_DELAY = 8000;

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
      className="relative isolate flex min-h-[96svh] items-center overflow-hidden bg-[#07130f]"
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

              {/* Directional smudge: Heavily shaded on the left text area, crystal clear and visible on the right */}
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-full sm:w-[90%] lg:w-[65%] xl:w-[60%] bg-gradient-to-r from-[#040e0b]/98 via-[#051410]/90 to-transparent backdrop-blur-[6px]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-full sm:w-[75%] lg:w-[50%] bg-[#040e0b]/75 backdrop-blur-md"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07130f] to-transparent"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_40%,rgba(16,185,129,0.15),transparent_70%)]"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Content layer: Left-aligned with rich text & smudged card, leaving the right side image completely visible */}
      <div className="shell relative z-10 w-full py-20 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-12 lg:items-center gap-8 lg:gap-10">
          {/* Left Text Area: Smudged, readable, and highly informative */}
          <div className="lg:col-span-7 xl:col-span-7 text-left">
            <div className="rounded-3xl border border-white/10 bg-[#071712]/85 p-6 sm:p-9 lg:p-10 shadow-2xl backdrop-blur-xl">
              <p
                key={`eyebrow-${active}`}
                className="hero-stagger flex items-center gap-2"
                style={{ animationDelay: reduced ? undefined : '0ms' }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-emerald-300 backdrop-blur-md">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  {heroSlides[active].eyebrow}
                </span>
              </p>

              <h1
                key={`title-${active}`}
                className="hero-stagger mt-4 text-balance font-heading text-[2.2rem] font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-[3.25rem]"
                style={{ animationDelay: reduced ? undefined : '90ms' }}
              >
                {heroSlides[active].headline}
              </h1>

              <p
                key={`body-${active}`}
                className="hero-stagger mt-4 text-pretty text-sm sm:text-base leading-relaxed text-white/80"
                style={{ animationDelay: reduced ? undefined : '180ms' }}
              >
                {heroSlides[active].subtext}
              </p>

              {/* 4 Technical Capability Badges */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Zap className="h-3.5 w-3.5" />
                    <span className="font-mono text-xs font-bold text-white">3.3–350 kW</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] text-ink-muted">High-Power DC EVSE</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Sun className="h-3.5 w-3.5" />
                    <span className="font-mono text-xs font-bold text-white">22.5%+</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] text-ink-muted">Solar PV Efficiency</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <BatteryCharging className="h-3.5 w-3.5" />
                    <span className="font-mono text-xs font-bold text-white">&lt; 4ms</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] text-ink-muted">LFP BESS Transfer</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Activity className="h-3.5 w-3.5" />
                    <span className="font-mono text-xs font-bold text-white">OCPP 2.0.1</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] text-ink-muted">Cloud Telemetry</p>
                </div>
              </div>

              {/* CTAs */}
              <div
                key={`cta-${active}`}
                className="hero-stagger mt-7 flex flex-wrap items-center gap-3"
                style={{ animationDelay: reduced ? undefined : '270ms' }}
              >
                <Link
                  to="/request-consultation"
                  onClick={() => trackEvent('hero_cta_click', { target: '/request-consultation', label: 'Request Review' })}
                  className="btn-primary-lg text-sm"
                >
                  Request Site Feasibility Review
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>

                <Link
                  to="/services"
                  onClick={() => trackEvent('hero_cta_click', { target: '/services', label: 'Explore 8 Pillars' })}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 font-heading text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  Explore 8 CleanTech Pillars
                </Link>
              </div>

              {/* Trust Indicators Strip */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-muted">
                <span className="inline-flex items-center gap-1.5 text-white/90">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  10 Hubs Across India
                </span>
                <span className="inline-flex items-center gap-1.5 text-white/90">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Zero Diesel Backfeed
                </span>
                <span className="inline-flex items-center gap-1.5 text-white/90">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  CEA Grid Code Compliant
                </span>
              </div>
            </div>
          </div>

          {/* Right Area: Translucent live telemetry widget allowing the background photo to remain visible */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-5">
            <div className="rounded-3xl border border-white/15 bg-[#071510]/70 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">Live Facility Telemetry</span>
                </div>
                <span className="text-[0.68rem] font-mono text-emerald-300">50.02 Hz • Grid Synced</span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-white/[0.04] p-3 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Sun className="h-4 w-4 text-amber-400" />
                    <div>
                      <p className="text-xs font-semibold text-white">Solar Generation</p>
                      <p className="text-[0.66rem] text-ink-muted">2.4 MWp TOPCon Arrays</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-emerald-400">1,842 kW</p>
                    <p className="text-[0.66rem] text-ink-muted">4,380 kWh today</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/[0.04] p-3 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    <div>
                      <p className="text-xs font-semibold text-white">Fleet EV Charging</p>
                      <p className="text-[0.66rem] text-ink-muted">Depot Dual-Gun DCSE</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-emerald-400">8/10 Active</p>
                    <p className="text-[0.66rem] text-ink-muted">320 kW Draw</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/[0.04] p-3 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <BatteryCharging className="h-4 w-4 text-cyan-400" />
                    <div>
                      <p className="text-xs font-semibold text-white">Industrial BESS</p>
                      <p className="text-[0.66rem] text-ink-muted">Containerized LFP</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-emerald-400">96% SoC</p>
                    <p className="text-[0.66rem] text-ink-muted">Peak Shaving Ready</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <Link
                  to="/energy-platforms"
                  className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
                >
                  View Cloud SCADA Platform <ArrowRight className="h-3 w-3" />
                </Link>
                <span className="text-[0.68rem] text-ink-muted">Sub-second updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="shell absolute inset-x-0 bottom-6 z-20 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="sr-only" aria-live="polite">
            Slide {active + 1} of {heroSlides.length}
          </span>

          <div className="flex gap-2" role="tablist" aria-label="Slides">
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
                      ? 'block h-[4px] w-12 rounded-full bg-emerald-400 transition-all'
                      : 'block h-[4px] w-6 rounded-full bg-white/30 transition-all group-hover:bg-white/60'
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            id="hero-prev"
            aria-label="Previous slide"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <span aria-hidden="true" className="text-xs">←</span>
          </button>
          <button
            type="button"
            id="hero-next"
            aria-label="Next slide"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <span aria-hidden="true" className="text-xs">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
