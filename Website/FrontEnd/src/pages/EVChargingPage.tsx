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
} from 'lucide-react';
import { CtaBand } from '@/components/sections/PageHero';
import { RegionalLocator } from '@/components/RegionalLocator';
import { Reveal, SmartImage } from '@/components/ui';
import { visualAssets } from '@/data/visuals';

const SEGMENTS = {
  passenger: {
    label: 'Cars',
    title: 'Charging for electric cars',
    icon: CarFront,
    image: visualAssets.ev,
    imageAlt: 'Electric car connected to a charging station',
    preview: '60 kWh example · 11 kW AC · 20–80% in about 3.6 hours',
    intro: 'BEV and PHEV charging; standard hybrids do not plug in.',
    vehicles: ['Battery electric (BEV)', 'Plug-in hybrid (PHEV)', 'Hybrid electric (HEV)'],
    use: 'Home and workplace AC for long parking windows; destination charging for predictable visits; DC fast charging for route stops and high-turnover sites.',
    specs: [
      ['AC supply', 'Single-phase or three-phase; commonly 3.3–22 kW site options'],
      ['DC supply', 'Vehicle-dependent fast charging; public equipment commonly spans 30–350 kW'],
      ['Connectors', 'India: verify vehicle inlet, often Type 2 AC / CCS2 DC; global fleets vary'],
      ['Design priority', 'OEM charge curve, battery temperature, dwell time and simultaneous demand'],
    ],
    benefit: 'Reduce charging friction for employees, residents and visitors while making parking assets more useful.',
  },
  'two-wheelers': {
    label: '2-wheelers',
    title: 'Charging for two-wheelers',
    icon: Bike,
    image: visualAssets.electricMobility,
    imageAlt: 'Charging connector and cable for an electric vehicle',
    preview: '3 kWh example · 0.8 kW AC · 20–80% in about 2.5 hours',
    intro: 'Scooters, motorcycles and e-bikes; OEM charger or compatible swap pack.',
    vehicles: ['Electric scooters', 'Electric motorcycles', 'E-bikes and light EVs'],
    use: 'Secure AC outlets or dedicated low-power charging at residences, workplaces, campuses and delivery depots. Swapping may suit fleets built around compatible battery systems.',
    specs: [
      ['Charging input', 'Use the OEM charger rating; low-power AC is common, but products differ'],
      ['Battery interface', 'Fixed or removable packs; swapping only where the vehicle and operator support it'],
      ['Connectors', 'OEM-specific AC charger or battery interface; validate protection and earthing'],
      ['Design priority', 'Secure parking, fire separation, charging access and managed circuit capacity'],
    ],
    benefit: 'Support dependable daily use with convenient charging close to where riders park and work.',
  },
  'three-wheelers': {
    label: '3-wheelers',
    title: 'Charging for electric auto-rickshaws',
    icon: Route,
    image: { src: '/images/ai-ev-charging.svg', alt: 'Illustrated electric vehicle connected to a charging point' },
    imageAlt: 'Illustrated electric vehicle connected to a charging point',
    preview: '12 kWh example · 3 kW AC · 20–80% in about 2.7 hours',
    intro: 'Passenger e-autos, e-rickshaws and cargo three-wheelers.',
    vehicles: ['Passenger e-autos', 'E-rickshaws', 'Cargo and last-mile 3-wheelers'],
    use: 'Overnight depot or home-base AC charging; daytime top-up at hubs; battery swapping for supported models and managed networks.',
    specs: [
      ['Charging input', 'Vehicle and supplied charger determine AC power and charge duration'],
      ['Battery strategy', 'Fixed pack or operator-managed swap; confirm pack ownership and warranty terms'],
      ['Connectors', 'Vehicle-specific; confirm OEM documentation before shared infrastructure design'],
      ['Design priority', 'Queueing, shift change, daily kilometres, turnaround time and safe battery handling'],
    ],
    benefit: 'Improve fleet availability by aligning charger count, charging windows and operating routes.',
  },
  buses: {
    label: 'Buses',
    title: 'Charging for electric buses',
    icon: Bus,
    image: { src: '/images/generated-fleet-depot.jpg', alt: 'Electrical equipment serving a vehicle depot' },
    imageAlt: 'Electrical equipment serving a vehicle depot',
    preview: '300 kWh example · 150 kW DC average · 20–80% in about 1.2 hours',
    intro: 'Transit, school and staff buses; overnight depot or scheduled top-up.',
    vehicles: ['City transit buses', 'School buses', 'Intercity and staff buses'],
    use: 'Overnight depot charging for long dwell periods; planned opportunity charging during layovers; pantograph systems where vehicle and site interfaces are engineered together.',
    specs: [
      ['Supply architecture', 'Depot DC charging; individual output and aggregate load are fleet-specific'],
      ['Opportunity charging', 'High-power DC or pantograph only where route, vehicle and infrastructure align'],
      ['Connectors', 'Confirm vehicle inlet and communication profile; CCS2 is common in many newer deployments'],
      ['Design priority', 'Route energy, block schedule, reserve fleet, charger redundancy and utility capacity'],
    ],
    benefit: 'Protect dispatch reliability by planning charging against real timetables, not nameplate power alone.',
  },
  fleets: {
    label: 'Commercial fleets',
    title: 'Charging for vans and trucks',
    icon: Truck,
    image: visualAssets.industrial,
    imageAlt: 'Commercial truck fleet arranged at a depot',
    preview: '400 kWh example · 100 kW DC average · 20–80% in about 2.4 hours',
    intro: 'Delivery vans, medium-duty and heavy long-haul vehicles.',
    vehicles: ['Light commercial vehicles', 'Medium- and heavy-duty trucks', 'Long-haul and industrial fleets'],
    use: 'Managed depot charging for predictable returns; en-route DC charging for operating flexibility; MCS planning for compatible heavy-duty vehicles as the ecosystem matures.',
    specs: [
      ['Depot supply', 'AC or DC based on return windows, vehicle input and fleet utilisation'],
      ['Public / en-route', 'DC fast charging; site power sharing affects delivered power'],
      ['Megawatt charging', 'MCS standardisation is advancing; validate vehicle, charger and site readiness'],
      ['Design priority', 'Route energy, payload, break rules, queueing, redundancy and demand charges'],
    ],
    benefit: 'Tie charging investment to fleet duty cycles, utilisation and route expansion instead of charger counts alone.',
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

  const [batteryKwh, setBatteryKwh] = useState(60);
  const [startSoc, setStartSoc] = useState(20);
  const [targetSoc, setTargetSoc] = useState(80);
  const [chargerKw, setChargerKw] = useState(11);
  const [chargeEfficiency, setChargeEfficiency] = useState(90);

  const [vehicles, setVehicles] = useState(10);
  const [dailyKm, setDailyKm] = useState(100);
  const [evKwhPer100Km, setEvKwhPer100Km] = useState(18);
  const [iceLitresPer100Km, setIceLitresPer100Km] = useState(8);
  const [fuelPrice, setFuelPrice] = useState(100);
  const [electricityPrice, setElectricityPrice] = useState(10);
  const [chargerCapex, setChargerCapex] = useState(1000000);

  const [gridFactor, setGridFactor] = useState(0.716);
  const [fuelFactor, setFuelFactor] = useState(2.31);
  const [activeCity, setActiveCity] = useState(CITIES[0]);

  if (segment && !(segment in SEGMENTS)) return <Navigate to="/services/ev-charging" replace />;

  const energyNeeded = batteryKwh * Math.max(0, targetSoc - startSoc) / 100;
  const gridEnergy = energyNeeded / Math.max(0.01, chargeEfficiency / 100);
  const chargeHours = gridEnergy / Math.max(0.01, chargerKw);

  const annualDistance = Math.max(0, vehicles) * Math.max(0, dailyKm) * 365;
  const annualEvKwh = annualDistance * Math.max(0, evKwhPer100Km) / 100;
  const annualFuelLitres = annualDistance * Math.max(0, iceLitresPer100Km) / 100;
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

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-12 pt-28 sm:pb-16 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '56px 56px' }} aria-hidden="true" />
        <div className="shell relative">
          <nav aria-label="Breadcrumb" className="mb-7 text-sm text-white/60">
            <Link to="/" className="hover:text-white">Home</Link><span className="px-2">/</span>
            <Link to="/services" className="hover:text-white">Services</Link><span className="px-2">/</span>
            <Link to="/services/ev-charging" className="hover:text-white">EV Charging</Link>
            {selected && <><span className="px-2">/</span><span className="text-white">{selected.label}</span></>}
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow"><span className="rule-accent" />Electric mobility, engineered around use</p>
              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                {selected ? selected.title : 'EV charging for the way India moves.'}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                {selected ? selected.intro : 'Explore charging for cars, two-wheelers, electric autos, buses and commercial fleets. Compare the operating model, estimate energy and costs, then take a site-specific next step.'}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/request-consultation?service=ev-charging" className="btn-primary-lg">Plan an EV site <ArrowRight className="h-4 w-4" /></Link>
                <a href="#calculators" className="btn btn-lg border border-white/25 text-white hover:bg-white/10"><Calculator className="h-4 w-4" />Estimate performance</a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/65">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />Vehicle-first sizing</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />Transparent assumptions</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />India city coverage map</span>
              </div>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10 lg:col-span-5">
              <SmartImage src={selected?.image.src ?? visualAssets.serviceEvCharging.src} alt={selected?.imageAlt ?? visualAssets.serviceEvCharging.alt} width={1400} height={900} fill sizes="(min-width: 1024px) 42vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07110f]/65 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#07110f]/70 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm"><Zap className="h-4 w-4 text-emerald-300" />Charging systems, matched to duty cycles</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-mist py-4">
        <nav className="shell flex gap-2 overflow-x-auto pb-1" aria-label="EV vehicle categories">
          <Link to="/services/ev-charging" className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold ${!selected ? 'bg-emerald-400 text-[#07110f]' : 'border border-line text-ink-muted hover:text-ink'}`}>Overview</Link>
          {(Object.entries(SEGMENTS) as [SegmentKey, (typeof SEGMENTS)[SegmentKey]][]).map(([key, item]) => {
            const Icon = item.icon;
            return <Link key={key} to={`/services/ev-charging/${key}`} className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${selectedKey === key ? 'bg-emerald-400 text-[#07110f]' : 'border border-line text-ink-muted hover:text-ink'}`}><Icon className="h-4 w-4" />{item.label}</Link>;
          })}
        </nav>
      </section>

      {selected ? (
        <section className="section">
          <div className="shell">
            <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
                <Reveal>
                  <p className="eyebrow"><span className="rule-accent" />{selected.label} charging</p>
                  <h2 className="mt-4 text-3xl font-extrabold text-ink">Vehicle type and example charge time.</h2>
                  <p className="mt-4 leading-relaxed text-ink-muted">{selected.intro}</p>
                  <div className="mt-6 flex flex-wrap gap-2">{selected.vehicles.map((vehicle) => <span key={vehicle} className="rounded-full border border-line bg-mist px-3 py-2 text-sm font-medium text-ink">{vehicle}</span>)}</div>
                  <div className="mt-6 rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-4"><p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Illustrative estimate</p><p className="mt-2 text-sm font-semibold text-ink">{selected.preview}</p><p className="mt-2 text-xs leading-relaxed text-ink-faint">Example battery and charger values only. Actual time varies by vehicle, state of charge, charger power and battery temperature.</p></div>
                </Reveal>
              </div>
              <div className="lg:col-span-8">
                <div className="overflow-hidden rounded-lg border border-line">
                  <div className="grid grid-cols-[minmax(8rem,0.7fr)_1.3fr] bg-mist px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink-faint"><span>Technical area</span><span>Planning specification</span></div>
                  {selected.specs.map(([label, value]) => <div key={label} className="grid grid-cols-[minmax(8rem,0.7fr)_1.3fr] gap-4 border-t border-line px-5 py-4 text-sm sm:text-[0.95rem]"><span className="font-semibold text-ink">{label}</span><span className="leading-relaxed text-ink-muted">{value}</span></div>)}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ink-faint">Planning guidance only, not a product guarantee. Confirm vehicle charge curves, connector, battery limits, tariff and local electrical requirements with the OEM and project engineer.</p>
              </div>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <article className="card p-6"><PlugZap className="h-5 w-5 text-emerald-400" /><h3 className="mt-4 text-lg font-bold text-ink">Charging model</h3><p className="mt-2 text-sm leading-relaxed text-ink-muted">{selected.use}</p></article>
              <article className="card p-6"><BatteryCharging className="h-5 w-5 text-sky-400" /><h3 className="mt-4 text-lg font-bold text-ink">Performance drivers</h3><p className="mt-2 text-sm leading-relaxed text-ink-muted">Battery size, starting state of charge, charger output, vehicle acceptance curve, temperature and power sharing shape actual time and energy.</p></article>
              <article className="card p-6"><CircleDollarSign className="h-5 w-5 text-amber-400" /><h3 className="mt-4 text-lg font-bold text-ink">Why it matters</h3><p className="mt-2 text-sm leading-relaxed text-ink-muted">{selected.benefit}</p></article>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="section">
            <div className="shell">
              <Reveal className="max-w-3xl">
                <p className="eyebrow"><span className="rule-accent" />EV classification</p>
                <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">One charging strategy does not fit every vehicle.</h2>
                <p className="mt-4 leading-relaxed text-ink-muted">Open a category for its use cases, technical planning points and charging approach. Every equipment specification remains subject to vehicle compatibility and a site load review.</p>
              </Reveal>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {(Object.entries(SEGMENTS) as [SegmentKey, (typeof SEGMENTS)[SegmentKey]][]).map(([key, item], index) => {
                  const Icon = item.icon;
                  return <Reveal key={key} delay={index * 0.04} as="div"><Link to={`/services/ev-charging/${key}`} className="card card-hover group grid h-full grid-cols-[5.5rem_1fr] overflow-hidden">
                    <div className="relative min-h-44"><SmartImage src={item.image.src} alt={item.imageAlt} width={600} height={600} fill sizes="100px" /></div>
                    <div className="p-5"><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300"><Icon className="h-4 w-4" />{item.label}</span><h3 className="mt-3 text-lg font-bold text-ink">{item.title}</h3><p className="mt-3 text-sm font-semibold leading-relaxed text-white">{item.preview}</p><p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.intro}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-300">See charging details <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></div>
                  </Link></Reveal>;
                })}
              </div>
            </div>
          </section>

          <section className="section bg-mist">
            <div className="shell">
              <Reveal className="max-w-3xl"><p className="eyebrow"><span className="rule-accent" />Charging model matrix</p><h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">Match power to parking time and operations.</h2></Reveal>
              <div className="mt-8 overflow-x-auto rounded-lg border border-line">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead className="bg-[#13241d] text-xs uppercase tracking-wider text-ink-faint"><tr><th className="px-5 py-4">Model</th><th className="px-5 py-4">Best fit</th><th className="px-5 py-4">Technology</th><th className="px-5 py-4">Design check</th></tr></thead>
                  <tbody className="divide-y divide-line text-ink-muted">
                    {[
                      ['Home / workplace', 'Cars, 2-wheelers; long dwell', 'AC, managed load', 'Parking rights, circuits and access'],
                      ['Destination / public', 'Cars and mixed users', 'AC or DCFC', 'Utilisation, payments and uptime'],
                      ['Depot / fleet', 'Autos, vans, trucks and buses', 'Scheduled AC/DC', 'Duty cycle, demand peaks and resilience'],
                      ['Opportunity / pantograph', 'Transit bus routes with planned layovers', 'High-power DC, top-down or bottom-up pantograph', 'Vehicle-interface and route compatibility'],
                      ['Battery swapping', 'Compatible 2/3-wheelers and fleets', 'Manual or automated exchange', 'Pack interoperability, safety and ownership'],
                      ['Bidirectional / V2X', 'Supported vehicles and managed sites', 'V2H, V2B or V2G capable EVSE', 'Vehicle, charger, interconnection and market approval'],
                    ].map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell} className={`px-5 py-4 leading-relaxed ${index === 0 ? 'font-semibold text-ink' : ''}`}>{cell}</td>)}</tr>)}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink-faint">V2X is not enabled by a charger alone. Confirm vehicle support, ISO 15118 implementation, distribution utility rules, protection, metering and commercial arrangements.</p>
            </div>
          </section>

        </>
      )}

      <section id="calculators" className="section bg-mist scroll-mt-24">
        <div className="shell">
          <Reveal className="max-w-3xl"><p className="eyebrow"><span className="rule-accent" />Digital planning tools</p><h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">Estimate charging time, operating savings and carbon.</h2><p className="mt-4 leading-relaxed text-ink-muted">Use your own vehicle, tariff and site assumptions. Results are screening estimates, not an engineering design, investment offer or emissions assurance.</p></Reveal>
          <div className="mt-8 grid gap-5 xl:grid-cols-3">
            <article className="card p-5 sm:p-6">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300"><Clock3 className="h-5 w-5" /></span><div><h3 className="font-bold text-ink">Charging performance</h3><p className="text-xs text-ink-faint">Ideal energy and wall-time estimate</p></div></div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <NumericInput label="Battery size" value={batteryKwh} min={0.1} step={1} unit="kWh" onChange={setBatteryKwh} />
                <NumericInput label="Charger output" value={chargerKw} min={0.1} step={0.5} unit="kW" onChange={setChargerKw} />
                <NumericInput label="Start charge" value={startSoc} min={0} step={1} unit="%" onChange={(value) => setStartSoc(Math.min(100, value))} />
                <NumericInput label="Target charge" value={targetSoc} min={0} step={1} unit="%" onChange={(value) => setTargetSoc(Math.min(100, value))} />
                <NumericInput label="Charge efficiency" value={chargeEfficiency} min={1} step={1} unit="%" onChange={setChargeEfficiency} />
              </div>
              <div className="mt-5 rounded-lg bg-[#13241d] p-4"><p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Estimated result</p><p className="mt-2 text-2xl font-extrabold text-white">{chargeHours.toFixed(1)} hours</p><p className="mt-1 text-sm text-ink-muted">{gridEnergy.toFixed(1)} kWh from supply · {energyNeeded.toFixed(1)} kWh stored</p></div>
              <p className="mt-3 text-xs leading-relaxed text-ink-faint">Assumes constant power. Real sessions vary with tapering, temperature, vehicle limit, auxiliaries and site power sharing.</p>
            </article>

            <article className="card p-5 sm:p-6">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400/10 text-amber-300"><CircleDollarSign className="h-5 w-5" /></span><div><h3 className="font-bold text-ink">Fleet ROI screen</h3><p className="text-xs text-ink-faint">Fuel vs electricity operating cost</p></div></div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <NumericInput label="Fleet vehicles" value={vehicles} min={1} step={1} onChange={setVehicles} />
                <NumericInput label="Distance / day" value={dailyKm} min={0} step={5} unit="km" onChange={setDailyKm} />
                <NumericInput label="EV use" value={evKwhPer100Km} min={0} step={0.5} unit="kWh/100km" onChange={setEvKwhPer100Km} />
                <NumericInput label="Fuel use" value={iceLitresPer100Km} min={0} step={0.5} unit="L/100km" onChange={setIceLitresPer100Km} />
                <NumericInput label="Fuel price" value={fuelPrice} min={0} step={1} unit="₹/L" onChange={setFuelPrice} />
                <NumericInput label="Power tariff" value={electricityPrice} min={0} step={0.5} unit="₹/kWh" onChange={setElectricityPrice} />
                <NumericInput label="Charger investment" value={chargerCapex} min={0} step={50000} unit="₹" onChange={setChargerCapex} />
              </div>
              <div className="mt-5 rounded-lg bg-[#13241d] p-4"><p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Estimated annual operating difference</p><p className="mt-2 text-2xl font-extrabold text-white">₹{Math.round(annualSavings).toLocaleString('en-IN')}</p><p className="mt-1 text-sm text-ink-muted">{paybackYears === null ? 'No positive payback using these inputs' : `${paybackYears.toFixed(1)} year simple payback on charger investment`}</p></div>
              <p className="mt-3 text-xs leading-relaxed text-ink-faint">This is not full-project payback. It excludes vehicle purchase cost, grid upgrades, financing, demand charges, maintenance, taxes, incentives, residual value and downtime.</p>
            </article>

            <article className="card p-5 sm:p-6">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-sky-400/10 text-sky-300"><Factory className="h-5 w-5" /></span><div><h3 className="font-bold text-ink">Carbon reduction</h3><p className="text-xs text-ink-faint">Tailpipe baseline vs grid electricity</p></div></div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <NumericInput label="Grid emissions" value={gridFactor} min={0} step={0.001} unit="kg/kWh" onChange={setGridFactor} />
                <NumericInput label="Fuel emissions" value={fuelFactor} min={0} step={0.01} unit="kg/L" onChange={setFuelFactor} />
                <NumericInput label="EV energy use" value={evKwhPer100Km} min={0} step={0.5} unit="kWh/100km" onChange={setEvKwhPer100Km} />
                <NumericInput label="ICE fuel use" value={iceLitresPer100Km} min={0} step={0.5} unit="L/100km" onChange={setIceLitresPer100Km} />
              </div>
              <div className="mt-5 rounded-lg bg-[#13241d] p-4"><p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Estimated annual net emissions difference</p><p className="mt-2 text-2xl font-extrabold text-white">{annualAvoidedTonnes.toFixed(1)} tCO₂</p><p className="mt-1 text-sm text-ink-muted">Positive indicates estimated avoided emissions; negative indicates an increase under these inputs.</p></div>
              <p className="mt-3 text-xs leading-relaxed text-ink-faint">The 0.716 kg/kWh starting value is editable and for screening only. Update with the applicable CEA grid factor; results are not lifecycle emissions.</p>
                          <p className="mt-3 text-xs leading-relaxed text-ink-faint">The starting grid factor is editable and for screening only. Use the factor for your project location and reporting year; results are not lifecycle emissions.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-9 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5"><p className="eyebrow"><span className="rule-accent" />Regional coverage</p><h2 className="mt-4 text-3xl font-extrabold text-ink">Find a starting point across South India.</h2><p className="mt-4 leading-relaxed text-ink-muted">Choose a city to open its map view. The city markers are planning locations, not confirmed Virya office addresses; add verified street addresses before representing them as offices.</p>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">{CITIES.map((city) => <button key={city} type="button" onClick={() => setActiveCity(city)} className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-medium ${activeCity === city ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300' : 'border-line text-ink-muted hover:text-ink'}`}><MapPin className="h-4 w-4 shrink-0" />{city}</button>)}</div>
            <Link to="/request-consultation?service=ev-charging" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">Discuss a location <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="lg:col-span-7"><RegionalLocator locations={mapLocations} activeLocation={activeCity} onSelect={setActiveCity} /><div className="flex items-center justify-between gap-4 bg-mist px-4 py-3"><span className="text-sm font-semibold text-ink">{activeCity}, India</span><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activeCity}, India`)}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">Open in Google Maps</a></div></div>
        </div>
      </section>

      <CtaBand title="Turn your fleet and site data into a charging plan." body="Share vehicle types, daily routes, parking windows, power availability and target launch date. Virya can help scope the next technical and commercial review." secondary={{ label: 'Explore all services', to: '/services' }} />
    </>
  );
}