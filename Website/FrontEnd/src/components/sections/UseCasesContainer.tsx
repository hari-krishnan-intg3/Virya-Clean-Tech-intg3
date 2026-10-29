import { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { useCases } from '@/data/homeContent';
import { Reveal, SmartImage } from '@/components/ui';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function UseCasesContainer() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  return (
    <section id="use-cases" aria-labelledby="use-cases-title" className="section bg-mist/60 overflow-hidden">
      <div className="shell">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Industry Scenarios & Proven Blueprints (8 Slides)
            </p>
            <h2
              id="use-cases-title"
              className="mt-4 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl"
            >
              Real Operating Challenges <span className="text-gradient">Engineered into Clear Solutions</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Explore how CleanTech architectures solve tangible operational, financial, and regulatory constraints across 8 core industry sectors.
            </p>
          </Reveal>

          {/* Slider Controls */}
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono font-bold text-slate-500 mr-2">
              0{activeSlide + 1} <span className="text-slate-300">/</span> 0{useCases.length}
            </div>
            <button
              type="button"
              onClick={() => swiperInstance?.slidePrev()}
              aria-label="Previous scenario"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-ink transition-colors hover:bg-slate-100 hover:border-slate-400 active:scale-95 shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => swiperInstance?.slideNext()}
              aria-label="Next scenario"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-ink transition-colors hover:bg-slate-100 hover:border-slate-400 active:scale-95 shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 8-Slide Industry Selector Pills */}
        <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
          {useCases.map((useCase, idx) => (
            <button
              key={useCase.id}
              type="button"
              onClick={() => {
                swiperInstance?.slideTo(idx);
                setActiveSlide(idx);
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all border ${
                activeSlide === idx
                  ? 'border-emerald-600 bg-emerald-700 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="opacity-70 font-mono mr-1">0{idx + 1}.</span>
              <span>{useCase.sector}</span>
            </button>
          ))}
        </div>

        {/* 8-Slide Swiper Carousel */}
        <div className="mt-6">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            autoplay={{
              delay: 8500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
            }}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          >
            {useCases.map((useCase, index) => (
              <SwiperSlide key={useCase.id} className="h-auto">
                <article className="card h-full flex flex-col overflow-hidden border border-slate-200/90 bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl">
                  {/* Image header with sector badge */}
                  <div className="relative aspect-[16/8] overflow-hidden bg-slate-900">
                    <SmartImage
                      src={useCase.image}
                      alt={useCase.imageAlt}
                      width={1200}
                      height={600}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#07110f]/85 via-transparent to-transparent"
                    />
                    <span className="absolute bottom-4 left-5 rounded-full border border-white/20 bg-[#07110f]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-sm">
                      {useCase.sector}
                    </span>
                    <span className="absolute top-4 right-4 rounded-lg bg-black/50 px-2 py-0.5 text-[10px] font-mono text-white backdrop-blur-sm">
                      Case 0{index + 1}
                    </span>
                  </div>

                  <div className="p-6 sm:p-7 flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold leading-snug text-ink">
                        {useCase.title}
                      </h3>

                      <dl className="mt-5 space-y-4 text-xs sm:text-sm">
                        <div className="rounded-xl bg-rose-50/50 border border-rose-100 p-3">
                          <dt className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
                            The Challenge
                          </dt>
                          <dd className="mt-1 leading-relaxed text-slate-700">
                            {useCase.problem}
                          </dd>
                        </div>

                        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                          <dt className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                            Virya Engineered Approach
                          </dt>
                          <dd className="mt-1 leading-relaxed text-slate-700">
                            {useCase.approach}
                          </dd>
                        </div>

                        <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-3">
                          <dt className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-700" />
                            Business Outcome & Key Metric
                          </dt>
                          <dd className="mt-1 font-medium text-emerald-950">
                            {useCase.benefit}
                          </dd>
                          <p className="mt-2 pt-2 border-t border-emerald-200/60 font-mono text-[11px] text-emerald-800">
                            {useCase.metric}
                          </p>
                        </div>
                      </dl>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to="/request-consultation"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                      >
                        Model For Your Site
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        to="/services"
                        className="text-xs text-slate-500 hover:text-slate-800"
                      >
                        View Offerings
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
