import { BatteryCharging, Cpu, Gauge, Leaf, Sun, Wrench, Zap, type LucideIcon } from 'lucide-react';

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
    eyebrow: 'Clean energy, engineered for your site',
    headline: 'Build a clearer path to cleaner energy.',
    subtext:
      'Solar, EV charging, battery storage and connected-energy software can work together, but the right mix starts with your site. Explore the questions that shape a practical next step.',
    image: '/images/solar-array.jpg',
    imageAlt:
      'A wide field of solar panels catching warm evening light.',
    focal: 'center 52%',
  },
  {
    id: 'innovation',
    eyebrow: 'Systems work better in context',
    headline: 'Connect energy generation, storage and demand.',
    subtext:
      'Load patterns, operating hours, site infrastructure and project goals all influence what may be feasible. Bring those details together before choosing a technology or defining a project.',
    image: '/images/wind-energy.jpg',
    imageAlt: 'Wind turbines across a green landscape beneath a wide sky.',
    focal: 'center 48%',
  },
  {
    id: 'solar',
    eyebrow: 'Mobility meets site infrastructure',
    headline: 'Make room for the next generation of mobility.',
    subtext:
      'Charging needs depend on vehicle routes, dwell time and available electrical capacity. Start with how people and vehicles move through your site, then explore an infrastructure plan that fits.',
    image: '/images/electric-mobility.jpg',
    imageAlt: 'An electric vehicle connected to a charging cable.',
    focal: 'center 50%',
  },
];

/* ------------------------------------------------------------------ */
/* Ecosystem                                                           */
/* ------------------------------------------------------------------ */

export interface EcosystemNode {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
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
    description:
      'Solar generation converts site sunlight into electricity for facility use or export, subject to system design and local connection rules. Roof condition, shading, orientation and the site load help determine what can be assessed.',
    icon: Sun,
    accent: '#F59E0B',
    gradient: 'from-amber-400 to-amber-500',
    x: 50,
    y: 8,
  },
  {
    id: 'battery',
    label: 'Battery Technology',
    description:
      'Storage may hold energy for use at a different time or support selected operating needs. Its role depends on power requirements, duration, controls, safety measures and how it connects with the facility.',
    icon: BatteryCharging,
    accent: '#8B5CF6',
    gradient: 'from-violet-500 to-violet-600',
    x: 92,
    y: 50,
  },
  {
    id: 'ev',
    label: 'EV Charging',
    description:
      'Charging infrastructure serves vehicles according to their routes, dwell time and charging windows. Site layout, available electrical capacity, user access and network requirements influence the approach.',
    icon: Zap,
    accent: '#0EA5E9',
    gradient: 'from-sky-400 to-sky-500',
    x: 50,
    y: 92,
  },
  {
    id: 'systems',
    label: 'Intelligent Systems',
    description:
      'Connected systems can bring selected energy and equipment data into a shared operational view. Device compatibility, data access, connectivity and security requirements shape which monitoring or alerting functions are practical.',
    icon: Cpu,
    accent: '#10B981',
    gradient: 'from-emerald-400 to-emerald-600',
    x: 8,
    y: 50,
  },
];

/* Directed flows powering the animated connectors. */
export const ecosystemFlows: { from: string; to: string; label: string; description: string }[] = [
  {
    from: 'solar',
    to: 'battery',
    label: 'Store',
    description: 'Depending on system design, available solar generation may be stored for later use.',
  },
  {
    from: 'battery',
    to: 'ev',
    label: 'Support',
    description: 'Storage may support charging in some applications, subject to capacity, controls and operating requirements.',
  },
  {
    from: 'ev',
    to: 'systems',
    label: 'Monitor',
    description: 'Compatible charging equipment can provide session or status data for operational monitoring.',
  },
  {
    from: 'systems',
    to: 'solar',
    label: 'Review',
    description: 'Monitoring can help operators review generation and consumption data where the sources are connected.',
  },
];

/* ------------------------------------------------------------------ */
/* Why Virya                                                           */
/* ------------------------------------------------------------------ */

export interface Differentiator {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const differentiators: Differentiator[] = [
  {
    title: 'Innovation-Led Solutions',
    description:
      'We stay ahead of the curve with breakthrough technologies in EV charging, solar power, and battery systems — engineered for performance and efficiency.',
    icon: Cpu,
  },
  {
    title: 'Customized Approach',
    description:
      'No two clients are the same. We offer tailored solutions that align with your unique energy needs, ensuring maximum impact and value.',
    icon: Gauge,
  },
  {
    title: 'Technical Excellence',
    description:
      'Backed by a skilled team with deep industry knowledge, we deliver precision-engineered systems that meet the highest standards of quality and reliability.',
    icon: Wrench,
  },
  {
    title: 'Sustainability at Heart',
    description:
      'Our commitment goes beyond business — every solution we provide contributes to a cleaner planet and a more sustainable future.',
    icon: Leaf,
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