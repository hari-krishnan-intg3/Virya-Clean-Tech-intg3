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
    proof: 'Phased commissioning plans, installation outside production windows.',
    goesTo: 'solar',
  },
  {
    role: 'CFO / Finance Director',
    mandate: 'Capital allocation with a defensible payback period.',
    objection: '"Every EPC quotes a different payback. I cannot trust any of them."',
    proof: 'Modelled payback with stated sensitivity, on your actual interval data.',
    goesTo: 'consulting',
  },
  {
    role: 'Sustainability / ESG Lead',
    mandate: 'Scope 2 emissions and green-building credentials.',
    objection: '"The data has to be auditable, not a vendor dashboard."',
    proof: 'Reporting packs with an audit trail, exportable in the formats auditors ask for.',
    goesTo: 'software-iot',
  },
  {
    role: 'Real Estate Head',
    mandate: 'Asset value, green certification and tenant energy costs.',
    objection: '"Will this add value to the building, or just add maintenance?"',
    proof: 'Capacity modelling across the asset, phased so each block pays for itself.',
    goesTo: 'solar',
  },
  {
    role: 'Fleet / Mobility Manager',
    mandate: 'Vehicle uptime and diesel-to-electric total cost.',
    objection: '"Can my sanctioned load even take the chargers?"',
    proof: 'A load study that settles the transformer question before you spend anything.',
    goesTo: 'ev-charging',
  },
];

/** What makes a visitor worth a conversation, ranked. */
export const qualificationSignals: string[] = [
  'Annual consumption above roughly 5 lakh units',
  'A roof over 5,000 sq ft, or a sanctioned load above 250 kW',
  'A facility that cannot absorb an unplanned outage',
  'A fleet of ten or more vehicles, or a plan to electrify one',
  'An ESG or green-building target with a reporting deadline attached',
  'A new facility, lease or expansion in the next 12 months',
];

/** What tells us this is not a fit. Said plainly, on the site, on purpose. */
export const disqualifiers: string[] = [
  'Residential homes below 5 kW — we will refer you to the PM Surya Ghar scheme instead',
  'Enquiries that only want the lowest headline price per watt',
  'Sites with no usable roof area, yard or grid headroom',
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
      'On most commercial and industrial tariffs in India the bill is dominated by the demand charge rather than the per-unit energy rate. That means the first move is usually not "buy solar" — it is to read twelve months of interval data and find which peaks are worth removing. We start there because it is free and it changes the answer.',
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
      'Reporting obligations are usually the reason a project gets funded, not the reason it works. We build the measurement layer so your scope 2 numbers come from interval data you can hand to an auditor, rather than from a vendor dashboard nobody outside the company trusts.',
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
      'Fleet electrification fails on power, not on vehicles. The order that works is: measure the interval load, establish what headroom the connection actually has, then size the charger mix to your dwell time. Get that order wrong and you will pay for a transformer you did not need.',
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
      'If a grid interruption stops your operation, storage is usually the answer rather than more generation. The design question is what the critical load actually is, in kW, and how long it has to hold — that sets everything else. Most sites are far smaller than they assume, which makes this cheaper than expected.',
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
      'A new site is the cheapest moment to do any of this, because energy design costs almost nothing to include before the plant is built and a great deal to retrofit afterwards. If you are still in design, this conversation is worth ten minutes.',
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
      'Payback is entirely a function of your tariff structure, your load shape and what you are comparing against. We will give you a number — but it needs twelve months of interval data to be a real one rather than a rule of thumb.',
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