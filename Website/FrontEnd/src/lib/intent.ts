/**
 * The intent engine.
 *
 * A deterministic, explainable matcher: no external model, no API key, no
 * per-token cost, and it never invents facts. It works by scoring a visitor's
 * free text against a set of declared intents, using keyword overlap,
 * multi-word phrase patterns and page context, then composing a reply from
 * the service and trigger content in `src/data`.
 *
 * Why rule-based rather than an LLM:
 *  - every answer on this site is a commercial claim, and a claim should have
 *    an owner in the repo;
 *  - it works offline and in every market with no latency;
 *  - it degrades into a useful "here are the options" instead of confabulating.
 */

import { getService, industries, services, type ServiceSlug } from '@/data/services';
import { triggers } from '@/data/qualification';
import { buildGreeting } from './time';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface Chip {
  label: string;
  /** Free text sent back to the engine when clicked. */
  prompt?: string;
  /** Client-side navigation. */
  to?: string;
}

export interface BotContext {
  /** Current route. */
  path: string;
  /** Slug of the service page the visitor is on, if any. */
  activeService?: ServiceSlug;
  /** Every service page they have opened this session. */
  seenServices: ServiceSlug[];
  /** They have already opened the chatbot. */
  greeted: boolean;
  /** They have expressed intent to talk to someone. */
  leadInterest: boolean;
  /** Service the visitor has spent most time looking at, if any. */
  primaryInterestHint?: ServiceSlug;
  /** Heading of the section/card currently in view. */
  sectionTitle?: string;
  /** Short visible copy from that section/card. */
  sectionSummary?: string;
}

export interface Reply {
  text: string;
  chips: Chip[];
  service?: ServiceSlug;
  confidence: number;
  /** Confidence below this means we should not pretend we understood. */
  uncertain: boolean;
  /** Ask for a human rather than continue. */
  escalate: boolean;
  /** Entities we noticed and should confirm back. */
  noted: string[];
}

export interface ExtractedEntities {
  /** e.g. [{ value: 500, unit: 'kW', raw: '500 kW' }] */
  capacity: { value: number; unit: string; raw: string }[];
  location: string | null;
  timeline: string | null;
  /** True when the visitor is asking about cost. */
  priceSensitive: boolean;
}

/* ------------------------------------------------------------------ */
/* Normalisation                                                       */
/* ------------------------------------------------------------------ */

const FILLER = /\b(please|could you|can you|i want to|i need to|i would like|do you|would you|tell me about|help me with|any idea|quick question|hi|hello|hey)\b/g;

export function normalise(input: string): string {
  return input
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9\s'-+/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Strips the conversational padding so keywords are not diluted. */
export function stripFiller(input: string): string {
  return normalise(input).replace(FILLER, ' ').replace(/\s+/g, ' ').trim();
}

export function tokens(input: string): string[] {
  const cleaned = stripFiller(input);
  return cleaned.length ? cleaned.split(' ') : [];
}

function bigrams(list: string[]): string[] {
  return list.slice(0, -1).map((word, i) => `${word} ${list[i + 1]}`);
}

/* ------------------------------------------------------------------ */
/* Entity extraction                                                   */
/* ------------------------------------------------------------------ */

const CAPACITY_RE = /(\d+(?:\.\d+)?)\s*(kwp?|kilo\s?watts?|mw|mega\s?watts?|kwh|mega\s?watt\s?hours?)\b/gi;

const CITIES = [
  'bengaluru',
  'bangalore',
  'mysuru',
  'mysore',
  'hyderabad',
  'chennai',
  'pune',
  'mumbai',
  'delhi',
  'gurgaon',
  'noida',
  'kolkata',
  'ahmedabad',
  'surat',
  'jaipur',
  'kochi',
  'coimbatore',
  'madurai',
  'trichy',
  'hubballi',
  'belagavi',
  'vizag',
  'visakhapatnam',
  'nagpur',
  'indore',
  'bhopal',
  'patna',
  'lucknow',
  'chandigarh',
  'goa',
  'raipur',
  'guwahati',
  'thiruvananthapuram',
  'trivandrum',
  'karnataka',
  'kerala',
  'tamil nadu',
  'maharashtra',
  'telangana',
  'andhra pradesh',
];

const TIMELINE_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\b(asap|immediately|urgent|urgently|right now|immediately)\b/, label: 'urgent' },
  { re: /\b(this month|by the end of this month)\b/, label: 'this month' },
  { re: /\b(next month|coming month)\b/, label: 'next month' },
  { re: /\b(this quarter|next quarter|q[1-4])\b/, label: 'this quarter' },
  { re: /\b(within \d+\s*(?:days?|weeks?|months?))\b/, label: 'a fixed deadline' },
  { re: /\b(next year|next financial year|fy ?2[6-9])\b/, label: 'next financial year' },
  { re: /\b(explor|exploring|evaluating|just looking|early stages)\b/, label: 'exploring' },
];

export function extract(input: string): ExtractedEntities {
  const text = normalise(input);
  const capacity: ExtractedEntities['capacity'] = [];

  for (const match of text.matchAll(CAPACITY_RE)) {
    const value = Number(match[1]);
    if (Number.isFinite(value)) {
      capacity.push({ value, unit: match[2].replace(/\s+/g, ''), raw: match[0] });
    }
  }

  const location =
    CITIES.find((city) => new RegExp(`\\b${city}\\b`).test(text)) ??
    (/\bin ([a-z]{3,})/.exec(text)?.[1] ?? null);

  const timeline =
    TIMELINE_PATTERNS.find((p) => p.re.test(text))?.label ??
    (/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/.test(
      text,
    )
      ? 'a named month'
      : null);

  const priceSensitive = /\b(cost|costs|price|pricing|quote|budget|payback|roi|expensive|rate|rates|charge|charges|how much)\b/.test(
    text,
  );

  return { capacity, location: location ? titleCase(location) : null, timeline, priceSensitive };
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ------------------------------------------------------------------ */
/* Intent definitions                                                  */
/* ------------------------------------------------------------------ */

interface Intent {
  id: string;
  /** Keyword hits. Longer keywords score higher — "demand charge" beats "charge". */
  keywords: string[];
  /** Phrase patterns. A match is a strong signal. */
  patterns?: RegExp[];
  service?: ServiceSlug;
  triggerId?: string;
  /** Answer builder. */
  answer: (ctx: AnswerContext) => string;
  /** Follow-up chips. */
  chips: (ctx: AnswerContext) => Chip[];
  weight?: number;
  /**
   * Skip this intent entirely when the message is longer than this. Stops a
   * long, substantive message from being swallowed by "hello" → greeting.
   */
  maxWords?: number;
}

interface AnswerContext {
  entities: ExtractedEntities;
  input: string;
  bot: BotContext;
  /** Deep link to the service this answer is about. */
  service?: ServiceSlug;
}

const SERVICE_KEYWORDS: Record<ServiceSlug, string[]> = {
  solar: [
    'solar',
    'solar panel',
    'solar panels',
    'photovoltaic',
    'pv',
    'rooftop',
    'roof top',
    'solar plant',
    'solar power',
    'solar installation',
    'solar system',
    'sunlight',
    'module',
    'inverter',
    'net metering',
    'netmetering',
    'capacity',
  ],
  'ev-charging': [
    'ev',
    'ev charging',
    'charger',
    'chargers',
    'charging',
    'charging station',
    'charging point',
    'fast charger',
    'electric vehicle',
    'electric vehicles',
    'electric car',
    'evse',
    'ac charger',
    'dc charger',
    'charge point',
    'bus',
    'buses',
    'electric bus',
    'bike',
    'bikes',
    'scooter',
    'scooters',
    'two wheeler',
    'two-wheeler',
    'car',
    'cars',
    'van',
    'vans',
  ],
  battery: [
    'battery',
    'batteries',
    'storage',
    'energy storage',
    'bess',
    'backup',
    'peak shaving',
    'demand peak',
    'load shifting',
    'lfp',
    'nmc',
    'power cut',
    'power outage',
  ],
  'software-iot': [
    'iot',
    'software',
    'monitoring',
    'dashboard',
    'telemetry',
    'scada',
    'analytics',
    'real time',
    'realtime',
    'predictive maintenance',
    'energy management system',
    'reporting',
    'carbon reporting',
    'modbus',
    'mqtt',
  ],
  consulting: [
    'audit',
    'energy audit',
    'consulting',
    'consultant',
    'feasibility',
    'feasibility study',
    'assessment',
    'study',
    'evaluation',
    'payback',
    'roi',
    'analysis',
    'second opinion',
    'tariff',
  ],
};

const EV_VEHICLE_GUIDANCE = [
  {
    keywords: ['bus', 'buses', 'electric bus'],
    title: 'Electric buses',
    description:
      'Review route distance, return times, layovers and departure schedules. Depot layout, available connection capacity and whether charging can be staged between trips shape the assessment.',
  },
  {
    keywords: ['bike', 'bikes', 'scooter', 'scooters', 'two wheeler', 'two-wheeler'],
    title: 'Bikes and two-wheelers',
    description:
      'Consider secure parking, charging frequency, shared circuits and user access. Fleet turnaround and the available electrical supply matter when many vehicles return to a site together.',
  },
  {
    keywords: ['car', 'cars', 'workplace charging', 'customer parking'],
    title: 'Cars and workplace charging',
    description:
      'Compare employee, visitor and customer parking patterns, typical dwell time, access requirements and simultaneous use. Those factors help frame charger quantities and the operating model.',
  },
  {
    keywords: ['fleet', 'fleets', 'van', 'vans', 'truck', 'trucks', 'delivery vehicles'],
    title: 'Commercial and fleet vehicles',
    description:
      'Review vehicle mix, routes, daily distance, loading activity and depot return times. Charging windows and existing electrical capacity influence how a fleet plan can be staged.',
  },
];

const META_KEYWORDS: Record<string, string[]> = {
  greeting: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste', 'howdy'],
  thanks: ['thanks', 'thank you', 'thx', 'cheers', 'appreciate it', 'great thanks'],
  bye: ['bye', 'goodbye', 'see you', 'that is all', 'thats all', 'nothing else'],
  contact: [
    'phone number',
    'call you',
    'email you',
    'address',
    'where are you',
    'where are you located',
    'location',
    'office',
    'contact',
    'reach you',
    'get in touch',
  ],
  booking: ['book', 'booking', 'schedule', 'appointment', 'meeting', 'slot', 'call back', 'callback', 'speak to someone'],
  human: ['human', 'person', 'someone', 'talk to a human', 'speak to a person', 'agent', 'representative'],
  pricing: [
    'cost',
    'costs',
    'price',
    'pricing',
    'quote',
    'quotation',
    'budget',
    'rate',
    'rates',
    'how much',
    'charge',
    'charges',
    'expensive',
    'cheap',
    'cheapest',
  ],
  capability: ['what do you do', 'what do you offer', 'services', 'capabilities', 'what can you help', 'who are you', 'about you'],
  experience: [
    'experience',
    'how long',
    'how many years',
    'projects',
    'clients',
    'track record',
    'certified',
    'certification',
    'accredited',
    'reference',
    'case study',
  ],
  process: [
    'process',
    'how do you work',
    'how does it work',
    'what happens',
    'steps',
    'stage',
    'stages',
    'approach',
    'methodology',
    'engagement',
    'workflow',
    'timeline',
    'how long does it take',
  ],
  more: [
    'more',
    'more info',
    'more information',
    'tell me more',
    'explain',
    'elaborate',
    'details',
    'what is this',
    'what does it involve',
    'go on',
    'anything else',
  ],
};

/**
 * Industry vocabulary. These are the words a real prospect uses before they
 * ever say "solar", so matching them is what makes the assistant sound like
 * it has read the industries page.
 *
 * Plurals are listed explicitly — a rule-based matcher does no stemming, and
 * "hotels" failing to match "hotel" is exactly the kind of miss that makes
 * an assistant feel broken.
 */
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  manufacturing: [
    'manufacturing',
    'factory',
    'factories',
    'plant',
    'plants',
    'production',
    'shop floor',
    'assembly line',
    'industrial',
    'manufacturer',
  ],
  warehousing: [
    'warehouse',
    'warehouses',
    'warehousing',
    'cold storage',
    'cold store',
    'cold chain',
    'refrigerated',
    'refrigeration',
    'distribution centre',
    'distribution center',
    'logistics park',
    'godown',
  ],
  'fleet-logistics': [
    'fleet',
    'fleets',
    'logistics',
    'last mile',
    'delivery',
    'depots',
    'depot',
    'transport',
    'courier',
    'truck',
    'trucks',
    'goods',
  ],
  'real-estate': [
    'real estate',
    'builder',
    'builders',
    'developer',
    'developers',
    'reit',
    'reits',
    'leased',
    'tenant',
    'tenants',
    'office building',
    'residential society',
    'gated community',
    'apartment',
    'apartments',
    'mall',
    'malls',
  ],
  hospitals: [
    'hospital',
    'hospitals',
    'clinic',
    'clinics',
    'diagnostic',
    'diagnostics',
    'healthcare',
    'lab',
    'labs',
    'nursing home',
  ],
  hotels: [
    'hotel',
    'hotels',
    'resort',
    'resorts',
    'hostel',
    'hospitality',
    'guest',
    'guests',
    'room',
  ],
  retail: ['retail', 'mall', 'malls', 'store', 'stores', 'showroom', 'supermarket', 'shopping'],
  education: [
    'school',
    'schools',
    'college',
    'colleges',
    'university',
    'universities',
    'campus',
    'campuses',
    'education',
    'institute',
    'institutes',
    'academy',
  ],
};

const BOOK_CHIP: Chip = {
  label: 'Request a consultation',
  prompt: 'book',
};

const CONTACT_CHIP: Chip = { label: 'How do I reach you?', prompt: 'contact' };

function serviceChips(slug: ServiceSlug): Chip[] {
  const service = getService(slug);
  if (!service) return [];
  return service.capabilities.slice(0, 3).map((capability) => ({
    label: capability,
    prompt: `tell me about ${capability.toLowerCase()}`,
  }));
}

function consultChip(): Chip {
  return { label: 'Request a consultation', to: '/request-consultation' };
}

/* ------------------------------------------------------------------ */
/* Matching                                                            */
/* ------------------------------------------------------------------ */

const HIGH_CONFIDENCE = 3.5;
const LOW_CONFIDENCE = 1.2;

function scoreIntent(intent: Intent, input: string, context: BotContext): number {
  const raw = normalise(input);
  const stripped = stripFiller(input);
  const wordList = raw.split(' ').filter(Boolean);
  const pairs = bigrams(wordList);

  let score = 0;

  for (const keyword of intent.keywords) {
    const phrase = normalise(keyword);

    if (phrase.includes(' ')) {
      // Multi-word phrases must match contiguously.
      if (stripped.includes(phrase) || raw.includes(phrase)) score += 1.6 + phrase.length / 12;
    } else if (wordList.includes(phrase)) {
      // Single words score by specificity: "solar" is worth more than "ev".
      score += 1 + Math.min(phrase.length, 10) / 20;
    }
  }

  // Contiguous bigrams the intent does not already cover.
  for (const pair of pairs) {
    if (intent.keywords.some((k) => normalise(k) === pair)) score += 0.6;
  }

  for (const pattern of intent.patterns ?? []) {
    if (pattern.test(stripped) || pattern.test(raw)) score += 2.4;
  }

  // Page context. Being on /services/solar and asking "tell me more" should
  // resolve to solar, not to whichever keyword happens to be longest.
  if (intent.service && intent.service === context.activeService) score *= 1.45;

  return score * (intent.weight ?? 1);
}

function buildIntents(): Intent[] {
  const serviceIntents: Intent[] = services.map((service) => ({
    id: `service:${service.slug}`,
    keywords: SERVICE_KEYWORDS[service.slug],
    service: service.slug,
    answer: ({ entities, input }) => {
      const normalizedInput = normalise(input);
      const vehicleUse = service.slug === 'ev-charging'
        ? EV_VEHICLE_GUIDANCE.find((item) =>
            item.keywords.some((keyword) => {
              const term = normalise(keyword);
              return ` ${normalizedInput} `.includes(` ${term} `);
            }),
          )
        : undefined;
      const lead = vehicleUse
        ? [
            `${service.title}: ${vehicleUse.title}.`,
            '',
            vehicleUse.description,
            '',
            'The assessment should also consider site layout, available electrical capacity, charging windows and operating responsibilities before equipment is specified.',
          ]
        : [
            `${service.title}. ${service.tagline}`,
            '',
            service.summary.split(/(?<=\.)\s/)[0],
            '',
            `Typically ${service.scale}, and ${service.timeline.toLowerCase()} from signed scope.`,
          ];

      if (entities.capacity.length) {
        lead.push(
          '',
          `You mentioned ${entities.capacity.map((c) => c.raw).join(' and ')} — that is a useful starting point, and we would want to see the interval load before saying anything definite about it.`,
        );
      }
      if (entities.location) {
        lead.push(`We work in ${entities.location} and across India.`);
      }

      return lead.join('\n');
    },
    chips: ({ entities }) => {
      const chips = serviceChips(service.slug);
      if (entities.priceSensitive) chips.unshift({ label: 'What does it cost?', prompt: 'pricing' });
      if (entities.capacity.length) {
        chips.unshift({ label: 'Book a feasibility call', to: '/request-consultation' });
      }
      return [...chips, consultChip(), CONTACT_CHIP];
    },
  }));

  const triggerIntents: Intent[] = triggers.map((trigger) => ({
    id: `trigger:${trigger.id}`,
    keywords: trigger.keywords,
    triggerId: trigger.id,
    service: trigger.goesTo,
    // Triggers carry the commercial judgement and a written answer, so they
    // outrank a generic service page when the wording is ambiguous.
    weight: 1.3,
    answer: () => trigger.response,
    chips: () => [
      ...serviceChips(trigger.goesTo).slice(0, 2),
      { label: 'Book a feasibility call', to: '/request-consultation' },
      BOOK_CHIP,
    ],
  }));

  const industryIntents: Intent[] = industries.map((industry) => ({
    id: `industry:${industry.slug}`,
    keywords: INDUSTRY_KEYWORDS[industry.slug] ?? [industry.label.toLowerCase()],
    service: industry.entryService,
    answer: () => {
      const service = getService(industry.entryService);
      return [
        `${industry.label} — yes, that is squarely what we do.`,
        '',
        industry.pressure,
        '',
        `Most ${industry.label.toLowerCase()} sites start with ${service?.label.toLowerCase() ?? 'an audit'}, and the signals we look for are ${industry.signals
          .map((s) => s.toLowerCase())
          .join(', ')}.`,
      ].join('\n');
    },
    chips: () => [
      {
        label: `About ${getService(industry.entryService)?.label ?? 'this'}`,
        to: `/services/${industry.entryService}`,
      },
      { label: 'How we work', prompt: 'how do you work' },
      { label: 'Is my site a fit?', prompt: 'what makes a good fit' },
      BOOK_CHIP,
    ],
  }));

  const metaIntents: Intent[] = [
    {
      id: 'meta:more',
      // Only meaningful when the visitor is already on a service page.
      keywords: META_KEYWORDS.more,
      patterns: [/^(tell me more|more|explain|go on)\b/i],
      service: undefined,
      answer: ({ bot }) => {
        if (bot.sectionTitle && bot.sectionSummary) {
          return [
            `${bot.sectionTitle}.`,
            '',
            bot.sectionSummary,
            '',
            bot.activeService
              ? `This is part of the ${getService(bot.activeService)?.label ?? 'service'} discussion. Site suitability and deliverables depend on the agreed scope.`
              : 'The section is a starting point; the right next step depends on your facility and project requirements.',
          ].join('\n');
        }

        const service = bot.activeService ? getService(bot.activeService) : undefined;
        if (service) {
          return [
            `${service.title}.`,
            '',
            service.summary,
            '',
            `Typically ${service.scale}, ${service.timeline.toLowerCase()} from signed scope.`,
            '',
            `Best suited to: ${service.bestFor.slice(0, 2).join('; ').toLowerCase()}.`,
          ].join('\n');
        }
        return 'Tell me which area you mean — solar, EV charging, storage, monitoring or an audit — and I will go into it properly.';
      },
      chips: ({ bot }) => {
        if (!bot.activeService) return fallbackChips(bot);
        return [...serviceChips(bot.activeService).slice(0, 3), consultChip()];
      },
      weight: 1.5,
    },
    {
      id: 'meta:section-context',
      keywords: ['this section', 'this card', 'this page', 'this part', 'this area'],
      patterns: [
        /\bwhat am i (?:looking at|viewing)\b/i,
        /\bwhat does (?:this|that) (?:mean|cover|include)\b/i,
        /\bexplain (?:this|that) (?:section|card|part|area)\b/i,
      ],
      answer: ({ bot }) =>
        bot.sectionTitle && bot.sectionSummary
          ? `${bot.sectionTitle}\n\n${bot.sectionSummary}\n\nI can help connect this to your site, operating needs or next steps.`
          : `I can help with ${getService(bot.activeService ?? 'solar')?.label ?? 'the current topic'}, but I need to know which part you mean. Tell me the heading or question you have in mind.`,
      chips: ({ bot }) => contextualChips(bot),
      weight: 1.45,
    },
    {
      id: 'meta:process',
      keywords: META_KEYWORDS.process,
      answer: () =>
        [
          'Four stages, and the first one is free:',
          '',
          '1. Discovery — conversation, NDA, and twelve months of interval data.',
          '2. Design — load analysis, survey, modelling, and a written payback with sensitivity.',
          '3. Installation — build, commissioning, and DISCOM approval started during design, not after.',
          '4. Monitoring — handed over with the system. You keep the alerting and the data.',
          '',
          'The stage that usually saves money is the first one. An audit frequently changes the scope of everything after it.',
        ].join('\n'),
      chips: () => [
        { label: 'See the full process', to: '/process' },
        { label: 'Request a consultation', to: '/request-consultation' },
        { label: 'What does an audit produce?', prompt: 'How does an engagement usually start' },
      ],
      weight: 1.3,
    },
    {
      id: 'meta:greeting',
      keywords: META_KEYWORDS.greeting,
      patterns: [/^\s*(hi|hello|hey|good\s+(morning|afternoon|evening|night))\b/i],
      answer: ({ bot }) => {
        const greeting = buildGreeting({
          path: bot.path,
          service: bot.activeService ? getService(bot.activeService)?.label : undefined,
        });
        return `${greeting.line}\n\n${greeting.lead}`;
      },
      chips: ({ bot }) => {
        const focused = contextualChips(bot);
        if (focused.length) return [...focused, BOOK_CHIP];
        if (bot.activeService) return [...serviceChips(bot.activeService).slice(0, 3), BOOK_CHIP, CONTACT_CHIP];
        return services.slice(0, 3).map((s) => ({ label: s.label, prompt: s.label })) as Chip[];
      },
      weight: 1.6,
      // "hi" greets. "hello, I am the CFO at a plant in Pune with a rising
      // bill" must not be answered with a greeting — it has a real question
      // in it, so the greeting intent steps aside.
      maxWords: 5,
    },
    {
      id: 'meta:thanks',
      keywords: META_KEYWORDS.thanks,
      answer: () =>
        'Glad it was useful. If you want this taken further, the fastest route is a 30-minute consultation — we will look at your interval data and tell you whether the numbers work.',
      chips: () => [BOOK_CHIP, { label: 'One more question', prompt: 'what else can you tell me' }],
      weight: 1.4,
    },
    {
      id: 'meta:bye',
      keywords: META_KEYWORDS.bye,
      answer: () => 'Good to meet you. This page will keep your session open, so come back to it any time.',
      chips: () => [BOOK_CHIP],
      weight: 1.4,
    },
    {
      id: 'meta:contact',
      keywords: META_KEYWORDS.contact,
      patterns: [/\bwhere\b.*\b(are|based|located)\b/i],
      answer: () =>
        'We are at No 2, 1st Floor, No 113, Yogjam Sai Charan Layout, Bengaluru, Karnataka 560036.\n\nPhone: +91 8317494969\nEmail: connect@viryacleantech.com\n\nOpen Monday to Saturday, 10:00 to 19:00 IST.',
      chips: () => [BOOK_CHIP, { label: 'See on the map', to: '/contact' }],
      weight: 1.2,
    },
    {
      id: 'meta:booking',
      keywords: META_KEYWORDS.booking,
      answer: () => {
        const greeting = buildGreeting();
        const route = greeting.officeClosed
          ? 'The team is offline right now, so the surest route is the form — you will get a call back at the start of the next working window.'
          : 'The team is online right now. You can either book a slot directly or send your details and someone will call you.';
        return `${route}\n\nBoth land in the same place: a Jira ticket assigned to a human, with your requirements attached.`;
      },
      chips: () => [
        { label: 'Open the booking form', to: '/request-consultation' },
        { label: 'Book a calendar slot', to: '/contact#slots' },
        CONTACT_CHIP,
      ],
      weight: 1.3,
    },
    {
      id: 'meta:human',
      keywords: META_KEYWORDS.human,
      answer: () =>
        'Of course. The form creates a ticket with a human owner and your requirements attached, and it lands in our queue immediately rather than waiting for the next morning digest.',
      chips: () => [
        { label: 'Open the booking form', to: '/request-consultation' },
        { label: 'Or call +91 8317494969', to: '/contact' },
      ],
      weight: 1.5,
    },
    {
      id: 'meta:pricing',
      keywords: META_KEYWORDS.pricing,
      patterns: [/\bhow much\b/i, /\bwhat (?:does|will) it cost\b/i],
      answer: ({ entities }) => {
        const lines = [
          'We quote on delivered cost after a survey, not per watt off a rate card. That is deliberate — it is the only basis on which two proposals are comparable.',
          '',
          'What changes the number: the capacity you actually need, whether there is structural or civil work, whether a transformer or new connection is involved, and how much of the scope you want us to carry.',
        ];
        if (entities.capacity.length) {
          lines.push(
            '',
            `Since you mentioned ${entities.capacity.map((c) => c.raw).join(' and ')}, an audit against your interval data would give you a real figure rather than a rate-card guess.`,
          );
        } else {
          lines.push('', 'If you send us twelve months of half-hourly meter data, the audit turns that into an actual number in about two weeks.');
        }
        return lines.join('\n');
      },
      chips: ({ entities }) => [
        ...(entities.capacity.length ? [] : [{ label: 'How do audits work?', prompt: 'How does an engagement usually start' }]),
        { label: 'Request a consultation', to: '/request-consultation' },
        BOOK_CHIP,
      ],
      weight: 0.95,
    },
    {
      id: 'meta:capability',
      keywords: META_KEYWORDS.capability,
      answer: () =>
        [
          'Five capabilities, and most engagements use two of them together:',
          '',
          ...services.map((s) => `• ${s.title} — ${s.tagline}`),
          '',
          'The order matters more than the choice. If you are starting from a rising bill, an audit comes first; if you already know you need capacity, we skip straight to design.',
        ].join('\n'),
      chips: () => services.map((s) => ({ label: s.label, prompt: s.label })),
      weight: 1.2,
    },
    {
      id: 'meta:experience',
      keywords: META_KEYWORDS.experience,
      answer: () =>
        'We would rather tell you what we will not claim than what we will. We do not publish project counts or client logos we cannot evidence, and we will not name reference clients without their written consent.\n\nWhat we will give you instead, on a call: the technical lead who would run your project, a realistic timeline including the DISCOM approvals that slip most programmes, and an honest view of whether you need us at all.',
      chips: () => [BOOK_CHIP, { label: 'What do you actually do?', prompt: 'what do you do' }],
      weight: 1.2,
    },
  ];

  return [...serviceIntents, ...triggerIntents, ...industryIntents, ...metaIntents];
}

let INTENTS: Intent[] | null = null;

function intents(): Intent[] {
  if (!INTENTS) INTENTS = buildIntents();
  return INTENTS;
}

/* ------------------------------------------------------------------ */
/* Chips                                                               */
/* ------------------------------------------------------------------ */

/**
 * Collapses chips to their labels, preserving order and capping the count.
 * Two intents can easily both offer "Request a consultation"; showing it
 * twice reads as a bug.
 */
function dedupe(chips: Chip[], limit = 5): Chip[] {
  const seen = new Set<string>();
  const out: Chip[] = [];

  for (const chip of chips) {
    const key = chip.label.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(chip);
    if (out.length >= limit) break;
  }

  return out;
}

/* ------------------------------------------------------------------ */
/* Fallbacks                                                           */
/* ------------------------------------------------------------------ */

function fallbackChips(context: BotContext): Chip[] {
  const focused = contextualChips(context);
  if (focused.length) return [...focused, BOOK_CHIP];

  if (context.activeService) {
    const service = getService(context.activeService);
    if (service) {
      return [
        ...service.capabilities.slice(0, 2).map((c) => ({ label: c, prompt: c.toLowerCase() })),
        { label: 'What does it cost?', prompt: 'pricing' },
        consultChip(),
      ];
    }
  }

  const seen = new Set(context.seenServices);
  const unseen = services.filter((s) => !seen.has(s.slug));
  const pool = (unseen.length ? unseen : services).slice(0, 3);

  return [...pool.map((s) => ({ label: s.label, prompt: s.label })), BOOK_CHIP];
}

function fallbackReply(input: string, context: BotContext): Reply {
  const entities = extract(input);

  const suggestions: string[] = [];
  if (entities.priceSensitive) suggestions.push('cost and payback');
  if (entities.capacity.length) suggestions.push(`capacity around ${entities.capacity[0].raw}`);
  if (entities.location) suggestions.push(`sites in ${entities.location}`);

  const opener = suggestions.length
    ? `I picked up ${suggestions.join(', ')} but I want to be straight with you rather than guess. I can give you a general answer on scope and process, but a number for your site needs your interval data and a conversation.`
    : 'I did not follow that one, and I would rather say so than make something up.';

  const active = context.activeService ? getService(context.activeService) : undefined;

  return {
    text: [
      opener,
      '',
      active
        ? `Since you are on the ${active.label} page, here is what I can cover:`
        : 'Here is what I can cover:',
      ...services.slice(0, 4).map((s) => `• ${s.title}`),
      '',
      'Pick one, or ask about cost, timelines, or how to reach us.',
    ].join('\n'),
    chips: fallbackChips(context),
    service: context.activeService,
    confidence: 0,
    uncertain: true,
    escalate: false,
    noted: [],
  };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/** Resolves free text to a reply. Never throws. */
export function respond(input: string, context: BotContext): Reply {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      text: 'Ask me anything about solar, EV charging, storage, monitoring or audits.',
      chips: fallbackChips(context),
      confidence: 0,
      uncertain: true,
      escalate: false,
      noted: [],
    };
  }

  const entities = extract(trimmed);

  let best: { intent: Intent; score: number } | null = null;
  const wordCount = normalise(trimmed).split(' ').filter(Boolean).length;

  for (const intent of intents()) {
    if (intent.maxWords !== undefined && wordCount > intent.maxWords) continue;
    const score = scoreIntent(intent, trimmed, context);
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }

  if (!best || best.score < LOW_CONFIDENCE) return fallbackReply(trimmed, context);

  const { intent, score } = best;
  const answerContext: AnswerContext = { entities, input: trimmed, bot: context, service: intent.service };

  return {
    text: intent.answer(answerContext),
    chips: dedupe(intent.chips(answerContext)),
    service: intent.service,
    confidence: Math.min(1, score / (HIGH_CONFIDENCE * 1.6)),
    uncertain: score < HIGH_CONFIDENCE,
    escalate: false,
    noted: notedEntities(entities),
  };
}

function notedEntities(entities: ExtractedEntities): string[] {
  const notes: string[] = [];
  if (entities.capacity.length) notes.push(entities.capacity.map((c) => c.raw).join(', '));
  if (entities.location) notes.push(entities.location);
  if (entities.timeline) notes.push(entities.timeline);
  return notes;
}

/** Chips shown on first open — biased toward what the visitor is looking at. */
export function openingChips(context: BotContext): Chip[] {
  const focused = contextualChips(context);
  if (focused.length) return [...focused, BOOK_CHIP];

  if (context.activeService) {
    const service = getService(context.activeService);
    if (service) {
      return [
        ...service.capabilities.slice(0, 3).map((c) => ({ label: c, prompt: c.toLowerCase() })),
        { label: 'What does it cost?', prompt: 'pricing' },
        BOOK_CHIP,
      ];
    }
  }

  const seen = new Set(context.seenServices);
  const ranked = [...services.filter((s) => !seen.has(s.slug)), ...services.filter((s) => seen.has(s.slug))];

  return [...ranked.slice(0, 4).map((s) => ({ label: s.label, prompt: s.label })), BOOK_CHIP];
}

/** Recommendations follow the visible section first, then the current route. */
function contextualChips(context: BotContext): Chip[] {
  const title = normalise(context.sectionTitle ?? '');
  const summary = normalise(context.sectionSummary ?? '');
  const visible = `${title} ${summary}`;

  if (/vehicle applications|charging plans for cars|cars and workplace|bikes and two wheelers|electric buses|commercial and fleet/.test(visible)) {
    return [
      { label: 'What should we review for bus charging?', prompt: 'How should we plan charging for electric buses?' },
      { label: 'What about bikes and scooters?', prompt: 'What should we consider for charging electric bikes and scooters?' },
      { label: 'How do we plan car charging?', prompt: 'What should we consider for workplace and customer car charging?' },
    ];
  }

  if (context.path === '/insights') {
    return [
      { label: 'How does this apply to my site?', prompt: 'How should I apply market figures to my facility?' },
      { label: 'What affects site feasibility?', prompt: 'What affects clean-energy feasibility at a site?' },
      { label: 'Explore related offerings', to: '/services' },
    ];
  }

  if (context.path === '/' && /explore a smarter energy future|make your next energy decision/.test(title)) {
    return [
      { label: 'What offerings are available?', prompt: 'What clean-energy offerings does Virya provide?' },
      { label: 'What should I prepare?', prompt: 'What information should I prepare for an assessment?' },
      { label: 'Help me choose a starting point', prompt: 'Which clean-energy offering should I explore for my site?' },
    ];
  }

  if (context.path === '/' && /practical energy decisions start|start with context|explore connected options|make scope clear/.test(visible)) {
    return [
      { label: 'How do you assess a facility?', prompt: 'What should be reviewed when assessing an energy project?' },
      { label: 'Which systems can connect?', prompt: 'How can solar, storage, charging and monitoring work together?' },
      { label: 'What does project scope include?', prompt: 'What should be clarified in a project scope?' },
    ];
  }

  if (context.path === '/' && /streamlined path|how we work|initial discussion|assessment scope/.test(visible)) {
    return [
      { label: 'What happens after discovery?', prompt: 'What happens after an initial project discussion?' },
      { label: 'What should I prepare first?', prompt: 'What information should I prepare before an assessment?' },
      { label: 'What affects timing?', prompt: 'What affects a clean-energy project timeline?' },
    ];
  }

  if (context.path === '/' && /operating environments|industries/.test(visible)) {
    return [
      { label: 'Explore factory requirements', prompt: 'What should a factory consider about energy?' },
      { label: 'Explore fleet charging', prompt: 'What should a fleet consider before planning EV charging?' },
      { label: 'View all industries', to: '/industries' },
    ];
  }

  if (context.path === '/' && /numbers behind the conversation|market context|why now/.test(visible)) {
    return [
      { label: 'How does this apply to my site?', prompt: 'How should I apply market figures to my facility?' },
      { label: 'What affects site feasibility?', prompt: 'What affects clean-energy feasibility at a site?' },
      { label: 'Explore offerings', to: '/services' },
    ];
  }

  const industry = industries.find((item) => {
    const variants = [item.label, item.slug.replace(/-/g, ' '), item.label.split(/[&/]/)[0]]
      .map(normalise)
      .filter((value) => value.length > 3);
    return variants.some((name) => title.includes(name) || summary.includes(name));
  });
  if (industry) {
    const service = getService(industry.entryService);
    return [
      { label: 'What matters for this site type?', prompt: `What should ${industry.label.toLowerCase()} consider about energy?` },
      { label: `Explore ${service?.label ?? 'solutions'}`, to: `/services/${industry.entryService}` },
      { label: 'What information should I prepare?', prompt: 'What site information should I prepare for an assessment?' },
    ];
  }

  const service = services.find((item) => {
    const variants = [item.title, item.label, item.slug.replace(/-/g, ' ')].map(normalise);
    return variants.some((name) => title.includes(name) || summary.includes(name));
  });
  if (service) {
    if (service.slug === 'ev-charging') {
      return [
        { label: 'What affects charging capacity?', prompt: 'What affects EV charging capacity at a site?' },
        { label: 'How should we plan for buses?', prompt: 'How should we plan charging for electric buses?' },
        { label: 'What details should I prepare?', prompt: 'What information should I prepare for an EV charging discussion?' },
      ];
    }
    return [
      { label: `What affects ${service.label.toLowerCase()} suitability?`, prompt: `What affects ${service.label.toLowerCase()} suitability at a site?` },
      { label: 'What information should I prepare?', prompt: 'What information should I prepare for an assessment?' },
      { label: `What can ${service.label.toLowerCase()} include?`, prompt: `What can a ${service.label.toLowerCase()} project include?` },
    ];
  }

  if (/prepare for a first discussion|initial assessment|what information/.test(visible)) {
    return [
      { label: 'What information should I prepare?', prompt: 'What information should I prepare for an initial assessment?' },
      { label: 'Can I start without energy bills?', prompt: 'Can I discuss my project before I have energy bills?' },
      { label: 'How is site suitability checked?', prompt: 'What affects whether a site is suitable?' },
    ];
  }

  if (/ecosystem|connected vision|technology ecosystem/.test(visible)) {
    return [
      { label: 'How can solar and storage work together?', prompt: 'How can solar and battery storage work together?' },
      { label: 'Can charging connect with storage?', prompt: 'How can EV charging and storage work together?' },
      { label: 'What can energy monitoring show?', prompt: 'What can energy monitoring show about a site?' },
    ];
  }

  if (/project assessment|before a proposal|project capabilities/.test(visible) || context.path === '/projects') {
    if (/facility and operations/.test(title)) {
      return [
        { label: 'What site details matter?', prompt: 'Which facility and operating details matter for a project review?' },
        { label: 'What information is useful?', prompt: 'What information should I prepare for an assessment?' },
        { label: 'How do I discuss this site?', to: '/request-consultation' },
      ];
    }
    if (/energy requirements/.test(title)) {
      return [
        { label: 'Can bills help assess the site?', prompt: 'How can energy bills help assess my site?' },
        { label: 'What if I have limited data?', prompt: 'Can I start an assessment without complete energy data?' },
        { label: 'What should I prepare?', prompt: 'What information should I prepare for an assessment?' },
      ];
    }
    if (/site conditions/.test(title)) {
      return [
        { label: 'What site constraints matter?', prompt: 'Which site conditions affect clean-energy feasibility?' },
        { label: 'Do approvals affect feasibility?', prompt: 'Which approvals or utility requirements should I consider?' },
        { label: 'Discuss a site review', to: '/request-consultation' },
      ];
    }
    return [
      { label: 'What does an assessment cover?', prompt: 'What does an initial project assessment cover?' },
      { label: 'What site information is useful?', prompt: 'What information should I prepare for an assessment?' },
      { label: 'How do I discuss a project?', to: '/request-consultation' },
    ];
  }

  if (/insight|market context|numbers behind/.test(visible) || context.path === '/insights') {
    return [
      { label: 'How does this apply to my site?', prompt: 'How should I apply these market figures to my facility?' },
      { label: 'What changes site feasibility?', prompt: 'What affects clean-energy feasibility at a site?' },
      { label: 'Explore the related solutions', to: '/services' },
    ];
  }

  if (/process|next steps|project journey/.test(visible) || context.path === '/process') {
    return [
      { label: 'What happens after the first discussion?', prompt: 'What happens after an initial project discussion?' },
      { label: 'What information should I prepare?', prompt: 'What information should I prepare before an assessment?' },
      { label: 'How long can a project take?', prompt: 'What affects a project timeline?' },
    ];
  }

  if (/about|virya cleantech|who we are/.test(visible) || context.path === '/about') {
    return [
      { label: 'What offerings are available?', prompt: 'What clean-energy offerings does Virya provide?' },
      { label: 'Who do you work with?', prompt: 'Which types of businesses and sites do you serve?' },
      { label: 'How do I start?', to: '/request-consultation' },
    ];
  }

  if (context.path === '/industries') {
    return [
      { label: 'Explore manufacturing needs', prompt: 'What should a factory consider about energy?' },
      { label: 'Explore fleet charging', prompt: 'What should a fleet consider before planning EV charging?' },
      { label: 'Find a relevant solution', to: '/services' },
    ];
  }

  if (context.path === '/faq') {
    if (/cost|price|pricing/.test(title)) {
      return [
        { label: 'What affects project cost?', prompt: 'What factors affect clean-energy project cost?' },
        { label: 'How should I compare proposals?', prompt: 'How can I compare project quotations fairly?' },
        { label: 'Discuss my project scope', to: '/request-consultation' },
      ];
    }
    if (/performance guarantee/.test(title)) {
      return [
        { label: 'How are outcomes measured?', prompt: 'How should project performance be measured?' },
        { label: 'What assumptions matter?', prompt: 'Which assumptions affect a project estimate?' },
        { label: 'Ask about my project', to: '/request-consultation' },
      ];
    }
    if (/support outside|where.*based|residential/.test(title)) {
      return [
        { label: 'Check service availability', prompt: 'Can Virya support a project at my location?' },
        { label: 'What details should I share?', prompt: 'What information should I include in my enquiry?' },
        { label: 'Discuss my enquiry', to: '/request-consultation' },
      ];
    }
    return [
      { label: 'Ask about project scope', prompt: 'What information should I prepare for an assessment?' },
      { label: 'Ask about services', prompt: 'What clean-energy offerings does Virya provide?' },
      { label: 'Discuss a specific site', to: '/request-consultation' },
    ];
  }

  if (context.path === '/contact') {
    return [
      { label: 'Book a consultation', to: '/request-consultation' },
      { label: 'What should I include?', prompt: 'What details should I include in my enquiry?' },
      CONTACT_CHIP,
    ];
  }

  if (context.path === '/careers') {
    return [
      { label: 'What roles are listed?', prompt: 'What roles are available at Virya?' },
      { label: 'How does the application work?', prompt: 'What should I expect in the application process?' },
      { label: 'Contact the hiring team', to: '/careers#apply' },
    ];
  }

  if (context.path === '/services') {
    return [
      { label: 'Help me choose an offering', prompt: 'Which clean-energy offering should I explore for my site?' },
      { label: 'What information is useful?', prompt: 'What information should I prepare for an assessment?' },
      { label: 'Compare EV charging options', prompt: 'What affects EV charging requirements at a business site?' },
    ];
  }

  if (context.path === '/' && /offerings|services|energy solutions/.test(visible)) {
    return [
      { label: 'Help me choose an offering', prompt: 'Which clean-energy offering should I explore for my site?' },
      { label: 'Ask about EV charging', prompt: 'What should I consider for EV charging at my site?' },
      { label: 'What information should I prepare?', prompt: 'What information should I prepare for an assessment?' },
    ];
  }

  if (context.activeService) {
    const service = getService(context.activeService);
    return service
      ? [
          { label: 'What affects site suitability?', prompt: `What affects ${service.label.toLowerCase()} suitability at a site?` },
          { label: 'What information should I prepare?', prompt: 'What information should I prepare for an assessment?' },
          { label: 'What can the project include?', prompt: `What can a ${service.label.toLowerCase()} project include?` },
        ]
      : [];
  }

  return [];
}

/** Closes a conversation when the visitor is clearly ready to act. */
export function handoverReply(reason: 'high-intent' | 'closing', context: BotContext): Reply {
  const service = context.primaryInterestHint
    ? getService(context.primaryInterestHint)
    : undefined;

  const text =
    reason === 'high-intent'
      ? `Based on what you have asked about, this looks like a ${service?.label ?? 'multi-service'} enquiry rather than a general question. The fastest way to get a real answer is thirty minutes with the technical lead.\n\nIt takes one form. Everything you have told me goes with it.`
      : `No problem. If anything comes up later, the form on this site reaches the same team — and your session context travels with it, so you will not have to repeat yourself.`;

  return {
    text,
    chips: [
      { label: 'Open the consultation form', to: '/request-consultation' },
      { label: 'Call +91 8317494969 instead', to: '/contact' },
    ],
    confidence: 1,
    uncertain: false,
    escalate: false,
    noted: [],
  };
}