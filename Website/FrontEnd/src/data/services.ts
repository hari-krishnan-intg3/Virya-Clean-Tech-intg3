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
    tagline: 'Explore commercial and industrial solar options around your site and energy use.',
    summary:
      'Commercial solar feasibility depends on the site, available roof or land, shading, structural condition, energy use, electrical infrastructure and local utility requirements. An initial discussion can identify what information is available and whether a more detailed site and engineering assessment is appropriate. System design, procurement, installation, interconnection and monitoring are confirmed according to the agreed project scope.',
    icon: Sun,
    gradient: 'from-amber-400 via-orange-500 to-amber-600',
    accent: '#F59E0B',
    scale: 'Commercial and industrial facilities',
    timeline: 'Timing confirmed after scope review',
    capabilities: [
      'Load profile analysis and energy bill audit',
      'Site survey, shadow analysis and structural feasibility',
      'PV module, inverter and BOS engineering to IEC standards',
      'HT/LT integration, earthing and protection design',
      'DISCOM application, net-metering and grid interconnection',
      'Monitoring and controls, where included in the agreed scope',
    ],
    deliverables: [
      {
        title: 'Feasibility & yield report',
        description:
          'A generation estimate with documented assumptions, subject to available site and energy information.',
      },
      {
        title: 'Detailed design drawings',
        description:
          'Design documents such as array layouts and electrical drawings, when included in the detailed design scope.',
      },
      {
        title: 'Bill-of-quantities & vendor selection',
        description:
          'A project-specific equipment and scope breakdown, if procurement planning is part of the engagement.',
      },
      {
        title: 'O&M and monitoring plan',
        description:
          'A proposed operations or monitoring plan where ongoing support is included in the agreed scope.',
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
        question: 'How is the timing for a solar project determined?',
        answer:
          'Timing depends on the site review, design scope, equipment availability, utility approvals, permissions and installation requirements. A project schedule can be discussed once the facility and intended scope are understood.',
      },
      {
        question: 'Will our roof take the load?',
        answer:
          'Roof condition and structural capacity are important feasibility considerations. The appropriate structural review depends on the building, available records and proposed system; it should be confirmed before installation decisions are made.',
      },
      {
        question: 'What does it actually cost?',
        answer:
          'Cost depends on system design, site conditions, equipment, electrical work, approvals and the responsibilities included in the quotation. Comparing itemised scopes helps identify what is and is not included.',
      },
    ],
  },
  {
    slug: 'ev-charging',
    label: 'EV Charging',
    title: 'EV Charging Infrastructure',
    tagline: 'Plan charging infrastructure around vehicles, parking patterns and available power.',
    summary:
      'EV charging requirements depend on vehicle types, charging frequency, parking duration, site layout, electrical capacity, connectivity and the operating model. A site and load review can help clarify charger mix and infrastructure questions. Hardware, software, payment, installation and support responsibilities should be confirmed for each project rather than assumed.',
    icon: Zap,
    gradient: 'from-sky-400 via-signal-500 to-signal-700',
    accent: '#0EA5E9',
    scale: 'Workplace, commercial and fleet sites',
    timeline: 'Timing confirmed after site review',
    capabilities: [
      'Load study, transformer headroom and tariff modelling',
      'Charger selection: AC, DC fast, and destination charging',
      'Civil works, cable routing, protection and earthing',
      'Load management and dynamic balancing with solar and storage',
      'Payment gateway, RFID and OCPP backend integration',
      'Local utility and approval considerations, where relevant to the project',
    ],
    deliverables: [
      {
        title: 'Charging feasibility study',
        description:
          'A review of available load information, electrical capacity and potential connection requirements.',
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
          'Software, access, billing or reporting requirements, if these are included in the agreed solution.',
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
        question: 'How can I tell whether the electrical supply can support chargers?',
        answer:
          'A review of the existing connection, available load data, charging demand and operating schedule can indicate whether upgrades or managed charging should be considered. The result is site-specific and should be confirmed by an appropriate technical assessment.',
      },
      {
        question: 'AC or DC fast charging for our fleet?',
        answer:
          'The choice depends on vehicle requirements, dwell time, charging frequency, available power and the service expected by drivers. A fleet depot and a public or customer-facing site may need different approaches.',
      },
      {
        question: 'What information is useful for an initial EV charging discussion?',
        answer:
          'Share the site location, vehicle or fleet context, expected parking and charging patterns, approximate number of charging points, available electrical information and target timeline. Any incentives or approvals should be checked against current local rules.',
      },
    ],
  },
  {
    slug: 'battery',
    label: 'Battery & Storage',
    title: 'Battery Technology & Energy Storage',
    tagline: 'Assess storage against operating objectives, load requirements and site constraints.',
    summary:
      'Energy storage may be evaluated for applications such as managing demand, supporting selected loads or storing on-site generation. Feasibility depends on the operating objective, load profile, required power and duration, electrical integration, safety requirements and site conditions. Performance, savings and backup capability cannot be determined without project-specific engineering.',
    icon: BatteryCharging,
    gradient: 'from-violet-400 via-violet-600 to-emerald-600',
    accent: '#8B5CF6',
    scale: 'Sized to the application and load',
    timeline: 'Timing confirmed after technical review',
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
          'A review of available energy-use and tariff information to assess whether demand management is relevant.',
      },
      {
        title: 'Storage sizing study',
        description:
          'Potential power and energy requirements, with assumptions stated for further technical review.',
      },
      {
        title: 'System architecture',
        description:
          'Topology, PCS selection, protection philosophy and the control strategy for grid-connected, backup or islanded operation.',
      },
      {
        title: 'Safety & compliance plan',
        description:
          'Safety, fire protection and operational requirements to be reviewed by qualified project specialists.',
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
        question: 'Can a battery guarantee savings or uninterrupted supply?',
        answer:
          'No general guarantee is appropriate. Outcomes depend on the system design, tariff, usage patterns, equipment, controls, site conditions and the loads being supported. Any savings or backup expectations need to be evaluated against project-specific data and stated assumptions.',
      },
      {
        question: 'LFP or NMC?',
        answer:
          'Chemistry selection depends on the application, safety strategy, operating environment, lifecycle requirements and project constraints. A qualified technical review should determine the suitable options.',
      },
      {
        question: 'What information is needed to discuss storage?',
        answer:
          'Useful starting details include the site location, intended application, critical loads, available energy-use data, existing generation or backup systems and any required operating duration. A technical assessment is needed before sizing or financial outcomes can be estimated.',
      },
    ],
  },
  {
    slug: 'software-iot',
    label: 'Smart Energy Software',
    title: 'Custom Software & IoT Integration',
    tagline: 'Explore monitoring and integration options for energy assets and operational data.',
    summary:
      'Energy software and connected devices can bring selected readings, usage data and alerts into a more accessible view. The approach depends on existing meters and equipment, supported protocols, connectivity, data access, security requirements and the decisions the system should support. Any interface shown as a concept should be treated as illustrative unless it is identified as a deployed product.',
    icon: Cpu,
    gradient: 'from-emerald-400 via-emerald-600 to-signal-600',
    accent: '#10B981',
    scale: 'Scoped to existing assets and data',
    timeline: 'Timing confirmed after integration review',
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
          'Alert rules and notification paths, if included in the agreed implementation scope.',
      },
      {
        title: 'Reporting & compliance pack',
        description:
          'Reporting views based on available data and the organisation’s reporting requirements.',
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
        question: 'Can existing meters and equipment be connected?',
        answer:
          'Possibly. Compatibility depends on the equipment, data access, communications protocols, licensing and connectivity. These should be reviewed before integration scope is confirmed.',
      },
      {
        question: 'What does predictive maintenance actually predict?',
        answer:
          'Monitoring may help surface changes in available data, but it cannot guarantee that failures will be predicted. Useful alerts depend on sensor coverage, data quality, equipment access and the operational process for responding to them.',
      },
      {
        question: 'Can it be white-labelled for our customers?',
        answer:
          'Branding, user roles, tenant views and billing integrations can be discussed as project requirements. Availability depends on the agreed product and integration scope.',
      },
    ],
  },
  {
    slug: 'consulting',
    label: 'Consulting & Audits',
    title: 'Renewable Energy Consulting & Audits',
    tagline: 'Organise site and energy information before deciding on a project direction.',
    summary:
      'An assessment can help organise information about a facility, energy use, operating constraints and project goals. The appropriate scope may include an energy review, feasibility questions or a comparison of options, depending on the service agreed. Reports, regulatory advice, engineering sign-off and implementation support should be confirmed before engagement.',
    icon: LineChart,
    gradient: 'from-signal-400 via-signal-600 to-emerald-700',
    accent: '#1754CF',
    scale: 'Scoped to the site or portfolio',
    timeline: 'Timing agreed for each assessment',
    capabilities: [
      'Detailed energy audit with interval data analysis',
      'Solar, storage and charging feasibility studies',
      'Tariff optimisation and demand-charge review',
      'Energy and project information review',
      'Vendor scope comparison, where included in the engagement',
      'Relevant utility and regulatory questions for specialist review',
    ],
    deliverables: [
      {
        title: 'Energy audit report',
        description:
          'Findings and next-step recommendations based on the assessment scope and information provided.',
      },
      {
        title: 'Feasibility study',
        description:
          'Generation or storage modelling against your real load, with sensitivity analysis on the assumptions that actually move the answer.',
      },
      {
        title: 'Investment memorandum',
        description:
          'A summary of the options reviewed, assumptions, open questions and relevant project considerations.',
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
        question: 'What does an assessment include?',
        answer:
          'The scope is agreed for each enquiry. It may include a review of available site and energy information, key feasibility questions and possible next steps. Engineering deliverables, implementation and compliance services should not be assumed unless they are explicitly included.',
      },
      {
        question: 'What data do you need from us?',
        answer:
          'Start with your site location, facility type, project objective and any available electricity bills or consumption data. Operating hours and information about existing infrastructure can also help. The team can advise what else may be needed.',
      },
      {
        question: 'How long before we see a return?',
        answer:
          'Timing depends on the agreed scope, information availability, site access and any specialist reviews. A schedule can be discussed once the requirements are understood.',
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
  /** Common operating context to help visitors identify relevant questions. */
  pressure: string;
  /** Typical first engagement for this segment. */
  entryService: ServiceSlug;
  /** Site and operating considerations, not eligibility thresholds. */
  signals: string[];
}

export const industries: Industry[] = [
  {
    slug: 'manufacturing',
    label: 'Manufacturing & Plants',
    icon: Factory,
    pressure:
      'Production schedules, machinery loads, electrical infrastructure and site constraints can all shape an energy project.',
    entryService: 'solar',
    signals: ['Production schedules', 'Electrical supply', 'Process-critical loads'],
  },
  {
    slug: 'warehousing',
    label: 'Warehousing & Cold Storage',
    icon: Warehouse,
    pressure:
      'Roof condition and area, refrigeration demand, loading schedules and facility operations may affect the options to assess.',
    entryService: 'solar',
    signals: ['Roof and site layout', 'Refrigeration demand', 'Loading schedules'],
  },
  {
    slug: 'fleet-logistics',
    label: 'Fleet & Logistics',
    icon: Truck,
    pressure:
      'Vehicle routes, dwell time, charging windows, depot layout and electrical capacity are useful planning inputs.',
    entryService: 'ev-charging',
    signals: ['Vehicle patterns', 'Depot parking', 'Charging windows'],
  },
  {
    slug: 'real-estate',
    label: 'Real Estate & Developers',
    icon: Building2,
    pressure:
      'Ownership and lease arrangements, tenant operations, common-area demand and available building infrastructure may matter.',
    entryService: 'solar',
    signals: ['Lease responsibilities', 'Tenant energy use', 'Shared infrastructure'],
  },
  {
    slug: 'hospitals',
    label: 'Hospitals & Diagnostics',
    icon: HeartPulse,
    pressure:
      'Critical equipment, continuity requirements, power quality and existing backup arrangements call for careful review.',
    entryService: 'battery',
    signals: ['Critical equipment', 'Backup arrangements', 'Continuity requirements'],
  },
  {
    slug: 'hotels',
    label: 'Hotels & Resorts',
    icon: Hotel,
    pressure:
      'Occupancy patterns, cooling and hot-water demand, parking use and guest expectations may influence project priorities.',
    entryService: 'ev-charging',
    signals: ['Occupancy patterns', 'Cooling demand', 'Guest parking'],
  },
  {
    slug: 'retail',
    label: 'Retail & Malls',
    icon: ShoppingBag,
    pressure:
      'Trading hours, building services, customer parking and common-area energy use are useful assessment considerations.',
    entryService: 'solar',
    signals: ['Trading hours', 'Building services', 'Customer parking'],
  },
  {
    slug: 'education',
    label: 'Education & Institutions',
    icon: GraduationCap,
    pressure:
      'Term schedules, campus buildings, occupancy changes and institutional reporting priorities can shape energy requirements.',
    entryService: 'solar',
    signals: ['Term schedules', 'Campus infrastructure', 'Reporting priorities'],
  },
];

export const INDUSTRY_SLUGS = industries.map((i) => i.slug);

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}