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
    label: 'Rigid modules',
    title: 'Flat, rigid solar modules',
    image: visualAssets.solarMarketPanels,
    summary: 'Rigid framed PV modules for ground-mounted arrays, carports and suitable rooftops. Module format, efficiency, temperature coefficient, warranty and mounting design should be compared at the product level.',
    points: ['Established framed module format', 'Requires suitable mounting structure and access', 'Performance depends on shading, orientation, temperature and inverter design'],
  },
  flexible: {
    label: 'Flexible modules',
    title: 'Flexible solar modules',
    image: visualAssets.solarComplex,
    summary: 'Lightweight or flexible PV products may suit selected curved or weight-constrained surfaces, but their output, mounting, fire classification, serviceability and warranty are product-specific.',
    points: ['Consider only for compatible surface and load conditions', 'Check bend radius, attachment method and service access', 'Compare certified ratings and lifetime warranty against rigid alternatives'],
  },
  rooftop: {
    label: 'Rooftop systems',
    title: 'Commercial rooftop solar',
    image: visualAssets.solarMarketRooftop,
    summary: 'Rooftop is an installation configuration rather than a distinct solar-cell type. System design depends on roof structure, usable area, shading, load profile, fire access and utility interconnection rules.',
    points: ['Structural assessment and roof condition come first', 'Setbacks, access paths and shadow losses constrain usable area', 'Match generation profile with daytime load and export rules'],
  },
} as const;

const WIND_CLASSES = {
  distributed: {
    label: 'Distributed',
    title: 'Distributed wind systems',
    image: visualAssets.wind,
    band: 'Screening band: up to 100 kW rated output',
    description: 'Small and distributed turbines are considered for local loads or remote applications where the wind resource, tower, access and maintenance model are suitable.',
  },
  commercial: {
    label: 'Commercial',
    title: 'Commercial-scale wind',
    image: visualAssets.windEnergy,
    band: 'Screening band: 100 kW to 1 MW rated output',
    description: 'Mid-scale installations need site-specific wind measurements, wake/layout review, grid studies and a clear operations plan. This band is a navigation aid, not a universal standard classification.',
  },
  utility: {
    label: 'Utility scale',
    title: 'Utility-scale wind turbines',
    image: visualAssets.viryaWind,
    band: 'Screening band: above 1 MW rated output',
    description: 'Utility-scale projects require resource assessment, land and permitting review, evacuation capacity, project economics and turbine-specific performance data.',
  },
} as const;

type SolarType = (typeof SOLAR_TYPES)[keyof typeof SOLAR_TYPES];
type WindClass = (typeof WIND_CLASSES)[keyof typeof WIND_CLASSES];
type RenewableCategory = SolarType | WindClass;

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
        <input className="field pr-20" type="number" min={min} step={step} value={value} onChange={(event) => onChange(Math.max(min, Number(event.target.value) || 0))} />
        {unit && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-faint">{unit}</span>}
      </span>
    </label>
  );
}

export default function RenewablesPage() {
  const { pathname } = useLocation();
  const { category } = useParams<{ category?: string }>();
  const kind: RenewableKind = pathname.startsWith('/services/wind-energy') ? 'wind-energy' : 'solar';
  const isWind = kind === 'wind-energy';
  const categories: Record<string, RenewableCategory> = isWind ? WIND_CLASSES : SOLAR_TYPES;
  const categoryKey = category ?? '';
  const selected = category ? categories[category] : null;
  const selectedLabel = selected?.label ?? '';
  const selectedDescription = selected
    ? 'description' in selected
      ? selected.description
      : selected.summary
    : '';
  const selectedClassification = selected
    ? 'band' in selected
      ? selected.band
      : selected.label
    : '';
  const selectedPoints = selected && 'points' in selected ? selected.points : [];
  const icon = isWind ? Wind : Sun;
  const image = selected && 'image' in selected
    ? selected.image
    : isWind
      ? visualAssets.wind
      : visualAssets.solarArray;
  const serviceLabel = isWind ? 'Wind energy' : 'Solar power';

  const [siteArea, setSiteArea] = useState(100);
  const [moduleEfficiency, setModuleEfficiency] = useState(21);
  const [sunHours, setSunHours] = useState(4.5);
  const [solarPerformance, setSolarPerformance] = useState(80);
  const [windRatedKw, setWindRatedKw] = useState(1000);
  const [capacityFactor, setCapacityFactor] = useState(30);
  const [lineVoltage, setLineVoltage] = useState(11000);
  const [powerFactor, setPowerFactor] = useState(0.95);
  const [rotorRpm, setRotorRpm] = useState(12);
  const [generatorRpm, setGeneratorRpm] = useState(1500);
  const [annualTariff, setAnnualTariff] = useState(10);
  const [investment, setInvestment] = useState(0);
  const [gridFactor, setGridFactor] = useState(0.716);
  const [mapPlace, setMapPlace] = useState(isWind ? 'Kayathar, Tamil Nadu' : 'Bengaluru, India');

  if (category && !(category in categories)) return <Navigate to={`/services/${kind}`} replace />;

  const solarKw = siteArea * moduleEfficiency / 100;
  const solarDailyKwh = solarKw * sunHours * solarPerformance / 100;
  const solarAnnualKwh = solarDailyKwh * 365;
  const solarAnnualValue = solarAnnualKwh * annualTariff;
  const solarPayback = solarAnnualValue > 0 && investment > 0 ? investment / solarAnnualValue : null;

  const windAverageKw = windRatedKw * capacityFactor / 100;
  const windHourlyKwh = windAverageKw;
  const windAnnualKwh = windAverageKw * 8760;
  const windCurrent = windRatedKw * 1000 / (Math.sqrt(3) * Math.max(1, lineVoltage) * Math.max(0.01, powerFactor));
  const windAnnualValue = windAnnualKwh * annualTariff;
  const windPayback = windAnnualValue > 0 && investment > 0 ? investment / windAnnualValue : null;
  const annualEnergy = isWind ? windAnnualKwh : solarAnnualKwh;
  const annualValue = isWind ? windAnnualValue : solarAnnualValue;
  const payback = isWind ? windPayback : solarPayback;
  const CategoryIcon = icon;

  const mapPlaces = isWind ? ['Kayathar, Tamil Nadu', 'Tirunelveli, Tamil Nadu', 'South Tamil Nadu'] : ['Bengaluru, India', 'Hyderabad, India', 'Mysuru, India', 'Kochi, India'];
  const placeCoordinates: Record<string, [number, number]> = {
    'Kayathar, Tamil Nadu': [8.95, 77.75],
    'Tirunelveli, Tamil Nadu': [8.7139, 77.7567],
    'South Tamil Nadu': [8.7, 77.7],
    'Bengaluru, India': [12.9716, 77.5946],
    'Hyderabad, India': [17.385, 78.4867],
    'Mysuru, India': [12.2958, 76.6394],
    'Kochi, India': [9.9312, 76.2673],
  };
  const regionalLocations = mapPlaces.map((name) => ({
    name,
    latitude: placeCoordinates[name][0],
    longitude: placeCoordinates[name][1],
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-12 pt-28 sm:pb-16 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '56px 56px' }} aria-hidden="true" />
        <div className="shell relative">
          <nav aria-label="Breadcrumb" className="mb-7 text-sm text-white/60"><Link to="/" className="hover:text-white">Home</Link><span className="px-2">/</span><Link to="/services" className="hover:text-white">Services</Link><span className="px-2">/</span><span className="text-white">{serviceLabel}</span>{selected && <><span className="px-2">/</span><span>{selectedLabel}</span></>}</nav>
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7"><p className="eyebrow"><span className="rule-accent" />{isWind ? 'Wind resource to usable power' : 'Solar technology and site fit'}</p><h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">{selected ? selected.title : isWind ? 'Wind energy, measured by site and machine.' : 'Solar systems designed around surface and load.'}</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{selected ? selectedDescription : isWind ? 'Explore turbine sizing bands, estimate hourly energy and electrical output, and review Kayathar and South Tamil Nadu as project areas. Actual generation depends on measured wind conditions and turbine power curves.' : 'Compare rigid modules, flexible products and rooftop system layouts. Estimate capacity, daily and annual yield, savings and grid emissions with editable site assumptions.'}</p><div className="mt-7 flex flex-wrap gap-3"><Link to={`/request-consultation?service=${isWind ? 'consulting' : 'solar'}`} className="btn-primary-lg">Discuss a site <ArrowRight className="h-4 w-4" /></Link><a href="#calculator" className="btn btn-lg border border-white/25 text-white hover:bg-white/10"><Zap className="h-4 w-4" />Open calculator</a></div><div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/65"><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />Assumptions are editable</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />No plant data invented</span></div></div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10 lg:col-span-5"><SmartImage src={image.src} alt={image.alt} width={1400} height={900} fill sizes="(min-width: 1024px) 42vw, 100vw" /><div className="absolute inset-0 bg-gradient-to-t from-[#07110f]/60 to-transparent" /><span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#07110f]/70 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm"><CategoryIcon className="h-4 w-4 text-emerald-300" />{serviceLabel}</span></div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-mist py-4"><nav className="shell flex gap-2 overflow-x-auto pb-1" aria-label={`${serviceLabel} categories`}><Link to={`/services/${kind}`} className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold ${!selected ? 'bg-emerald-400 text-[#07110f]' : 'border border-line text-ink-muted hover:text-ink'}`}>Overview</Link>{Object.entries(categories).map(([key, item]) => <Link key={key} to={`/services/${kind}/${key}`} className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold ${categoryKey === key ? 'bg-emerald-400 text-[#07110f]' : 'border border-line text-ink-muted hover:text-ink'}`}>{item.label}</Link>)}</nav></section>

      {selected ? (
        <section className="section"><div className="shell grid gap-8 lg:grid-cols-12"><div className="lg:col-span-5"><p className="eyebrow"><span className="rule-accent" />{isWind ? 'Turbine classification' : 'Technology classification'}</p><h2 className="mt-4 text-3xl font-extrabold text-ink">{selectedClassification}</h2><p className="mt-4 leading-relaxed text-ink-muted">{selectedDescription}</p>{selectedPoints.length > 0 && <ul className="mt-6 space-y-3">{selectedPoints.map((point) => <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink-muted"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{point}</li>)}</ul>}</div><div className="overflow-hidden rounded-lg border border-line lg:col-span-7"><div className="bg-mist px-5 py-4 text-sm font-semibold text-ink">{isWind ? 'Machine and site inputs to verify' : 'Design parameters to verify'}</div>{(isWind ? [['Rated electrical output', 'Read the turbine nameplate and certified power curve'], ['Rotor speed', 'Use OEM operating range; variable-speed turbines change RPM with wind'], ['Generator speed', 'Record generator RPM separately; gearbox and direct-drive designs differ'], ['Output current', 'Calculated from power, line voltage and power factor; actual output changes with wind and controls']] : [['PV module', 'Check rated power, conversion efficiency, temperature coefficient and product certification'], ['Surface / structure', 'Confirm structural capacity, attachment, water sealing, fire access and maintenance route'], ['System conversion', 'Account for inverter, wiring, shading, temperature and availability losses'], ['Grid connection', 'Confirm utility approvals, export limits, metering and applicable state rules']]).map(([label, detail]) => <div key={label} className="grid grid-cols-[minmax(8rem,0.65fr)_1.35fr] gap-4 border-t border-line px-5 py-4 text-sm"><span className="font-semibold text-ink">{label}</span><span className="leading-relaxed text-ink-muted">{detail}</span></div>)}</div></div></section>
      ) : (
        <section className="section"><div className="shell"><Reveal className="max-w-3xl"><p className="eyebrow"><span className="rule-accent" />{isWind ? 'Wind system classes' : 'Solar system classes'}</p><h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">{isWind ? 'Compare machine scale, then validate the wind resource.' : 'Choose the panel or installation configuration that fits the site.'}</h2><p className="mt-4 leading-relaxed text-ink-muted">{isWind ? 'The output bands below are navigation buckets for this page, not regulatory classes. Turbine size and speed alone do not predict energy; use the OEM power curve and site wind assessment.' : 'Rigid and flexible describe module construction; rooftop describes where a PV system is installed. A rooftop system may use rigid modules unless the roof conditions justify a suitable alternative.'}</p></Reveal><div className="mt-8 grid gap-4 md:grid-cols-3">{Object.entries(categories).map(([key, item], index) => { const categoryImage = 'image' in item ? item.image : visualAssets.wind; const categoryDescription = 'description' in item ? item.description : item.summary; const categoryTag = 'band' in item ? item.band : item.label; return <Reveal key={key} delay={index * 0.05} as="div"><Link to={`/services/${kind}/${key}`} className="card card-hover group h-full overflow-hidden"><div className="relative aspect-[16/9]"><SmartImage src={categoryImage.src} alt={categoryImage.alt} width={1000} height={600} fill sizes="(min-width: 768px) 33vw, 100vw" /></div><div className="p-6"><span className="text-xs font-bold uppercase tracking-wider text-emerald-300">{categoryTag}</span><h3 className="mt-3 text-lg font-bold text-ink">{item.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{categoryDescription}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-300">View details <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></div></Link></Reveal>; })}</div></div></section>
      )}

      <section id="calculator" className="section bg-mist scroll-mt-24"><div className="shell"><Reveal className="max-w-3xl"><p className="eyebrow"><span className="rule-accent" />Performance and commercial screen</p><h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">Estimate energy, value and emissions.</h2><p className="mt-4 leading-relaxed text-ink-muted">Replace the starting assumptions with site-specific data. These tools are preliminary screening calculators, not an energy yield assessment or financial commitment.</p></Reveal>
        <div className="mt-8 grid gap-5 lg:grid-cols-12">
          <article className="card p-5 sm:p-6 lg:col-span-7"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300">{isWind ? <Wind className="h-5 w-5" /> : <Sun className="h-5 w-5" />}</span><div><h3 className="font-bold text-ink">{isWind ? 'Wind turbine output' : 'Solar PV yield'}</h3><p className="text-xs text-ink-faint">{isWind ? 'Nameplate power, load factor and machine readings' : 'Usable area, module efficiency and local solar hours'}</p></div></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">{isWind ? <><NumericInput label="Rated output" value={windRatedKw} min={0.1} step={10} unit="kW" onChange={setWindRatedKw} /><NumericInput label="Capacity factor" value={capacityFactor} min={0} step={1} unit="%" onChange={(value) => setCapacityFactor(Math.min(value, 100))} /><NumericInput label="Line voltage" value={lineVoltage} min={1} step={100} unit="V L-L" onChange={setLineVoltage} /><NumericInput label="Power factor" value={powerFactor} min={0.01} step={0.01} onChange={(value) => setPowerFactor(Math.min(value, 1))} /><NumericInput label="Rotor speed" value={rotorRpm} min={0} step={0.1} unit="RPM" onChange={setRotorRpm} /><NumericInput label="Generator speed" value={generatorRpm} min={0} step={10} unit="RPM" onChange={setGeneratorRpm} /></> : <><NumericInput label="Usable panel area" value={siteArea} min={0} step={5} unit="m²" onChange={setSiteArea} /><NumericInput label="Module efficiency" value={moduleEfficiency} min={0} step={0.5} unit="%" onChange={(value) => setModuleEfficiency(Math.min(value, 100))} /><NumericInput label="Peak sun hours" value={sunHours} min={0} step={0.1} unit="h/day" onChange={setSunHours} /><NumericInput label="System performance ratio" value={solarPerformance} min={0} step={1} unit="%" onChange={(value) => setSolarPerformance(Math.min(value, 100))} /></>}<NumericInput label="Electricity value" value={annualTariff} min={0} step={0.5} unit="₹/kWh" onChange={setAnnualTariff} /><NumericInput label="Project investment" value={investment} min={0} step={100000} unit="₹" onChange={setInvestment} /></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-lg bg-[#13241d] p-4"><span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">{isWind ? 'Average hourly energy' : 'Estimated DC capacity'}</span><p className="mt-2 text-xl font-extrabold text-white">{isWind ? `${windHourlyKwh.toFixed(1)} kWh/h` : `${solarKw.toFixed(1)} kWp`}</p></div><div className="rounded-lg bg-[#13241d] p-4"><span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Annual generation</span><p className="mt-2 text-xl font-extrabold text-white">{Math.round(annualEnergy).toLocaleString('en-IN')} kWh</p></div><div className="rounded-lg bg-[#13241d] p-4"><span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Annual energy value</span><p className="mt-2 text-xl font-extrabold text-white">₹{Math.round(annualValue).toLocaleString('en-IN')}</p></div></div>
            {isWind && <div className="mt-3 grid gap-3 sm:grid-cols-3"><div className="rounded-lg border border-line p-4"><span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Estimated rated current</span><p className="mt-2 text-lg font-bold text-ink">{windCurrent.toFixed(1)} A</p></div><div className="rounded-lg border border-line p-4"><span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Rotor speed input</span><p className="mt-2 text-lg font-bold text-ink">{rotorRpm.toFixed(1)} RPM</p></div><div className="rounded-lg border border-line p-4"><span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Generator speed input</span><p className="mt-2 text-lg font-bold text-ink">{generatorRpm.toLocaleString('en-IN')} RPM</p></div></div>}
            <p className="mt-3 text-xs leading-relaxed text-ink-faint">{isWind ? 'Average hourly energy = rated kW × capacity factor. Rated three-phase AC current is an estimate using line voltage and power factor; confirm system topology, efficiency and nameplate values. Rotor and generator RPM are independent OEM readings, not inferred from output.' : 'Daily energy = estimated kWp × peak sun hours × performance ratio. Actual output depends on location, season, orientation, shading, temperature, inverter sizing, downtime and utility export rules.'}</p>
          </article>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1"><article className="card p-5 sm:p-6"><div className="flex items-center gap-3"><CircleDollarSign className="h-5 w-5 text-amber-300" /><h3 className="font-bold text-ink">Simple payback</h3></div><p className="mt-3 text-sm leading-relaxed text-ink-muted">Based on annual generation value at your input tariff. It excludes maintenance, degradation, financing, taxes, incentives, export compensation and downtime.</p><div className="mt-4 rounded-lg bg-[#13241d] p-4"><span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Screening result</span><p className="mt-2 text-2xl font-extrabold text-white">{payback === null ? 'Add project investment' : `${payback.toFixed(1)} years`}</p></div></article><article className="card p-5 sm:p-6"><div className="flex items-center gap-3"><Factory className="h-5 w-5 text-sky-300" /><h3 className="font-bold text-ink">Avoided grid emissions</h3></div><div className="mt-4"><NumericInput label="Grid emissions factor" value={gridFactor} min={0} step={0.001} unit="kg CO₂/kWh" onChange={setGridFactor} /></div><div className="mt-4 rounded-lg bg-[#13241d] p-4"><span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Annual screening estimate</span><p className="mt-2 text-2xl font-extrabold text-white">{(annualEnergy * gridFactor / 1000).toFixed(1)} tCO₂</p></div><p className="mt-3 text-xs leading-relaxed text-ink-faint">Set the factor for your location and reporting year. This is grid displacement only, not lifecycle emissions or a verified carbon claim.</p></article></div>
        </div>
      </div></section>

      <section className="section"><div className="shell grid gap-8 lg:grid-cols-12 lg:items-start"><div className="lg:col-span-5"><p className="eyebrow"><span className="rule-accent" />Project geography</p><h2 className="mt-4 text-3xl font-extrabold text-ink">{isWind ? 'Kayathar and South Tamil Nadu' : 'Select a solar project area'}</h2><p className="mt-4 leading-relaxed text-ink-muted">{isWind ? 'Explore Kayathar and nearby areas on the map. Turbine locations and hourly output require confirmed site coordinates and operating data.' : 'Choose a city to view the region. Generation depends on the specific site, system and local conditions.'}</p><div className="mt-6 flex flex-wrap gap-2">{mapPlaces.map((place) => <button key={place} type="button" onClick={() => setMapPlace(place)} className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${mapPlace === place ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300' : 'border-line text-ink-muted hover:text-ink'}`}><MapPin className="h-4 w-4" />{place}</button>)}</div></div><div className="lg:col-span-7"><RegionalLocator locations={regionalLocations} activeLocation={mapPlace} onSelect={setMapPlace} /><div className="flex items-center justify-between bg-mist px-4 py-3"><span className="text-sm font-semibold text-ink">{mapPlace}</span><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapPlace)}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-emerald-300">Open in Google Maps</a></div></div></div></section>


      <CtaBand title={`Plan ${isWind ? 'wind generation' : 'solar'} around real site data.`} body="Share location, load profile, available area, utility information and project objectives to shape the next technical and commercial review." secondary={{ label: 'View services', to: '/services' }} />
    </>
  );
}