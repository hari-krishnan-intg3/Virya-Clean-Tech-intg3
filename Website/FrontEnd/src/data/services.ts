import {
  Sun,
  Zap,
  BatteryCharging,
  Cpu,
  LineChart,
  Factory,
  Building2,
  Truck,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  Hotel,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';

/**
 * The single source of truth for Virya's service taxonomy.
 *
 * Previously this file, `validation.ts` (form values) and the chatbot each
 * carried their own id list that drifted apart. `slug` is now the one id
 * used by routes, form values, chatbot intents and Jira labels alike.
 */
export type ServiceSlug =
  | 'solar'
  | 'ev-charging'
  | 'battery'
  | 'software-iot'
  | 'consulting';

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDeliverable {
  title: string;
  description: string;
}

export interface Service {
  slug: ServiceSlug;
  /** Short label for chips, menus and form selects. */
  label: string;
  /** Full published name. */
  title: string;
  /** One-line positioning statement used in cards and the mega menu. */
  tagline: string;
  /** Two to three sentence overview for the detail page hero. */
  summary: string;
  icon: LucideIcon;
  /** Tailwind gradient used for the visual block. */
  gradient: string;
  accent: string;
  /** Typical project size band — matches the qualification questions. */
  scale: string;
  /** Lead time from signed scope to energisation. */
  timeline: string;
  /** Ordered capability list shown on the detail page. */
  capabilities: string[];
  /** Concrete artefacts the client receives. */
  deliverables: ServiceDeliverable[];
  /** Which ICP segments this service is usually bought for. */
  bestFor: string[];
  faqs: ServiceFaq[];
}

export const services: Service[] = [
  {
    slug: 'solar',
    label: 'Solar Power',
    title: 'Solar Power Plant Design & Development',
    tagline: 'Rooftop to utility-scale generation, engineered around your load and your roof.',
    summary:
      'We design and build solar power systems for industrial, commercial and institutional sites — from load assessment and structural checks through to installation, grid interconnection and ongoing performance monitoring. India installed 171.05 GW of solar as of 30 September 2026, of which 33.41 GW is grid-connected rooftop. Rooftop alone took 38.6% of all new solar capacity added between April and August 2026, which means rooftop is where the market is moving fastest and where a competent integrator matters most.',
    icon: Sun,
    gradient: 'from-amber-400 via-orange-500 to-amber-600',
    accent: '#F59E0B',
    scale: '100 kW – 100 MW',
    timeline: '8–16 weeks typical',
    capabilities: [
      'Load profile analysis and energy bill audit',
      'Site survey, shadow analysis and structural feasibility',
      'PV module, inverter and BOS engineering to IEC standards',
      'HT/LT integration, earthing and protection design',
      'DISCOM application, net-metering and grid interconnection',
      'SCADA integration and performance guarantees',
    ],
    deliverables: [
      {
        title: 'Feasibility & yield report',
        description:
          'Twelve-month generation model, specific yield, degradation assumptions and a bankable payback estimate for your exact tariff.',
      },
      {
        title: 'Detailed design drawings',
        description:
          'Single-line diagram, array layout, civil and structural drawings, cable sizing and protection coordination study.',
      },
      {
        title: 'Bill-of-quantities & vendor selection',
        description:
          'Itemised BOQ across modules, inverters, transformers and BOS, with comparative vendor analysis.',
      },
      {
        title: 'O&M and monitoring plan',
        description:
          'Preventive maintenance schedule, cleaning cycles, spare-parts list and remote alerting thresholds.',
      },
    ],
    bestFor: [
      'Manufacturing plants running high daytime load',
      'Warehouses and cold-storage facilities with large uninterrupted roofs',
      'Hospitals, colleges and campuses with strict power-quality needs',
      'Real-estate developers adding rooftop capacity to leased buildings',
    ],
    faqs: [
      {
        question: 'How long does a commercial rooftop solar project take?',
        answer:
          'A 500 kW – 1 MW rooftop installation typically runs 8 to 16 weeks from survey to energisation. The two variables are DISCOM approval timelines and structural roof capacity; we start both in parallel during the design phase to avoid losing months at the end.',
      },
      {
        question: 'Will our roof take the load?',
        answer:
          'Structural assessment is part of the feasibility study, not an afterthought. We check dead load, wind uplift and the existing waterproofing condition, and we tell you early if reinforcement is required rather than after equipment is ordered.',
      },
      {
        question: 'What does it actually cost?',
        answer:
          'We quote on a delivered-cost basis after the survey — that is the only number that survives comparison, because it includes modules, inverters, structure, cable, earthing, labour and interconnection. Ask any two EPCs for their BOQ and you will find they are quoting different scopes.',
      },
    ],
  },
  {
    slug: 'ev-charging',
    label: 'EV Charging',
    title: 'EV Charging Infrastructure',
    tagline: 'AC and DC fast charging, engineered for sites with constrained grid capacity.',
    summary:
      'We develop fast, reliable and smart EV charging stations for campuses, fleets, retail sites and public networks. The hard part is rarely the charger — it is power. Our work starts with a load and tariff study so your charging estate does not trigger demand charges or an unnecessary transformer upgrade. As of 1 July 2026 the Government of India had approved 6,562 public chargers under PM E-DRIVE, including 1,571 for Karnataka, and FAME-II had delivered 9,583 public charging stations nationwide.',
    icon: Zap,
    gradient: 'from-sky-400 via-signal-500 to-signal-700',
    accent: '#0EA5E9',
    scale: '2 – 60 chargers per site',
    timeline: '6–14 weeks typical',
    capabilities: [
      'Load study, transformer headroom and tariff modelling',
      'Charger selection: AC, DC fast, and destination charging',
      'Civil works, cable routing, protection and earthing',
      'Load management and dynamic balancing with solar and storage',
      'Payment gateway, RFID and OCPP backend integration',
      'PM E-DRIVE subsidy documentation support',
    ],
    deliverables: [
      {
        title: 'Charging feasibility study',
        description:
          'Existing load profile, available headroom, transformer augmentation requirement and the resulting connection cost.',
      },
      {
        title: 'Site electrical design',
        description:
          'Distribution board layout, feeder sizing, protection grading and a phased deployment plan.',
      },
      {
        title: 'Hardware specification',
        description:
          'Charger count, mix of AC and DC, socket standards and mounting, sized to your demand curve rather than a rule of thumb.',
      },
      {
        title: 'Software & revenue integration',
        description:
          'Billing, access control, uptime dashboard and reporting so the site owner can prove utilisation.',
      },
    ],
    bestFor: [
      'Logistics and last-mile delivery fleets moving to electric',
      'Apartment and gated-community parking with managed supply',
      'Retail, showroom and hotel forecourts adding customer charging',
      'Municipal e-bus depots on PM E-DRIVE allocation',
    ],
    faqs: [
      {
        question: 'Do I need a new transformer to add chargers?',
        answer:
          'Sometimes, and it is usually the single biggest cost line. Our load study tells you before you buy anything. In plenty of cases load management — staggering charging, capping power, or running chargers off a solar-plus-storage island — removes the need entirely.',
      },
      {
        question: 'AC or DC fast charging for our fleet?',
        answer:
          'AC (7–22 kW) suits overnight depot charging where vehicles sit for hours. DC fast (60–350 kW) suits public and turnaround duty cycles. Most mixed fleets need both, and the right ratio is a function of dwell time, not fleet size.',
      },
      {
        question: 'Can we claim PM E-DRIVE support?',
        answer:
          'Government entities and nodal agencies can apply under the ₹2,000 crore EV public charging allocation. Private site owners generally cannot claim it directly, but understanding the subsidy structure helps when you are building a public or semi-public charger network.',
      },
    ],
  },
  {
    slug: 'battery',
    label: 'Battery & Storage',
    title: 'Battery Technology & Energy Storage',
    tagline: 'Shift peak demand, ride through outages, and make better use of what you generate.',
    summary:
      'We design and integrate battery energy storage systems that cut peak demand charges, keep critical loads running through outages, and absorb surplus rooftop generation before export. For a commercial site in India, demand charges frequently cost more than the energy itself — which is where storage usually pays back first.',
    icon: BatteryCharging,
    gradient: 'from-violet-400 via-violet-600 to-emerald-600',
    accent: '#8B5CF6',
    scale: '50 kWh – 5 MWh',
    timeline: '10–20 weeks typical',
    capabilities: [
      'Load profile capture and demand-charge analysis',
      'Chemistry selection: LFP, NMC and hybrid configurations',
      'Sizing against tariff structure and outage criticality',
      'Hybrid inverter design for PV + storage + grid',
      'Fire safety, thermal management and BMS integration',
      'Peak shaving, self-consumption and islanding strategies',
    ],
    deliverables: [
      {
        title: 'Demand & tariff analysis',
        description:
          'Twelve months of interval data, identifying exactly which demand peaks are worth shaving and what each kW of peak reduction is worth per month.',
      },
      {
        title: 'Storage sizing study',
        description:
          'Capacity, C-rate, round-trip efficiency and cycle-life assumptions with a modelled payback against your actual tariff.',
      },
      {
        title: 'System architecture',
        description:
          'Topology, PCS selection, protection philosophy and the control strategy for grid-connected, backup or islanded operation.',
      },
      {
        title: 'Safety & compliance plan',
        description:
          'Detection, ventilation, separation distances and emergency procedures matched to the installed chemistry.',
      },
    ],
    bestFor: [
      'Cold storage and data centres with zero-tolerance outages',
      'Sites on time-of-day tariffs with steep peak penalties',
      'Factories with solar curtailment or export restrictions',
      'Hospitals and labs requiring ride-through capability',
    ],
    faqs: [
      {
        question: 'How does storage actually save money?',
        answer:
          'Two ways, and you should model both. Peak shaving removes demand charges — usually the faster payback. Self-consumption lets you use generation you would otherwise export at a low rate or curtail. Which one dominates depends entirely on your tariff structure.',
      },
      {
        question: 'LFP or NMC?',
        answer:
          'LFP for anything that will cycle regularly: longer life, better thermal stability, lower cost per cycle. NMC where footprint is severely constrained. For commercial peak shaving, LFP is almost always the right default.',
      },
      {
        question: 'What is the realistic payback period?',
        answer:
          'Typically 4 to 7 years where demand charges are meaningful, driven by cycle degradation rather than calendar age. We model it with conservative assumptions and show you the sensitivity, because a payback that only works at optimistic degradation is not a payback.',
      },
    ],
  },
  {
    slug: 'software-iot',
    label: 'Smart Energy Software',
    title: 'Custom Software & IoT Integration',
    tagline: 'One dashboard across solar, storage, chargers and meters — with alerts that matter.',
    summary:
      'Our engineering team builds energy-focused software and IoT systems for real-time monitoring, smart energy management and predictive maintenance. The goal is deliberately unglamorous: a single view that answers "what is generating, what is drawing, what is lost, and what is about to fail" — without a data scientist.',
    icon: Cpu,
    gradient: 'from-emerald-400 via-emerald-600 to-signal-600',
    accent: '#10B981',
    scale: 'Any asset count',
    timeline: '6–12 weeks typical',
    capabilities: [
      'Meter, inverter and charger telemetry integration',
      'OpenTelemetry / Modbus / MQTT protocol bridging',
      'Role-based dashboards for CFO, facility and operations teams',
      'Automated anomaly and performance-loss alerting',
      'Energy accounting, CO2e reporting and audit trails',
      'White-label portals and tenant billing',
    ],
    deliverables: [
      {
        title: 'Systems integration map',
        description:
          'Every device, protocol, data owner and failure mode documented before a line of code is written.',
      },
      {
        title: 'Unified monitoring dashboard',
        description:
          'Generation, consumption, storage state-of-charge, charger utilisation and loss analysis in one view.',
      },
      {
        title: 'Alerting & automation rules',
        description:
          'Threshold and anomaly rules with escalation paths, so faults surface before they become downtime.',
      },
      {
        title: 'Reporting & compliance pack',
        description:
          'Scheduled energy, cost and emissions reporting formatted for internal review and external audit.',
      },
    ],
    bestFor: [
      'Multi-site operators who need one view across every location',
      'REITs and developers managing assets on behalf of tenants',
      'Facilities teams that currently reconcile data from four vendors',
      'Any site where a missed fault costs more than the software',
    ],
    faqs: [
      {
        question: 'Do we have to replace our existing equipment?',
        answer:
          'No, and that is usually the right answer. We integrate with the inverters, meters and chargers you already have. Replacing working hardware to get better data is rarely justified.',
      },
      {
        question: 'What does predictive maintenance actually predict?',
        answer:
          'In our experience the highest-value signals are degradation in specific strings or modules, rising insulation resistance, and the drift patterns that precede an inverter failure. We tune rules against your real failure history rather than generic thresholds.',
      },
      {
        question: 'Can it be white-labelled for our customers?',
        answer:
          'Yes. If you are a developer, operator or EPC reselling energy assets, we can deploy a branded portal with tenant-level metering and billing rather than handing you an internal ops tool.',
      },
    ],
  },
  {
    slug: 'consulting',
    label: 'Consulting & Audits',
    title: 'Renewable Energy Consulting & Audits',
    tagline: 'Independent feasibility, energy audits and compliance guidance before you commit capital.',
    summary:
      'We guide clients through their clean-energy journey with expert consulting, feasibility studies and detailed energy audits. The value is in the recommendations that do not make it into the report: the projects that look attractive on paper but fail on your specific tariff, your specific roof or your specific load shape.',
    icon: LineChart,
    gradient: 'from-signal-400 via-signal-600 to-emerald-700',
    accent: '#1754CF',
    scale: 'Any scale',
    timeline: '2–6 weeks typical',
    capabilities: [
      'Detailed energy audit with interval data analysis',
      'Solar, storage and charging feasibility studies',
      'Tariff optimisation and demand-charge review',
      'Carbon accounting and scope 2 reporting readiness',
      'Vendor BOQ review and tender evaluation support',
      'Regulatory, DISCOM and compliance guidance',
    ],
    deliverables: [
      {
        title: 'Energy audit report',
        description:
          'Interval-data analysis, load characterisation, wastage quantification and a ranked list of measures with payback.',
      },
      {
        title: 'Feasibility study',
        description:
          'Generation or storage modelling against your real load, with sensitivity analysis on the assumptions that actually move the answer.',
      },
      {
        title: 'Investment memorandum',
        description:
          'Written for a CFO or board: capital, opex, savings, payback, and the risks stated plainly.',
      },
      {
        title: 'Vendor evaluation support',
        description:
          'Comparative BOQ normalisation so you are comparing the same scope, and evaluation criteria you can defend.',
      },
    ],
    bestFor: [
      'CFOs who need an independent number before approving capital',
      'Facilities teams validating an EPC quote they have been given',
      'Organisations preparing scope 2 and CSRD-adjacent disclosures',
      'Anyone deciding between doing nothing and doing something now',
    ],
    faqs: [
      {
        question: 'Do you also implement what you recommend?',
        answer:
          'Yes. That is a deliberate choice — an auditor who is not allowed to build has no incentive to be accurate about what is buildable on your site. We mark up our recommendation clearly so you can see where our commercial interest lies.',
      },
      {
        question: 'What data do you need from us?',
        answer:
          'Twelve months of half-hourly or hourly electricity bills and meter data is ideal. If you only have monthly totals we can still work, but the analysis will be coarser and the demand-charge work will not be possible.',
      },
      {
        question: 'How long before we see a return?',
        answer:
          'A focused energy audit is typically 2 to 3 weeks from receiving the data. A full feasibility study including site survey is 4 to 6 weeks. Both are usually delivered with a call to walk through the findings.',
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Derived lookups                                                     */
/* ------------------------------------------------------------------ */

export const SERVICE_SLUGS = services.map((s) => s.slug);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Industries — the ICP                                                */
/* ------------------------------------------------------------------ */

export interface Industry {
  slug: string;
  label: string;
  icon: LucideIcon;
  /** The specific operational pressure that makes energy a board topic. */
  pressure: string;
  /** Typical first engagement for this segment. */
  entryService: ServiceSlug;
  /** Quantified hooks, e.g. tariff bands, roof areas. */
  signals: string[];
}

export const industries: Industry[] = [
  {
    slug: 'manufacturing',
    label: 'Manufacturing & Plants',
    icon: Factory,
    pressure:
      'Continuous process load, peak-hour concentration and a board-level energy number that auditors now ask about.',
    entryService: 'solar',
    signals: ['Three-shift operation', 'HT supply', 'Demand charges above ₹8/unit'],
  },
  {
    slug: 'warehousing',
    label: 'Warehousing & Cold Storage',
    icon: Warehouse,
    pressure:
      'Large uninterrupted roof area plus refrigeration load that runs hardest in exactly the hours solar peaks.',
    entryService: 'solar',
    signals: ['10,000+ sq ft roof', 'Refrigeration compression', 'Night-time load'],
  },
  {
    slug: 'fleet-logistics',
    label: 'Fleet & Logistics',
    icon: Truck,
    pressure:
      'Diesel cost, EV uptime and depot charging that has to fit inside an existing sanctioned load.',
    entryService: 'ev-charging',
    signals: ['20+ vehicles', 'Overnight depot dwell', 'High km/month'],
  },
  {
    slug: 'real-estate',
    label: 'Real Estate & Developers',
    icon: Building2,
    pressure:
      'Tenant electricity costs, green-building certification and the ability to add capacity to a leased asset.',
    entryService: 'solar',
    signals: ['Leased rooftops', 'Green building target', 'Multiple blocks'],
  },
  {
    slug: 'hospitals',
    label: 'Hospitals & Diagnostics',
    icon: HeartPulse,
    pressure:
      'Critical-load continuity, power quality and backup ride-through. Energy cost is secondary to uptime.',
    entryService: 'battery',
    signals: ['Critical load > 100 kW', 'Generator dependency', '24×7 operation'],
  },
  {
    slug: 'hotels',
    label: 'Hotels & Resorts',
    icon: Hotel,
    pressure:
      'Guest-facing EV charging as an amenity, plus high cooling and hot-water loads in expensive tariff hours.',
    entryService: 'ev-charging',
    signals: ['Public forecourt', 'Summer peak load', 'EV guest expectation'],
  },
  {
    slug: 'retail',
    label: 'Retail & Malls',
    icon: ShoppingBag,
    pressure:
      'Customer-facing chargers, HVAC peak load and energy costs across large common-area footprints.',
    entryService: 'solar',
    signals: ['Long trading hours', 'Large common area', 'Daytime footfall'],
  },
  {
    slug: 'education',
    label: 'Education & Institutions',
    icon: GraduationCap,
    pressure:
      'Daytime-heavy usage that maps almost perfectly onto a solar day curve, plus institutional ESG reporting.',
    entryService: 'solar',
    signals: ['8am–4pm load', 'Large campus roof', 'Annual reporting'],
  },
];

export const INDUSTRY_SLUGS = industries.map((i) => i.slug);

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}