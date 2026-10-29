import { useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Factory,
  MapPin,
  Sun,
  Wind,
  Zap,
} from 'lucide-react';
import { CtaBand } from '@/components/sections/PageHero';
import { RegionalLocator } from '@/components/RegionalLocator';
import { Reveal, SmartImage } from '@/components/ui';
import { visualAssets } from '@/data/visuals';

const SOLAR_TYPES = {
  rigid: {
    label: 'Rigid panels',
    title: 'Flat, rigid framed solar panels',
    image: visualAssets.solarFlatRigid,
    imageAlt: 'High-efficiency rigid monocrystalline solar panels with aluminum framing in sunlight',
    summary:
      'Framed monocrystalline silicon modules (Mono PERC, TOPCon, and Heterojunction HJT) delivering 21.5% to 23.8% cell efficiency. Sized for ground-mounted solar farms, industrial carports, and reinforced concrete (RCC) flat rooftops.',
    specs: [
      ['Module efficiency', '21.5% to 23.8% conversion efficiency (TOPCon / HJT n-type)'],
      ['Required area', '4.2 to 4.8 m² per kWp installed DC capacity'],
      ['Dead weight', '18 to 22 kg/m² (including framed glass & anodized aluminum mounting structure)'],
      ['Light capture', 'Bifacial glass-on-glass architecture capturing up to 25% additional albedo reflection from ground'],
      ['Temperature coefficient', '-0.30%/°C to -0.34%/°C, maintaining stable power output during peak summer irradiance'],
      ['Best fit', 'RCC rooftops, open industrial land, solar carports, elevated factory superstructures'],
    ],
    points: [
      'Industry-standard framed format with 25-year product and 30-year linear performance warranty',
      'Highest energy density per square meter for unconstrained, high-load structural surfaces',
      'Robust mechanical load rating resisting 2400 Pa wind uplift and 5400 Pa snow/hail pressure',
    ],
  },
  flexible: {
    label: 'Flexible mats',
    title: 'Lightweight flexible solar mats',
    image: visualAssets.solarFlexibleMat,
    imageAlt: 'Lightweight flexible solar panel mats seamlessly installed on curved warehouse roof',
    summary:
      'Ultra-thin flexible thin-film (CIGS) and flexible monocrystalline panels weighing just 2.8 kg/m². Conforms seamlessly to curved architectural surfaces and pre-engineered metal buildings (PEB) where roof load limits prevent rigid panels.',
    specs: [
      ['Module efficiency', '16.5% to 18.5% conversion efficiency'],
      ['Required area', '5.8 to 6.5 m² per kWp installed DC capacity'],
      ['Dead weight', '2.6 to 3.2 kg/m² (up to 85% lighter than rigid framed panels)'],
      ['Flexibility & curve', 'Up to 30° bend radius without micro-crack damage to internal solar cells'],
      ['Installation method', 'Peel-and-stick structural adhesive or mechanical clip bonding — zero roof penetrations'],
      ['Best fit', 'Curved dome roofs, aging PEB metal warehouses, weight-sensitive industrial hangars, transport vehicles'],
    ],
    points: [
      'Eliminates need for costly structural roof reinforcement on lightweight industrial sheds',
      'Zero aerodynamic wind uplift or roof leak risks due to direct membrane bonding',
      'High low-light sensitivity and exceptional performance during overcast monsoon months',
    ],
  },
  rooftop: {
    label: 'Commercial rooftop',
    title: 'Commercial & industrial rooftop solar systems',
    image: visualAssets.solarCommercialRooftop,
    imageAlt: 'Vast industrial commercial warehouse rooftop covered in solar panel arrays',
    summary:
      'Turnkey rooftop PV architectures engineered for manufacturing plants, logistics sheds, and IT parks. Includes ballasted non-penetrating or sheet-clamped racking, string inverters, net metering, and zero-export controllers.',
    specs: [
      ['System architecture', 'Grid-tied commercial rooftop with multi-MPPT string inverters and rapid shutdown'],
      ['Regulatory frameworks', 'Net metering, Gross metering, or Behind-The-Meter (BTM) captive consumption'],
      ['Evacuation voltage', '415V 3-phase LT or stepped up to 11kV/33kV for high-tension (HT) industrial consumers'],
      ['Zero-export control', 'Dynamic reverse power relay (DG-PV synchronization) preventing generator damage during outages'],
      ['Monitoring & SCADA', 'Module-level or string-level DC monitoring with automatic cloud fault alert dispatch'],
      ['Best fit', 'Manufacturing factories, distribution warehouses, commercial office complexes, cold storages'],
    ],
    points: [
      'Reduces daytime utility grid power draw by 40% to 70% at levelized cost of ₹3.20 to ₹3.80/kWh',
      'Walkways, lifeline safety anchors, and perimeter setbacks integrated for rapid cleaning access',
      'Protects factory machinery against peak daytime utility tariff spikes and maximum demand charges',
    ],
  },
} as const;

const WIND_CLASSES = {
  distributed: {
    label: 'Distributed wind',
    title: 'Distributed wind systems (Up to 100 kW)',
    image: visualAssets.wind,
    imageAlt: 'Distributed wind turbine generating clean electricity on site',
    band: 'Screening band: 10 kW to 100 kW rated output',
    rotorRpm: '30 to 50 RPM rotor speed',
    generatorType: 'Direct-drive permanent magnet synchronous generator (PMSG)',
    currentRating: 'Low-voltage 415V generation delivering 15A to 140A three-phase current',
    hourlyOutput: 'Average 15 kWh to 35 kWh per operating hour depending on site wind resource',
    description:
      'Engineered for decentralized industrial campuses, remote microgrids, agricultural processing centers, and telecom towers. Compact footprint with low noise emissions and direct LT grid connection.',
    specs: [
      ['Rotor diameter', '12m to 24m with aerodynamic composite fiberglass blades'],
      ['Hub height', '18m to 36m free-standing tubular steel or tilt-up towers'],
      ['Cut-in wind speed', '2.5 to 3.0 m/s; rated output reached at 10.5 m/s'],
      ['Evacuation', '415V 3-phase AC directly into local facility distribution panel'],
    ],
  },
  commercial: {
    label: 'Commercial wind',
    title: 'Commercial-scale wind turbines (100 kW to 1 MW)',
    image: visualAssets.windEnergy,
    imageAlt: 'Commercial scale wind turbine operating in an open landscape',
    band: 'Screening band: 100 kW to 1,000 kW (1 MW) rated output',
    rotorRpm: '18 to 30 RPM rotor speed',
    generatorType: 'Medium-speed geared or direct-drive synchronous generator',
    currentRating: '690V AC generation delivering 100A to 900A three-phase current',
    hourlyOutput: 'Average 280 kWh to 420 kWh per operating hour in active wind season',
    description:
      'Ideal for textile mills, cement grinding units, automotive foundries, and industrial parks in South Tamil Nadu and Karnataka. Designed for captive open access and wheeling across state transmission lines.',
    specs: [
      ['Rotor diameter', '50m to 75m with active blade pitch regulation'],
      ['Hub height', '60m to 90m tubular steel tower with internal ladder hoist'],
      ['Generator current', '690V generation stepped up to 11kV/33kV at tower base transformer'],
      ['Power factor', '0.95 leading to 0.95 lagging with automated VAR compensation'],
    ],
  },
  utility: {
    label: 'Utility scale',
    title: 'Utility-scale high-yield wind turbines (1.5 MW to 3.5 MW+)',
    image: visualAssets.viryaWind,
    imageAlt: 'Utility scale wind turbines in Kayathar South Tamil Nadu wind farm',
    band: 'Screening band: 1,500 kW to 3,500 kW (1.5 MW–3.5 MW+) rated output',
    rotorRpm: '9 to 16 RPM low rotor speed',
    generatorType: 'Doubly-Fed Induction Generator (DFIG) or Direct-Drive PMSG',
    currentRating: '690V (1,400A–3,000A) stepped up to 33kV medium voltage',
    hourlyOutput: 'Average 750 kWh to 1,450 kWh per operating hour (Capacity factor 32%–42%)',
    description:
      'Deployed across high-resource wind corridors in Kayathar, Muppandal, and Tirunelveli. Features high hub heights (120m to 140m) to harvest strong laminar wind currents funneling through the Western Ghats pass.',
    specs: [
      ['Rotor diameter', '110m to 156m with ultra-light carbon-fiber reinforced blades'],
      ['Hub height', '120m to 140m hybrid concrete-steel tubular towers'],
      ['Western Ghats funnel', 'Optimized for South-West monsoon winds with average speeds of 7.8 to 9.5 m/s'],
      ['Grid connection', 'Dedicated 33kV/110kV/230kV pooling substation with SCADA telemetry'],
    ],
  },
} as const;

type RenewableKind = 'solar' | 'wind-energy';

type NumericInputProps = {
  label: string;
  value: number;
  min?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
};

function NumericInput({ label, value, min = 0, step = 1, unit, onChange }: NumericInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <span className="relative block">
        <input
          className="field pr-20"
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(Math.max(min, Number(event.target.value) || 0))}
        />
        {unit && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-faint">
            {unit}
          </span>
        )}
      </span>
    </label>
  );
}

export default function RenewablesPage() {
  const { pathname } = useLocation();
  const { category } = useParams<{ category?: string }>();
  const kind: RenewableKind = pathname.startsWith('/services/wind-energy') ? 'wind-energy' : 'solar';
  const isWind = kind === 'wind-energy';

  // Calculator State
  const [siteArea, setSiteArea] = useState(2500); // m²
  const [moduleEfficiency, setModuleEfficiency] = useState(22.5); // %
  const [sunHours, setSunHours] = useState(5.2); // h/day
  const [solarPerformance, setSolarPerformance] = useState(82); // %

  const [windRatedKw, setWindRatedKw] = useState(2000); // kW (2 MW)
  const [capacityFactor, setCapacityFactor] = useState(35); // %
  const [lineVoltage, setLineVoltage] = useState(690); // V
  const [powerFactor, setPowerFactor] = useState(0.95);
  const [rotorRpm, setRotorRpm] = useState(12.5); // RPM
  const [generatorRpm, setGeneratorRpm] = useState(1500); // RPM

  const [annualTariff, setAnnualTariff] = useState(8.5); // ₹/kWh
  const [investment, setInvestment] = useState(12000000); // ₹
  const [gridFactor, setGridFactor] = useState(0.716); // kg CO₂/kWh
  const [mapPlace, setMapPlace] = useState(isWind ? 'Kayathar, Tamil Nadu' : 'Bengaluru');

  const selected = category
    ? isWind
      ? WIND_CLASSES[category as keyof typeof WIND_CLASSES]
      : SOLAR_TYPES[category as keyof typeof SOLAR_TYPES]
    : null;

  if (category && (isWind ? !(category in WIND_CLASSES) : !(category in SOLAR_TYPES))) {
    return <Navigate to={`/services/${kind}`} replace />;
  }

  // Solar Sizing Formulas
  const solarKw = (siteArea * moduleEfficiency) / 100;
  const solarDailyKwh = (solarKw * sunHours * solarPerformance) / 100;
  const solarAnnualKwh = solarDailyKwh * 365;
  const solarAnnualValue = solarAnnualKwh * annualTariff;
  const solarPayback = solarAnnualValue > 0 && investment > 0 ? investment / solarAnnualValue : null;

  // Wind Sizing Formulas
  const windAverageKw = (windRatedKw * capacityFactor) / 100;
  const windHourlyKwh = windAverageKw; // kWh per hour is equivalent to average kW
  const windAnnualKwh = windAverageKw * 8760;
  const windCurrent =
    (windRatedKw * 1000) / (Math.sqrt(3) * Math.max(1, lineVoltage) * Math.max(0.01, powerFactor));
  const windAnnualValue = windAnnualKwh * annualTariff;
  const windPayback = windAnnualValue > 0 && investment > 0 ? investment / windAnnualValue : null;

  const annualEnergy = isWind ? windAnnualKwh : solarAnnualKwh;
  const annualValue = isWind ? windAnnualValue : solarAnnualValue;
  const payback = isWind ? windPayback : solarPayback;

  const mapPlaces = isWind
    ? ['Kayathar, Tamil Nadu', 'Tirunelveli, Tamil Nadu', 'Panaji, Goa', 'Bengaluru']
    : ['Bengaluru', 'Hyderabad', 'Panaji, Goa', 'Mysuru', 'Kochi', 'Visakhapatnam'];

  const placeCoordinates: Record<string, [number, number]> = {
    'Kayathar, Tamil Nadu': [8.95, 77.75],
    'Tirunelveli, Tamil Nadu': [8.7139, 77.7567],
    Bengaluru: [12.9716, 77.5946],
    Hyderabad: [17.385, 78.4867],
    'Panaji, Goa': [15.4909, 73.8278],
    Mysuru: [12.2958, 76.6394],
    Kochi: [9.9312, 76.2673],
    Visakhapatnam: [17.6868, 83.2185],
  };

  const regionalLocations = mapPlaces.map((name) => ({
    name,
    latitude: placeCoordinates[name] ? placeCoordinates[name][0] : 12.9716,
    longitude: placeCoordinates[name] ? placeCoordinates[name][1] : 77.5946,
  }));

  const serviceLabel = isWind ? 'Wind Energy' : 'Solar Power';
  const Icon = isWind ? Wind : Sun;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ink pb-12 pt-28 sm:pb-16 sm:pt-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
          aria-hidden="true"
        />
        <div className="shell relative">
          <nav aria-label="Breadcrumb" className="mb-7 text-sm text-white/60">
            <Link to="/" className="hover:text-white">Home</Link><span className="px-2">/</span>
            <Link to="/services" className="hover:text-white">Offerings</Link><span className="px-2">/</span>
            <Link to={`/services/${kind}`} className="hover:text-white">{serviceLabel}</Link>
            {selected && (
              <>
                <span className="px-2">/</span>
                <span className="text-white">{selected.label}</span>
              </>
            )}
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Icon className="h-3.5 w-3.5" />
                {isWind ? 'Wind Generation & Turbine Engineering' : 'Solar Photovoltaic Architecture'}
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                {selected
                  ? selected.title
                  : isWind
                  ? 'Wind Energy Harvested from India’s Prime Corridors.'
                  : 'Solar Systems Sized for Surface, Light & Load.'}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                {selected
                  ? 'summary' in selected
                    ? selected.summary
                    : selected.description
                  : isWind
                  ? 'Classify turbines based on current generation (690V vs 11kV) and motor speed (direct-drive vs high-speed geared). Explore Kayathar and South Tamil Nadu wind farms with hourly energy metrics.'
                  : 'Compare high-efficiency rigid framed panels, ultra-lightweight flexible solar mats, and engineered commercial rooftop arrays. Calculate solar yields, required surface area, and payback.'}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={`/request-consultation?service=${isWind ? 'consulting' : 'solar'}`}
                  className="btn-primary-lg"
                >
                  Plan a clean energy site <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#calculator" className="btn btn-lg border border-white/25 text-white hover:bg-white/10">
                  <Zap className="h-4 w-4" />
                  Estimate yield & savings
                </a>
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 lg:col-span-5 shadow-lift">
              <SmartImage
                src={selected ? selected.image.src : isWind ? visualAssets.wind.src : visualAssets.solarFlatRigid.src}
                alt={selected ? selected.imageAlt : serviceLabel}
                width={1400}
                height={900}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07110f]/75 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#07110f]/80 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                <Icon className="h-4 w-4 text-emerald-300" />
                {isWind ? 'Kayathar Corridor Wind Engineering' : 'Tier-1 Mono PERC & TOPCon Photovoltaics'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Page Category Sub-Navigation */}
      <section className="sticky top-[4.25rem] z-30 border-b border-line bg-mist/95 backdrop-blur-md py-3.5">
        <nav className="shell flex gap-2 overflow-x-auto pb-1" aria-label={`${serviceLabel} categories`}>
          <Link
            to={`/services/${kind}`}
            className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              !selected
                ? 'bg-emerald-400 text-[#07110f]'
                : 'border border-line bg-card text-ink-muted hover:text-ink'
            }`}
          >
            Overview & Comparison
          </Link>
          {Object.entries(isWind ? WIND_CLASSES : SOLAR_TYPES).map(([key, item]) => (
            <Link
              key={key}
              to={`/services/${kind}/${key}`}
              className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                category === key
                  ? 'bg-emerald-400 text-[#07110f]'
                  : 'border border-line bg-card text-ink-muted hover:text-ink'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </section>

      {/* Detail or Overview Branch */}
      {selected ? (
        <section className="section">
          <div className="shell">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  {isWind ? 'Turbine Scale & Electrical Classification' : 'Panel Technology Classification'}
                </span>
                <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
                  {selected.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
                  {'summary' in selected ? selected.summary : selected.description}
                </p>

                {'points' in selected && selected.points.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {selected.points.map((point) => (
                      <li key={point} className="flex gap-3 text-xs sm:text-sm leading-relaxed text-ink">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="lg:col-span-7">
                <div className="overflow-hidden rounded-xl border border-line bg-card shadow-soft">
                  <div className="bg-mist px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-faint border-b border-line">
                    Engineering Specifications & Deployment Ratings
                  </div>
                  {selected.specs.map(([label, detail]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[minmax(9rem,0.75fr)_1.25fr] gap-4 border-b border-line/60 last:border-0 px-5 py-4 text-xs sm:text-sm"
                    >
                      <span className="font-bold text-ink">{label}</span>
                      <span className="leading-relaxed text-ink-muted">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="section">
          <div className="shell">
            <Reveal className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                {isWind ? 'Wind Sizing Classes' : 'Solar Panel Taxonomy'}
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
                {isWind
                  ? 'Turbine Classes Separated by Output Current & Rotor Speed.'
                  : 'Flat Rigid Panels, Flexible Mats & Rooftop Systems.'}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                {isWind
                  ? 'Explore wind systems classified by generated current (690V vs 11kV) and machine speed (direct-drive PMSG vs high-speed geared DFIG). Includes location data for Kayathar and South Tamil Nadu.'
                  : 'Rigid panels maximize conversion efficiency for roofs and carports. Lightweight flexible mats conform to curved or load-sensitive surfaces without roof penetrations.'}
              </p>
            </Reveal>

            {/* Cards Grid */}
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {Object.entries(isWind ? WIND_CLASSES : SOLAR_TYPES).map(([key, item], index) => {
                const img = item.image;
                return (
                  <Reveal key={key} delay={index * 0.06} as="div">
                    <Link
                      to={`/services/${kind}/${key}`}
                      className="group card card-hover flex h-full flex-col overflow-hidden border border-line"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <SmartImage
                          src={img.src}
                          alt={item.imageAlt}
                          width={800}
                          height={500}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07110f]/80 via-transparent to-transparent" />
                        <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-[#07110f]/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                          <h3 className="text-base font-bold text-ink group-hover:text-emerald-300 transition-colors">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-xs leading-relaxed text-ink-muted line-clamp-3">
                            {'summary' in item ? item.summary : item.description}
                          </p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-300 group-hover:translate-x-1 transition-transform">
                          Explore engineering details <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Interactive Sizing, Yield & Payback Calculator */}
      <section id="calculator" className="section bg-mist scroll-mt-24">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              CleanTech Performance Model
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              {isWind ? 'Estimate Wind Hourly Energy, Current & Payback' : 'Model Solar Capacity, Daily Yield & Payback'}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Configure your site surface area, turbine rated kW, grid voltage, and local electricity tariffs to model generation and financial payback.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            {/* Input Form */}
            <article className="card p-6 sm:p-7 lg:col-span-7 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{isWind ? 'Wind Turbine Parameters' : 'Solar PV Surface Parameters'}</h3>
                  <p className="text-xs text-ink-faint">
                    {isWind ? 'Nameplate kW, capacity factor & rotor speed' : 'Usable panel area, cell efficiency & sun hours'}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {isWind ? (
                  <>
                    <NumericInput label="Rated wind output" value={windRatedKw} min={1} step={50} unit="kW" onChange={setWindRatedKw} />
                    <NumericInput label="Capacity factor" value={capacityFactor} min={5} step={1} unit="%" onChange={(v) => setCapacityFactor(Math.min(v, 100))} />
                    <NumericInput label="Terminal line voltage" value={lineVoltage} min={400} step={50} unit="V AC" onChange={setLineVoltage} />
                    <NumericInput label="Power factor (cos φ)" value={powerFactor} min={0.5} step={0.01} onChange={(v) => setPowerFactor(Math.min(v, 1))} />
                    <NumericInput label="Rotor speed" value={rotorRpm} min={1} step={0.5} unit="RPM" onChange={setRotorRpm} />
                    <NumericInput label="Generator speed" value={generatorRpm} min={10} step={50} unit="RPM" onChange={setGeneratorRpm} />
                  </>
                ) : (
                  <>
                    <NumericInput label="Available roof / land area" value={siteArea} min={10} step={50} unit="m²" onChange={setSiteArea} />
                    <NumericInput label="Module efficiency" value={moduleEfficiency} min={10} step={0.5} unit="%" onChange={(v) => setModuleEfficiency(Math.min(v, 30))} />
                    <NumericInput label="Peak sun hours" value={sunHours} min={1} step={0.1} unit="h/day" onChange={setSunHours} />
                    <NumericInput label="System performance ratio" value={solarPerformance} min={50} step={1} unit="%" onChange={(v) => setSolarPerformance(Math.min(v, 100))} />
                  </>
                )}
                <NumericInput label="Electricity tariff" value={annualTariff} min={1} step={0.5} unit="₹/kWh" onChange={setAnnualTariff} />
                <NumericInput label="Total project investment" value={investment} min={0} step={100000} unit="₹" onChange={setInvestment} />
              </div>

              {/* Primary Output Metrics */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-[#10221a] p-4 border border-line">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    {isWind ? 'Average Hourly Output' : 'Installed DC Capacity'}
                  </span>
                  <p className="mt-2 text-xl font-extrabold text-white">
                    {isWind ? `${windHourlyKwh.toFixed(1)} kWh / hr` : `${solarKw.toFixed(1)} kWp`}
                  </p>
                </div>
                <div className="rounded-xl bg-[#10221a] p-4 border border-line">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    Annual Clean Generation
                  </span>
                  <p className="mt-2 text-xl font-extrabold text-white">
                    {Math.round(annualEnergy).toLocaleString('en-IN')} kWh
                  </p>
                </div>
                <div className="rounded-xl bg-[#10221a] p-4 border border-line">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    Annual Energy Value
                  </span>
                  <p className="mt-2 text-xl font-extrabold text-white">
                    ₹{Math.round(annualValue).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Wind Specific Current & Speed Metrics */}
              {isWind && (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-line bg-card p-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Rated AC Current</span>
                    <p className="mt-1 text-lg font-bold text-emerald-400">{windCurrent.toFixed(1)} A</p>
                    <p className="text-[0.7rem] text-ink-faint">3-phase current at {lineVoltage}V</p>
                  </div>
                  <div className="rounded-xl border border-line bg-card p-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Rotor Speed</span>
                    <p className="mt-1 text-lg font-bold text-ink">{rotorRpm.toFixed(1)} RPM</p>
                    <p className="text-[0.7rem] text-ink-faint">Aerodynamic blade sweep</p>
                  </div>
                  <div className="rounded-xl border border-line bg-card p-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Generator Speed</span>
                    <p className="mt-1 text-lg font-bold text-ink">{generatorRpm.toLocaleString('en-IN')} RPM</p>
                    <p className="text-[0.7rem] text-ink-faint">Internal alternator shaft</p>
                  </div>
                </div>
              )}
            </article>

            {/* Payback & Carbon Avoidance Output */}
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              <article className="card p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <CircleDollarSign className="h-5 w-5 text-amber-300" />
                    <h3 className="font-bold text-ink">Simple Capital Payback</h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                    Direct electricity bill offset against project CAPEX at input utility tariff.
                  </p>
                </div>
                <div className="mt-4 rounded-xl bg-[#10221a] p-4 border border-line">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Estimated Payback Period</span>
                  <p className="mt-2 text-2xl font-extrabold text-white">
                    {payback === null ? 'Input project CAPEX' : `${payback.toFixed(1)} Years`}
                  </p>
                </div>
              </article>

              <article className="card p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <Factory className="h-5 w-5 text-sky-300" />
                    <h3 className="font-bold text-ink">Avoided Grid Emissions</h3>
                  </div>
                  <div className="mt-3">
                    <NumericInput label="Grid carbon factor" value={gridFactor} min={0} step={0.005} unit="kg/kWh" onChange={setGridFactor} />
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-[#10221a] p-4 border border-line">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Annual Carbon Offset</span>
                  <p className="mt-2 text-2xl font-extrabold text-white">
                    {((annualEnergy * gridFactor) / 1000).toFixed(1)} tCO₂e / year
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Geography & Live Google Map */}
      <section className="section">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Project Corridors
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              {isWind ? 'Kayathar & South Tamil Nadu Wind Corridor.' : 'Solar Development Hubs Across South India.'}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              {isWind
                ? 'Kayathar and Tirunelveli form one of Asia’s premier wind energy funnels with continuous monsoonal air currents. Locate our project stations and evacuation hubs.'
                : 'Select an operational hub to view regional irradiance characteristics, grid connectivity, and office locations.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {mapPlaces.map((place) => (
                <button
                  key={place}
                  type="button"
                  onClick={() => setMapPlace(place)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                    mapPlace === place
                      ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300'
                      : 'border-line bg-card text-ink-muted hover:text-ink'
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                  {place}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Link
                to={`/request-consultation?service=${isWind ? 'consulting' : 'solar'}`}
                className="btn-primary-lg inline-flex items-center gap-2"
              >
                Request resource assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <RegionalLocator locations={regionalLocations} activeLocation={mapPlace} />
          </div>
        </div>
      </section>

      <CtaBand
        title={`Plan your ${serviceLabel.toLowerCase()} project with verified engineering.`}
        body="Share your site coordinates, rooftop layout or land acreage, electricity bills, and utility connection details. Virya delivers an exhaustive technical and financial feasibility proposal."
        primary={{ label: 'Request site assessment', to: `/request-consultation?service=${isWind ? 'consulting' : 'solar'}` }}
        secondary={{ label: 'Explore EV charging infrastructure', to: '/services/ev-charging' }}
      />
    </>
  );
}
