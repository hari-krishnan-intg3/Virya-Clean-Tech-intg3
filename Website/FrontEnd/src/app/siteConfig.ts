import { services, industries, type ServiceSlug } from '@/data/services';
import { roles } from '@/data/careers';

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
    label: 'Services',
    to: '/services',
    columns: [
      {
        heading: 'What we build',
        items: serviceItems,
      },
      {
        heading: 'Start with',
        items: [
          {
            label: 'All services',
            to: '/services',
            description: 'The full capability set, side by side.',
          },
          {
            label: 'Energy audit',
            to: '/services/consulting',
            description: 'Twelve months of interval data, read properly.',
          },
          {
            label: 'Request a consultation',
            to: '/request-consultation',
            description: 'Thirty minutes, no obligation, no sales deck.',
          },
        ],
      },
    ],
    feature: {
      title: 'Not sure which one applies?',
      body: 'Most sites need exactly two of these, and the right order is rarely the obvious one. Start with the audit.',
      to: '/services/consulting',
      cta: 'See how an audit works',
    },
  },
  {
    label: 'Industries',
    to: '/industries',
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
        heading: 'Also served by',
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
        ],
      },
    ],
  },
  {
    label: 'Approach',
    to: '/process',
    columns: [
      {
        heading: 'How we work',
        items: [
          {
            label: 'Our process',
            to: '/process',
            description: 'Discovery through to monitoring, in four stages.',
          },
          {
            label: 'About Virya',
            to: '/about',
            description: 'Who we are and how we are built.',
          },
        ],
      },
      {
        heading: 'Before you write',
        items: [
          {
            label: 'Common questions',
            to: '/faq',
            description: 'Pricing, timelines, size, NDAs and what we will not do.',
          },
          {
            label: 'Careers',
            to: '/careers',
            description: `${roles.length} open roles, and what each one actually involves.`,
          },
          {
            label: 'Talk to us',
            to: '/contact',
            description: 'Phone, email and the Bengaluru office.',
          },
        ],
      },
    ],
  },
];

/** Flat links always visible in the bar. */
export const PRIMARY_LINKS = [{ label: 'Home', to: '/' }, ...NAV.map((g) => ({ label: g.label, to: g.to }))];

/** Bottom-of-footer sitemap. */
export const FOOTER_LINKS = {
  company: [
    { label: 'About', to: '/about' },
    { label: 'Process', to: '/process' },
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