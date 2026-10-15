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
    summary: 'Review facility and energy information before shaping commercial rooftop or ground-mounted PV designs. The work spans load analysis, yield modelling, site surveys, drawings and equipment scope. Engineering decisions should reflect roof or land conditions, electrical interfaces, local requirements and each project’s agreed responsibilities.',
    mandate:
      'Solar proposals can change when actual consumption, site conditions and connection details are reviewed. This role exists to bring those inputs into design early, explain the assumptions and identify where structural or utility questions require further review.',
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
      'You will contribute to a live design from initial data review through drawings and interconnection questions. A senior engineer will review the work, explain the reasoning and help you take on more ownership as the project scope and readiness allow.',
  },
  {
    slug: 'ev-charging-engineer',
    title: 'EV Charging Infrastructure Engineer',
    team: 'Delivery',
    location: 'Bengaluru — with depot and forecourt site visits',
    type: 'Full time',
    level: 'Mid',
    summary: 'Plan EV charging around cars, two-wheelers, buses and commercial vehicle patterns. The work includes load studies, charger selection, electrical design and delivery coordination. Site layout, dwell time, grid capacity and operating schedules all affect what can be proposed; you will document the assumptions behind those decisions.',
    mandate:
      'Fleet charging depends on more than vehicle choice. This role examines routes, dwell windows, electrical capacity and site operations so infrastructure questions can be surfaced before equipment decisions are made.',
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
      'You will work through a charging assessment from site information and load data to documented findings. The team will review the assumptions with you and help communicate what the results mean for charger planning and any remaining technical questions.',
  },
  {
    slug: 'energy-software-engineer',
    title: 'Energy Software Engineer',
    team: 'Software & IoT',
    location: 'Bengaluru — hybrid, with field commissioning travel',
    type: 'Full time',
    level: 'Mid to senior',
    summary: 'Build software and integrations that help operators understand connected energy assets. The role spans device telemetry, data pipelines, monitoring interfaces, alerting and reporting. Compatibility, access permissions, data quality, security and the needs of daily users shape the work.',
    mandate:
      'Connected assets produce useful information only when the data can be accessed, understood and acted on. This role helps clarify those requirements and build software that supports operators without implying that monitoring alone prevents equipment issues.',
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
      'You will examine telemetry from an asset class, document what the devices report and identify data-quality gaps. Together with the team, you will prioritize fixes and agree how operators can use the resulting information.',
  },
  {
    slug: 'project-manager',
    title: 'Project Manager — Energy Projects',
    team: 'Delivery',
    location: 'Bengaluru',
    type: 'Full time',
    level: 'Senior',
    summary: 'Coordinate energy projects from agreed scope through delivery milestones. The role brings together schedules, budgets, site teams, suppliers, approvals and client communication. Clear records and early risk escalation help teams understand changes to timing, responsibilities or deliverables.',
    mandate:
      'Project schedules can depend on approvals, equipment availability, site access and coordination across multiple teams. This role exists to track those dependencies, communicate uncertainty and keep decisions visible before a delay becomes difficult to manage.',
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
      'You will learn the project records, meet the delivery stakeholders and identify current dependencies. With support from the team, you will document risks, agree follow-up owners and communicate any schedule or scope questions clearly.',
  },
  {
    slug: 'field-supervisor',
    title: 'Field Supervisor — Solar & Storage',
    team: 'Delivery',
    location: 'South India — site based',
    type: 'Full time',
    level: 'Mid',
    summary: 'Coordinate field work for solar and storage projects with safety, quality and drawing compliance in focus. The role supports crews, checks work against approved documents and records site conditions. Clear reporting helps engineers review deviations before they become installation or handover issues.',
    mandate:
      'Installation quality and site safety depend on clear drawings, safe work practices and timely communication. This role provides field oversight, documents deviations and raises issues so they can be reviewed by the appropriate engineering and project leads.',
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
      'You will become familiar with site procedures, approved drawings and reporting expectations. Responsibilities grow with site readiness and role scope, with a focus on safe coordination, documented quality checks and clear handover information.',
  },
  {
    slug: 'energy-consultant',
    title: 'Energy Consultant — Audits & Feasibility',
    team: 'Consulting',
    location: 'Bengaluru — with client site visits',
    type: 'Full time',
    level: 'Mid',
    summary: 'Review energy information and project assumptions for organisations considering clean-energy options. The role translates technical findings into decision material that explains data gaps, constraints, options and risks. Recommendations should distinguish evidence from estimates and identify when more review is needed.',
    mandate:
      'An assessment should be useful even when an option is not suitable. This role exists to examine evidence, communicate uncertainty and document why a recommendation does or does not fit the requirements and information available.',
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
      'You will support an assessment from information review through findings and discussion. The team will help you communicate assumptions and limitations clearly, and build confidence presenting project considerations to client stakeholders.',
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
      'A person in the relevant discipline reviews your experience against the actual work in the role. Share project examples and the part you owned so the team can understand your decisions. If a position has already closed, the page may no longer reflect its status.',
    duration: 'Within 5 working days',
  },
  {
    stage: 'Conversation',
    detail:
      'A conversation with the team lead covers the responsibilities, working context and the problems the role is expected to address. Bring questions about the team and expectations so both sides can decide whether the opportunity is a useful fit.',
    duration: '1 week',
  },
  {
    stage: 'Technical session',
    detail:
      'Discuss a relevant work problem and explain how you would approach it. The focus is on assumptions, trade-offs, safety and communication, rather than guessing a hidden answer or reciting a textbook. Ask for context if the problem statement needs clarification.',
    duration: '2–3 days after the conversation',
  },
  {
    stage: 'Site or team meet',
    detail:
      'Where relevant to the role, spend time with the delivery team or visit a site to understand the operating environment. The format depends on location and site access; any required visit is paid at the agreed day rate.',
    duration: 'Within 2 weeks',
  },
  {
    stage: 'Offer',
    detail:
      'An offer is provided in writing with compensation and role expectations stated. Review the responsibilities, work location, employment terms and any questions before accepting; it is better to clarify a mismatch early than discover it after joining.',
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
    body: 'Travel for project work is reimbursed the same month. Site visits are part of paid project work, not unpaid development time. The work can include observing site conditions, coordinating with the delivery team and documenting what needs to be followed up.',
  },
  {
    title: 'Certification funded',
    body: 'Safety training, professional registration and technical certifications are funded and scheduled during working hours. Relevant learning can be discussed with the manager so it supports the responsibilities of the role and the work being delivered.',
  },
  {
    title: 'Real ownership',
    body: 'In a small team, design work stays connected to implementation. Your drawing is the document used by the site team, and you are named on it. That creates a clear feedback loop between design decisions and installation conditions.',
  },
  {
    title: 'No billable-only culture',
    body: 'The focus is not simply how many proposals are sent. For assessment work, recommendations should remain useful when the site, available data and project constraints are reviewed. The reasoning and assumptions matter as much as the document itself.',
  },
  {
    title: 'Exposure across the stack',
    body: 'The published service areas include solar, storage, charging and monitoring. Depending on the role, engineers can learn how these systems interact with site operations, electrical infrastructure and data rather than viewing each device in isolation.',
  },
  {
    title: 'Honest written feedback',
    body: 'Feedback should be specific enough to explain the decision and point to what could improve. That applies when the answer is no as well as when an application progresses, so candidates can understand the process rather than guess at it.',
  },
];

export const CAREERS = {
  email: 'careers@viryacleantech.com',
  emailHref: 'mailto:careers@viryacleantech.com',
  subjectPrefix: 'Application — Virya Clean Tech',
  location: 'Bengaluru, Karnataka',
  openApplicationNote:
    'Nothing here that fits? Send an open application with the area of work you are interested in, relevant experience and examples of your work. Explain what kind of projects you want to contribute to and where your experience is strongest. We review applications when there is a suitable need, though an opening or response time cannot be guaranteed.',
} as const;

export const ROLE_SLUGS = roles.map((r) => r.slug);