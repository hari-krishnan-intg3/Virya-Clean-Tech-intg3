import { useCallback, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { ArrowRight, Play, Pause } from 'lucide-react';
import { heroSlides } from '@/data/content';
import { scrollToSection, trackEvent } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Button, SmartImage } from '@/components/ui';

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

  const goTo = (id: string, label: string) => {
    trackEvent('hero_cta_click', { target: id, label });
    if (id === 'booking') scrollToSection('booking');
    else scrollToSection(id);
  };

  return (
    <section
      id="home"
      aria-label="Introduction"
      aria-roledescription="carousel"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink"
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

              {/* Readability overlays */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_100%,rgba(16,185,129,0.22),transparent_60%)]"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Content layer — fixed so text position never shifts between slides */}
      <div className="shell relative z-10 w-full pb-24 pt-32 sm:pb-28">
        <div className="max-w-3xl">
          <p
            key={`eyebrow-${active}`}
            className="hero-stagger"
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
            className="hero-stagger mt-6 text-balance font-heading text-[2.1rem] font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[4.1rem]"
            style={{ animationDelay: reduced ? undefined : '90ms' }}
          >
            {heroSlides[active].headline}
          </h1>

          <p
            key={`body-${active}`}
            className="hero-stagger mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg"
            style={{ animationDelay: reduced ? undefined : '180ms' }}
          >
            {heroSlides[active].subtext}
          </p>

          <div
            key={`cta-${active}`}
            className="hero-stagger mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: reduced ? undefined : '270ms' }}
          >
            <Button size="lg" onClick={() => goTo('services', 'Explore Solutions')}>
              Explore Solutions
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>

            <button
              type="button"
              onClick={() => goTo('booking', 'Book Consultation')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 font-heading text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="shell absolute inset-x-0 bottom-8 z-20 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm tabular-nums text-white/70">
            0{active + 1}
            <span className="mx-1 text-white/30">/</span>
            0{heroSlides.length}
          </span>

          <div className="hidden gap-1.5 sm:flex" role="tablist" aria-label="Slides">
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
                      ? 'block h-[3px] w-10 rounded-full bg-emerald-500'
                      : 'block h-[3px] w-6 rounded-full bg-white/30 transition-all group-hover:bg-white/60'
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