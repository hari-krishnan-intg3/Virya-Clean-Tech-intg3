import { BatteryCharging, Cpu, Gauge, Leaf, Sun, Wrench, Zap, type LucideIcon } from 'lucide-react';
import { visualAssets } from './visuals';

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
  /** Focal point of the illustration so cropping stays stable across breakpoints. */
  focal: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'future',
    eyebrow: 'ENGINEERING INDIA’S ENERGY TRANSITION',
    headline: 'Industrial Clean Energy, Engineered to Scale.',
    subtext:
      'Virya integrates multi-MW solar PV, high-power EV charging (3.3kW to 350kW MCS), containerized LFP battery storage, and cloud SCADA telemetry—synchronized directly to your facility’s real operating loads.',
    image: visualAssets.heroCleantechHub.src,
    imageAlt: visualAssets.heroCleantechHub.alt,
    focal: 'center 52%',
  },
  {
    id: 'solar-rooftop',
    eyebrow: 'HIGH-YIELD RENEWABLE ARCHITECTURES',
    headline: 'Multi-MW Solar PV, Flexible Mats & Microgrids.',
    subtext:
      'Engineered for factories, warehouses, and commercial properties. Deploy high-efficiency rigid monocrystalline arrays (22.5%+ efficiency) or lightweight CIGS flexible mats for curved PEB roofs with zero structural risk.',
    image: visualAssets.solarCommercialRooftop.src,
    imageAlt: visualAssets.solarCommercialRooftop.alt,
    focal: 'center 48%',
  },
  {
    id: 'ev-mobility',
    eyebrow: 'ELECTRIC MOBILITY & FLEET DECARBONIZATION',
    headline: 'Megawatt Fleet Depots & Highway EV Corridors.',
    subtext:
      'Turn fleet vehicles into distributed energy assets. High-throughput DC fast chargers for transit buses, commercial haulers, and two/three-wheelers with ISO 15118 dynamic load balancing and automated billing.',
    image: visualAssets.evBusDepot.src,
    imageAlt: visualAssets.evBusDepot.alt,
    focal: 'center 50%',
  },
  {
    id: 'bess-storage',
    eyebrow: 'CONTAINERIZED BATTERY ENERGY STORAGE',
    headline: 'Utility-Grade LFP BESS & Millisecond Peak Shaving.',
    subtext:
      'Containerized lithium iron phosphate (LFP) energy storage with liquid thermal management, sub-4ms transfer times, and AI-driven Time-of-Day tariff arbitrage that cuts peak demand charges by up to 45%.',
    image: visualAssets.storage.src,
    imageAlt: visualAssets.storage.alt,
    focal: 'center 50%',
  },
  {
    id: 'wind-generation',
    eyebrow: 'UTILITY-SCALE & COMMERCIAL WIND POWER',
    headline: 'High-Yield Wind Corridors & Southern Interconnection.',
    subtext:
      'Direct-drive and geared turbines (100kW to 3.5MW) optimized for the high-wind Kayathar and South Tamil Nadu funnels. Integrated with captive transmission pooling for round-the-clock green power.',
    image: visualAssets.wind.src,
    imageAlt: visualAssets.wind.alt,
    focal: 'center 50%',
  },
  {
    id: 'digital-microgrids',
    eyebrow: '24/7 MISSION-CRITICAL POWER RESILIENCE',
    headline: 'Hyperscale Microgrids & Data Center Green Power.',
    subtext:
      'Achieve 24/7 carbon-free operations with hybrid solar-wind PPAs, containerized BESS ride-through, and zero-diesel backup transitions designed for sub-1.25 PUE hyperscale digital infrastructure.',
    image: visualAssets.dataCenterGreenPower.src,
    imageAlt: visualAssets.dataCenterGreenPower.alt,
    focal: 'center 50%',
  },
  {
    id: 'smart-platforms',
    eyebrow: 'CLOUD SCADA & VIRTUAL POWER PLANTS',
    headline: 'Intelligent Energy Platforms & OCPP Orchestration.',
    subtext:
      'Sub-second telemetry monitoring, automated demand response, day-ahead neural network generation forecasting, and certified OCPP 2.0.1 charge station management across enterprise distributed energy assets.',
    image: visualAssets.industrial.src,
    imageAlt: visualAssets.industrial.alt,
    focal: 'center 50%',
  },
  {
    id: 'carbon-economics',
    eyebrow: 'DECARBONIZATION FINANCE & CARBON MARKETS',
    headline: 'Carbon Economics, CBAM Compliance & ESG Audits.',
    subtext:
      'Navigate the Indian Carbon Market (CCTS), mitigate EU CBAM carbon import tariffs, and generate audit-ready SEBI BRSR Core Scope 1, 2, and 3 disclosures backed by certified telemetry intervals.',
    image: visualAssets.engineering.src,
    imageAlt: visualAssets.engineering.alt,
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
    image: visualAssets.solar.src,
    imageAlt: visualAssets.solar.alt,
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
    image: visualAssets.ev.src,
    imageAlt: visualAssets.ev.alt,
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
    image: visualAssets.storage.src,
    imageAlt: visualAssets.storage.alt,
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
    image: visualAssets.energyControl.src,
    imageAlt: visualAssets.energyControl.alt,
    href: '#service-software-iot',
    focal: 'center 45%',
    span: 'wide',
  },
];