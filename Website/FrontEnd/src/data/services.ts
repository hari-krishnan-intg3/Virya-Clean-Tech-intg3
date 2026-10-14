/**
 * `LineChart` stands in for `ChartNoAxesCombined`, which is not present in the
 * pinned lucide-react version. Swap freely if the dependency is upgraded.
 */
export type IconName = 'Sun' | 'Zap' | 'Cpu' | 'LineChart';

export interface Service {
  /** Stable id — used for anchors, tracking and form pre-selection. */
  id: string;
  /** Position badge shown on the card. */
  index: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: IconName;
  image: string;
  imageAlt: string;
  highlights: string[];
}

export const services: Service[] = [
  {
    id: 'solar',
    index: '01',
    title: 'Solar Power Plant Design & Development',
    shortTitle: 'Solar Power',
    description:
      'From residential rooftops to large-scale commercial installations, we design and build high-performance solar systems tailored to your needs.',
    icon: 'Sun',
    image:
      'https://viryacleantech.com/wp-content/uploads/2025/03/solar-LFGADCC.png',
    imageAlt:
      'Engineer inspecting a photovoltaic solar array installed across a rooftop array.',
    highlights: ['Load & site assessment', 'System design & engineering', 'Rooftop to utility scale'],
  },
  {
    id: 'ev-charging',
    index: '02',
    title: 'EV Charging Infrastructure',
    shortTitle: 'EV Charging',
    description:
      'We develop fast, reliable, and smart EV charging stations to support the growing demand for electric mobility — from private setups to public networks.',
    icon: 'Zap',
    image:
      'https://viryacleantech.com/wp-content/uploads/elementor/thumbs/ev-charging-station-clean-energy-filling-technology-electric-car-charging-scaled-r6meidpw3yeqhqnfbk43plqnob1so02kx2zrxwbiag.jpg',
    imageAlt: 'Electric vehicle connected to a modern EV charging station.',
    highlights: ['AC & DC fast charging', 'Load management', 'Public & private deployment'],
  },
  {
    id: 'software-iot',
    index: '03',
    title: 'Custom Software & IoT Integration',
    shortTitle: 'IoT Integration',
    description:
      'Our tech team builds energy-focused software and IoT systems that enable real-time monitoring, smart energy management, and predictive maintenance.',
    icon: 'Cpu',
    image:
      'https://viryacleantech.com/wp-content/uploads/2025/04/programming-background-with-html-1024x683.jpg',
    imageAlt: 'Developer writing energy-monitoring software on a workstation.',
    highlights: ['Real-time dashboards', 'Predictive maintenance', 'Device & meter integration'],
  },
  {
    id: 'consulting',
    index: '04',
    title: 'Renewable Energy Consulting & Audits',
    shortTitle: 'Energy Audits',
    description:
      'We guide clients through their clean energy journey with consulting, feasibility studies, and detailed energy audits for optimized performance and savings.',
    icon: 'LineChart',
    image:
      'https://viryacleantech.com/wp-content/uploads/2025/04/business-person-planning-alternative-energies-1024x683.jpg',
    imageAlt: 'Consultant analysing alternative energy options on a tablet.',
    highlights: ['Energy audits', 'Feasibility studies', 'Compliance guidance'],
  },
];