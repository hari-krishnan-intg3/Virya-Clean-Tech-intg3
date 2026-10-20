import { services, industries, type ServiceSlug } from '@/data/services';

/**
 * Business, contact and navigation architecture.
 *
 * Copy is verified against the published viryacleantech.com content. Anything
 * we could not verify is listed in `PENDING_CONFIRMATION` and deliberately
 * kept out of the UI rather than guessed at.
 */

export const BUSINESS = {
  name: 'VIRYA CLEANTECH',
  shortName: 'VIRYA',
  tagline: 'Cleaner tomorrow, engineered today.',
  subLabel: 'Clean Technology',
  partnerNote: 'Powered by Algobiz Innovations LLP',
} as const;

export const CONTACT = {
  phoneDisplay: '+91 8317494969',
  phoneHref: 'tel:+918317494969',
  email: 'connect@viryacleantech.com',
  emailHref: 'mailto:connect@viryacleantech.com',
  address: {
    line1: 'No 2, 1st Floor, No 113',
    line2: 'Yogjam Sai Charan Layout',
    locality: 'Bengaluru',
    region: 'Karnataka',
    postalCode: '560036',
    country: 'India',
  },
  /**
   * Used to decide whether the chatbot offers "book a slot" (open) or
   * "leave your details" (closed). IST because the whole business operates
   * from Bengaluru.
   */
  businessHours: { open: 10, close: 19 } as const,
  businessHoursLabel: 'Mon–Sat, 10:00–19:00 IST',
  timezone: 'Asia/Kolkata',
} as const;

export const ADDRESS_LINES: string[] = [
  CONTACT.address.line1,
  CONTACT.address.line2,
  `${CONTACT.address.locality}, ${CONTACT.address.region} ${CONTACT.address.postalCode}`,
  CONTACT.address.country,
];

export const ADDRESS_ONE_LINER = ADDRESS_LINES.join(', ');

export const MAP_QUERY = encodeURIComponent(ADDRESS_LINES.join(', '));
export const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;
export const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;

export const SITE_URL = 'https://viryacleantech.com';

export const SOCIAL_LINKS = [] as { label: string; href: string }[];

/**
 * Items we deliberately do not publish because they are not verified. Keep
 * this list until someone confirms the underlying fact — do not quietly
 * promote one of these into the UI.
 */
export const PENDING_CONFIRMATION = [
  'Certification, accreditation and compliance claims — none verified.',
  'Named client testimonials — the published examples are template placeholders.',
  'Years of experience, project counts and named project references — no source.',
  'Team biographies and leadership names — the published attribution is a third party.',
  'Support hours outside the Bengaluru business window.',
] as const;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export interface NavChild {
  label: string;
  to: string;
  description: string;
  /** Slug for the accent tile in the mega menu. */
  accent?: ServiceSlug;
}

export interface NavColumn {
  heading: string;
  items: NavChild[];
}

export interface NavGroup {
  label: string;
  /** Mega menu when set, plain link otherwise. */
  columns?: NavColumn[];
  /** Context shown alongside this group's links in its menu. */
  context?: { eyebrow: string; title: string; description: string };
  /** Promotional strip rendered at the foot of the mega menu. */
  feature?: { title: string; body: string; to: string; cta: string };
  to: string;
}

const serviceItems: NavChild[] = services.map((service) => ({
  label: service.label,
  to: `/services/${service.slug}`,
  description: service.tagline,
  accent: service.slug,
}));

export const NAV: NavGroup[] = [
  {
    label: 'Home',
    to: '/',
    context: {
      eyebrow: 'Start here',
      title: 'A clearer view of clean energy',
      description: 'Explore Virya’s capabilities, approach and practical next steps for your site.',
    },
    columns: [
      {
        heading: 'Explore Virya',
        items: [
          { label: 'Our approach', to: '/about', description: 'Start with the facility, its energy use and operating context.' },
          { label: 'Energy services', to: '/services', description: 'Compare solar, charging, storage and connected-energy options.' },
          { label: 'Industries', to: '/industries', description: 'See how energy needs differ across operating environments.' },
          { label: 'Latest insights', to: '/insights', description: 'Read practical context for energy decisions.' },
        ],
      },
      {
        heading: 'Plan a next step',
        items: [
          { label: 'How we work', to: '/process', description: 'Understand the path from first questions to a scoped review.' },
          { label: 'Request a consultation', to: '/request-consultation', description: 'Share your project objective with the Virya team.' },
          { label: 'Common questions', to: '/faq', description: 'Find answers about services, feasibility and next steps.' },
          { label: 'Contact Virya', to: '/contact', description: 'Reach the team directly with a question.' },
        ],
      },
    ],
    feature: {
      title: 'Have a project in mind?',
      body: 'Share your site, energy needs and objectives to start a focused conversation.',
      to: '/request-consultation',
      cta: 'Request a consultation',
    },
  },
  {
    label: 'About',
    to: '/about',
    context: {
      eyebrow: 'About Virya',
      title: 'People, process and perspective',
      description: 'Learn about our site-first approach and how to connect with our team.',
    },
    columns: [
      {
        heading: 'The company',
        items: [
          { label: 'About Virya', to: '/about', description: 'Our practical, site-first view of clean-energy decisions.' },
          { label: 'Our process', to: '/process', description: 'What to expect as a project question takes shape.' },
          { label: 'Projects & capabilities', to: '/projects', description: 'Explore project considerations and areas of work.' },
          { label: 'Insights', to: '/insights', description: 'Read practical context on energy and technology.' },
        ],
      },
      {
        heading: 'Connect',
        items: [
          { label: 'Careers', to: '/careers', description: 'Explore current opportunities and role information.' },
          { label: 'Contact', to: '/contact', description: 'Reach the Bengaluru team directly.' },
          { label: 'Frequently asked questions', to: '/faq', description: 'Review common questions before getting in touch.' },
        ],
      },
    ],
    feature: {
      title: 'Know what to expect',
      body: 'See how an initial conversation can progress into a clearly scoped project review.',
      to: '/process',
      cta: 'View our process',
    },
  },
  {
    label: 'Offerings',
    to: '/services',
    context: {
      eyebrow: 'Energy solutions',
      title: 'Explore the right capabilities',
      description: 'Compare technologies and services in the context of your facility and operating needs.',
    },
    columns: [
      {
        heading: 'What we build',
        items: serviceItems,
      },
      {
        heading: 'Plan your next step',
        items: [
          {
            label: 'All services',
            to: '/services',
            description: 'The full capability set, side by side.',
          },
          {
            label: 'How we work',
            to: '/process',
            description: 'From initial questions to project-specific next steps.',
          },
          {
            label: 'Request a consultation',
            to: '/request-consultation',
            description: 'Share your site context and project objective.',
          },
          {
            label: 'Common questions',
            to: '/faq',
            description: 'Information about services, feasibility and next steps.',
          },
          {
            label: 'Industries',
            to: '/industries',
            description: 'Explore operating contexts across eight segments.',
          },
          {
            label: 'Contact the team',
            to: '/contact',
            description: 'Ask a question about your facility or project.',
          },
        ],
      },
    ],
    feature: {
      title: 'Not sure which option to explore?',
      body: 'Start with your facility, operating needs and project objective. The right next step depends on the site.',
      to: '/services/consulting',
      cta: 'Explore assessment services',
    },
  },
  {
    label: 'Industries',
    to: '/industries',
    context: {
      eyebrow: 'Industries we serve',
      title: 'Designed around how sites operate',
      description: 'Explore energy considerations for facilities with different loads, schedules and infrastructure.',
    },
    columns: [
      {
        heading: 'Who we work with',
        items: industries.slice(0, 4).map((industry) => ({
          label: industry.label,
          to: `/industries#${industry.slug}`,
          description: industry.pressure,
        })),
      },
      {
        heading: 'More sectors',
        items: [
          ...industries.slice(4).map((industry) => ({
            label: industry.label,
            to: `/industries#${industry.slug}`,
            description: industry.pressure,
          })),
          {
            label: 'All industries',
            to: '/industries',
            description: 'Eight segments, with the pressure point for each.',
          },
          {
            label: 'Explore energy services',
            to: '/services',
            description: 'Compare capabilities for your site and operating needs.',
          },
          {
            label: 'Common questions',
            to: '/faq',
            description: 'Learn about feasibility reviews and project next steps.',
          },
        ],
      },
    ],
    feature: {
      title: 'Every site has its own context',
      body: 'Discuss your facility and operating requirements before deciding which options to explore.',
      to: '/request-consultation',
      cta: 'Discuss your site',
    },
  },
  {
    label: 'Projects',
    to: '/projects',
    context: {
      eyebrow: 'Project planning',
      title: 'Move from questions to a scope',
      description: 'Understand the information, site conditions and decisions that shape energy projects.',
    },
    columns: [
      {
        heading: 'Capabilities',
        items: [
          { label: 'Project overview', to: '/projects', description: 'Explore the kinds of site and energy questions we help assess.' },
          { label: 'Services', to: '/services', description: 'Review the clean-energy capabilities available to explore.' },
          { label: 'Industries', to: '/industries', description: 'Review operating contexts across different facility types.' },
        ],
      },
      {
        heading: 'Project planning',
        items: [
          { label: 'How we work', to: '/process', description: 'A clear path from initial context to an agreed scope.' },
          { label: 'Common questions', to: '/faq', description: 'Get answers about feasibility and planning.' },
          { label: 'Contact the team', to: '/contact', description: 'Discuss project information and possible next steps.' },
        ],
      },
    ],
    feature: {
      title: 'Planning a project?',
      body: 'Bring your objectives and site context together for a practical first discussion.',
      to: '/request-consultation',
      cta: 'Start a conversation',
    },
  },
  {
    label: 'Insights',
    to: '/insights',
    context: {
      eyebrow: 'Ideas & guidance',
      title: 'Make informed energy decisions',
      description: 'Read practical context on the energy transition, feasibility and choosing next steps.',
    },
    columns: [
      {
        heading: 'Energy context',
        items: [
          { label: 'Latest insights', to: '/insights', description: 'Read sourced context on India’s energy transition.' },
          { label: 'Frequently asked questions', to: '/faq', description: 'Answers on feasibility, services and first steps.' },
          { label: 'How we work', to: '/process', description: 'See how questions progress into project-specific scope.' },
        ],
      },
      {
        heading: 'Explore further',
        items: [
          { label: 'Industries', to: '/industries', description: 'See how operating needs vary from site to site.' },
          { label: 'Explore services', to: '/services', description: 'Review clean-energy options for commercial facilities.' },
          { label: 'Request a consultation', to: '/request-consultation', description: 'Discuss the question behind your project.' },
          { label: 'Contact Virya', to: '/contact', description: 'Connect with the team about your energy questions.' },
        ],
      },
    ],
    feature: {
      title: 'Have a question about your site?',
      body: 'Browse common questions or talk through the context behind your project.',
      to: '/faq',
      cta: 'Browse common questions',
    },
  },
];

/** Flat links always visible in the bar. */
export const PRIMARY_LINKS = [{ label: 'Home', to: '/' }, ...NAV.map((g) => ({ label: g.label, to: g.to }))];

/** Bottom-of-footer sitemap. */
export const FOOTER_LINKS = {
  company: [
    { label: 'About', to: '/about' },
    { label: 'Process', to: '/process' },
    { label: 'Projects & capabilities', to: '/projects' },
    { label: 'Insights', to: '/insights' },
    { label: 'Industries', to: '/industries' },
    { label: 'Careers', to: '/careers' },
    { label: 'FAQ', to: '/faq' },
  ],
  services: services.map((s) => ({ label: s.label, to: `/services/${s.slug}` })),
  contact: [
    { label: 'Request a consultation', to: '/request-consultation' },
    { label: 'Contact', to: '/contact' },
  ],
} as const;

/** Google Calendar scheduling link used by every "book a slot" control. */
export const SCHEDULE_URL =
  'https://calendar.google.com/calendar/scheduling-button-script?action=TEMPLATE' +
  '&text=P VIRYA%20CLEANTECH%20Energy%20Consultation' +
  '&dates=2026-01-01T00%3A00%3A00Z/2027-12-31T00%3A00%3A00Z' +
  '&details=Energy%20consultation%20with%20VIRYA%20CLEANTECH.%20Please%20briefly%20describe%20your%20site%20and%20what%20you%20are%20trying%20to%20solve.' +
  '&location=Bengaluru%2C%20Karnataka&ctz=Asia%2FKolkata';