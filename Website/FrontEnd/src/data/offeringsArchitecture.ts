import {
  Truck,
  Zap,
  Sun,
  BatteryCharging,
  Cpu,
  LineChart,
  ShieldCheck,
  Factory,
  Warehouse,
  Building2,
  Activity,
  ShoppingBag,
  Wrench,
  Globe2,
  type LucideIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* 1. Mega Menu Offerings Architecture (8 Core CleanTech Pillars)     */
/* ------------------------------------------------------------------ */

export interface OfferingSubItem {
  label: string;
  to: string;
  description: string;
}

export interface OfferingPillar {
  id: string;
  title: string;
  to: string;
  icon: LucideIcon;
  tagline: string;
  items: OfferingSubItem[];
}

export const OFFERINGS_TREE: OfferingPillar[] = [
  {
    id: 'electric-mobility',
    title: 'Electric Mobility Infrastructure',
    to: '/services/ev-charging',
    icon: Zap,
    tagline: 'High-uptime depot, en-route, and destination EV charging networks.',
    items: [
      {
        label: 'Fleet Charging',
        to: '/services/ev-charging/fleets',
        description: 'Dedicated depot charging systems for delivery vans, logistics fleets, and heavy trucks.',
      },
      {
        label: 'Public Charging Networks',
        to: '/services/ev-charging',
        description: 'High-power DC fast charging hubs, highway corridors, and urban commercial charging.',
      },
      {
        label: 'Workplace & Community Charging',
        to: '/services/ev-charging/passenger',
        description: 'Smart AC charging solutions for corporate campuses, IT parks, and residential societies.',
      },
    ],
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy Infrastructure',
    to: '/services/solar',
    icon: Sun,
    tagline: 'High-yield solar PV, wind generation, and hybrid microgrid architectures.',
    items: [
      {
        label: 'Solar Energy Systems',
        to: '/services/solar',
        description: 'Rigid panels, lightweight flexible mats, and engineered commercial rooftop arrays.',
      },
      {
        label: 'Hybrid Energy Systems',
        to: '/services/wind-energy',
        description: 'Integrated solar-wind microgrids with synchronized power management and battery storage.',
      },
      {
        label: 'Energy Asset Management',
        to: '/services/consulting',
        description: 'Continuous telemetry, predictive maintenance, and degradation analytics for clean assets.',
      },
    ],
  },
  {
    id: 'battery-storage',
    title: 'Battery & Energy Storage',
    to: '/services/battery',
    icon: BatteryCharging,
    tagline: 'Commercial and industrial BESS for peak shaving and energy resilience.',
    items: [
      {
        label: 'Battery Storage Systems',
        to: '/services/battery',
        description: 'Containerized LFP battery storage engineered for peak shaving and power backup.',
      },
      {
        label: 'Battery Intelligence',
        to: '/services/battery',
        description: 'AI-driven State-of-Health (SoH), thermal run-away prevention, and cycle life prediction.',
      },
      {
        label: 'Battery Circular Economy',
        to: '/services/battery',
        description: 'Second-life battery repurposing, state diagnostics, and closed-loop recycling pathways.',
      },
    ],
  },
  {
    id: 'smart-platforms',
    title: 'Smart Energy Platforms',
    to: '/services/software-iot',
    icon: Cpu,
    tagline: 'Real-time telemetry, IoT orchestration, and automated energy optimization.',
    items: [
      {
        label: 'Energy Operations Platform',
        to: '/services/software-iot',
        description: 'Unified cloud dashboard for multi-facility power generation, load, and tariff tracking.',
      },
      {
        label: 'EV Software Platforms',
        to: '/services/ev-charging',
        description: 'OCPP 1.6J/2.0.1 compliant charge station management, automated billing, and RFID access.',
      },
      {
        label: 'AI & Analytics',
        to: '/services/software-iot',
        description: 'Predictive load shedding, day-ahead solar forecasting, and automated tariff arbitrage.',
      },
    ],
  },
  {
    id: 'grid-modernization',
    title: 'Grid Modernization',
    to: '/services/consulting',
    icon: LineChart,
    tagline: 'Future-ready utility interconnects, VPPs, and demand response networks.',
    items: [
      {
        label: 'Utility Solutions',
        to: '/services/consulting',
        description: 'Substation capacity studies, transformer headroom analysis, and harmonic filtering.',
      },
      {
        label: 'Smart Infrastructure',
        to: '/services/consulting',
        description: 'Virtual Power Plants (VPP), smart metering AMI, and bidirectional DER interconnections.',
      },
    ],
  },
  {
    id: 'sustainability-esg',
    title: 'Sustainability & ESG',
    to: '/services/consulting',
    icon: ShieldCheck,
    tagline: 'Science-based decarbonization and verifiable ESG compliance frameworks.',
    items: [
      {
        label: 'Decarbonization Solutions',
        to: '/services/consulting',
        description: 'Scope 1 & Scope 2 emissions reduction roadmaps with marginal abatement cost curves.',
      },
      {
        label: 'ESG & Climate Services',
        to: '/services/consulting',
        description: 'BRSR, CSRD, and CBAM export compliance reporting with audit-ready carbon telemetry.',
      },
    ],
  },
  {
    id: 'engineering-delivery',
    title: 'Engineering & Project Delivery',
    to: '/services/consulting',
    icon: Wrench,
    tagline: 'End-to-end feasibility, detailed design, and turnkey EPC execution.',
    items: [
      {
        label: 'Project Development',
        to: '/services/consulting',
        description: 'Site feasibility, statutory approvals, evacuation NOCs, and tariff feasibility modeling.',
      },
      {
        label: 'Engineering Services',
        to: '/services/consulting',
        description: 'Detailed civil, structural, single-line electrical (SLD), and protection relay coordination.',
      },
      {
        label: 'EPC & Deployment',
        to: '/services/consulting',
        description: 'Turnkey procurement, precision installation, commissioning, and grid synchronization.',
      },
    ],
  },
  {
    id: 'managed-services',
    title: 'Managed Services',
    to: '/services/consulting',
    icon: Globe2,
    tagline: 'Uptime guarantees, preventive maintenance, and zero-capex energy contracts.',
    items: [
      {
        label: 'Operations & Maintenance',
        to: '/services/consulting',
        description: '24/7 remote monitoring, rapid-dispatch field engineering, and guaranteed 98%+ uptime.',
      },
      {
        label: 'Energy-as-a-Service',
        to: '/services/consulting',
        description: 'Zero-capex OPEX models with per-kWh or subscription billing backed by performance SLAs.',
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 2. Industries Architecture (8 Market Segments & Outcomes)          */
/* ------------------------------------------------------------------ */

export interface MarketSegmentApplicationCard {
  offering: string; // EV Charging, Solar, BESS, Energy Platforms, AI Analytics, Grid Modernization, ESG, Managed Services
  title: string;
  spec: string;
  benefit: string;
  to: string;
}

export interface MarketSegment {
  slug: string;
  title: string;
  tagline: string;
  overview: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  applications: string[];
  applicationCards: MarketSegmentApplicationCard[];
  businessOutcomes: string[];
}

export const MARKET_SEGMENTS: MarketSegment[] = [
  {
    slug: 'transportation',
    title: 'Transportation & Mobility',
    tagline: 'Accelerating Fleet Electrification & Smart Mobility',
    overview:
      'Turn vehicle fleets from fossil cost centers into zero-emission distributed energy assets. Designed for transit authorities, logistics operators, e-commerce delivery networks, and highway charging corridor developers.',
    icon: Truck,
    image: '/images/generated-fleet-depot.jpg',
    imageAlt: 'Commercial fleet depot with dedicated DC fast chargers',
    applications: [
      'Fleet Charging Infrastructure',
      'Bus Depot Electrification',
      'Truck Charging Networks',
      'Last-Mile Delivery Charging',
      'Public EV Charging Hubs',
      'Route Energy Optimization',
      'Battery Swapping Infrastructure',
      'Mobility Energy Analytics',
    ],
    applicationCards: [
      {
        offering: 'EV Charging',
        title: 'Depot & Highway High-Power DCFC',
        spec: '60 kW to 360 kW Dual-Gun CCS2 & Pantograph',
        benefit: 'Enables rapid 15–45 min turnaround for buses and delivery trucks with managed peak demand.',
        to: '/services/ev-charging/fleets',
      },
      {
        offering: 'Solar',
        title: 'Depot Canopy & Rooftop PV',
        spec: '100 kWp to 2 MWp Solar Carports',
        benefit: 'Powers daytime depot operations directly with zero-marginal-cost renewable electricity.',
        to: '/services/solar/rooftop',
      },
      {
        offering: 'BESS',
        title: 'Depot Peak-Shaving Battery Systems',
        spec: '250 kWh to 2 MWh Containerized LFP',
        benefit: 'Eliminates utility demand surcharges during simultaneous high-current fleet charging cycles.',
        to: '/services/battery',
      },
      {
        offering: 'Energy Platforms',
        title: 'Smart Charge & Telematics Orchestration',
        spec: 'OCPP 2.0.1 + ISO 15118 Smart Load Balancing',
        benefit: 'Dynamically shifts charging blocks to cheapest tariff windows while guaranteeing departure SoC.',
        to: '/services/software-iot',
      },
      {
        offering: 'AI Analytics',
        title: 'Route Energy & Degradation Forecasting',
        spec: 'Machine-learning battery health & range models',
        benefit: 'Predicts exact energy consumption per route considering payload, gradient, and temperature.',
        to: '/services/software-iot',
      },
      {
        offering: 'Grid Modernization',
        title: 'Depot Substation & Headroom Expansion',
        spec: '11kV/33kV HT yard engineering & active harmonics',
        benefit: 'Connects multi-megawatt depot loads without tripping local distribution feeders.',
        to: '/services/consulting',
      },
      {
        offering: 'ESG',
        title: 'Scope 1 Fleet Decarbonization Audit',
        spec: 'BRSR / GHG Protocol verified diesel displacement',
        benefit: 'Generates auditable proof of emissions avoided for corporate ESG reporting and carbon credits.',
        to: '/services/consulting',
      },
      {
        offering: 'Managed Services',
        title: 'Fleet-as-a-Service & O&M SLA',
        spec: '24/7 uptime guarantee + preventive depot maintenance',
        benefit: '99%+ charger availability backed by emergency on-site technician response.',
        to: '/services/consulting',
      },
    ],
    businessOutcomes: [
      '45% to 65% reduction in total operating cost per vehicle-kilometer compared to diesel',
      '100% on-time depot morning dispatch compliance through scheduled smart charging',
      'Zero local tailpipe emissions across urban delivery corridors',
      'Demand-charge penalty avoidance via synchronized BESS peak shaving',
    ],
  },
  {
    slug: 'manufacturing',
    title: 'Manufacturing & Industrial',
    tagline: 'Decarbonizing Energy-Intensive Operations',
    overview:
      'Heavy manufacturing, automotive plants, chemical processing, and metal fabrication face relentless power tariffs and impending carbon tariffs like EU CBAM. We engineer on-site generation, energy storage, and AI monitoring that protect margins.',
    icon: Factory,
    image: '/images/generated-industrial.jpg',
    imageAlt: 'Modern industrial manufacturing plant with clean energy management',
    applications: [
      'Industrial Solar Systems',
      'Industrial BESS (Battery Energy Storage Systems)',
      'Energy Monitoring Platforms',
      'Peak Demand Optimization',
      'Process Energy Analytics',
      'Microgrid Deployment',
      'Carbon Reduction Programs',
      'Industrial Electrification',
    ],
    applicationCards: [
      {
        offering: 'EV Charging',
        title: 'Plant Employee & Logistics Yard EVSE',
        spec: 'Dual 22kW AC + 60kW DC Yard Chargers',
        benefit: 'Powers factory material handling vehicles and employee commuting with green energy.',
        to: '/services/ev-charging/passenger',
      },
      {
        offering: 'Solar',
        title: 'High-Yield Rigid Industrial Rooftop PV',
        spec: '500 kWp to 5 MWp Mono PERC / TOPCon arrays',
        benefit: 'Cuts industrial daytime grid reliance by 30–60% with sub-₹3.50/unit levelized cost.',
        to: '/services/solar/rigid',
      },
      {
        offering: 'BESS',
        title: 'Industrial Peak Shaving & UPS Storage',
        spec: '500 kWh to 5 MWh High-C LFP storage',
        benefit: 'Protects sensitive CNC, robotic, and furnace lines against voltage sags and momentary outages.',
        to: '/services/battery',
      },
      {
        offering: 'Energy Platforms',
        title: 'Facility SCADA & Power Quality Dashboard',
        spec: 'Sub-second electrical telemetry & power factor',
        benefit: 'Detects harmonics, phase imbalances, and motor inefficiencies before equipment failures occur.',
        to: '/services/software-iot',
      },
      {
        offering: 'AI Analytics',
        title: 'Process Energy Intensity Optimization',
        spec: 'Multi-variable regression models for batch lines',
        benefit: 'Correlates energy draw with production output to minimize kWh consumed per finished unit.',
        to: '/services/software-iot',
      },
      {
        offering: 'Grid Modernization',
        title: 'Captive Open Access & HT Interconnection',
        spec: 'Interconnection engineering for 33kV/66kV lines',
        benefit: 'Enables wheeling of low-cost green wind and solar from off-site regional generation parks.',
        to: '/services/consulting',
      },
      {
        offering: 'ESG',
        title: 'EU CBAM & BRSR Decarbonization Readiness',
        spec: 'Product-level carbon footprinting (LCA ISO 14067)',
        benefit: 'Safeguards export competitiveness by certifying low embodied emissions in manufactured goods.',
        to: '/services/consulting',
      },
      {
        offering: 'Managed Services',
        title: 'Performance-Guaranteed Energy-as-a-Service',
        spec: 'Zero CAPEX, guaranteed per-kWh generation SLA',
        benefit: 'Provides turnkey industrial solar + storage with zero balance-sheet liability.',
        to: '/services/consulting',
      },
    ],
    businessOutcomes: [
      '₹1.2 Cr to ₹4.5 Cr annual power bill reduction on 2 MW+ industrial rooftop installations',
      'CBAM export readiness avoiding steep tariffs on goods shipped to international markets',
      'Protection of production uptime against grid dips, eliminating costly scrap losses',
      'Targeted 3–4 year capital payback backed by Tier-1 OEM equipment warranties',
    ],
  },
  {
    slug: 'logistics',
    title: 'Logistics & Warehousing',
    tagline: 'Powering Sustainable Supply Chains',
    overview:
      'Fulfillment hubs, cross-docks, and cold chain warehouses possess expansive roofs and heavy logistics power requirements. We turn these facilities into self-sustaining clean energy hubs that power both operations and delivery fleets.',
    icon: Warehouse,
    image: '/images/generated-warehouse.jpg',
    imageAlt: 'Automated warehouse and logistics distribution center',
    applications: [
      'Warehouse EV Charging',
      'Electric Fleet Infrastructure',
      'Smart Energy Management',
      'Distribution Center Solar',
      'Cold Chain Energy Systems',
      'Energy Storage Systems',
      'Fleet Operations Platform',
      'Sustainability Reporting',
    ],
    applicationCards: [
      {
        offering: 'EV Charging',
        title: 'Loading Bay Overnight EV Hubs',
        spec: '30kW–120kW DC fast chargers at loading docks',
        benefit: 'Charges 2-wheeler, 3-wheeler, and delivery vans during automated sorting and staging windows.',
        to: '/services/ev-charging/fleets',
      },
      {
        offering: 'Solar',
        title: 'Distribution Center Rooftop Solar',
        spec: 'Lightweight & Rigid PV for PEB metal sheds',
        benefit: 'Generates 100% of daytime lighting, conveyer, and sorting facility power from warehouse roof.',
        to: '/services/solar/rooftop',
      },
      {
        offering: 'BESS',
        title: 'Cold Storage Thermal & Electrical BESS',
        spec: 'Thermal energy storage + LFP batteries',
        benefit: 'Maintains critical cold chain temperatures during grid power interruptions with zero diesel.',
        to: '/services/battery',
      },
      {
        offering: 'Energy Platforms',
        title: 'Supply Chain Facility IoT Network',
        spec: 'Sub-metered zone energy & temperature telemetry',
        benefit: 'Monitors real-time cooling loads, dock door open cycles, and energy leakage across multi-tenant sheds.',
        to: '/services/software-iot',
      },
      {
        offering: 'AI Analytics',
        title: 'Predictive Cold-Chain Pre-Cooling',
        spec: 'Weather-integrated cooling optimization',
        benefit: 'Pre-chills cold storage spaces using peak solar generation hours before grid peak tariff kicks in.',
        to: '/services/software-iot',
      },
      {
        offering: 'Grid Modernization',
        title: 'Warehouse Park Shared Microgrid',
        spec: 'Multi-warehouse private distribution & metering',
        benefit: 'Distributes solar generation across multiple logistics tenants with dynamic billing.',
        to: '/services/consulting',
      },
      {
        offering: 'ESG',
        title: 'Scope 3 Logistics Customer Reporting',
        spec: 'Per-parcel emissions tracking framework',
        benefit: 'Allows logistics brands to provide green-shipping certification to major e-commerce clients.',
        to: '/services/consulting',
      },
      {
        offering: 'Managed Services',
        title: 'Warehouse Solar & EV Charger O&M',
        spec: 'Drone thermography & scheduled array washing',
        benefit: 'Maintains peak solar irradiance capture and 99% charger uptime throughout dry monsoon cycles.',
        to: '/services/consulting',
      },
    ],
    businessOutcomes: [
      'Zero-emission last-mile logistics fulfillment across Tier 1 & 2 urban zones',
      'Up to 40% reduction in cold storage cooling electricity costs via solar pre-cooling',
      'Full displacement of polluting diesel generators in warehousing zones',
      'Premium sustainability rating attracting top-tier global 3PL and retail tenants',
    ],
  },
  {
    slug: 'real-estate',
    title: 'Real Estate & Smart Buildings',
    tagline: 'Creating Intelligent Low-Carbon Properties',
    overview:
      'Commercial real estate, tech parks, luxury high-rises, and mixed-use communities require tenant EV charging, solar canopies, and automated sub-metering to attain LEED Platinum and IGBC Green ratings.',
    icon: Building2,
    image: '/images/generated-office.jpg',
    imageAlt: 'Sustainable commercial office building and tech park',
    applications: [
      'Residential EV Charging',
      'Commercial Building Charging',
      'Solar Rooftop Systems',
      'Building Energy Management',
      'Smart Metering',
      'Battery Backup Systems',
      'Green Building Analytics',
      'Tenant Energy Platforms',
    ],
    applicationCards: [
      {
        offering: 'EV Charging',
        title: 'Tenant Smart AC & DC Parking Chargers',
        spec: '7.4kW–22kW Smart AC with RFID & app billing',
        benefit: 'Shares existing building transformer capacity dynamically across hundreds of parking bays.',
        to: '/services/ev-charging/passenger',
      },
      {
        offering: 'Solar',
        title: 'Architectural Solar Carports & Rooftops',
        spec: 'BIPV & high-efficiency rooftop PV arrays',
        benefit: 'Transforms parking decks into energy-generating shaded amenities for corporate tenants.',
        to: '/services/solar/rooftop',
      },
      {
        offering: 'BESS',
        title: 'Clean Building Backup & Demand Shaving',
        spec: 'Quiet, indoor-rated modular BESS systems',
        benefit: 'Replaces smoky basement diesel generator testing with silent, instantaneous battery backup.',
        to: '/services/battery',
      },
      {
        offering: 'Energy Platforms',
        title: 'Tenant Energy & EV Billing Cloud',
        spec: 'Automated UPI, credit card, and corporate pass',
        benefit: 'Recovers electricity costs automatically without complex manual sub-meter reconciliation.',
        to: '/services/software-iot',
      },
      {
        offering: 'AI Analytics',
        title: 'HVAC & Lighting Load Prediction',
        spec: 'Occupancy-correlated climate management',
        benefit: 'Reduces building common-area energy consumption by 22% by matching HVAC to true footfall.',
        to: '/services/software-iot',
      },
      {
        offering: 'Grid Modernization',
        title: 'Net Metering & HT Substation Interfacing',
        spec: 'State discom net-metering approvals & bi-directional meters',
        benefit: 'Credits surplus weekend solar power back to the grid to offset weekday building demand.',
        to: '/services/consulting',
      },
      {
        offering: 'ESG',
        title: 'LEED & IGBC Green Building Certification',
        spec: 'Energy model simulation & compliance documentation',
        benefit: 'Commands 8–14% higher rental yields by securing gold/platinum green building credentials.',
        to: '/services/consulting',
      },
      {
        offering: 'Managed Services',
        title: 'Turnkey Tenant EV & Energy Operations',
        spec: 'Full facility management support and revenue share',
        benefit: 'Zero administrative headache for real estate developers while generating new amenity revenue.',
        to: '/services/consulting',
      },
    ],
    businessOutcomes: [
      'Higher commercial tenant retention and 8–14% rental yield premium from LEED Platinum status',
      'Zero electrical service panel overloading despite adding hundreds of EV charging points',
      'Automated tenant billing collecting 100% of EV charging and common-area power revenues',
      'Clean, silent basement parking operations eliminating diesel exhaust emissions',
    ],
  },
  {
    slug: 'utilities',
    title: 'Utilities & Energy Providers',
    tagline: 'Building the Grid of the Future',
    overview:
      'Distribution companies (DISCOMs), regional transmission operators, and independent power producers need to balance surging intermittent renewables and EV charging spikes with grid stability and reliability.',
    icon: Activity,
    image: '/images/generated-energy-network.jpg',
    imageAlt: 'Electric utility transmission grid and renewable substation',
    applications: [
      'Distributed Energy Resources',
      'Virtual Power Plants',
      'Smart Grid Monitoring',
      'Renewable Integration',
      'Grid Balancing Systems',
      'Demand Response Programs',
      'Utility Analytics',
      'Network Modernization',
    ],
    applicationCards: [
      {
        offering: 'EV Charging',
        title: 'V2G (Vehicle-to-Grid) Aggregation Nodes',
        spec: 'ISO 15118-20 bidirectional grid stabilization',
        benefit: 'Dispatches aggregated EV battery power back to the grid during severe peak demand hours.',
        to: '/services/ev-charging',
      },
      {
        offering: 'Solar',
        title: 'Utility Feeder Solar Integration',
        spec: 'Megawatt-scale ground mount & canal-top arrays',
        benefit: 'Supplies local daytime agricultural and industrial feeders without long transmission losses.',
        to: '/services/solar/rigid',
      },
      {
        offering: 'BESS',
        title: 'Grid-Scale Substation BESS (10MWh+)',
        spec: 'Frequency regulation & spinning reserve LFP systems',
        benefit: 'Stabilizes grid frequency within 50 Hz ± 0.05 Hz and mitigates sudden renewable ramp rates.',
        to: '/services/battery',
      },
      {
        offering: 'Energy Platforms',
        title: 'Virtual Power Plant (VPP) Orchestrator',
        spec: 'Aggregates thousands of distributed solar + BESS nodes',
        benefit: 'Enables real-time automated dispatch in state power exchange and ancillary service markets.',
        to: '/services/software-iot',
      },
      {
        offering: 'AI Analytics',
        title: 'Day-Ahead Renewable & EV Load Forecasting',
        spec: 'High-resolution weather and historical load AI models',
        benefit: 'Minimizes deviation settlement mechanism (DSM) penalties for distribution utilities.',
        to: '/services/software-iot',
      },
      {
        offering: 'Grid Modernization',
        title: 'Feeder Automation & Dynamic Line Rating',
        spec: 'Smart sensor integration & SCADA telemetry',
        benefit: 'Maximizes existing copper conductor transmission capacity without expensive line rebuilding.',
        to: '/services/consulting',
      },
      {
        offering: 'ESG',
        title: 'Renewable Purchase Obligation (RPO) Compliance',
        spec: 'Solar & Non-Solar RPO fulfillment validation',
        benefit: 'Assures compliance with regulatory targets and facilitates green energy certificate trading.',
        to: '/services/consulting',
      },
      {
        offering: 'Managed Services',
        title: 'Substation & Transmission Line O&M',
        spec: 'Thermal drone inspections & predictive relay testing',
        benefit: 'Drastically reduces forced outage rates across critical transmission corridors.',
        to: '/services/consulting',
      },
    ],
    businessOutcomes: [
      'Alleviation of distribution transformer overloading during peak evening charging hours',
      'Zero DSM penalty exposure via predictive day-ahead generation and load forecasting',
      'Unlocking of new ancillary services revenue from battery frequency regulation',
      'Accelerated integration of distributed solar and EV charging without capital-heavy line replacements',
    ],
  },
  {
    slug: 'government',
    title: 'Government & Public Infrastructure',
    tagline: 'Driving Sustainable Cities & Public Services',
    overview:
      'Municipal corporations, smart city development agencies, transit departments, and government institutions spearhead India’s national mission towards net-zero emissions and the PM E-DRIVE program.',
    icon: Building2,
    image: '/images/generated-campus.jpg',
    imageAlt: 'Smart city government public infrastructure and transit hub',
    applications: [
      'Public EV Infrastructure',
      'Smart City Energy Platforms',
      'Transit Electrification',
      'Municipal Solar Projects',
      'Government Fleet Charging',
      'Urban Energy Analytics',
      'Public Asset Monitoring',
      'Net-Zero Infrastructure Programs',
    ],
    applicationCards: [
      {
        offering: 'EV Charging',
        title: 'Municipal Public Hubs & Bus Depots',
        spec: 'Multi-gun fast chargers & automated e-bus depot yards',
        benefit: 'Accelerates public transit conversion under PM E-DRIVE and FAME-II frameworks.',
        to: '/services/ev-charging/buses',
      },
      {
        offering: 'Solar',
        title: 'Municipal Building & Water Treatment Solar',
        spec: 'Ground and rooftop PV for public utility sites',
        benefit: 'Slashes recurring municipal electricity bills for pumping stations and public offices.',
        to: '/services/solar/rooftop',
      },
      {
        offering: 'BESS',
        title: 'Critical Public Service Backup Storage',
        spec: 'Resilient emergency power for civic infrastructure',
        benefit: 'Keeps traffic networks, emergency centers, and municipal pumping online during severe grid failures.',
        to: '/services/battery',
      },
      {
        offering: 'Energy Platforms',
        title: 'Smart City Integrated Command Center (ICCC)',
        spec: 'City-wide energy and street-lighting telemetry',
        benefit: 'Centralizes visibility of public EV chargers, solar assets, and power consumption across city wards.',
        to: '/services/software-iot',
      },
      {
        offering: 'AI Analytics',
        title: 'Urban Emissions & Air Quality Mapping',
        spec: 'Correlated vehicular count & particulate sensors',
        benefit: 'Quantifies tangible public health gains and emission drops from transit electrification.',
        to: '/services/software-iot',
      },
      {
        offering: 'Grid Modernization',
        title: 'Smart Streetlighting & Underground Cabling',
        spec: 'Dimmable smart LED networks with EVSE charging hubs',
        benefit: 'Cuts municipal lighting power draw by 60% while embedding public EV charging curbside.',
        to: '/services/consulting',
      },
      {
        offering: 'ESG',
        title: 'Municipal Net-Zero Action Roadmaps',
        spec: 'City carbon inventory & Climate Action Plans',
        benefit: 'Positions municipal corporations to issue high-demand green municipal bonds.',
        to: '/services/consulting',
      },
      {
        offering: 'Managed Services',
        title: 'Public-Private Partnership (PPP) CPO Operations',
        spec: 'Build-Own-Operate-Transfer (BOOT) concessions',
        benefit: 'Deploys world-class public charging infrastructure at zero upfront cost to the civic treasury.',
        to: '/services/consulting',
      },
    ],
    businessOutcomes: [
      'Swift deployment of reliable public charging networks under PM E-DRIVE guidelines',
      '30% to 50% reduction in municipal municipal pumping and civic lighting electricity expenditures',
      'Measurable air quality improvement (PM2.5 / NOx reduction) along high-density transit corridors',
      'Unlocking low-cost climate finance through certified Green Municipal Bonds',
    ],
  },
  {
    slug: 'retail',
    title: 'Retail, Hospitality & Commercial Networks',
    tagline: 'Enhancing Customer Experience Through Clean Energy',
    overview:
      'Malls, shopping complexes, luxury hotels, highway dining plazas, and showroom chains attract high-spending EV drivers by offering destination fast charging and visible sustainability branding.',
    icon: ShoppingBag,
    image: '/images/generated-retail.jpg',
    imageAlt: 'Upscale retail destination and hospitality center with clean energy',
    applications: [
      'Destination EV Charging',
      'Retail Charging Hubs',
      'Hospitality Charging Solutions',
      'Solar Carports',
      'Smart Energy Platforms',
      'Carbon Monitoring',
      'Customer Engagement Analytics',
      'Sustainability Branding Programs',
    ],
    applicationCards: [
      {
        offering: 'EV Charging',
        title: 'Customer Destination Fast Charging',
        spec: '30kW–60kW DC Fast + 11kW AC Destination Posts',
        benefit: 'Increases customer dwell time and basket spend by 35% while providing hassle-free charging.',
        to: '/services/ev-charging/passenger',
      },
      {
        offering: 'Solar',
        title: 'Architectural Solar Entrance Canopies',
        spec: 'Bi-facial glass-on-glass solar structures',
        benefit: 'Lowers air-conditioning energy costs while projecting undeniable clean-energy leadership to guests.',
        to: '/services/solar/rigid',
      },
      {
        offering: 'BESS',
        title: 'Silent Hospitality Power Resilience',
        spec: 'Acoustically insulated indoor LFP storage',
        benefit: 'Delivers uninterrupted luxury guest experience without noisy, fume-emitting diesel generators.',
        to: '/services/battery',
      },
      {
        offering: 'Energy Platforms',
        title: 'Guest Loyalty & EV App Integration',
        spec: 'Seamless validation with mall rewards and dining vouchers',
        benefit: 'Allows retail centers to reward top shoppers with complimentary or discounted green charging.',
        to: '/services/software-iot',
      },
      {
        offering: 'AI Analytics',
        title: 'Retail Footfall & Charging Demand Heatmaps',
        spec: 'Predictive utilization and tariff optimization',
        benefit: 'Maximizes charging bay turnover and parking monetization during weekend peak hours.',
        to: '/services/software-iot',
      },
      {
        offering: 'Grid Modernization',
        title: 'Commercial Sub-metering & Load Balancing',
        spec: 'Automated dynamic current throttling',
        benefit: 'Prevents commercial facility main breaker trips when chargers and heavy HVAC run together.',
        to: '/services/consulting',
      },
      {
        offering: 'ESG',
        title: 'Green Stay & Carbon-Neutral Retail Badging',
        spec: 'Guest carbon-offset certificate generator',
        benefit: 'Satisfies corporate travel procurement guidelines for Fortune 500 corporate room bookings.',
        to: '/services/consulting',
      },
      {
        offering: 'Managed Services',
        title: 'Turnkey Revenue-Share CPO Concession',
        spec: 'Virya invests, deploys, maintains; property earns revenue share',
        benefit: 'Creates an immediate recurring passive revenue stream with zero technical overhead.',
        to: '/services/consulting',
      },
    ],
    businessOutcomes: [
      '+35% higher average retail dwell time leading to verified increases in dining and retail spend',
      'Immediate net-positive recurring revenue from public EV charging utilization margins',
      'Preferred selection by corporate travelers demanding verified sustainable accommodation',
      'Substantial electricity bill savings via solar carport self-consumption',
    ],
  },
  {
    slug: 'data-centers',
    title: 'Data Centers & Digital Infrastructure',
    tagline: 'Enabling Resilient and Sustainable Digital Operations',
    overview:
      'Hyperscale facilities, colocation hubs, and AI cloud clusters consume continuous gigawatt-hours and require 99.999% uptime. We engineer round-the-clock clean energy architectures that displace diesel and achieve sub-1.25 PUE.',
    icon: Cpu,
    image: '/images/generated-battery-room.jpg',
    imageAlt: 'Mission-critical data center power infrastructure and battery room',
    applications: [
      'Data Center Energy Optimization',
      'Battery Energy Storage Systems',
      'Renewable Power Integration',
      'Backup Power Systems',
      'AI-Based Energy Analytics',
      'Energy Resilience Platforms',
      'Carbon Management',
      'Mission-Critical Infrastructure Monitoring',
    ],
    applicationCards: [
      {
        offering: 'EV Charging',
        title: 'Campus Employee & Operations EV Hub',
        spec: 'Automated 22kW AC + 60kW DC secured chargers',
        benefit: 'Serves campus engineering staff and critical operations vehicles with green power.',
        to: '/services/ev-charging/passenger',
      },
      {
        offering: 'Solar',
        title: 'Campus Solar & Direct PPA Integration',
        spec: 'High-voltage DC coupled solar arrays',
        benefit: 'Powers chilled water loops and auxiliary facility loads directly with zero transmission overhead.',
        to: '/services/solar/rigid',
      },
      {
        offering: 'BESS',
        title: 'Megawatt UPS & Grid-Forming BESS',
        spec: 'Sub-4 millisecond transfer LFP / Sodium-ion systems',
        benefit: 'Provides instantaneous transition during utility trips, replacing dirty diesel spinning reserves.',
        to: '/services/battery',
      },
      {
        offering: 'Energy Platforms',
        title: 'DCIM (Data Center Infrastructure Management)',
        spec: 'Real-time rack-level kW & thermal monitoring',
        benefit: 'Eliminates hot spots, optimizes chilled air velocity, and drives PUE down to industry-leading levels.',
        to: '/services/software-iot',
      },
      {
        offering: 'AI Analytics',
        title: 'Predictive Cooling & AI Workload Shifting',
        spec: 'Neural networks predicting thermal loads 15 min ahead',
        benefit: 'Dynamically modulates chiller speeds and cooling towers to match incoming compute bursts.',
        to: '/services/software-iot',
      },
      {
        offering: 'Grid Modernization',
        title: 'Dedicated Dual-Feeder 110kV/220kV Substation',
        spec: 'Ultra-low impedance transformers & bus-tie automation',
        benefit: 'Guarantees uninterrupted dual-path transmission from independent grid substations.',
        to: '/services/consulting',
      },
      {
        offering: 'ESG',
        title: '24/7 Carbon-Free Energy (CFE) Matching',
        spec: 'Hourly energy-attribute certificate (EAC) reconciliation',
        benefit: 'Proves true hour-by-hour zero carbon computing to meet strict hyperscaler mandates (Google/Microsoft).',
        to: '/services/consulting',
      },
      {
        offering: 'Managed Services',
        title: 'Mission-Critical 24/7 Engineering SLA',
        spec: 'Dedicated on-site electrical engineers & 15-min MTTR',
        benefit: 'Guarantees Tier-IV 99.999% availability standards across all clean energy power trains.',
        to: '/services/consulting',
      },
    ],
    businessOutcomes: [
      'PUE reduction from 1.55+ down to sub-1.25, saving tens of millions in annual cooling costs',
      '100% elimination of routine diesel generator run-up tests and associated localized soot emissions',
      'Audit-ready 24/7 carbon-free energy certification demanded by global cloud hyperscalers',
      'Rock-solid five-nines (99.999%) mission-critical power reliability backed by battery UPS',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 3. Real EV Vehicle Database with Concrete Charging Performance     */
/* ------------------------------------------------------------------ */

export interface EvModelDetail {
  name: string;
  category: 'passenger' | 'two-wheelers' | 'three-wheelers' | 'buses' | 'fleets';
  batteryKwh: number;
  chemistry: string;
  realRangeKm: number;
  acCharging: string;
  acTimeHours: string;
  dcFastCharging: string;
  dcTimeMinutes: string;
  connectorType: string;
  idealApplication: string;
}

export const EV_VEHICLE_DATABASE: EvModelDetail[] = [
  // Passenger Cars
  {
    name: 'Tata Nexon EV (Long Range)',
    category: 'passenger',
    batteryKwh: 45,
    chemistry: 'LFP (Lithium Iron Phosphate)',
    realRangeKm: 320,
    acCharging: '7.2 kW AC Single-Phase',
    acTimeHours: '6.0 hours (10–100%)',
    dcFastCharging: '50 kW DC Fast',
    dcTimeMinutes: '56 mins (10–80%)',
    connectorType: 'CCS2 / Type 2 AC',
    idealApplication: 'Daily corporate commute, executive travel, personal use, urban mobility.',
  },
  {
    name: 'MG ZS EV',
    category: 'passenger',
    batteryKwh: 50.3,
    chemistry: 'Prismatic LFP',
    realRangeKm: 340,
    acCharging: '7.4 kW AC Single-Phase',
    acTimeHours: '8.0 hours (0–100%)',
    dcFastCharging: '50 kW DC Fast',
    dcTimeMinutes: '60 mins (10–80%)',
    connectorType: 'CCS2 / Type 2 AC',
    idealApplication: 'Workplace parking, destination charging at retail hubs, intercity corridors.',
  },
  {
    name: 'Hyundai Ioniq 5 (800V Architecture)',
    category: 'passenger',
    batteryKwh: 72.6,
    chemistry: 'High-Density NMC',
    realRangeKm: 480,
    acCharging: '11 kW AC 3-Phase',
    acTimeHours: '6.2 hours (10–100%)',
    dcFastCharging: '350 kW Ultra-Fast (HPC)',
    dcTimeMinutes: '18 mins (10–80%)',
    connectorType: 'CCS2 with Plug & Charge',
    idealApplication: 'High-speed highway travel, premier corporate executive fleets, ultra-fast charging.',
  },
  {
    name: 'Mahindra XUV400 EV',
    category: 'passenger',
    batteryKwh: 39.4,
    chemistry: 'High-Energy NMC',
    realRangeKm: 295,
    acCharging: '7.2 kW AC',
    acTimeHours: '6.5 hours (0–100%)',
    dcFastCharging: '50 kW DC Fast',
    dcTimeMinutes: '50 mins (0–80%)',
    connectorType: 'CCS2 / Type 2 AC',
    idealApplication: 'Campus fleets, residential community parking, shared company vehicles.',
  },

  // 2-Wheelers
  {
    name: 'Ather 450X (Gen 3 / Apex)',
    category: 'two-wheelers',
    batteryKwh: 3.7,
    chemistry: 'IP67 Liquid-Cooled NMC',
    realRangeKm: 110,
    acCharging: '700W Home AC Dot Charger',
    acTimeHours: '5.7 hours (0–100%)',
    dcFastCharging: 'Ather Grid High-Rate Fast',
    dcTimeMinutes: '50 mins (0–80%) or 1.5 km/min',
    connectorType: 'Ather Proprietary / IEC 62196-6',
    idealApplication: 'Urban commuting, campus transport, tech-park employee mobility.',
  },
  {
    name: 'Ola S1 Pro (Gen 2)',
    category: 'two-wheelers',
    batteryKwh: 4.0,
    chemistry: 'High-Capacity NMC',
    realRangeKm: 145,
    acCharging: '750W Portable Home Charger',
    acTimeHours: '6.5 hours (0–100%)',
    dcFastCharging: 'Ola Hypercharger Fast',
    dcTimeMinutes: '15 mins for 50 km top-up',
    connectorType: 'Combined AC/DC proprietary port',
    idealApplication: 'Daily high-mileage urban commuting, gig delivery delivery personnel.',
  },
  {
    name: 'TVS iQube Electric',
    category: 'two-wheelers',
    batteryKwh: 3.4,
    chemistry: 'Aluminum Cased LFP',
    realRangeKm: 100,
    acCharging: '650W Offboard Smart Charger',
    acTimeHours: '4.5 hours (0–80%)',
    dcFastCharging: 'Standard AC Priority',
    dcTimeMinutes: 'Opportunity top-up recommended',
    connectorType: 'Standard 15A 3-pin plug',
    idealApplication: 'Family commuting, residential society parking, campus logistics.',
  },
  {
    name: 'Battery Swappable Standard 2W',
    category: 'two-wheelers',
    batteryKwh: 2.0,
    chemistry: 'Modular Swappable LFP/NMC',
    realRangeKm: 65,
    acCharging: 'Bulk Station Multi-Pack Charging',
    acTimeHours: '2.5 hours in automated kiosk',
    dcFastCharging: 'Instantaneous Pack Swap',
    dcTimeMinutes: '1.5 mins swap duration',
    connectorType: 'Ruggedized Blind-Mate Swappable',
    idealApplication: 'High-density Q-commerce delivery, Swiggy/Zomato fleets, 24/7 uptime operations.',
  },

  // 3-Wheelers
  {
    name: 'Mahindra Treo (Passenger Auto)',
    category: 'three-wheelers',
    batteryKwh: 7.37,
    chemistry: 'Long-Life LFP',
    realRangeKm: 130,
    acCharging: '3.7 kW Onboard AC Charger',
    acTimeHours: '3.8 hours (0–100%)',
    dcFastCharging: 'Rapid top-up compatible',
    dcTimeMinutes: '80 mins (20–80%)',
    connectorType: 'IEC 60309 16A Industrial Plug',
    idealApplication: 'First/last mile public transit, metro station feeder routes, urban passenger transport.',
  },
  {
    name: 'Piaggio Ape E-City / E-Xtra',
    category: 'three-wheelers',
    batteryKwh: 8.0,
    chemistry: 'Robust LFP Pack',
    realRangeKm: 105,
    acCharging: '3.0 kW AC',
    acTimeHours: '3.5 hours (0–100%)',
    dcFastCharging: 'Automated Swapping Option',
    dcTimeMinutes: '2 mins (Battery Swap Kiosk)',
    connectorType: 'Universal 16A industrial or quick-swap',
    idealApplication: 'City freight, municipal solid waste collection, intra-city courier deliveries.',
  },
  {
    name: 'Euler HiLoad EV (Cargo Auto)',
    category: 'three-wheelers',
    batteryKwh: 12.4,
    chemistry: 'Liquid-Cooled LFP (Thermal Regulated)',
    realRangeKm: 120,
    acCharging: '3.3 kW AC Onboard',
    acTimeHours: '4.0 hours (0–100%)',
    dcFastCharging: 'Fast DC Hub Support',
    dcTimeMinutes: '15 mins for 50 km range',
    connectorType: 'Type 2 AC / DC Fast Port',
    idealApplication: 'Heavy payload urban cargo (688 kg payload), FMCG distribution, cold grocery routes.',
  },

  // Buses
  {
    name: 'Olectra K9 / CX2 Electric Bus',
    category: 'buses',
    batteryKwh: 360,
    chemistry: 'Advanced LFP Chemistry',
    realRangeKm: 280,
    acCharging: 'Dual Gun Depot AC (Optional)',
    acTimeHours: 'Overnight trickle balance',
    dcFastCharging: '150 kW Dual-Gun CCS2 DC',
    dcTimeMinutes: '110 mins (10–80%)',
    connectorType: 'Dual CCS2 Connectors',
    idealApplication: 'State transport corporations (STUs), municipal transit systems, long airport routes.',
  },
  {
    name: 'Tata Starbus EV (Ultra 9/12m)',
    category: 'buses',
    batteryKwh: 250,
    chemistry: 'High-Safety LFP Cell Architecture',
    realRangeKm: 200,
    acCharging: 'Depot Scheduled AC/DC',
    acTimeHours: 'Overnight managed charging',
    dcFastCharging: '120 kW to 180 kW CCS2 DC',
    dcTimeMinutes: '90 mins (20–80%)',
    connectorType: 'Dual CCS2 Inlets',
    idealApplication: 'City feeder bus lines, corporate employee shuttle routes, university campus transit.',
  },
  {
    name: 'Terminal Opportunity Pantograph Bus',
    category: 'buses',
    batteryKwh: 180,
    chemistry: 'High-Rate Fast-Charge LFP',
    realRangeKm: 140,
    acCharging: 'Depot overnight balancing',
    acTimeHours: '3.5 hours',
    dcFastCharging: '300 kW–450 kW Inverted Pantograph',
    dcTimeMinutes: '12–15 mins terminal recharge',
    connectorType: 'Top-Down Inverted Pantograph (SAE J3105)',
    idealApplication: 'High-frequency BRTS bus corridors with rapid layover recharges at terminal gates.',
  },

  // Commercial Fleets & Heavy Duty
  {
    name: 'Tata Ace EV (SCV Delivery)',
    category: 'fleets',
    batteryKwh: 21.3,
    chemistry: 'Evogen Liquid-Cooled LFP',
    realRangeKm: 154,
    acCharging: '3.3 kW AC Onboard',
    acTimeHours: '6.5 hours (0–100%)',
    dcFastCharging: '10 kW–25 kW DC Fast',
    dcTimeMinutes: '105 mins (10–80%)',
    connectorType: 'CCS2 Combined Connector',
    idealApplication: 'Last-mile retail distribution, e-commerce parcels, pharmaceutical urban deliveries.',
  },
  {
    name: 'Ashok Leyland IeV Series (IeV3/IeV4)',
    category: 'fleets',
    batteryKwh: 32.2,
    chemistry: 'Commercial Grade LFP',
    realRangeKm: 120,
    acCharging: '3.3 kW AC',
    acTimeHours: '8.0 hours',
    dcFastCharging: '30 kW DC Fast',
    dcTimeMinutes: '60 mins (20–80%)',
    connectorType: 'CCS2 Inlets',
    idealApplication: 'Intercity agricultural produce transport, wholesale parcel movement.',
  },
  {
    name: 'Heavy-Duty 40–55 Ton Electric Hauler',
    category: 'fleets',
    batteryKwh: 380,
    chemistry: 'High-Capacity Thermal-Liquid LFP',
    realRangeKm: 220,
    acCharging: 'Depot 44kW 3-Phase AC',
    acTimeHours: '8.5 hours overnight',
    dcFastCharging: '240 kW Dual CCS2 / Megawatt MCS',
    dcTimeMinutes: '35 mins on MCS / 75 mins on dual CCS2',
    connectorType: 'Dual CCS2 or MCS (Megawatt Charging System)',
    idealApplication: 'Port container evacuation, cement plant raw materials, steel coil corridor hauling.',
  },
];

/* ------------------------------------------------------------------ */
/* 4. Complete Offices & Operational Hubs Across India                */
/* ------------------------------------------------------------------ */

export interface OfficeHub {
  city: string;
  state: string;
  role: string;
  address: string;
  coordinates: [number, number];
  phone: string;
  email: string;
  specialization: string;
  isHeadquarters?: boolean;
}

export const HUBS_ACROSS_INDIA: OfficeHub[] = [
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    role: 'Central Headquarters & Technology Engineering Center',
    address: 'No 2, 1st Floor, No 113, Yogjam Sai Charan Layout, Bengaluru, Karnataka 560036',
    coordinates: [12.9716, 77.5946],
    phone: '+91 8317494969',
    email: 'connect@viryacleantech.com',
    specialization: 'Core engineering, software platforms, hardware architecture & leadership.',
    isHeadquarters: true,
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    role: 'Regional CleanTech & BESS Delivery Hub',
    address: 'Hitec City Knowledge Corridor, Madhapur, Hyderabad, Telangana 500081',
    coordinates: [17.385, 78.4867],
    phone: '+91 8317494969',
    email: 'connect@viryacleantech.com',
    specialization: 'Industrial solar, commercial BESS, and data-center microgrid solutions.',
  },
  {
    city: 'Panaji, Goa',
    state: 'Goa',
    role: 'Coastal & Hospitality Energy Hub',
    address: 'Patto Centre, Commercial Plaza, Panaji, Goa 403001',
    coordinates: [15.4909, 73.8278],
    phone: '+91 8317494969',
    email: 'connect@viryacleantech.com',
    specialization: 'Hospitality destination charging, solar carports, and coastal resilience.',
  },
  {
    city: 'Mysuru',
    state: 'Karnataka',
    role: 'Industrial & Automotive CleanTech Desk',
    address: 'Hebbal Industrial Area, Mysuru, Karnataka 570016',
    coordinates: [12.2958, 76.6394],
    phone: '+91 8317494969',
    email: 'connect@viryacleantech.com',
    specialization: 'Automotive manufacturing solar rooftops and factory peak demand shaving.',
  },
  {
    city: 'Mangaluru',
    state: 'Karnataka',
    role: 'Maritime & Port Logistics CleanTech Desk',
    address: 'Panambur Port Area, Mangaluru, Karnataka 575010',
    coordinates: [12.9141, 74.856],
    phone: '+91 8317494969',
    email: 'connect@viryacleantech.com',
    specialization: 'Port equipment electrification, heavy hauler charging, and coastal solar.',
  },
  {
    city: 'Kozhikode',
    state: 'Kerala',
    role: 'North Kerala Commercial & Agro Hub',
    address: 'Cyberpark Campus, Kozhikode, Kerala 673016',
    coordinates: [11.2588, 75.7804],
    phone: '+91 8317494969',
    email: 'connect@viryacleantech.com',
    specialization: 'Cold chain solar systems, agro-processing energy efficiency, and commercial EV hubs.',
  },
  {
    city: 'Kochi',
    state: 'Kerala',
    role: 'Kerala Regional Operations & Marine CleanTech Hub',
    address: 'Infopark Phase 1, Kakkanad, Kochi, Kerala 682042',
    coordinates: [9.9312, 76.2673],
    phone: '+91 8317494969',
    email: 'connect@viryacleantech.com',
    specialization: 'Commercial building microgrids, solar open access, and urban transit EV charging.',
  },
  {
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    role: 'Public Infrastructure & Smart City Desk',
    address: 'Technopark Campus, Kazhakoottam, Thiruvananthapuram, Kerala 695581',
    coordinates: [8.5241, 76.9366],
    phone: '+91 8317494969',
    email: 'connect@viryacleantech.com',
    specialization: 'Government smart city platforms, transit e-bus depots, and net-zero institutions.',
  },
  {
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    role: 'Coastal Industrial & Heavy Logistics Hub',
    address: 'Dwaraka Nagar Commercial Hub, Visakhapatnam, Andhra Pradesh 530016',
    coordinates: [17.6868, 83.2185],
    phone: '+91 8317494969',
    email: 'connect@viryacleantech.com',
    specialization: 'Heavy manufacturing decarbonization, port hauler charging, and solar PV farms.',
  },
  {
    city: 'Kayathar, Tamil Nadu',
    state: 'Tamil Nadu',
    role: 'South Tamil Nadu Wind Energy Operational Corridor',
    address: 'Kayathar Wind Farm Operational Junction, Thoothukudi District, Tamil Nadu 628521',
    coordinates: [8.95, 77.75],
    phone: '+91 8317494969',
    email: 'connect@viryacleantech.com',
    specialization: 'High-speed wind turbine monitoring, substation evacuation, and hybrid solar-wind parks.',
  },
];
