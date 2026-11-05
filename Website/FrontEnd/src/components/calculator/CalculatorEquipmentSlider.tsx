import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { visualAssets } from '@/data/visuals';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface EquipmentSlide {
  id: string;
  badge: string;
  title: string;
  vernacularSubtitle?: string;
  description: string;
  specs: { label: string; value: string }[];
  highlight: string;
  image: string;
  imageAlt: string;
}

export const EQUIPMENT_SLIDES: EquipmentSlide[] = [
  {
    id: 'topcon-solar',
    badge: 'Solar Generation',
    title: 'N-Type TOPCon & Bifacial Rigid Solar Modules',
    vernacularSubtitle: 'High-Yield Rooftop PV',
    description: 'Tier-1 bifacial photovoltaic panels yielding up to 22.8% module efficiency, certified ALMM compliant for DISCOM net-metering and PM Surya Ghar schemes.',
    specs: [
      { label: 'Module Efficiency', value: '22.8% TOPCon' },
      { label: 'Degradation', value: '0.40%/year linear' },
      { label: 'Performance Warranty', value: '25–30 Years' },
    ],
    highlight: '3 kW residential system generates ~4,350 units/year, saving ₹34,000+ annually on grid tariffs.',
    image: visualAssets.solarCommercialRooftop.src,
    imageAlt: 'Tier-1 bifacial solar PV panels installed on rooftop.',
  },
  {
    id: 'solar-paai',
    badge: 'Lightweight Innovation',
    title: 'Solar Mat / Solar Paai (Flexible CIGS Panels)',
    vernacularSubtitle: 'Solar Paai (Peel-and-Stick Solar Mat)',
    description: 'Ultra-thin, non-penetrating flexible solar mats weighing only 2.9 kg/m². Adheres directly to curved standing-seam PEB factory roofs without heavy ballast or structural puncturing.',
    specs: [
      { label: 'Surface Weight', value: '2.9 kg/m²' },
      { label: 'Roof Penetration', value: 'Zero (Peel & Stick)' },
      { label: 'Curvature Radius', value: 'Down to 0.5m bend' },
    ],
    highlight: 'Ideal for old warehouse sheds and PEB industrial roofs where structural engineers reject heavy glass panels.',
    image: visualAssets.solarFlexibleMat.src,
    imageAlt: 'Flexible peel-and-stick solar mat installed on curved industrial metal roof.',
  },
  {
    id: 'sodium-batteries',
    badge: 'Next-Gen Storage',
    title: 'Sodium-Ion Battery Systems (Sodium BESS)',
    vernacularSubtitle: 'Thermal-Resilient Stationary Storage',
    description: 'Abundant, cobalt-free, and lithium-free stationary battery storage offering exceptional thermal safety up to 60°C ambient temperatures without thermal runaway hazards.',
    specs: [
      { label: 'Operating Temp', value: '-20°C to +60°C' },
      { label: 'Cycle Life', value: '4,000+ Deep Cycles' },
      { label: 'Fire Safety', value: 'Zero Runaway Risk' },
    ],
    highlight: 'Dramatically reduces HVAC parasitic cooling load in hot Indian industrial zones while cutting storage CapEx.',
    image: visualAssets.storage.src,
    imageAlt: 'Containerized sodium-ion battery energy storage system.',
  },
  {
    id: 'green-hydrogen',
    badge: 'Industrial Clean Fuel',
    title: 'Green Hydrogen Generation Plants & Electrolyzers',
    vernacularSubtitle: 'PEM & Alkaline Decarbonization Skids',
    description: 'Modular multi-megawatt water electrolysis generating 99.999% ultra-pure green hydrogen for steel annealing, ammonia production, and long-duration clean energy storage.',
    specs: [
      { label: 'Purity Level', value: '99.999% Grade 5.0' },
      { label: 'Electrolyzer Tech', value: 'Pressurized Alkaline/PEM' },
      { label: 'Carbon Abatement', value: '100% Scope 1 & 2' },
    ],
    highlight: 'Replaces expensive fossil natural gas and diesel in heavy manufacturing, shielding exporters against EU CBAM penalties.',
    image: visualAssets.dataCenterGreenPower.src,
    imageAlt: 'Industrial green hydrogen generation electrolyzer facility.',
  },
  {
    id: 'ev-fleet-depot',
    badge: 'E-Mobility Fleet Hubs',
    title: 'Electric Fleet Charging & High-Power DC Depots',
    vernacularSubtitle: '30kW to 360kW DC Fast Charging',
    description: 'Depot charging infrastructure for delivery vans, municipal buses, and logistics fleets with automated OCPP 2.0.1 smart load balancing and priority departure queuing.',
    specs: [
      { label: 'Charger Power', value: '30 kW to 360 kW DC' },
      { label: 'Protocol Standard', value: 'OCPP 1.6J / 2.0.1' },
      { label: 'Dispenser Standard', value: 'Dual CCS2 Combo' },
    ],
    highlight: 'Cuts commercial fleet fuel expenditure from ₹11.50/km (diesel) to ₹2.80/km (EV), achieving sub-18 month payback.',
    image: visualAssets.evBusDepot.src,
    imageAlt: 'High-power electric bus depot and commercial fleet DC fast chargers.',
  },
  {
    id: 'telecom-solar-towers',
    badge: 'Telecom Infrastructure',
    title: 'Mobile Towers & Solar Telecom Power Towers',
    vernacularSubtitle: '100% Diesel Genset Displacement',
    description: 'Custom hybrid solar-BESS systems engineered for rural and urban telecom cell towers, displacing expensive diesel generator fuel burning and fuel pilferage.',
    specs: [
      { label: 'Diesel Elimination', value: 'Up to 90% Fuel Avoided' },
      { label: 'Telecom DC Supply', value: '-48V DC Native Output' },
      { label: 'Remote Telemetry', value: 'SNMP / MQTT NOC Sync' },
    ],
    highlight: 'Saves telecom infrastructure providers ₹4.5 to ₹7.2 Lakhs annually per tower in avoided diesel purchases.',
    image: visualAssets.gridModernizationSubstation.src,
    imageAlt: 'Solar powered telecom tower and grid modernization infrastructure.',
  },
  {
    id: 'pm-surya-ghar',
    badge: 'Government Scheme',
    title: 'PM Surya Ghar: Muft Bijli Yojana (₹78,000 Subsidy)',
    vernacularSubtitle: '3 kW -> ~₹1 Lakh Direct Savings',
    description: 'Direct Benefit Transfer (DBT) subsidies deposited directly into the beneficiary bank account. 1kW gets ₹30,000, 2kW gets ₹60,000, and 3kW+ receives ₹78,000 direct subsidy.',
    specs: [
      { label: '3 kW Direct Subsidy', value: '₹78,000 Direct DBT' },
      { label: 'Annual Bill Offset', value: 'Zero Electricity Bills' },
      { label: 'Combined Year-1 Benefit', value: '>₹1,00,000 Savings' },
    ],
    highlight: '3kW system pays for itself in just 3.2 years with zero recurring electricity bills under net metering.',
    image: visualAssets.solarFlatRigid.src,
    imageAlt: 'Residential rooftop solar panels under PM Surya Ghar Muft Bijli Yojana.',
  },
  {
    id: 'commercial-accelerated-depreciation',
    badge: 'Corporate Finance',
    title: 'Section 32 Accelerated Depreciation (40%) & GEOA',
    vernacularSubtitle: 'C&I CleanTech Tax Shield',
    description: 'Commercial facilities claim a 40% Year-1 tax depreciation write-off on solar, BESS, and EVSE. Green Energy Open Access (GEOA) permits captive procurement for loads above 100 kW.',
    specs: [
      { label: 'Year-1 Tax Shield', value: '40% Accelerated Dep' },
      { label: 'Effective CapEx Refund', value: '~10.4% in Year 1' },
      { label: 'GEOA Threshold', value: '100 kW Minimum Load' },
    ],
    highlight: 'Reduces net corporate capital outlay by over 10% within the first financial filing year.',
    image: visualAssets.siteAssessment.src,
    imageAlt: 'Commercial enterprise energy audit and tax shield optimization.',
  },
];

export function CalculatorEquipmentSlider() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>8 Core CleanTech Solutions & Subsidies</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Engineered Equipment & Government Schemes
          </h3>
          <p className="text-xs text-white/70 mt-1">
            Explore Solar Paai, Sodium Batteries, Hydrogen Plants, EV Charging, Telecom Towers, and Subsidies.
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-white/50 mr-2">
            0{activeIdx + 1} <span className="text-white/20">/</span> 0{EQUIPMENT_SLIDES.length}
          </span>
          <button
            type="button"
            onClick={() => swiper?.slidePrev()}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/15 transition active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => swiper?.slideNext()}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/15 transition active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Pill Selectors */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {EQUIPMENT_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => {
              swiper?.slideTo(idx);
              setActiveIdx(idx);
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition border ${
              activeIdx === idx
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="font-mono opacity-60 mr-1">0{idx + 1}.</span>
            <span>{slide.title.split(' ')[0]} {slide.title.split(' ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Swiper Slider */}
      <div className="mt-6">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 7500, disableOnInteraction: false }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            1024: { slidesPerView: 2 },
          }}
          onSwiper={setSwiper}
          onSlideChange={(s) => setActiveIdx(s.realIndex)}
        >
          {EQUIPMENT_SLIDES.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5 flex flex-col justify-between hover:border-emerald-500/30 transition">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[0.68rem] font-bold text-emerald-400 uppercase">
                      {slide.badge}
                    </span>
                    {slide.vernacularSubtitle && (
                      <span className="text-[0.7rem] font-semibold text-white/50">
                        {slide.vernacularSubtitle}
                      </span>
                    )}
                  </div>

                  <h4 className="mt-3 text-base sm:text-lg font-bold text-white">
                    {slide.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    {slide.description}
                  </p>

                  {/* Specs Grid */}
                  <div className="mt-4 grid grid-cols-3 gap-2 border-y border-white/10 py-3">
                    {slide.specs.map((spec, i) => (
                      <div key={i}>
                        <span className="block text-[0.62rem] text-white/40 uppercase font-semibold">
                          {spec.label}
                        </span>
                        <span className="block text-xs font-bold text-white mt-0.5">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 p-2.5 text-[0.7rem] text-emerald-300 font-medium">
                  {slide.highlight}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
