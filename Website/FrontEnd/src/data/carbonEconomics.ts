import { visualAssets } from './visuals';

export interface CarbonSlide {
  id: string;
  tag: string;
  title: string;
  headline: string;
  description: string;
  metrics: { label: string; value: string }[];
  framework: string;
  image: string;
}

export const CARBON_SLIDES: CarbonSlide[] = [
  {
    id: 'ccts',
    tag: 'Indian Carbon Market',
    title: 'Carbon Credit Trading Scheme (CCTS)',
    headline: 'Transitioning Energy Savings (PAT) into Tradable Carbon Credits',
    description:
      'India’s Bureau of Energy Efficiency (BEE) and Ministry of Power are migrating the Perform, Achieve and Trade (PAT) scheme to the Indian Carbon Market (CCTS). Obligated industrial entities receive verified Carbon Credit Certificates (CCCs) for exceeding specific greenhouse gas emission intensity targets per unit of output.',
    metrics: [
      { label: 'Obligated Sectors', value: '13 Industrial Classes' },
      { label: 'Unit of Trade', value: '1 tCO2e / Certificate' },
      { label: 'Regulatory Overseer', value: 'BEE & CERC Trading' },
    ],
    framework: 'MoP Notification / BEE CCTS 2023-2026',
    image: visualAssets.industrial.src,
  },
  {
    id: 'cbam',
    tag: 'EU Export Compliance',
    title: 'EU Carbon Border Adjustment Mechanism (CBAM)',
    headline: 'Protecting Indian Steel, Aluminum & Chemical Exports from Border Tariffs',
    description:
      'Starting January 2026, European importers must surrender CBAM certificates reflecting the embedded carbon emissions of imported goods. Virya delivers direct Scope 1 and Scope 2 interval telemetry to replace prohibitive EU default emission penalization with certified actual site intensities.',
    metrics: [
      { label: 'Impacted Goods', value: 'Steel, Al, Cement, Fert.' },
      { label: 'Definitive Phase', value: 'Live 2026' },
      { label: 'Cost Protection', value: '€65–€95 / tCO2e' },
    ],
    framework: 'EU Regulation 2023/956 / DG CLIMA',
    image: visualAssets.dataCenterGreenPower.src,
  },
  {
    id: 'brsr',
    tag: 'SEBI Mandatory ESG',
    title: 'BRSR Core Scope 1, 2 & 3 Audit Assurance',
    headline: 'Audit-Grade GHG Accounting for Top 1000 Listed Indian Enterprises',
    description:
      'SEBI mandates the Business Responsibility and Sustainability Report (BRSR) Core with reasonable assurance requirements. Virya connects utility smart meters, captive solar inverters, and EVSE telemetry directly into GHG Protocol-compliant Scope 1 (fuel combustion) and Scope 2 (grid electricity) ledgers.',
    metrics: [
      { label: 'Compliance Scope', value: 'Top 1000 NSE/BSE' },
      { label: 'Assurance Standard', value: 'ISAE 3000 / ISAE 3410' },
      { label: 'Granularity', value: '15-Minute Interval Sync' },
    ],
    framework: 'SEBI Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122',
    image: visualAssets.engineering.src,
  },
  {
    id: 'macc',
    tag: 'Techno-Economic Ranking',
    title: 'Marginal Abatement Cost Curves (MACC)',
    headline: 'Ranking Industrial Decarbonization by Net Financial Return',
    description:
      'Prioritize capital allocation using Marginal Abatement Cost Curves that evaluate $/tCO2e abated against lifetime financial payback. On-site solar rooftop and fleet EV depot conversion generate strong negative abatement costs (saving money per ton mitigated) before evaluating long-tail storage.',
    metrics: [
      { label: 'Rooftop Solar Abatement', value: '-₹2,800 / tCO2e' },
      { label: 'Fleet EV Conversion', value: '-₹3,400 / tCO2e' },
      { label: 'BESS Arbitrage', value: '+₹450 / tCO2e' },
    ],
    framework: 'World Bank / McKinsey MACC Framework',
    image: visualAssets.solarCommercialRooftop.src,
  },
  {
    id: 'icp',
    tag: 'Internal Carbon Pricing',
    title: 'Internal Carbon Pricing (ICP) Shadow Modeling',
    headline: 'Factoring Carbon Risk into Corporate CapEx Approvals',
    description:
      'Leading manufacturing boards apply an internal shadow price of $25 to $65 per metric ton of CO2e to stress-test capital projects. Projects that substitute diesel generators or heavy grid tariffs with solar and storage yield elevated internal rates of return under ICP hurdle rates.',
    metrics: [
      { label: 'Shadow Price Band', value: '$25–$65 / tCO2e' },
      { label: 'IRR Uplift', value: '+320 to +480 bps' },
      { label: 'Risk Mitigation', value: 'Future Tariff Hikes' },
    ],
    framework: 'CDP / Carbon Pricing Leadership Coalition',
    image: visualAssets.storage.src,
  },
  {
    id: 'geoa',
    tag: 'Green Open Access',
    title: 'Green Energy Open Access (GEOA) Economics',
    headline: 'Procuring Off-Site Utility Renewables at Lowered 100 kW Thresholds',
    description:
      'The Ministry of Power’s Green Energy Open Access Rules lowered the open access transaction limit from 1 MW down to 100 kW. Captive and group captive structures enjoy significant cross-subsidy surcharge (CSS) and additional surcharge exemptions, securing levelized solar tariffs below ₹4.50/kWh.',
    metrics: [
      { label: 'Sanctioned Threshold', value: '100 kW Minimum' },
      { label: 'CSS Exemption', value: '100% for Captive' },
      { label: 'Tariff Delta', value: '₹3.50–₹5.00/kWh Savings' },
    ],
    framework: 'Electricity (Promoting RE through Green OA) Rules',
    image: visualAssets.wind.src,
  },
  {
    id: 'eaas',
    tag: 'Zero-Capex Financing',
    title: 'Energy-as-a-Service (EaaS) & RESCO Models',
    headline: 'Off-Balance-Sheet Decarbonization with Performance Guarantees',
    description:
      'Deploy multi-MW solar PV, high-power DC fleet EV charging hubs, and industrial BESS storage with zero upfront capital expenditure. Virya structures 15 to 25-year Power Purchase Agreements (PPAs) where your facility pays solely for delivered green kilowatt-hours at guaranteed sub-grid rates.',
    metrics: [
      { label: 'Upfront Capex', value: '₹0 / Zero Capital' },
      { label: 'Asset Treatment', value: 'Off-Balance Sheet OPEX' },
      { label: 'Performance SLA', value: '98.5% Uptime Guaranteed' },
    ],
    framework: 'RESCO PPA / IFRS 16 Lease Structure',
    image: visualAssets.heroCleantechHub.src,
  },
  {
    id: 'credits',
    tag: 'International Markets',
    title: 'Article 6 & Voluntary Carbon Markets (VCM)',
    headline: 'Monetizing High-Integrity Verified Emission Reductions',
    description:
      'High-impact clean energy microgrids and verified fleet electrification projects generate carbon credits certified under Verra VCS, Gold Standard, and Article 6.2 bilateral cooperative mechanisms, unlocking supplemental foreign exchange revenue streams.',
    metrics: [
      { label: 'Verra VCS Standard', value: 'VM0038 / ACM0002' },
      { label: 'Credit Liquidity', value: 'Global Registry Sync' },
      { label: 'Integrity Rating', value: 'ICVCM CCP-Eligible' },
    ],
    framework: 'Paris Agreement Article 6 / Verra VCS',
    image: visualAssets.gridModernizationSubstation.src,
  },
];

export interface MACCItem {
  technology: string;
  category: string;
  abatementCost: number; // in INR per tCO2e (negative means saves money)
  abatementPotential: string;
  payback: string;
  suitability: string;
}

export const MACC_RANKING: MACCItem[] = [
  {
    technology: 'Rooftop Solar PV (Captive Net Metering)',
    category: 'Renewable Power',
    abatementCost: -2850,
    abatementPotential: '450–1,800 tCO2e/yr per MWp',
    payback: '3.2–4.1 Years',
    suitability: 'Factories, PEB Warehouses, Tech Parks',
  },
  {
    technology: 'Fleet EV Depot Electrification (LCVs & 3W)',
    category: 'Electric Mobility',
    abatementCost: -3400,
    abatementPotential: '320–950 tCO2e/yr per 50-fleet',
    payback: '1.8–2.6 Years',
    suitability: 'Last-Mile Delivery, Logistics Fleets',
  },
  {
    technology: 'Lightweight Flexible CIGS Solar Mats',
    category: 'Renewable Power',
    abatementCost: -2100,
    abatementPotential: '380–1,400 tCO2e/yr per MWp',
    payback: '3.8–4.6 Years',
    suitability: 'Curved Roofs, Aged Metal Sheds',
  },
  {
    technology: 'Green Energy Open Access (GEOA Captive Solar)',
    category: 'Off-Site Clean Power',
    abatementCost: -1950,
    abatementPotential: '1,500–12,000 tCO2e/yr',
    payback: 'Immediate (PPA Discount)',
    suitability: 'Energy-Intensive Manufacturing',
  },
  {
    technology: 'Industrial BESS Peak Shaving & Arbitrage',
    category: 'Energy Storage',
    abatementCost: 450,
    abatementPotential: '180–650 tCO2e/yr per MWh',
    payback: '4.5–5.5 Years',
    suitability: 'Continuous Process Plants, Data Centers',
  },
  {
    technology: 'Solar-BESS Microgrid (Diesel Displacement)',
    category: 'Backup Hybrid',
    abatementCost: -1600,
    abatementPotential: '240–800 tCO2e/yr',
    payback: '2.9–3.7 Years',
    suitability: 'Unreliable Grid Areas, Hospitals',
  },
];
