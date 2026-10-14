import type { LucideIcon } from 'lucide-react';
import { Compass, Cpu, Gauge, ShieldCheck, Sparkles, Wrench } from 'lucide-react';

/**
 * Careers content.
 *
 * ⚠ `roles` is the one place on this site holding claims we cannot evidence
 * yet. Unlike testimonials or project counts, vacancies are *intentional* —
 * but they go stale the moment a role is filled, so treat this list as the
 * single source of truth and delete an entry the day the role closes.
 *
 * Everything else here describes how the company works and is safe to publish.
 */

export interface Role {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: 'Full time' | 'Contract' | 'Internship';
  level: string;
  /** One line, the version worth reading in a list. */
  summary: string;
  /** Why the role exists. */
  mandate: string;
  responsibilities: string[];
  /** What we are looking for, stated as evidence rather than adjectives. */
  looking: string[];
  niceToHave: string[];
  /** What the first ninety days look like. */
  firstNinetyDays: string;
}

export const roles: Role[] = [
  {
    slug: 'solar-design-engineer',
    title: 'Solar Design Engineer',
    team: 'Design & Engineering',
    location: 'Bengaluru — with site travel across South India',
    type: 'Full time',
    level: 'Mid',
    summary: 'Size, design and document commercial rooftop and ground-mount PV systems from real interval data.',
    mandate:
      'Most solar proposals in India are generated from a rule of thumb. Ours start with the customer\'s half-hourly consumption, which changes the answer often enough to be worth doing properly.',
    responsibilities: [
      'Run load analysis and yield modelling for commercial and industrial sites',
      'Produce single-line diagrams, array layouts and cable schedules',
      'Run structural and shadow analysis on site, with survey support',
      'Prepare BOQs and support tender evaluation against client quotes',
      'Support DISCOM interconnection and net-metering submissions',
    ],
    looking: [
      'B.E./B.Tech in Electrical or Electronics, or a demonstrably equivalent portfolio',
      'Hands-on PV design experience on commercial or industrial systems',
      'Fluency in PVsyst, Helioscope or an equivalent modelling tool',
      'Willingness to travel to sites — this is not a desk role',
    ],
    niceToHave: [
      'Exposure to HT/LT integration or substation works',
      'Familiarity with Indian DISCOM approval processes',
      'Exposure to storage or hybrid PV design',
    ],
    firstNinetyDays:
      'You will own one live design end to end, from data request through to an approved interconnection — with an engineer reviewing your drawings, not replacing them.',
  },
  {
    slug: 'ev-charging-engineer',
    title: 'EV Charging Infrastructure Engineer',
    team: 'Delivery',
    location: 'Bengaluru — with depot and forecourt site visits',
    type: 'Full time',
    level: 'Mid',
    summary: 'Design charging infrastructure for sites with real constraints — grid headroom, dwell time, tariff structure.',
    mandate:
      'Fleet electrification projects fail on power, not on vehicles. This role exists to make sure we find that out before the customer buys anything.',
    responsibilities: [
      'Carry out load studies and establish available transformer headroom',
      'Size charger mixes to measured dwell time rather than fleet size',
      'Produce site electrical design and protection grading documentation',
      'Coordinate civil, cable and earthing works with contractors',
      'Integrate OCPP backends, payment and access control',
    ],
    looking: [
      'B.E./B.Tech in Electrical Engineering',
      'Experience with EVSE selection and site electrical design',
      'Ability to read interval data and reason about demand profiles',
      'Comfort working near live electrical installations with correct safety discipline',
    ],
    niceToHave: [
      'PM E-DRIVE or FAME-II documentation experience',
      'Load-management or dynamic-balancing implementation exposure',
      'Familiarity with DC fast charging standards and thermal design',
    ],
    firstNinetyDays:
      'You will lead the load study on two live sites and defend the resulting headroom findings to clients who expected a different answer.',
  },
  {
    slug: 'energy-software-engineer',
    title: 'Energy Software Engineer',
    team: 'Software & IoT',
    location: 'Bengaluru — hybrid, with field commissioning travel',
    type: 'Full time',
    level: 'Mid to senior',
    summary: 'Build the monitoring layer that makes solar, storage and charging assets operable rather than merely installed.',
    mandate:
      'Hardware gets commissioned and then quietly degrades because nobody is watching the data. This role closes that gap, and it is the part of the energy transition that is consistently under-specified.',
    responsibilities: [
      'Integrate inverter, meter and charger telemetry across Modbus, MQTT and OCPP',
      'Build dashboards for CFO, facility and operations audiences',
      'Implement anomaly and performance-loss alerting tuned to real failure modes',
      'Own energy accounting, CO2e reporting and export formats auditors accept',
      'Commission software on site — you will travel, and you will get your hands dirty',
    ],
    looking: [
      'Strong TypeScript or similar, plus real backend experience',
      'Comfortable near hardware: serial protocols, gateways, field debugging',
      'A track record of shipping something that other people depend on daily',
      'Willingness to travel to commissioning sites during the first year',
    ],
    niceToHave: [
      'Energy or industrial telemetry experience',
      'Time-series data handling at moderate scale',
      'Experience building multi-tenant or white-label portals',
    ],
    firstNinetyDays:
      'You will take ownership of telemetry for one live asset class, find out what it is actually reporting, and fix the parts that were lying.',
  },
  {
    slug: 'project-manager',
    title: 'Project Manager — Energy Projects',
    team: 'Delivery',
    location: 'Bengaluru',
    type: 'Full time',
    level: 'Senior',
    summary: 'Run solar, storage and charging projects from signed scope to energisation without the schedule slipping quietly.',
    mandate:
      'Grid approval and equipment lead times are the two things that derail energy projects. This role exists to see them coming and to tell the client before they become a surprise.',
    responsibilities: [
      'Own schedule, cost and risk across concurrent energy projects',
      'Coordinate contractors, DISCOMs, clients and internal engineering',
      'Run stage-gate reviews against the documented deliverables in each proposal',
      'Flag slippage early, with options — not late, with excuses',
      'Maintain the handover pack: drawings, test certificates, training, monitoring',
    ],
    looking: [
      'Five or more years delivering capital projects, ideally infrastructure or electrical',
      'Genuine experience of external approval processes',
      'A style of reporting that a client would find reassuring rather than alarming',
      'Fluency with commercial terms — variations, claims, retention',
    ],
    niceToHave: [
      'Renewable energy or EPC background',
      'P&L or budget ownership for a project portfolio',
      'Familiarity with Indian DISCOM and state approval bodies',
    ],
    firstNinetyDays:
      'You will take over one live project mid-flight, write down its true state, and present the recovery plan to the client in week six.',
  },
  {
    slug: 'field-supervisor',
    title: 'Field Supervisor — Solar & Storage',
    team: 'Delivery',
    location: 'South India — site based',
    type: 'Full time',
    level: 'Mid',
    summary: 'Run installation crews safely, to drawing, on sites where safety outcomes are not negotiable.',
    mandate:
      'A design that reaches site incorrectly is a design failure with a safety dimension. This role is the last line of that defence.',
    responsibilities: [
      'Supervise installation, earthing, testing and commissioning on site',
      'Enforce permit-to-work, PPE and electrical safety discipline without exception',
      'Verify installed work against approved drawings and raise deviations early',
      'Coordinate site labour, materials and daily progress reporting',
      'Train and supervise subcontracted crews',
    ],
    looking: [
      'Four or more years supervising electrical or solar installation work',
      'Formal electrical safety training, and the authority to stop work',
      'Fluency in earthing, protection and testing instruments',
      'Willingness to be on site for most of the month',
    ],
    niceToHave: [
      'Working-at-height and HV switching certification',
      'Experience with rooftop or industrial-scale PV installation',
      'Exposure to battery systems commissioning',
    ],
    firstNinetyDays:
      'You will run one site to completion and own the safety plan, the quality checklist and the handover documentation for it.',
  },
  {
    slug: 'energy-consultant',
    title: 'Energy Consultant — Audits & Feasibility',
    team: 'Consulting',
    location: 'Bengaluru — with client site visits',
    type: 'Full time',
    level: 'Mid',
    summary: 'Turn interval data into a payback number a CFO can defend in a board meeting.',
    mandate:
      'We are as happy to tell a client the project does not work. That is only credible because the audit team is measured on the quality of its negative findings, not the volume of proposals it produces.',
    responsibilities: [
      'Lead detailed energy audits using half-hourly interval data',
      'Model solar, storage and charging feasibility with stated assumptions',
      'Produce investment memoranda for CFO and board audiences',
      'Review and normalise competing EPC BOQs so clients compare the same scope',
      'Present findings and recommendations to client stakeholders',
    ],
    looking: [
      'Engineering or energy management background',
      'Genuine fluency in interval data and tariff structures, not just spreadsheets',
      'Ability to write a recommendation a finance director will accept',
      'Willingness to conclude "do not proceed" when the analysis says so',
    ],
    niceToHave: [
      'Certified energy manager or equivalent',
      'Experience with scope 2 and carbon accounting',
      'Experience supporting green-building certification',
    ],
    firstNinetyDays:
      'You will lead one audit from data request to presentation and defend the recommendation to the client directly.',
  },
];

/* ------------------------------------------------------------------ */
/* Employer brand                                                      */
/* ------------------------------------------------------------------ */

export interface Value {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const values: Value[] = [
  {
    icon: Gauge,
    title: 'Accuracy over optimism',
    body: 'We publish our assumptions, including the unfavourable ones. A project that fails its own hurdle rate is an expense, and we would rather hear it in week two than year two.',
  },
  {
    icon: Compass,
    title: 'Engineers who stay accountable',
    body: 'The person who signs off your design is the person who turns up on site. There is no handoff to a delivery team that has never seen the drawing.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety is not negotiable',
    body: 'Anyone on this team can stop a job for a safety reason without needing permission or a justification afterwards. That authority is real and it is used.',
  },
  {
    icon: Sparkles,
    title: 'Newer energy, older engineering',
    body: 'The technology here is young. The discipline has to be old-school: drawings checked, earthing tested, commissioning signed off by a named person.',
  },
  {
    icon: Wrench,
    title: 'You will see your work energised',
    body: 'You are not writing reports about systems. You are standing next to them on the day they switch on, and that is the part people stay for.',
  },
  {
    icon: Cpu,
    title: 'Software is part of the trade',
    body: 'Software is how every asset we install becomes operable. We treat telemetry, alerting and reporting as engineering deliverables, not as an afterthought.',
  },
];

export interface HiringStage {
  stage: string;
  detail: string;
  duration: string;
}

export const hiringStages: HiringStage[] = [
  {
    stage: 'Application review',
    detail:
      'Read properly, by a person in the relevant discipline. If the role is filled we will not reply — but you will get an answer either way.',
    duration: 'Within 5 working days',
  },
  {
    stage: 'Conversation',
    detail:
      'Thirty to forty-five minutes with the team lead. Bring questions — this is the stage where you find out whether the role is honest.',
    duration: '1 week',
  },
  {
    stage: 'Technical session',
    detail:
      'A real problem from our work, discussed together. Not a puzzle with a hidden answer, and nobody is testing whether you have memorised a textbook.',
    duration: '2–3 days after the conversation',
  },
  {
    stage: 'Site or team meet',
    detail:
      'Half a day on a live site or with the delivery team, whichever suits the role. Paid at your day rate.',
    duration: 'Within 2 weeks',
  },
  {
    stage: 'Offer',
    detail:
      'Written, with the band stated openly. We would rather you decline because the number is wrong than spend three months finding out.',
    duration: 'Decision within 48 hours of the site visit',
  },
];

export interface Benefit {
  title: string;
  body: string;
}

export const benefits: Benefit[] = [
  {
    title: 'Paid site visits',
    body: 'Travel for project work is reimbursed the same month. Site visits are paid work, not unpaid development.',
  },
  {
    title: 'Certification funded',
    body: 'Safety training, professional registration and technical certifications are paid for and scheduled during working hours.',
  },
  {
    title: 'Real ownership',
    body: 'Small team, no layers. Your drawing is the drawing that goes to site, and you are named on it.',
  },
  {
    title: 'No billable-only culture',
    body: 'Nobody here is measured on how many proposals went out. The audit team is measured on whether the recommendations held up.',
  },
  {
    title: 'Exposure across the stack',
    body: 'Solar, storage, charging and monitoring in one company. Engineers here see the whole system, which is rarer than it should be.',
  },
  {
    title: 'Honest written feedback',
    body: 'Including when the answer is no, and specifically why. We would rather you learn something from the process.',
  },
];

export const CAREERS = {
  email: 'careers@viryacleantech.com',
  emailHref: 'mailto:careers@viryacleantech.com',
  subjectPrefix: 'Application — Virya Clean Tech',
  location: 'Bengaluru, Karnataka',
  openApplicationNote:
    'Nothing here that fits? Send an open application. We read speculative applications properly — several of our current engineers arrived without an advertised role.',
} as const;

export const ROLE_SLUGS = roles.map((r) => r.slug);