import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  BatteryCharging,
  Bike,
  Bus,
  Calculator,
  CarFront,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Factory,
  MapPin,
  PlugZap,
  Route,
  Truck,
  Zap,
  Layers,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { CtaBand } from '@/components/sections/PageHero';
import { RegionalLocator } from '@/components/RegionalLocator';
import { Reveal, SmartImage } from '@/components/ui';
import { visualAssets } from '@/data/visuals';
import { EV_VEHICLE_DATABASE } from '@/data/offeringsArchitecture';

const SEGMENTS = {
  passenger: {
    label: 'Cars',
    title: 'Charging for electric cars',
    icon: CarFront,
    image: visualAssets.ev,
    imageAlt: 'Electric passenger car connected to a fast charging station',
    preview: 'Tata Nexon (45 kWh): 56 mins DC / 6h AC · Ioniq 5 (72.6 kWh): 18 mins HPC',
    intro: 'BEV and PHEV passenger charging with Type 2 AC (3.3–22 kW) and CCS2 DC fast charging (30–350 kW).',
    vehicles: ['Tata Nexon EV', 'MG ZS EV', 'Hyundai Ioniq 5', 'Mahindra XUV400 EV', 'BYD Atto 3'],
    use: 'Home & workplace AC for long dwell hours; destination fast charging at commercial hubs; ultra-fast highway corridor HPC.',
    specs: [
      ['AC supply', 'Single-phase 3.3–7.4 kW / 3-phase 11–22 kW AC with Type 2 connector'],
      ['DC fast supply', '30 kW to 350 kW ultra-fast DC on 400V/800V architectures with CCS2'],
      ['Connectors', 'Type 2 AC, CCS2 Combo (India standard); NACS / GB/T where configured'],
      ['Smart protocol', 'ISO 15118-20 Plug & Charge, automated RFID / UPI payment, dynamic load balancing'],
    ],
    benefit: 'Reduce charging friction for employees, residents and visitors while eliminating transformer upgrade costs.',
  },
  'two-wheelers': {
    label: '2-wheelers',
    title: 'Charging for two-wheelers',
    icon: Bike,
    image: visualAssets.evTwoWheeler,
    imageAlt: 'Electric scooter connected to a smart urban AC charging post',
    preview: 'Ather 450X (3.7 kWh): 50 mins fast / 5.7h AC · Ola S1 (4 kWh): 15 mins for 50km',
    intro: 'Scooters, motorcycles, and delivery fleets; smart AC slow charging or 90-second battery swapping.',
    vehicles: ['Ather 450X', 'Ola S1 Pro', 'TVS iQube', 'Bajaj Chetak', 'Vida V1', 'Swappable Fleet Packs'],
    use: 'Secure low-power AC posts at tech parks, apartments, and campuses; automated battery swap kiosks for high-mileage delivery riders.',
    specs: [
      ['Charging input', '700W to 3.3 kW AC on standard 15A or dedicated light EV charging sockets'],
      ['Swapping kiosk', 'Automated 8–15 bay battery swap kiosks; 90-second automated exchange'],
      ['Connectors', 'Standard 15A 3-pin plug, IEC 62196-6, proprietary fast-charge ports'],
      ['Safety & earthing', 'IP67 ingress protection, residual current device (RCD), automated fire suppression'],
    ],
    benefit: 'Enable hassle-free daily commuting and 24/7 delivery uptime with dense, low-footprint charging points.',
  },
  'three-wheelers': {
    label: '3-wheelers',
    title: 'Charging for electric auto-rickshaws',
    icon: Route,
    image: visualAssets.evAutoRickshaw,
    imageAlt: 'Electric auto-rickshaw connected to a public charging station in India',
    preview: 'Mahindra Treo (7.37 kWh): 3.8h AC · Euler HiLoad (12.4 kWh): 15 mins for 50km',
    intro: 'Passenger e-autos, e-rickshaws, and high-payload urban cargo 3-wheelers.',
    vehicles: ['Mahindra Treo', 'Piaggio Ape E-City', 'Euler HiLoad EV', 'Altigreen neEV', 'Bajaj RE E-Tec'],
    use: 'Overnight depot AC charging; daytime top-up at metro feeder hubs; automated battery swapping for urban passenger runs.',
    specs: [
      ['Charging input', '3.0 kW to 3.7 kW AC onboard chargers on 16A industrial receptacles'],
      ['Fast charge option', 'High-current DC charging hubs (e.g. Euler HiLoad 50km in 15 mins)'],
      ['Battery strategy', 'Fixed LFP battery packs or interoperable quick-swap standard batteries'],
      ['Depot operations', 'Multi-gun overnight charging bays with off-peak tariff scheduling'],
    ],
    benefit: 'Maximize driver earning hours and fleet availability by eliminating long daytime charging downtime.',
  },
  buses: {
    label: 'Buses',
    title: 'Charging for electric buses',
    icon: Bus,
    image: visualAssets.evBusDepot,
    imageAlt: 'Electric transit city bus charging at a high-power depot charging bay',
    preview: 'Olectra K9 (360 kWh): 110 mins 150kW DC · Pantograph (180 kWh): 12 mins 450kW',
    intro: 'Municipal transit buses, intercity coaches, school and corporate employee shuttles.',
    vehicles: ['Olectra K9 / CX2', 'Tata Starbus EV (9/12m)', 'Ashok Leyland Switch EiV 12', 'JBM Ecolife'],
    use: 'Overnight depot DC charging for scheduled morning dispatch; opportunity pantograph charging at terminal layovers.',
    specs: [
      ['Depot supply', '120 kW to 240 kW dual-gun CCS2 DC fast chargers with sequential power sharing'],
      ['Opportunity charging', '300 kW to 450 kW top-down inverted pantograph (SAE J3105) for 10–15 min layover top-ups'],
      ['Grid connection', 'Dedicated 11kV/33kV HT substation with ring main unit (RMU) and dry-type transformers'],
      ['Software profile', 'OCPP 2.0.1 automated schedule dispatch, pre-conditioning, and state-of-charge guarantees'],
    ],
    benefit: 'Protect 100% on-time route dispatch while cutting fleet operating cost by over 50% compared to diesel.',
  },
  fleets: {
    label: 'Commercial fleets',
    title: 'Charging for vans and trucks',
    icon: Truck,
    image: visualAssets.industrial,
    imageAlt: 'Commercial electric truck fleet arranged at a logistics depot',
    preview: 'Tata Ace EV (21.3 kWh): 105 mins DC · 40-55T Hauler (380 kWh): 35 mins MCS',
    intro: 'E-commerce delivery vans, light commercial vehicles (LCVs), and heavy-duty 40–55 ton haulers.',
    vehicles: ['Tata Ace EV', 'Ashok Leyland IeV Series', 'Eicher Pro EV', 'Heavy Electric Haulers (40–55T)'],
    use: 'Dedicated distribution center depot charging; en-route fast charging along freight corridors; Megawatt Charging System (MCS) for heavy trucks.',
    specs: [
      ['Depot power', '30 kW to 120 kW DC for delivery vans; 240 kW to 360 kW dual-gun for medium trucks'],
      ['Megawatt charging', 'MCS (Megawatt Charging System) up to 1250V / 1000A+ for heavy-duty long-haul freight'],
      ['Demand management', 'Dynamic peak shaving with co-located BESS and rooftop solar integration'],
      ['Standards', 'CCS2, MCS, ISO 15118-20 bidirectional grid export support'],
    ],
    benefit: 'Tie charging infrastructure directly to logistics delivery blocks, turnaround SLAs, and route profitability.',
  },
} as const;

type SegmentKey = keyof typeof SEGMENTS;
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
          className="field pr-16"
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(Math.max(min, Number(event.target.value) || 0))}
        />
        {unit && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-faint">{unit}</span>}
      </span>
    </label>
  );
}

const CITIES = [
  'Bengaluru',
  'Hyderabad',
  'Panaji, Goa',
  'Mysuru',
  'Mangaluru',
  'Kozhikode',
  'Kochi',
  'Thiruvananthapuram',
  'Visakhapatnam',
];

const CITY_COORDINATES: Record<string, [number, number]> = {
  Bengaluru: [12.9716, 77.5946],
  Hyderabad: [17.385, 78.4867],
  'Panaji, Goa': [15.4909, 73.8278],
  Mysuru: [12.2958, 76.6394],
  Mangaluru: [12.9141, 74.856],
  Kozhikode: [11.2588, 75.7804],
  Kochi: [9.9312, 76.2673],
  Thiruvananthapuram: [8.5241, 76.9366],
  Visakhapatnam: [17.6868, 83.2185],
};

export default function EVChargingPage() {
  const { segment } = useParams<{ segment?: string }>();
  const selectedKey = (segment ?? '') as SegmentKey | '';
  const selected = selectedKey ? SEGMENTS[selectedKey] : null;

  // Calculators State
  const [batteryKwh, setBatteryKwh] = useState(45);
  const [startSoc, setStartSoc] = useState(20);
  const [targetSoc, setTargetSoc] = useState(80);
  const [chargerKw, setChargerKw] = useState(50);
  const [chargeEfficiency, setChargeEfficiency] = useState(92);

  const [vehicles, setVehicles] = useState(15);
  const [dailyKm, setDailyKm] = useState(120);
  const [evKwhPer100Km, setEvKwhPer100Km] = useState(16);
  const [iceLitresPer100Km, setIceLitresPer100Km] = useState(9);
  const [fuelPrice, setFuelPrice] = useState(102);
  const [electricityPrice, setElectricityPrice] = useState(8.5);
  const [chargerCapex, setChargerCapex] = useState(1200000);

  const [gridFactor, setGridFactor] = useState(0.716);
  const [fuelFactor, setFuelFactor] = useState(2.31);
  const [activeCity, setActiveCity] = useState(CITIES[0]);

  if (segment && !(segment in SEGMENTS)) return <Navigate to="/services/ev-charging" replace />;

  const energyNeeded = (batteryKwh * Math.max(0, targetSoc - startSoc)) / 100;
  const gridEnergy = energyNeeded / Math.max(0.01, chargeEfficiency / 100);
  const chargeHours = gridEnergy / Math.max(0.01, chargerKw);
  const chargeMinutes = Math.round(chargeHours * 60);

  const annualDistance = Math.max(0, vehicles) * Math.max(0, dailyKm) * 365;
  const annualEvKwh = (annualDistance * Math.max(0, evKwhPer100Km)) / 100;
  const annualFuelLitres = (annualDistance * Math.max(0, iceLitresPer100Km)) / 100;
  const annualFuelCost = annualFuelLitres * Math.max(0, fuelPrice);
  const annualElectricityCost = annualEvKwh * Math.max(0, electricityPrice);
  const annualSavings = annualFuelCost - annualElectricityCost;
  const paybackYears = annualSavings > 0 ? chargerCapex / annualSavings : null;
  const annualAvoidedTonnes = (annualFuelLitres * fuelFactor - annualEvKwh * gridFactor) / 1000;

  const mapLocations = CITIES.map((name) => ({
    name,
    latitude: CITY_COORDINATES[name][0],
    longitude: CITY_COORDINATES[name][1],
  }));

  // Filtered vehicles for category detail view
  const categoryVehicles = selectedKey
    ? EV_VEHICLE_DATABASE.filter((v) => v.category === selectedKey)
    : EV_VEHICLE_DATABASE;

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
            <Link to="/services/ev-charging" className="hover:text-white">EV Charging</Link>
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
                <Zap className="h-3.5 w-3.5" />
                Electric Mobility Infrastructure
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                {selected ? selected.title : 'EV Charging Infrastructure Engineered for Scale.'}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                {selected
                  ? selected.intro
                  : 'Turnkey charging systems engineered around vehicle duty cycles, battery acceptance curves, and available transformer headroom. Sized for passenger cars, two-wheelers, auto-rickshaws, transit bus fleets, and heavy commercial trucks.'}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/request-consultation?service=ev-charging" className="btn-primary-lg">
                  Plan an EV site <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#calculators" className="btn btn-lg border border-white/25 text-white hover:bg-white/10">
                  <Calculator className="h-4 w-4" />
                  Estimate ROI & Performance
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/65">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Real Vehicle Charge Curves
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Transparent Sizing Calculators
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  All-India Regional Hubs
                </span>
              </div>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 lg:col-span-5 shadow-lift">
              <SmartImage
                src={selected?.image.src ?? visualAssets.ev.src}
                alt={selected?.imageAlt ?? visualAssets.ev.alt}
                width={1400}
                height={900}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07110f]/75 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#07110f]/80 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                <Zap className="h-4 w-4 text-emerald-300" />
                High-Uptime EVSE Sizing & Deployment
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Multi-Page Sub-Navigation */}
      <section className="sticky top-[4.25rem] z-30 border-b border-line bg-mist/95 backdrop-blur-md py-3.5">
        <nav className="shell flex gap-2 overflow-x-auto pb-1" aria-label="EV vehicle categories">
          <Link
            to="/services/ev-charging"
            className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              !selected
                ? 'bg-emerald-400 text-[#07110f]'
                : 'border border-line bg-card text-ink-muted hover:text-ink'
            }`}
          >
            All Categories & Matrix
          </Link>
          {(Object.entries(SEGMENTS) as [SegmentKey, (typeof SEGMENTS)[SegmentKey]][]).map(([key, item]) => {
            const Icon = item.icon;
            const isCurrent = selectedKey === key;
            return (
              <Link
                key={key}
                to={`/services/ev-charging/${key}`}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                  isCurrent
                    ? 'bg-emerald-400 text-[#07110f]'
                    : 'border border-line bg-card text-ink-muted hover:text-ink'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </section>

      {/* Conditional: Category Specific View OR Overview Page */}
      {selected ? (
        <section className="section">
          <div className="shell">
            {/* Top Split: Planning Specs */}
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Reveal>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                    Category Deep-Dive
                  </span>
                  <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
                    {selected.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
                    {selected.intro}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {selected.vehicles.map((vehicle) => (
                      <span
                        key={vehicle}
                        className="rounded-md border border-line bg-card px-3 py-1.5 text-xs font-semibold text-ink"
                      >
                        {vehicle}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Standard Duty Cycle Benchmark
                    </p>
                    <p className="mt-2 text-sm font-bold text-ink">{selected.preview}</p>
                    <p className="mt-2 text-xs leading-relaxed text-ink-faint">
                      Benchmarked against standard ambient temperatures (25–35°C) and certified OEM charge acceptance rates.
                    </p>
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <div className="overflow-hidden rounded-xl border border-line shadow-soft bg-card">
                  <div className="grid grid-cols-[minmax(9rem,0.75fr)_1.25fr] bg-mist px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-faint border-b border-line">
                    <span>Engineering Dimension</span>
                    <span>Deployment Specification</span>
                  </div>
                  {selected.specs.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[minmax(9rem,0.75fr)_1.25fr] gap-4 border-b border-line/60 last:border-0 px-5 py-4 text-xs sm:text-sm"
                    >
                      <span className="font-bold text-ink">{label}</span>
                      <span className="leading-relaxed text-ink-muted">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Real Vehicle Models in India Table */}
            <div className="mt-14">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-ink sm:text-2xl">
                    Popular Vehicle Models & Real Charging Speeds
                  </h3>
                  <p className="mt-1 text-xs text-ink-muted">
                    Verified technical specifications for key commercial and passenger models operating in India.
                  </p>
                </div>
                <Link
                  to="/request-consultation?service=ev-charging"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
                >
                  Request fleet site design <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto rounded-xl border border-line bg-card shadow-soft">
                <table className="w-full min-w-[760px] border-collapse text-left text-xs sm:text-sm">
                  <thead className="bg-mist text-xs font-bold uppercase tracking-wider text-ink-faint border-b border-line">
                    <tr>
                      <th className="px-5 py-3.5">Vehicle Model</th>
                      <th className="px-5 py-3.5">Battery & Chemistry</th>
                      <th className="px-5 py-3.5">Real Range</th>
                      <th className="px-5 py-3.5">AC Charging Time</th>
                      <th className="px-5 py-3.5">DC Fast Charging Time</th>
                      <th className="px-5 py-3.5">Inlet / Standard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-ink-muted">
                    {categoryVehicles.map((vehicle) => (
                      <tr key={vehicle.name} className="hover:bg-mist/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-ink">{vehicle.name}</td>
                        <td className="px-5 py-4">
                          <span className="font-semibold text-emerald-400">{vehicle.batteryKwh} kWh</span>
                          <span className="block text-xs text-ink-faint">{vehicle.chemistry}</span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-ink">{vehicle.realRangeKm} km</td>
                        <td className="px-5 py-4">
                          <span className="font-semibold text-ink">{vehicle.acTimeHours}</span>
                          <span className="block text-xs text-ink-faint">{vehicle.acCharging}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-semibold text-emerald-300">{vehicle.dcTimeMinutes}</span>
                          <span className="block text-xs text-ink-faint">{vehicle.dcFastCharging}</span>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs">{vehicle.connectorType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Practical Operating Benefit Cards */}
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              <article className="card p-6">
                <PlugZap className="h-6 w-6 text-emerald-400" />
                <h3 className="mt-4 text-base font-bold text-ink">Operational Architecture</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-muted">{selected.use}</p>
              </article>
              <article className="card p-6">
                <BatteryCharging className="h-6 w-6 text-sky-400" />
                <h3 className="mt-4 text-base font-bold text-ink">Battery Life & Thermal Care</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-muted">
                  Intelligent stepped charging curves preserve cell cycle life, maintain pack temperatures below 38°C, and prevent premature degradation.
                </p>
              </article>
              <article className="card p-6">
                <CircleDollarSign className="h-6 w-6 text-amber-400" />
                <h3 className="mt-4 text-base font-bold text-ink">Tangible Economic Return</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-muted">{selected.benefit}</p>
              </article>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Overview: 5 Vehicle Category Cards */}
          <section className="section">
            <div className="shell">
              <Reveal className="max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Vehicle Classification
                </span>
                <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
                  Purpose-Built Infrastructure for Every Vehicle Class.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-muted">
                  Select a category to explore certified vehicle models, battery acceptance profiles, charging speeds, and site engineering specifications.
                </p>
              </Reveal>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {(Object.entries(SEGMENTS) as [SegmentKey, (typeof SEGMENTS)[SegmentKey]][]).map(
                  ([key, item], index) => {
                    const Icon = item.icon;
                    return (
                      <Reveal key={key} delay={index * 0.05} as="div">
                        <Link
                          to={`/services/ev-charging/${key}`}
                          className="group card card-hover flex h-full flex-col overflow-hidden border border-line"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <SmartImage
                              src={item.image.src}
                              alt={item.imageAlt}
                              width={600}
                              height={380}
                              fill
                              sizes="(min-width: 1200px) 20vw, (min-width: 640px) 50vw, 100vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#07110f]/80 via-transparent to-transparent" />
                            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#07110f]/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                              <Icon className="h-3.5 w-3.5 text-emerald-300" />
                              {item.label}
                            </span>
                          </div>
                          <div className="flex flex-1 flex-col justify-between p-5">
                            <div>
                              <h3 className="text-base font-bold text-ink group-hover:text-emerald-300 transition-colors">
                                {item.title}
                              </h3>
                              <p className="mt-2 text-xs font-semibold text-emerald-400">
                                {item.preview}
                              </p>
                              <p className="mt-2 text-xs leading-relaxed text-ink-muted line-clamp-3">
                                {item.intro}
                              </p>
                            </div>
                            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-300 group-hover:translate-x-1 transition-transform">
                              View specs & models <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </Link>
                      </Reveal>
                    );
                  }
                )}
              </div>
            </div>
          </section>

          {/* Charging Models Matrix */}
          <section className="section bg-mist">
            <div className="shell">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="max-w-2xl">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                    Charging Models Architecture
                  </span>
                  <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
                    Matching Power Topology to Dwell Time & Duty Cycles.
                  </h2>
                </div>
                <Link
                  to="/request-consultation?service=ev-charging"
                  className="btn-outline text-xs"
                >
                  Consult an EVSE architect <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-card shadow-soft">
                <table className="w-full min-w-[800px] border-collapse text-left text-xs sm:text-sm">
                  <thead className="bg-[#10221a] text-xs font-bold uppercase tracking-wider text-ink-faint border-b border-line">
                    <tr>
                      <th className="px-5 py-4">Charging Model</th>
                      <th className="px-5 py-4">Target Vehicle Segment</th>
                      <th className="px-5 py-4">Power & Architecture</th>
                      <th className="px-5 py-4">Standard Connectors</th>
                      <th className="px-5 py-4">Key Site Requirement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-ink-muted">
                    {[
                      ['Home & Residential', 'Cars, 2-wheelers; overnight dwell', '3.3 kW – 7.4 kW AC Single-Phase', 'Type 2 AC / 15A Socket', 'Sub-metered dedicated circuit, MCB + RCD protection'],
                      ['Workplace & Campuses', 'Employee fleets, commuters; 4–8 hr dwell', '7.4 kW – 22 kW AC 3-Phase', 'Type 2 AC / Dual Gun', 'Dynamic load sharing, RFID / Employee pass integration'],
                      ['Destination Commercial', 'Retail malls, hotels, dining; 1–3 hr dwell', '30 kW – 60 kW DC Fast Charging', 'CCS2 Combo Dual-Gun', 'Customer billing gateway, UPI / credit card automated terminal'],
                      ['Highway Corridor HPC', 'Intercity passenger, tourist cars; 15–30 min', '120 kW – 350 kW Ultra-Fast DC', 'CCS2 Liquid-Cooled', 'Dedicated 11kV HT yard, harmonic filter, transformer headroom'],
                      ['Depot Fleet Operations', 'Delivery vans, trucks, municipal buses', '60 kW – 240 kW DC Fast Charging', 'Dual CCS2 Inlets', 'Off-peak charging automation, scheduled departure SoC guarantee'],
                      ['Opportunity Transit', 'BRTS transit buses; 10–15 min terminal stops', '300 kW – 450 kW Inverted Pantograph', 'SAE J3105 Pantograph', 'Terminal gate structural overhead gantry, ultra-high peak grid feeder'],
                      ['Battery Swapping Kiosks', 'Q-commerce 2W, passenger 3W autos', 'Automated 12–15 bay pack swap', 'Rugged blind-mate packs', '15–30 kW 3-phase grid connection, fire suppression enclosure'],
                      ['Heavy Megawatt (MCS)', 'Long-haul 40–55 ton heavy haulage trucks', 'Up to 1.25 MW (1250V / 1000A+)', 'MCS Standard Connector', 'Direct 33kV grid interconnection, co-located BESS peak buffer'],
                      ['Bidirectional (V2G/V2H)', 'Fleet depots & smart grid testing sites', '11 kW – 50 kW Bidirectional Inverter', 'CCS2 / ISO 15118-20', 'Anti-islanding protection, utility grid-tie agreement, four-quadrant meter'],
                    ].map((row) => (
                      <tr key={row[0]} className="hover:bg-mist/30 transition-colors">
                        <td className="px-5 py-4 font-bold text-ink">{row[0]}</td>
                        <td className="px-5 py-4">{row[1]}</td>
                        <td className="px-5 py-4 font-semibold text-emerald-400">{row[2]}</td>
                        <td className="px-5 py-4 font-mono text-xs">{row[3]}</td>
                        <td className="px-5 py-4 text-xs text-ink-faint">{row[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 2025–2026 Innovation Tracker */}
          <section className="section">
            <div className="shell">
              <div className="max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Technology Roadmap
                </span>
                <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
                  2025–2026 CleanTech Standards & Innovation Tracker.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-muted">
                  Virya engineers charging systems aligned with current and emerging global interoperability standards.
                </p>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <article className="card p-6 border-l-4 border-emerald-400">
                  <ShieldCheck className="h-6 w-6 text-emerald-400" />
                  <h3 className="mt-4 text-base font-bold text-ink">ISO 15118-20 & Plug & Charge</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                    Automated encrypted authentication between vehicle and charger. Eliminates apps and RFID cards: plug in, charge, and billing executes automatically.
                  </p>
                </article>

                <article className="card p-6 border-l-4 border-sky-400">
                  <Cpu className="h-6 w-6 text-sky-400" />
                  <h3 className="mt-4 text-base font-bold text-ink">Megawatt Charging System (MCS)</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                    Engineered for heavy-duty commercial freight up to 1,250V and 1,000A+. Recharges 40-ton electric haulers in under 35 minutes during mandatory driver rest breaks.
                  </p>
                </article>

                <article className="card p-6 border-l-4 border-amber-400">
                  <Zap className="h-6 w-6 text-amber-400" />
                  <h3 className="mt-4 text-base font-bold text-ink">Bidirectional V2G & V2B</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                    Enables vehicle batteries to feed power back into corporate buildings or the distribution grid during peak tariff windows, earning ancillary services revenue.
                  </p>
                </article>

                <article className="card p-6 border-l-4 border-emerald-400">
                  <Layers className="h-6 w-6 text-emerald-400" />
                  <h3 className="mt-4 text-base font-bold text-ink">AI Dynamic Load Management</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                    Cloud-orchestrated smart power sharing divides available transformer capacity in real-time across dozens of active bays, avoiding costly utility transformer upgrades.
                  </p>
                </article>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Digital Planning Calculators (Screening Tools) */}
      <section id="calculators" className="section bg-mist scroll-mt-24">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Interactive Planning Calculators
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              Model Charging Time, Fleet TCO Savings & Carbon Avoidance.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Adjust vehicle battery sizes, charger ratings, fleet distance, and energy tariffs to simulate real operational metrics for your site.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            {/* Calculator 1: Performance */}
            <article className="card p-6 sm:p-7 flex flex-col justify-between shadow-soft">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300">
                    <Clock3 className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-ink">Charging Time & Energy</h3>
                    <p className="text-xs text-ink-faint">Simulate duration for any vehicle battery</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <NumericInput label="Battery size" value={batteryKwh} min={0.1} step={1} unit="kWh" onChange={setBatteryKwh} />
                  <NumericInput label="Charger output" value={chargerKw} min={0.1} step={5} unit="kW" onChange={setChargerKw} />
                  <NumericInput label="Start SoC" value={startSoc} min={0} step={5} unit="%" onChange={(v) => setStartSoc(Math.min(100, v))} />
                  <NumericInput label="Target SoC" value={targetSoc} min={0} step={5} unit="%" onChange={(v) => setTargetSoc(Math.min(100, v))} />
                  <div className="col-span-2">
                    <NumericInput label="Charging efficiency" value={chargeEfficiency} min={50} step={1} unit="%" onChange={setChargeEfficiency} />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="rounded-xl bg-[#10221a] p-4 border border-line">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Estimated Session Time</p>
                  <p className="mt-2 text-2xl font-extrabold text-white">
                    {chargeHours >= 1 ? `${chargeHours.toFixed(1)} hours` : `${chargeMinutes} minutes`}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {gridEnergy.toFixed(1)} kWh drawn from grid · {energyNeeded.toFixed(1)} kWh delivered to battery
                  </p>
                </div>
                <p className="mt-3 text-[0.72rem] leading-relaxed text-ink-faint">
                  Calculated using steady-state power transfer. Actual session duration modulates with battery thermal limits and vehicle charge acceptance curves.
                </p>
              </div>
            </article>

            {/* Calculator 2: Fleet ROI */}
            <article className="card p-6 sm:p-7 flex flex-col justify-between shadow-soft">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400/10 text-amber-300">
                    <CircleDollarSign className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-ink">Fleet Operational ROI</h3>
                    <p className="text-xs text-ink-faint">Diesel vs electricity operating costs</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <NumericInput label="Fleet vehicles" value={vehicles} min={1} step={1} onChange={setVehicles} />
                  <NumericInput label="Daily km / vehicle" value={dailyKm} min={10} step={10} unit="km" onChange={setDailyKm} />
                  <NumericInput label="EV consumption" value={evKwhPer100Km} min={5} step={1} unit="kWh/100km" onChange={setEvKwhPer100Km} />
                  <NumericInput label="Diesel fuel rate" value={iceLitresPer100Km} min={1} step={0.5} unit="L/100km" onChange={setIceLitresPer100Km} />
                  <NumericInput label="Fuel price" value={fuelPrice} min={50} step={1} unit="₹/L" onChange={setFuelPrice} />
                  <NumericInput label="Power tariff" value={electricityPrice} min={3} step={0.5} unit="₹/kWh" onChange={setElectricityPrice} />
                </div>
                <div className="mt-3">
                  <NumericInput label="Charger infrastructure CAPEX" value={chargerCapex} min={0} step={50000} unit="₹" onChange={setChargerCapex} />
                </div>
              </div>

              <div className="mt-6">
                <div className="rounded-xl bg-[#10221a] p-4 border border-line">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Annual Fleet Fuel Savings</p>
                  <p className="mt-2 text-2xl font-extrabold text-white">
                    ₹{Math.round(annualSavings).toLocaleString('en-IN')}
                  </p>
                  <p className="mt-1 text-xs text-emerald-400 font-semibold">
                    {paybackYears === null ? 'Negative cashflow under these inputs' : `${paybackYears.toFixed(1)} Year Simple Payback on EVSE CAPEX`}
                  </p>
                </div>
                <p className="mt-3 text-[0.72rem] leading-relaxed text-ink-faint">
                  Compares direct energy operating expense. Excludes vehicle depreciation, loan financing, road tax exemptions, and routine mechanical maintenance.
                </p>
              </div>
            </article>

            {/* Calculator 3: Carbon Reduction */}
            <article className="card p-6 sm:p-7 flex flex-col justify-between shadow-soft">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-sky-400/10 text-sky-300">
                    <Factory className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-ink">Carbon Reduction Screen</h3>
                    <p className="text-xs text-ink-faint">Scope 1 tailpipe vs grid electricity</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <NumericInput label="Grid carbon factor" value={gridFactor} min={0} step={0.005} unit="kg/kWh" onChange={setGridFactor} />
                  <NumericInput label="Diesel emission" value={fuelFactor} min={1} step={0.05} unit="kg/L" onChange={setFuelFactor} />
                  <NumericInput label="EV energy use" value={evKwhPer100Km} min={5} step={1} unit="kWh/100km" onChange={setEvKwhPer100Km} />
                  <NumericInput label="Diesel fuel use" value={iceLitresPer100Km} min={1} step={0.5} unit="L/100km" onChange={setIceLitresPer100Km} />
                </div>
              </div>

              <div className="mt-6">
                <div className="rounded-xl bg-[#10221a] p-4 border border-line">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Net Avoided Carbon Emissions</p>
                  <p className="mt-2 text-2xl font-extrabold text-white">
                    {annualAvoidedTonnes.toFixed(1)} tCO₂e / year
                  </p>
                  <p className="mt-1 text-xs text-sky-300">
                    Equivalent to removing {Math.max(0, Math.round(annualAvoidedTonnes / 4.2))} passenger cars from the road annually.
                  </p>
                </div>
                <p className="mt-3 text-[0.72rem] leading-relaxed text-ink-faint">
                  Grid emission factor baseline: 0.716 kg CO₂/kWh (editable for CEA regional grid factor or renewable PPA matching).
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Regional All-India Hubs & Google Maps Locator */}
      <section className="section">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              All-India Operational Footprint
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              CleanTech Offices & Project Hubs Across India.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Select a city to locate our active technology center, regional delivery hub, or maritime clean-energy desk. Connect directly with our on-ground electrical architects.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setActiveCity(city)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                    activeCity === city
                      ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300'
                      : 'border-line bg-card text-ink-muted hover:text-ink'
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  {city}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Link
                to="/request-consultation?service=ev-charging"
                className="btn-primary-lg inline-flex items-center gap-2"
              >
                Schedule an on-site technical audit
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <RegionalLocator
              locations={mapLocations}
              activeLocation={activeCity}
            />
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <CtaBand
        title="Ready to engineer your EV charging infrastructure?"
        body="Share your vehicle fleet breakdown, operating schedules, daily route distances, and available electrical single-line diagram. Virya delivers an end-to-end technical, commercial, and utility interconnection plan."
        primary={{ label: 'Request site feasibility audit', to: '/request-consultation?service=ev-charging' }}
        secondary={{ label: 'Explore renewable solar systems', to: '/services/solar' }}
      />
    </>
  );
}
