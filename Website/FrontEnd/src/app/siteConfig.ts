import { services, type ServiceSlug } from '@/data/services';
import { OFFERINGS_TREE } from '@/data/offeringsArchitecture';

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

export const NAV: NavGroup[] = [
  {
    label: 'Home',
    to: '/',
    context: {
      eyebrow: 'Start Here',
      title: 'A Clearer View of Clean Energy',
      description: 'Explore Virya’s engineering capabilities, site-first methodology, and regional infrastructure.',
    },
    columns: [
      {
        heading: 'Explore Virya',
        items: [
          { label: 'CleanTech Offerings', to: '/services', description: '8 core pillars covering EV charging, solar, wind, BESS & platforms.' },
          { label: 'Market Segments', to: '/industries', description: 'Consulting-led architectures across 8 core industry sectors.' },
          { label: 'Energy Platforms', to: '/energy-platforms', description: 'SCADA telemetry, certified OCPP charge management & AI forecasting.' },
          { label: 'Technical Insights', to: '/insights', description: 'Sourced analysis on India’s grid codes, tariffs & decarbonization.' },
        ],
      },
      {
        heading: 'Plan a Next Step',
        items: [
          { label: 'Engineering Process', to: '/process', description: 'Structured roadmap from feasibility study to turnkey commissioning.' },
          { label: 'Request a Consultation', to: '/request-consultation', description: 'Direct project scope review with electrical engineers.' },
          { label: 'Regional Hubs & Locator', to: '/contact', description: 'Interactive map across Bengaluru HQ, Tamil Nadu & western hubs.' },
          { label: 'Common Questions', to: '/faq', description: 'Clear answers on feasibility, tariffs, timelines & compliance.' },
        ],
      },
    ],
    feature: {
      title: 'Have a project in mind?',
      body: 'Share your facility loads, location, and energy objectives to start a focused review.',
      to: '/request-consultation',
      cta: 'Request a consultation',
    },
  },
  {
    label: 'Offerings',
    to: '/services',
    context: {
      eyebrow: 'CleanTech Pillars',
      title: 'Full Lifecycle Energy Architecture',
      description: 'End-to-end capabilities spanning electric mobility, solar, wind, storage, AI platforms and utility modernization.',
    },
    columns: OFFERINGS_TREE.map((pillar) => ({
      heading: pillar.title,
      items: pillar.items.map((sub) => ({
        label: sub.label,
        to: sub.to,
        description: sub.description,
      })),
    })),
    feature: {
      title: 'Need a customized energy architecture?',
      body: 'Engage our technical architects to scope solar, EV charging, storage and smart platforms for your facility.',
      to: '/request-consultation',
      cta: 'Request an engineering review',
    },
  },
  {
    label: 'Industries',
    to: '/industries',
    context: {
      eyebrow: 'Market Segments',
      title: 'Industry → Applications → Outcomes',
      description: 'Consulting-led CleanTech architectures aligned with sector-specific loads, duty cycles, and business outcomes.',
    },
    columns: [
      {
        heading: 'Transportation & Mobility',
        items: [
          { label: 'Fleet EVSE & Bus Depots', to: '/industries#transportation', description: 'Megawatt depot charging & transit bus electrification.' },
          { label: 'Truck Corridors & Hubs', to: '/industries#transportation', description: 'Heavy-duty highway fast DC charging networks.' },
          { label: 'Route Energy Analytics', to: '/industries#transportation', description: 'Battery swapping & telematics-driven range planning.' },
        ],
      },
      {
        heading: 'Manufacturing & Industrial',
        items: [
          { label: 'Industrial Solar Arrays', to: '/industries#manufacturing', description: 'High-yield rooftop PV & balance-of-plant integration.' },
          { label: 'Containerized BESS Storage', to: '/industries#manufacturing', description: 'Peak demand shaving & millisecond power protection.' },
          { label: 'CBAM Decarbonization', to: '/industries#manufacturing', description: 'Export carbon audits & Scope 1 & 2 reduction roadmaps.' },
        ],
      },
      {
        heading: 'Logistics & Warehousing',
        items: [
          { label: 'Warehouse EV Hubs', to: '/industries#logistics', description: 'Yard fast chargers & material handling equipment EVSE.' },
          { label: 'Cold Chain Microgrids', to: '/industries#logistics', description: 'Zero-downtime solar-hybrid power for temperature control.' },
          { label: 'Distribution Center Solar', to: '/industries#logistics', description: 'Expansive flat roof PV arrays & Time-of-Day arbitrage.' },
        ],
      },
      {
        heading: 'Real Estate & Smart Buildings',
        items: [
          { label: 'Tenant EV Charging', to: '/industries#real-estate', description: 'Automated billing, load sharing & resident app access.' },
          { label: 'Commercial Solar Rooftops', to: '/industries#real-estate', description: 'Architectural carports & common-area net metering.' },
          { label: 'LEED & IGBC Compliance', to: '/industries#real-estate', description: 'Audit-ready carbon telemetry & BEMS integration.' },
        ],
      },
      {
        heading: 'Utilities & Energy Providers',
        items: [
          { label: 'Distributed Energy (DERs)', to: '/industries#utilities', description: 'Substation interconnection, hosting capacity & feeder sync.' },
          { label: 'Virtual Power Plants (VPP)', to: '/industries#utilities', description: 'Aggregated distributed solar & BESS dispatch for discoms.' },
          { label: 'Grid Power Quality', to: '/industries#utilities', description: 'Harmonic mitigation, power factor & reactive compensation.' },
        ],
      },
      {
        heading: 'Government & Smart Cities',
        items: [
          { label: 'Public EV Charging Hubs', to: '/industries#government', description: 'Multi-bay public DC fast charging & urban infrastructure.' },
          { label: 'Transit Bus Electrification', to: '/industries#government', description: 'Overhead pantographs, depot chargers & PM E-DRIVE.' },
          { label: 'Net-Zero Civic Buildings', to: '/industries#government', description: 'Municipal solar microgrids & smart city telemetry.' },
        ],
      },
      {
        heading: 'Retail & Hospitality',
        items: [
          { label: 'Destination Fast Charging', to: '/industries#retail', description: 'Customer DC charging hubs that boost footfall & dwell time.' },
          { label: 'Architectural Solar Carports', to: '/industries#retail', description: 'Aesthetic shaded parking generating on-site green power.' },
          { label: 'Brand Carbon Dashboards', to: '/industries#retail', description: 'Customer-facing sustainability kiosks & green branding.' },
        ],
      },
      {
        heading: 'Data Centers & Digital Hubs',
        items: [
          { label: '24/7 Carbon-Free Power', to: '/industries#data-centers', description: 'Multi-MW solar-wind hybrid PPAs with BESS firming.' },
          { label: 'High-C-Rate UPS Storage', to: '/industries#data-centers', description: 'Millisecond battery failover replacing diesel generators.' },
          { label: 'Sub-1.25 PUE Optimization', to: '/industries#data-centers', description: 'AI chiller telemetry & thermal efficiency controls.' },
        ],
      },
    ],
    feature: {
      title: 'Sector-specific feasibility reviews',
      body: 'Explore consulting-led CleanTech applications and ROI modeling for your industry.',
      to: '/industries',
      cta: 'Explore all 8 market segments',
    },
  },
  {
    label: 'Energy Platforms',
    to: '/energy-platforms',
    context: {
      eyebrow: 'Software Intelligence',
      title: 'Cloud Orchestration & Telemetry',
      description: 'Industrial SCADA, certified OCPP charge management, and machine-learning energy intelligence.',
    },
    columns: [
      {
        heading: 'Operations & SCADA',
        items: [
          { label: 'Energy Operations Platform', to: '/energy-platforms', description: 'Unified multi-facility telemetry & real-time SLD tracking.' },
          { label: 'Power Quality & Harmonics', to: '/energy-platforms', description: 'Continuous THD, power factor, and voltage sag alerts.' },
          { label: 'Sub-Metered Facility IoT', to: '/energy-platforms', description: 'Zone-level power tracing & machine duty cycle monitoring.' },
        ],
      },
      {
        heading: 'EV Software & CSMS',
        items: [
          { label: 'OCPP 1.6J / 2.0.1 Server', to: '/energy-platforms', description: 'Certified charger management, OTA diagnostics & reboot.' },
          { label: 'Dynamic Load Balancing', to: '/energy-platforms', description: 'Automated current throttling preventing breaker trips.' },
          { label: 'Automated Billing & UPI', to: '/energy-platforms', description: 'Instant tariffs, corporate RFID, and automated reconciliation.' },
        ],
      },
      {
        heading: 'AI & Forecasting',
        items: [
          { label: 'Day-Ahead Generation Forecast', to: '/energy-platforms', description: '96%+ accuracy satellite irradiance & wake modeling.' },
          { label: 'Time-of-Day Tariff Arbitrage', to: '/energy-platforms', description: 'Automated off-peak battery charge & peak shaving.' },
          { label: 'Battery SoH & Thermal Care', to: '/energy-platforms', description: 'Degradation tracking & thermal runaway prevention.' },
        ],
      },
      {
        heading: 'Grid & Microgrids',
        items: [
          { label: 'Virtual Power Plants (VPP)', to: '/energy-platforms', description: 'Aggregated DER dispatch into state energy exchanges.' },
          { label: 'Automated Demand Response', to: '/energy-platforms', description: 'Non-critical load shedding during peak discom alerts.' },
          { label: 'DG-PV-BESS Reverse Protection', to: '/energy-platforms', description: 'Zero generator back-feed during grid trip events.' },
        ],
      },
    ],
    feature: {
      title: 'Ready for full telemetry visibility?',
      body: 'Integrate your solar, BESS, and EVSE hardware into Virya Energy Platforms with zero vendor lock-in.',
      to: '/request-consultation?service=software-iot',
      cta: 'Request a platform demo',
    },
  },
  {
    label: 'Insights',
    to: '/insights',
    context: {
      eyebrow: 'Ideas & Guidance',
      title: 'Make Informed Energy Decisions',
      description: 'Read practical context on India’s clean energy transition, technical feasibility, and regulatory frameworks.',
    },
    columns: [
      {
        heading: 'Technical Intelligence',
        items: [
          { label: 'Latest Insights & Whitepapers', to: '/insights', description: 'Sourced analysis on solar ROI, tariffs & open-access policy.' },
          { label: 'Frequently Asked Questions', to: '/faq', description: 'Technical answers on solar, BESS, EVSE & feasibility.' },
          { label: 'Engineering Methodology', to: '/process', description: 'See how questions progress into site-specific single line diagrams.' },
        ],
      },
      {
        heading: 'Strategic Guidance',
        items: [
          { label: 'Market Segments Architecture', to: '/industries', description: 'Consulting-led blueprints across 8 industrial sectors.' },
          { label: 'CleanTech Offerings Scope', to: '/services', description: 'Explore full lifecycle engineering across all clean technologies.' },
          { label: 'Direct Engineering Scope', to: '/request-consultation', description: 'Discuss the engineering challenge behind your facility.' },
        ],
      },
    ],
    feature: {
      title: 'Have a question about your site?',
      body: 'Browse common technical questions or talk through the context behind your project.',
      to: '/faq',
      cta: 'Browse common questions',
    },
  },
  {
    label: 'About',
    to: '/about',
    context: {
      eyebrow: 'Engineering Leadership',
      title: 'Site-First CleanTech Engineering',
      description: 'Headquartered in Bengaluru with operational hubs across Tamil Nadu and western industrial corridors.',
    },
    columns: [
      {
        heading: 'The Company',
        items: [
          { label: 'About Virya', to: '/about', description: 'Our engineering philosophy, site-first principles & governance.' },
          { label: 'Engineering Process', to: '/process', description: 'Structured delivery from site audit to commissioning.' },
          { label: 'Energy Platforms', to: '/energy-platforms', description: 'Cloud SCADA, certified OCPP charge management & telemetry.' },
          { label: 'Regional Hubs & Presence', to: '/contact', description: '10 operational hubs across Bengaluru, Tamil Nadu & India.' },
        ],
      },
      {
        heading: 'Connect & Engage',
        items: [
          { label: 'Request a Consultation', to: '/request-consultation', description: 'Direct project scope review with electrical engineers.' },
          { label: 'Technical Insights', to: '/insights', description: 'Research papers on tariffs, grid codes & battery chemistry.' },
          { label: 'Frequently Asked Questions', to: '/faq', description: 'Verified engineering answers for facility managers.' },
          { label: 'Careers at Virya', to: '/careers', description: 'Engineering, software, and project delivery openings.' },
        ],
      },
    ],
    feature: {
      title: 'Consult our engineering team',
      body: 'Get a site-specific feasibility review for solar, EVSE, or storage.',
      to: '/request-consultation',
      cta: 'Book a consultation',
    },
  },
];

/** Flat links always visible in the bar. */
export const PRIMARY_LINKS = NAV.map((g) => ({ label: g.label, to: g.to }));

/** Bottom-of-footer sitemap. */
export const FOOTER_LINKS = {
  company: [
    { label: 'About', to: '/about' },
    { label: 'Process', to: '/process' },
    { label: 'Energy Platforms', to: '/energy-platforms' },
    { label: 'Industries', to: '/industries' },
    { label: 'Insights', to: '/insights' },
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
