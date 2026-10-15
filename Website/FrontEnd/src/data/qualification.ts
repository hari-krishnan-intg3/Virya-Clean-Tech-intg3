import type { ServiceSlug } from './services';

/**
 * Ideal Customer Profile.
 *
 * The site is written against this document. Every section, service page and
 * chatbot answer should speak to one of the triggers or objections listed
 * here — if a piece of content does not, it is decoration.
 */

export interface Persona {
  role: string;
  /** What they are accountable for. */
  mandate: string;
  /** The objection they arrive with. */
  objection: string;
  /** What earns their trust. */
  proof: string;
  /** Which service page to send them to. */
  goesTo: ServiceSlug;
}

export const personas: Persona[] = [
  {
    role: 'Facility / Plant Head',
    mandate: 'Uptime, safety and cost control across a physical site.',
    objection: '"I cannot afford an outage to install this."',
    proof: 'Operating schedules, access restrictions and any planned work windows.',
    goesTo: 'solar',
  },
  {
    role: 'CFO / Finance Director',
    mandate: 'Capital allocation with a defensible payback period.',
    objection: '"Every EPC quotes a different payback. I cannot trust any of them."',
    proof: 'Clear assumptions, scope, cost components and project-specific analysis.',
    goesTo: 'consulting',
  },
  {
    role: 'Sustainability / ESG Lead',
    mandate: 'Scope 2 emissions and green-building credentials.',
    objection: '"The data has to be auditable, not a vendor dashboard."',
    proof: 'Data sources, calculation methods and reporting requirements.',
    goesTo: 'software-iot',
  },
  {
    role: 'Real Estate Head',
    mandate: 'Asset value, green certification and tenant energy costs.',
    objection: '"Will this add value to the building, or just add maintenance?"',
    proof: 'Building ownership, tenant arrangements and available infrastructure.',
    goesTo: 'solar',
  },
  {
    role: 'Fleet / Mobility Manager',
    mandate: 'Vehicle uptime and diesel-to-electric total cost.',
    objection: '"Can my sanctioned load even take the chargers?"',
    proof: 'Vehicle patterns, charging windows and available electrical information.',
    goesTo: 'ev-charging',
  },
];

/** What makes a visitor worth a conversation, ranked. */
export const qualificationSignals: string[] = [
  'Energy use or operating complexity that merits a closer review',
  'Available roof, land, parking or electrical infrastructure relevant to the project',
  'Continuity, power quality or backup requirements',
  'A current or planned fleet with defined operating patterns',
  'A sustainability or reporting objective with clear information needs',
  'A new facility, lease, expansion or operational change under consideration',
];

/** What tells us this is not a fit. Said plainly, on the site, on purpose. */
export const disqualifiers: string[] = [
  'Residential enquiries may fall outside this business-focused service scope; confirm before proceeding',
  'A request that cannot be assessed without understanding the full project scope',
  'A site constraint that may prevent the proposed solution from being feasible',
];

/**
 * Commercial triggers. These are the moments a site is worth contacting, and
 * they are what the chatbot listens for.
 */
export interface Trigger {
  id: string;
  label: string;
  /** Keywords the intent engine matches on. */
  keywords: string[];
  /** What we actually say when they raise it. */
  response: string;
  goesTo: ServiceSlug;
}

export const triggers: Trigger[] = [
  {
    id: 'power-bill',
    label: 'Electricity bill has gone up',
    keywords: [
      'bill',
      'bills',
      'tariff',
      'cost',
      'costs',
      'increase',
      'increased',
      'rising',
      'rose',
      'prices',
      'charges',
      'demand charge',
      'energy cost',
      'running cost',
      'operating cost',
    ],
    response:
      'Energy costs can reflect several factors, including consumption patterns, tariff structure and demand. Available bills and meter data can help identify questions for a closer review; the right next step depends on the site.',
    goesTo: 'consulting',
  },
  {
    id: 'esg',
    label: 'ESG or green-building reporting',
    keywords: [
      'esg',
      'sustainability',
      'sustainable',
      'carbon',
      'emission',
      'emissions',
      'co2',
      'scope 2',
      'csrd',
      'green building',
      'certification',
      'compliance',
      'rating',
      'reporting',
      'disclosure',
      'disclosures',
      'obligations',
      'regulatory',
      'greenwashing',
    ],
    response:
      'If reporting is part of the objective, identify the required metrics, data sources, calculation method and review process. Software or monitoring options depend on the systems and information available.',
    goesTo: 'software-iot',
  },
  {
    id: 'fleet',
    label: 'Electrifying a fleet',
    keywords: [
      'fleet',
      'vehicles',
      'vehicle',
      'electric vehicle',
      'ev',
      'evs',
      'truck',
      'trucks',
      'delivery',
      'logistics',
      'last mile',
      'electrify',
      'diesel',
      'commercial vehicle',
    ],
    response:
      'Charging plans should consider vehicle routes, dwell time, charging windows, site layout and available electrical capacity. A technical review is needed to confirm whether upgrades or managed charging should be considered.',
    goesTo: 'ev-charging',
  },
  {
    id: 'outage',
    label: 'Outage or backup risk',
    keywords: [
      'outage',
      'outages',
      'power cut',
      'backup',
      'continuity',
      'uptime',
      'reliability',
      'downtime',
      'critical load',
      'uninterruptible',
    ],
    response:
      'For continuity requirements, identify the loads that need support, the required operating duration and existing backup systems. Storage is one option to assess; suitability and performance depend on project-specific engineering.',
    goesTo: 'battery',
  },
  {
    id: 'new-site',
    label: 'New site or expansion',
    keywords: [
      'new site',
      'new plant',
      'new facility',
      'expansion',
      'greenfield',
      'green field',
      'commissioning',
      'fit out',
      'fitout',
      'opening',
      'lease',
      'taking on a new',
    ],
    response:
      'A new site or expansion can be a useful time to review energy needs, space, electrical supply and future operating plans. The appropriate scope depends on the project stage and available design information.',
    goesTo: 'consulting',
  },
  {
    id: 'roi',
    label: 'Payback and return',
    keywords: [
      'payback',
      'roi',
      'return on investment',
      'roi',
      'worth it',
      'cost benefit',
      'break even',
      'break-even',
      'savings',
      'how long',
      'payback period',
      'viable',
      'feasible',
    ],
    response:
      'Financial outcomes depend on project costs, tariffs, operating patterns, equipment and assumptions. Any estimate should be based on relevant site data and clearly state its limitations; no general payback period can be promised.',
    goesTo: 'consulting',
  },
];

/** Capacity figures we recognise out of free-text, so we can ask the right follow-up. */
export const CAPACITY_UNITS: Record<string, number> = {
  kw: 1,
  kwp: 1,
  kilowatt: 1,
  megawatts: 1000,
  mw: 1000,
  giga: 1000,
};