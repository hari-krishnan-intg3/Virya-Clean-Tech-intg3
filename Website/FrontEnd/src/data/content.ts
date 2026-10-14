import type { IconName } from './services';

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export interface HeroSlide {
  id: string;
  eyebrow: string;
  headline: string;
  subtext: string;
  image: string;
  imageAlt: string;
  /** Focal point of the photograph so cropping stays stable across breakpoints. */
  focal: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'future',
    eyebrow: 'Clean energy. Intelligent future.',
    headline: 'Pioneering the Future of Sustainable Energy',
    subtext:
      "We're not just another startup — we're innovators reshaping the renewable energy landscape with EV charging, advanced battery technology, and efficient solar power solutions.",
    image:
      'https://viryacleantech.com/wp-content/uploads/elementor/thumbs/alternative-energy-ecological-concept-2021-08-29-01-16-39-utc-r6meidpw3yeqhqnfbk43plqnob1so02kx2zrxwbiag.jpg',
    imageAlt:
      'Solar photovoltaic panels installed on a building, surrounded by greenery at dusk.',
    focal: 'center 40%',
  },
  {
    id: 'innovation',
    eyebrow: 'Innovation meets intelligent energy',
    headline: 'Empowering the Future Through Clean Innovation',
    subtext:
      'Combining technical expertise and bold creativity to deliver smarter, more sustainable alternatives to conventional energy systems.',
    image:
      'https://viryacleantech.com/wp-content/uploads/elementor/thumbs/ev-charging-station-clean-energy-filling-technology-electric-car-charging-scaled-r6meidpw3yeqhqnfbk43plqnob1so02kx2zrxwbiag.jpg',
    imageAlt: 'Electric vehicle plugged into a smart charging station.',
    focal: 'center 45%',
  },
  {
    id: 'solar',
    eyebrow: 'Solar engineered for tomorrow',
    headline: 'We Are Ready For Solar Energy',
    subtext:
      'Discover precision-engineered solar solutions designed around your energy needs, operational goals, and a greener tomorrow.',
    image:
      'https://viryacleantech.com/wp-content/uploads/elementor/thumbs/engineer-electric-woman-checking-and-maintenance-of-solar-cells-1024x684-1-r6meidptx0o0prd40xhzpa0uy2uuax1um815hhjz0g.jpg',
    imageAlt: 'Engineer carrying out maintenance checks across a solar panel array.',
    focal: 'center 40%',
  },
];

/* ------------------------------------------------------------------ */
/* Ecosystem                                                           */
/* ------------------------------------------------------------------ */

export interface EcosystemNode {
  id: string;
  label: string;
  description: string;
  icon: IconName | 'Battery';
  /** Hex accent used by the SVG connectors. */
  accent: string;
  /** Tailwind gradient classes for the node badge. */
  gradient: string;
  /** Position as a percentage of the diagram box. */
  x: number;
  y: number;
}

export const ecosystemNodes: EcosystemNode[] = [
  {
    id: 'solar',
    label: 'Solar Generation',
    description: 'Renewable power generated from photovoltaic systems.',
    icon: 'Sun',
    accent: '#F59E0B',
    gradient: 'from-amber-400 to-amber-500',
    x: 50,
    y: 8,
  },
  {
    id: 'battery',
    label: 'Battery Technology',
    description: 'Energy stored and released on demand.',
    icon: 'Battery',
    accent: '#8B5CF6',
    gradient: 'from-violet-500 to-violet-600',
    x: 92,
    y: 50,
  },
  {
    id: 'ev',
    label: 'EV Charging',
    description: 'Electric mobility infrastructure for any site.',
    icon: 'Zap',
    accent: '#0EA5E9',
    gradient: 'from-sky-400 to-sky-500',
    x: 50,
    y: 92,
  },
  {
    id: 'systems',
    label: 'Intelligent Systems',
    description: 'Software, IoT devices and live monitoring.',
    icon: 'Cpu',
    accent: '#10B981',
    gradient: 'from-emerald-400 to-emerald-600',
    x: 8,
    y: 50,
  },
];

/* Directed flows powering the animated connectors. */
export const ecosystemFlows: { from: string; to: string; label: string }[] = [
  { from: 'solar', to: 'battery', label: 'Charge' },
  { from: 'battery', to: 'ev', label: 'Supply' },
  { from: 'ev', to: 'systems', label: 'Report' },
  { from: 'systems', to: 'solar', label: 'Optimise' },
];

/* ------------------------------------------------------------------ */
/* Why Virya                                                           */
/* ------------------------------------------------------------------ */

export interface Differentiator {
  title: string;
  description: string;
  icon: IconName | 'Gauge' | 'Leaf' | 'Wrench';
}

export const differentiators: Differentiator[] = [
  {
    title: 'Innovation-Led Solutions',
    description:
      'We stay ahead of the curve with breakthrough technologies in EV charging, solar power, and battery systems — engineered for performance and efficiency.',
    icon: 'Cpu',
  },
  {
    title: 'Customized Approach',
    description:
      'No two clients are the same. We offer tailored solutions that align with your unique energy needs, ensuring maximum impact and value.',
    icon: 'Gauge',
  },
  {
    title: 'Technical Excellence',
    description:
      'Backed by a skilled team with deep industry knowledge, we deliver precision-engineered systems that meet the highest standards of quality and reliability.',
    icon: 'Wrench',
  },
  {
    title: 'Sustainability at Heart',
    description:
      'Our commitment goes beyond business — every solution we provide contributes to a cleaner planet and a more sustainable future.',
    icon: 'Leaf',
  },
];

/* ------------------------------------------------------------------ */
/* Applications                                                        */
/* ------------------------------------------------------------------ */

export interface Application {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Routes to the matching service anchor, or to the booking form. */
  href: string;
  /** Composition hint so cards do not all look identical. */
  focal: string;
  span: 'tall' | 'wide' | 'normal';
}

/**
 * Illustrative application scenarios — NOT completed Virya projects.
 * No verified case studies are published on the official website.
 */
export const applications: Application[] = [
  {
    id: 'solar-install',
    title: 'Residential & Commercial Solar',
    category: 'Solar power',
    description:
      'Rooftop and ground-mounted installations engineered around your consumption pattern, roof geometry and available daylight.',
    image:
      'https://viryacleantech.com/wp-content/uploads/2025/03/solar-LFGADCC.png',
    imageAlt: 'Solar panels installed across a large rooftop installation.',
    href: '#service-solar',
    focal: 'center 50%',
    span: 'tall',
  },
  {
    id: 'ev-network',
    title: 'EV Charging Networks',
    category: 'EV charging',
    description:
      'Charging infrastructure for workplaces, retail complexes and fleet depots, planned around peak demand and available grid capacity.',
    image:
      'https://viryacleantech.com/wp-content/uploads/elementor/thumbs/ev-charging-station-clean-energy-filling-technology-electric-car-charging-scaled-r6meidpw3yeqhqnfbk43plqnob1so02kx2zrxwbiag.jpg',
    imageAlt: 'Electric car connected to a public EV charging point.',
    href: '#service-ev-charging',
    focal: 'center 45%',
    span: 'normal',
  },
  {
    id: 'storage',
    title: 'Battery Storage Systems',
    category: 'Battery technology',
    description:
      'Storage paired with on-site generation to shift peak demand, maintain continuity and make better use of every unit generated.',
    image:
      'https://viryacleantech.com/wp-content/uploads/elementor/thumbs/female-maintenance-engineer-controls-the-work-of-w-2021-12-09-04-14-06-utc-r6meidpuek646827clcskxuzu6n5w9vjl7nfud2a88.jpg',
    imageAlt: 'Engineer inspecting energy storage equipment in an equipment room.',
    href: '#service-software-iot',
    focal: 'center 35%',
    span: 'normal',
  },
  {
    id: 'monitoring',
    title: 'Intelligent Energy Monitoring',
    category: 'Software & IoT',
    description:
      'Live dashboards and device telemetry so operators can see generation, consumption and charging behaviour in one place.',
    image:
      'https://viryacleantech.com/wp-content/uploads/2025/04/programming-background-with-html-1024x683.jpg',
    imageAlt: 'Energy monitoring software being developed on a workstation.',
    href: '#service-software-iot',
    focal: 'center 45%',
    span: 'wide',
  },
];