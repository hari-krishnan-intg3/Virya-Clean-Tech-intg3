import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Cpu,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { Reveal, SmartImage } from '@/components/ui';
import {
  insights,
  marketShifts,
  TECHNICAL_WHITEPAPERS,
  TECHNICAL_BRIEFS_SLIDES,
} from '@/data/insights';
import { visualAssets } from '@/data/visuals';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const INSIGHT_VISUALS = [
  visualAssets.solar,
  visualAssets.solarInstallation,
  visualAssets.solar,
  visualAssets.solarInstallation,
  visualAssets.ev,
  visualAssets.ev,
  visualAssets.wind,
  visualAssets.solar,
];

const SHIFT_VISUALS = [
  visualAssets.solar,
  visualAssets.ev,
  visualAssets.storage,
  visualAssets.engineering,
];

export default function InsightsPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedPaperId, setExpandedPaperId] = useState<string | null>(null);

  const categories = ['All', 'Solar & Storage', 'EV Mobility', 'Policy & Tariffs', 'Carbon Economics'];

  const filteredPapers =
    selectedCategory === 'All'
      ? TECHNICAL_WHITEPAPERS
      : TECHNICAL_WHITEPAPERS.filter((p) => p.category === selectedCategory);

  const togglePaper = (id: string) => {
    setExpandedPaperId(expandedPaperId === id ? null : id);
  };

  const handleJumpToPaper = (paperId: string) => {
    setSelectedCategory('All');
    setExpandedPaperId(paperId);
    const element = document.getElementById(`paper-${paperId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Technical Intelligence & Research"
        title={
          <>
            Engineering research for <span className="text-gradient">high-stakes energy decisions.</span>
          </>
        }
        description="Comprehensive technical whitepapers, regulatory citations (CEA, CERC, MoP, EU CBAM), and financial arbitrage models for commercial, industrial, and institutional CleanTech infrastructure."
        primary={{ label: 'Explore Solutions', to: '/services' }}
        secondary={{ label: 'Carbon Economics', to: '/carbon-economics' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'Insights & Technical Research', to: '/insights' }]}
      />

      {/* 8-Slide Technical Intelligence Briefs Slider */}
      <section className="section bg-slate-950 text-white overflow-hidden py-16">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                Strategic Intelligence Slider (8 Research Briefs)
              </p>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
              Executive Technical Briefs
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              Slide through 8 high-impact clean energy briefs covering tariff arbitrage, border carbon tariffs, fleet megawatt sizing, and electrochemical safety.
            </p>
          </Reveal>

          {/* Quick Jump Buttons */}
          <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
            {TECHNICAL_BRIEFS_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  swiperInstance?.slideTo(idx);
                  setActiveSlide(idx);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  activeSlide === idx
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                0{idx + 1}. {slide.pill}
              </button>
            ))}
          </div>

          {/* Swiper Container */}
          <div className="mt-6 relative">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              autoplay={{
                delay: 7500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              spaceBetween={20}
              slidesPerView={1}
              onSwiper={(swiper) => setSwiperInstance(swiper)}
              onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
              className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl"
            >
              {TECHNICAL_BRIEFS_SLIDES.map((slide, index) => (
                <SwiperSlide key={slide.id}>
                  <div className="grid lg:grid-cols-12 min-h-[500px]">
                    {/* Left: Narrative (7 cols) */}
                    <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                            {slide.category}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            Brief {index + 1} / 8
                          </span>
                        </div>

                        <h3 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                          {slide.title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm font-semibold text-emerald-400">
                          {slide.headline}
                        </p>
                        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
                          {slide.summary}
                        </p>

                        {/* Metric + Key Takeaways */}
                        <div className="mt-6 grid sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                          <div className="sm:col-span-1 border-b sm:border-b-0 sm:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-3 flex flex-col justify-center">
                            <div className="text-2xl font-black text-white">{slide.metric.value}</div>
                            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">
                              {slide.metric.label}
                            </div>
                          </div>
                          <div className="sm:col-span-2 space-y-1.5 text-xs text-slate-300 flex flex-col justify-center">
                            {slide.keyPoints.map((pt, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-1.5">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => handleJumpToPaper(slide.whitepaperRefId)}
                          className="btn-primary inline-flex items-center gap-2 group text-xs sm:text-sm"
                        >
                          <span>Read Full Technical Paper</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                        <Link
                          to="/request-consultation"
                          className="text-xs text-slate-400 hover:text-emerald-400 font-semibold transition-colors"
                        >
                          Request Feasibility Study →
                        </Link>
                      </div>
                    </div>

                    {/* Right: Background Asset (5 cols) */}
                    <div className="lg:col-span-5 relative bg-slate-950 min-h-[250px] lg:min-h-full overflow-hidden flex flex-col justify-end p-6">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="absolute inset-0 h-full w-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                      <div className="relative z-10">
                        <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Peer-Reviewed Citation
                        </div>
                        <p className="mt-2 text-xs text-slate-300 font-medium">
                          Derived from CEA Grid Regulations, CERC Open Access Frameworks & IEEE Standards.
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-between px-2">
              <span className="text-xs text-slate-400 font-mono">
                Slide 0{activeSlide + 1} / 0{TECHNICAL_BRIEFS_SLIDES.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => swiperInstance?.slidePrev()}
                  aria-label="Previous brief"
                  className="h-8 w-8 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => swiperInstance?.slideNext()}
                  aria-label="Next brief"
                  className="h-8 w-8 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Whitepapers Library */}
      <section className="section bg-white" id="whitepapers-library">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              In-Depth Research Papers
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
              Technical Whitepaper <span className="text-gradient">Repository</span>
            </h2>
            <p className="mt-4 text-base text-ink-muted">
              Peer-level technical documentation containing mathematical formulas, regulatory standards, and verified empirical benchmarks for engineering leads, CFOs, and plant directors.
            </p>
          </Reveal>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
                <span className="ml-1.5 text-xs opacity-70">
                  ({cat === 'All' ? TECHNICAL_WHITEPAPERS.length : TECHNICAL_WHITEPAPERS.filter((p) => p.category === cat).length})
                </span>
              </button>
            ))}
          </div>

          {/* Whitepapers Grid */}
          <div className="mt-8 space-y-6">
            {filteredPapers.map((paper) => {
              const isExpanded = expandedPaperId === paper.id;
              return (
                <article
                  key={paper.id}
                  id={`paper-${paper.id}`}
                  className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 transition-shadow hover:shadow-lg scroll-mt-24"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {paper.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {paper.readTime} • Published {paper.publishedDate}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl sm:text-2xl font-bold text-ink">
                        {paper.title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-slate-600">
                        {paper.subtitle}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                        {paper.executiveSummary}
                      </p>

                      {/* Cited Standards Tags */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Standards Cited:</span>
                        {paper.standardsCited.map((std) => (
                          <span
                            key={std}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {std}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stat Highlight Card */}
                    <div className="lg:w-64 shrink-0 rounded-xl border border-slate-100 bg-slate-50 p-4 text-center lg:text-left flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          Critical Metric
                        </span>
                        <div className="mt-1 text-2xl font-black text-emerald-800">
                          {paper.statHighlight.value}
                        </div>
                        <div className="mt-0.5 text-xs font-medium text-slate-600">
                          {paper.statHighlight.label}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => togglePaper(paper.id)}
                        className="mt-4 inline-flex items-center justify-center gap-1.5 w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-colors"
                      >
                        <span>{isExpanded ? 'Collapse Analysis' : 'Expand Engineering Findings'}</span>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Engineering Breakdown Drawer */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-slate-200 animate-fadeIn space-y-6">
                      {/* Key Formulas */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-emerald-600" />
                          Key Regulatory & Engineering Mathematical Formulas
                        </h4>
                        <div className="mt-3 grid md:grid-cols-2 gap-4">
                          {paper.keyFormulas.map((f, fIdx) => (
                            <div
                              key={fIdx}
                              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                            >
                              <div className="text-xs font-bold text-slate-700">{f.label}</div>
                              <div className="mt-2 font-mono text-sm font-semibold text-emerald-800 bg-white p-2.5 rounded-lg border border-slate-200 overflow-x-auto">
                                {f.formula}
                              </div>
                              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                {f.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Engineering Findings */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-emerald-600" />
                          Field Engineering Findings & Technical Constraints
                        </h4>
                        <ul className="mt-3 space-y-2 text-xs sm:text-sm text-ink-muted">
                          {paper.engineeringFindings.map((finding, findIdx) => (
                            <li key={findIdx} className="flex items-start gap-2">
                              <span className="font-bold text-emerald-600 mt-0.5">•</span>
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Procurement & RFP Takeaways */}
                      <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-emerald-700" />
                          Actionable RFP & Technical Procurement Takeaways
                        </h4>
                        <ul className="mt-2 space-y-1.5 text-xs text-emerald-950">
                          {paper.procurementTakeaways.map((takeaway, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-2">
                              <span className="font-bold text-emerald-700">✓</span>
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <span className="text-xs font-mono text-slate-400">
                          Author: {paper.author}
                        </span>
                        <Link
                          to="/request-consultation"
                          className="btn-primary inline-flex items-center gap-1.5 text-xs"
                        >
                          <span>Request Site Specific Study</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* National Published Figures (Statutory Attributed Data) */}
      <section className="section bg-mist/60 border-t border-slate-200">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Statutory Data
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              National Market Context & Public Benchmarks
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Attributed data from the Ministry of New and Renewable Energy (MNRE), Ministry of Power, and Mercom Research.
            </p>
          </Reveal>

          <dl className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {insights.map((insight, index) => (
              <Reveal key={insight.id} delay={index * 0.04} as="div">
                <div className="card flex h-full flex-col overflow-hidden border border-slate-200">
                  <div className="relative h-28 overflow-hidden">
                    <SmartImage
                      src={INSIGHT_VISUALS[index % INSIGHT_VISUALS.length].src}
                      alt={INSIGHT_VISUALS[index % INSIGHT_VISUALS.length].alt}
                      width={960}
                      height={480}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#07110f]/60 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <dt className="font-heading text-2xl font-extrabold text-ink">
                      {insight.value}{' '}
                      <span className="text-sm font-bold text-emerald-700">{insight.unit}</span>
                    </dt>
                    <dd className="mt-2 flex flex-1 flex-col">
                      <p className="text-xs font-semibold text-ink">{insight.label}</p>
                      <p className="mt-2 text-xs leading-relaxed text-ink-muted line-clamp-3">{insight.note}</p>
                      <p className="mt-4 border-t border-slate-100 pt-3 text-[10px] text-ink-faint">
                        {insight.source} · {insight.asOf}
                      </p>
                      {insight.href && (
                        <a
                          href={insight.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
                        >
                          View source <ArrowUpRight className="h-3 w-3" />
                        </a>
                      )}
                    </dd>
                  </div>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Strategic Market Shifts */}
      <section className="section bg-white border-t border-slate-200">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Strategic Perspectives
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              What Emerging Clean Energy Trends Prompt Businesses to Ask
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {marketShifts.map((shift, index) => (
              <Reveal key={shift.title} delay={index * 0.05} as="div">
                <article className="card h-full overflow-hidden border border-slate-200">
                  <div className="relative h-40 overflow-hidden">
                    <SmartImage
                      src={SHIFT_VISUALS[index % SHIFT_VISUALS.length].src}
                      alt={SHIFT_VISUALS[index % SHIFT_VISUALS.length].alt}
                      width={1200}
                      height={600}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#07110f]/60 to-transparent" />
                    <span className="absolute bottom-4 left-5 grid h-9 w-9 place-items-center rounded-xl border border-white/20 bg-[#07110f]/60 text-emerald-300 backdrop-blur">
                      <BookOpenText className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-bold text-ink">{shift.title}</h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-ink-muted">{shift.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
            >
              Explore Solutions & ROI Calculators <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/carbon-economics"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
            >
              Explore Carbon Economics & CBAM <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title="Turn research intelligence into site-level implementation"
        body="Technical papers establish the engineering boundaries. Share your facility single-line diagram and billing history to model actual project returns."
        primary={{ label: 'Request a Consultation', to: '/request-consultation' }}
        secondary={{ label: 'Review All Offerings', to: '/services' }}
      />
    </>
  );
}
