/**
 * Home-page copy that is not part of a service or industry definition.
 */
import { visualAssets } from './visuals';

export interface WhyWeStart {
  title: string;
  body: string;
}

/**
 * The three arguments that decide an engagement, stated up front rather than
 * buried in a brochure.
 */
export const whyWeStart: WhyWeStart[] = [
  {
    title: 'Site context',
    body: 'Facility type, location, energy data and existing systems frame the first review.',
  },
  {
    title: 'Operating needs',
    body: 'Hours, critical loads and charging windows shape the options worth assessing.',
  },
  {
    title: 'A clear next step',
    body: 'Agree on missing information, review scope and responsibilities before detailed work.',
  },
];

/** Strip that appears between the hero and the services grid. */
export const positioningLine =
  'Energy systems designed around how your site actually behaves.';

export interface UseCase {
  id: string;
  sector: string;
  title: string;
  problem: string;
  approach: string;
  benefit: string;
  metric: string;
  image: string;
  imageAlt: string;
}

/** Illustrative scenarios for project discovery across 8 core industry verticals. */
export const useCases: UseCase[] = [
  {
    id: 'daytime-facility',
    sector: 'Manufacturing & Industrial',
    title: 'Match On-Site Solar to Industrial Operating Shifts',
    problem:
      'Continuous 3-shift factories face steep maximum demand charges. Rigid rooftop solar can overload light-gauge PEB sheds without rigorous structural dead-load verification.',
    approach:
      'Compare 15-minute interval smart meter demand with roof dead-load ratings. Deploy high-efficiency N-Type TOPCon or ultra-lightweight 2.9 kg/m² flexible CIGS mats paired with DISCOM net-metering.',
    benefit:
      'Reduce daytime grid reliance by up to 65%, lock in levelized energy cost at ₹3.40/kWh, and claim 40% Year 1 accelerated depreciation tax shields.',
    metric:
      'Solar Self-Consumption Ratio: >92% on-site utilization. Demand shaving: 320 kW avoided peak penalty.',
    image: visualAssets.solarCommercialRooftop.src,
    imageAlt: 'Industrial commercial warehouse rooftop covered in high-efficiency solar panel arrays.',
  },
  {
    id: 'fleet-depot',
    sector: 'Transportation & Fleet Logistics',
    title: 'Electrify 100+ Commercial Vehicle Depots Without Grid Tripping',
    problem:
      'Simultaneous charging of 50+ commercial electric buses or delivery vans causes catastrophic 8MW+ transformer demand spikes that exceed sanctioned HT limits.',
    approach:
      'Deploy 60kW to 360kW dual-gun DC fast chargers orchestrated by dynamic OCPP 2.0.1 automated load balancing, priority departure algorithms, and containerized battery buffers.',
    benefit:
      'Flatten coincident peak electrical demand by 45%, lower per-km fuel costs from ₹11.50 (diesel) to ₹2.80 (EV), and guarantee 99.4% depot dispatch reliability.',
    metric:
      'Depot Uptime: 99.4% availability SLA. Coincident peak curtailed from 8.4 MW to 3.8 MW.',
    image: visualAssets.evBusDepot.src,
    imageAlt: 'Zero-emission electric bus and commercial fleet high-power charging depot.',
  },
  {
    id: 'critical-loads',
    sector: 'Healthcare & Critical Facilities',
    title: 'Sub-20ms Diesel Genset Displacement with Containerized BESS',
    problem:
      'Hospitals and critical facilities suffer noisy, high-polluting diesel generators running at expensive ₹24–₹28/kWh operating costs during brief voltage fluctuations.',
    approach:
      'Integrate containerized Lithium Iron Phosphate (LFP) stationary storage with active liquid cooling and static transfer switches for instantaneous microgrid islanding.',
    benefit:
      'Sub-20 millisecond automatic changeover eliminates surgical theater and imaging reboot interruptions while cutting auxiliary diesel fuel burn by up to 80%.',
    metric:
      'Transfer Switching: <18 ms. Diesel displacement: 72,000 Liters/year saved per 1MWh BESS.',
    image: visualAssets.storage.src,
    imageAlt: 'Containerized LFP battery energy storage system with BMS monitoring.',
  },
  {
    id: 'multi-site-visibility',
    sector: 'Real Estate & Multi-Site Portfolios',
    title: 'Consolidate Multi-Building Telemetry into Unified Cloud Glass',
    problem:
      'Disparate energy meters, tenant billing disputes, and lagged utility bills conceal energy waste, power factor penalties, and phase unbalance across nationwide properties.',
    approach:
      'Install IoT smart energy gateways on main HT and LT incomers with native Modbus/BACnet protocols, streaming 15-minute telemetry into Virya’s centralized operations cloud.',
    benefit:
      'Automate tenant sub-metering reconciliation, identify low power factor penalties before DISCOM billing, and benchmark building energy intensity per square foot.',
    metric:
      'Data Completeness: 99.9% telemetry uptime. Billing Reconciliation: 100% digital audit trace.',
    image: visualAssets.energyControl.src,
    imageAlt: 'Cloud SCADA energy operations dashboard monitoring multi-facility telemetry.',
  },
  {
    id: 'data-center-green',
    sector: 'Data Centers & Hyperscale Infrastructure',
    title: 'Achieve 24/7 Carbon-Free Energy for Mission-Critical Compute',
    problem:
      'Hyperscale AI workloads require continuous 24/7 power with strict 99.999% tier-IV reliability, making intermittent standalone renewables insufficient on their own.',
    approach:
      'Structure bilateral hybrid Wind-Solar Green Energy Open Access (GEOA) PPAs paired with dedicated on-site battery storage for round-the-clock green electron matching.',
    benefit:
      'Deliver Power Usage Effectiveness (PUE) below 1.28 while achieving 100% Scope 2 decarbonization compliant with global hyperscale tenant sustainability covenants.',
    metric:
      'Round-the-Clock Matching: 88% true 24/7 clean power. Carbon Intensity: 0.04 kg CO2e / kWh.',
    image: visualAssets.dataCenterGreenPower.src,
    imageAlt: 'Modern sustainable hyperscale data center powered by solar canopies and battery energy storage.',
  },
  {
    id: 'retail-hospitality',
    sector: 'Retail & Hospitality Networks',
    title: 'Turn Guest Parking into Destination Revenue with High-Power EVSE',
    problem:
      'Retail malls and luxury hotel chains face rising guest expectations for rapid EV charging but lack spare substation capacity during peak HVAC operating hours.',
    approach:
      'Install architectural solar carports integrated with smart DC fast chargers and dynamic load curtailment that automatically prioritizes hotel guest comfort during peak air conditioning loads.',
    benefit:
      'Monetize parking dwell times with automated payment gateways, enhance ESG hospitality ratings, and capture corporate fleet business travelers.',
    metric:
      'Guest Dwell Monetization: ₹18–₹22/kWh vend rate. Solar Carport Generation: 450 MWh/year.',
    image: visualAssets.evTwoWheeler.src,
    imageAlt: 'Electric scooter and vehicle charging at a modern public destination charging hub.',
  },
  {
    id: 'utilities-grid-modern',
    sector: 'Utilities & Grid Providers',
    title: 'Enhance Distribution Feeder Resiliency with Turnkey Substation EPC',
    problem:
      'Penetration of distributed rooftop solar creates reverse power flows, feeder voltage rise, and high harmonic distortion that trip legacy DISCOM distribution substations.',
    approach:
      'Engineer turnkey 11kV/33kV digital substations with numeric protection relays, automated on-load tap changers (OLTC), active harmonic filters, and SCADA connectivity.',
    benefit:
      'Maintain feeder voltage within statutory ±5% limits, eliminate harmonic penalties, and satisfy Central Electricity Authority (CEA) grid connectivity regulations.',
    metric:
      'Harmonic Distortion: THD < 2.8% (well within IEEE 519 limit). Feeder Tripping: Zero relay faults.',
    image: visualAssets.gridModernizationSubstation.src,
    imageAlt: 'Digital electrical substation and grid interconnection facility with high-voltage transformers.',
  },
  {
    id: 'carbon-cbam-export',
    sector: 'Heavy Industrial & Exporters',
    title: 'Mitigate EU CBAM Border Tariffs for Steel & Aluminum Exporters',
    problem:
      'Full phase-in of EU CBAM threatens Indian metal and engineering exporters with €70–€95/tCO2e border penalties due to fossil fuel-heavy grid electricity and thermal processes.',
    approach:
      'Conduct granular product-level embedded emissions accounting, model Marginal Abatement Cost Curves (MACC), and replace captive fossil power with bilateral clean PPAs.',
    benefit:
      'Mitigate up to 92% of gross CBAM border tax exposure, protect export operating margins in European markets, and satisfy SEBI BRSR Core assurance mandates.',
    metric:
      'Border Liability Reduced: Up to ₹14.2 Crores/year avoided on a 15,000-ton export volume.',
    image: visualAssets.siteAssessment.src,
    imageAlt: 'Comprehensive technical site assessment for industrial clean energy deployment.',
  },
];
