/**
 * Comprehensive CleanTech ROI Engine with 25-Year 5% Annual Compounding Tariff Escalation.
 * Aligned with PM Surya Ghar Muft Bijli Yojana, PM-KUSUM, PM E-DRIVE, and Commercial AD.
 */

export interface DiscomTariff {
  state: string;
  discom: string;
  residentialAvgKwh: number;
  commercialAvgKwh: number;
  solarIrradianceHours: number; // Peak sun hours per day
}

export const DISCOM_TARIFFS: Record<string, DiscomTariff> = {
  'karnataka-bescom': {
    state: 'Karnataka',
    discom: 'BESCOM / HESCOM',
    residentialAvgKwh: 7.85,
    commercialAvgKwh: 8.95,
    solarIrradianceHours: 5.2,
  },
  'tamilnadu-tangedco': {
    state: 'Tamil Nadu',
    discom: 'TANGEDCO',
    residentialAvgKwh: 6.95,
    commercialAvgKwh: 9.40,
    solarIrradianceHours: 5.4,
  },
  'maharashtra-msedcl': {
    state: 'Maharashtra',
    discom: 'MSEDCL / Adani Electricity',
    residentialAvgKwh: 8.65,
    commercialAvgKwh: 11.20,
    solarIrradianceHours: 5.1,
  },
  'gujarat-guvnl': {
    state: 'Gujarat',
    discom: 'UGVCL / DGVCL / Torrent',
    residentialAvgKwh: 6.40,
    commercialAvgKwh: 8.20,
    solarIrradianceHours: 5.5,
  },
  'delhi-bses': {
    state: 'Delhi NCR',
    discom: 'BSES Rajdhani / Yamuna / TPDDL',
    residentialAvgKwh: 7.20,
    commercialAvgKwh: 9.80,
    solarIrradianceHours: 4.9,
  },
  'telangana-tsspdcl': {
    state: 'Telangana',
    discom: 'TSSPDCL',
    residentialAvgKwh: 7.60,
    commercialAvgKwh: 10.10,
    solarIrradianceHours: 5.3,
  },
  'rajasthan-jvvnl': {
    state: 'Rajasthan',
    discom: 'JVVNL / AVVNL',
    residentialAvgKwh: 7.50,
    commercialAvgKwh: 9.60,
    solarIrradianceHours: 5.7,
  },
  'kerala-kseb': {
    state: 'Kerala',
    discom: 'KSEB',
    residentialAvgKwh: 7.10,
    commercialAvgKwh: 9.30,
    solarIrradianceHours: 4.8,
  },
};

export type TechnologyType =
  | 'solar-rooftop'
  | 'solar-paai'
  | 'ev-charging'
  | 'sodium-bess'
  | 'hydrogen-plant'
  | 'telecom-tower';

export interface TechMetadata {
  id: TechnologyType;
  title: string;
  vernacularName?: string;
  description: string;
  defaultUnitCostInr: number;
  unitLabel: string;
}

export const TECHNOLOGIES: Record<TechnologyType, TechMetadata> = {
  'solar-rooftop': {
    id: 'solar-rooftop',
    title: 'Rooftop & Ground Solar PV',
    description: 'High-efficiency Tier-1 TOPCon / Mono PERC rigid solar arrays with bidirectional net-metering.',
    defaultUnitCostInr: 52000, // per kW
    unitLabel: 'kW',
  },
  'solar-paai': {
    id: 'solar-paai',
    title: 'Solar Mat / Solar Paai',
    vernacularName: 'Solar Paai (Flexible Solar Mat)',
    description: 'Ultra-lightweight (2.9 kg/m²) flexible peel-and-stick solar mats engineered for PEB sheds, curved roofs, and non-penetrating structures.',
    defaultUnitCostInr: 64000, // per kW
    unitLabel: 'kW',
  },
  'ev-charging': {
    id: 'ev-charging',
    title: 'EV Charging Infrastructure',
    description: 'Turnkey fleet depots, public hubs, and commercial EVSE featuring 30kW–360kW DC Fast & 22kW Type-2 AC chargers.',
    defaultUnitCostInr: 120000, // per EV gun / charging node
    unitLabel: 'Charger Node',
  },
  'sodium-bess': {
    id: 'sodium-bess',
    title: 'Sodium-ion Battery Storage (Sodium BESS)',
    description: 'Thermal-runaway safe, abundant non-lithium chemistry delivering 4,000+ cycles in extreme Indian ambient temperatures (-20°C to 60°C).',
    defaultUnitCostInr: 18500, // per kWh
    unitLabel: 'kWh',
  },
  'hydrogen-plant': {
    id: 'hydrogen-plant',
    title: 'Green Hydrogen Generation Plant',
    description: 'Electrolyzer systems (PEM / Alkaline) producing high-purity green hydrogen for industrial heat, transport, and captive power.',
    defaultUnitCostInr: 110000, // per Nm³/hr capacity
    unitLabel: 'Nm³/hr',
  },
  'telecom-tower': {
    id: 'telecom-tower',
    title: 'Mobile Towers & Solar Telecom Towers',
    description: 'Solar-BESS hybrid systems replacing expensive diesel generators on remote cellular telecom towers with 100% clean uptime.',
    defaultUnitCostInr: 75000, // per telecom tower hybrid node
    unitLabel: 'Tower Site',
  },
};

export interface YearProjection {
  year: number;
  tariffPerKwh: number;
  solarGenerationKwh: number;
  billWithoutSolarInr: number;
  billWithSolarInr: number;
  annualSavingsInr: number;
  cumulativeSavingsInr: number;
}

export interface RoiCalculationResult {
  category: 'residential' | 'commercial';
  techType: TechnologyType;
  selectedDiscom: string;
  monthlyBillInr: number;
  monthlyUnitsKwh: number;
  sanctionedLoadKw: number;
  recommendedSystemSizeKw: number;
  estimatedGrossCapexInr: number;
  subsidyOrTaxShieldInr: number;
  netInvestmentInr: number;
  subsidySchemeName: string;
  subsidyDetailNote: string;
  year1SavingsInr: number;
  lifetime25YrSavingsInr: number;
  paybackPeriodYears: number;
  paybackPeriodDisplay: string;
  annualCo2AbatedTonnes: number;
  treesPlantedEquivalent: number;
  twentyFiveYearProjections: YearProjection[];
  boq: {
    item: string;
    specification: string;
    quantity: string;
  }[];
}

/**
 * Calculates PM Surya Ghar Muft Bijli Yojana Subsidies:
 * 1 kW: ₹30,000
 * 2 kW: ₹60,000
 * 3 kW to 10 kW: ₹78,000 maximum direct DBT
 * Crucial user highlight: "3kW -> ~1 Lakh savings" (combining ₹78k subsidy + first year bills eliminated!)
 */
export function calculatePmSuryaGharSubsidy(systemSizeKw: number): {
  subsidyInr: number;
  schemeLabel: string;
  highlightNote: string;
} {
  let subsidy = 0;
  if (systemSizeKw <= 1) {
    subsidy = 30000;
  } else if (systemSizeKw <= 2) {
    subsidy = 60000;
  } else {
    // 3kW and above capped at ₹78,000
    subsidy = 78000;
  }

  return {
    subsidyInr: subsidy,
    schemeLabel: 'PM Surya Ghar: Muft Bijli Yojana',
    highlightNote: systemSizeKw >= 3
      ? 'PM Surya Ghar DBT Subsidy: ₹78,000 Direct Cash Credit! Combined with year 1 zero-bill savings, you save over ₹1 Lakh immediately.'
      : `PM Surya Ghar DBT Subsidy: ₹${subsidy.toLocaleString('en-IN')} Direct Cash Credit to your Aadhaar-linked bank account.`,
  };
}

/**
 * Commercial 40% Accelerated Depreciation (AD) under Section 32 of Indian Income Tax Act.
 * Assumes corporate tax rate of 25% + 4% cess = 26% effective tax shield.
 */
export function calculateCommercialTaxShield(grossCapexInr: number): {
  taxShieldInr: number;
  schemeLabel: string;
  highlightNote: string;
} {
  const effectiveShield = Math.round(grossCapexInr * 0.40 * 0.26);
  return {
    taxShieldInr: effectiveShield,
    schemeLabel: 'Section 32 Accelerated Depreciation (40%)',
    highlightNote: `Claim 40% Year-1 tax depreciation write-off. At standard 26% corporate tax, you recover ₹${effectiveShield.toLocaleString('en-IN')} as direct tax savings in Year 1.`,
  };
}

/**
 * Main calculation engine applying the mandatory 5% annual compounded tariff increase
 * across 25 years.
 */
export function run25YearCleanTechRoi({
  category,
  techType = 'solar-rooftop',
  discomKey = 'karnataka-bescom',
  monthlyBillInr,
  monthlyUnitsKwh,
  sanctionedLoadKw,
  customSystemSizeKw,
}: {
  category: 'residential' | 'commercial';
  techType?: TechnologyType;
  discomKey?: string;
  monthlyBillInr: number;
  monthlyUnitsKwh?: number;
  sanctionedLoadKw?: number;
  customSystemSizeKw?: number;
}): RoiCalculationResult {
  const discom = DISCOM_TARIFFS[discomKey] || DISCOM_TARIFFS['karnataka-bescom'];
  const baseTariff = category === 'residential' ? discom.residentialAvgKwh : discom.commercialAvgKwh;

  // Resolve units if not provided
  const resolvedUnits = monthlyUnitsKwh && monthlyUnitsKwh > 0 ? monthlyUnitsKwh : Math.round(monthlyBillInr / baseTariff);
  const annualConsumptionKwh = resolvedUnits * 12;

  // Recommended system size: 1 kWp typically produces 1,450 kWh/year in India (~120 kWh/month)
  const autoCalculatedSize = Math.max(1, Math.round((resolvedUnits / 120) * 10) / 10);
  const recommendedSize = customSystemSizeKw && customSystemSizeKw > 0
    ? customSystemSizeKw
    : category === 'residential'
      ? Math.min(10, Math.max(1, Math.round(autoCalculatedSize)))
      : Math.max(10, Math.round(autoCalculatedSize));

  const techMeta = TECHNOLOGIES[techType] || TECHNOLOGIES['solar-rooftop'];

  // Calculate Gross CapEx
  let unitCost = techMeta.defaultUnitCostInr;
  if (category === 'commercial' && recommendedSize > 100) {
    unitCost *= 0.88; // economies of scale
  }
  const grossCapex = Math.round(recommendedSize * unitCost);

  // Subsidies / Incentives
  let subsidyAmount = 0;
  let schemeName = '';
  let highlightNote = '';

  if (category === 'residential') {
    const pmsg = calculatePmSuryaGharSubsidy(recommendedSize);
    subsidyAmount = pmsg.subsidyInr;
    schemeName = pmsg.schemeLabel;
    highlightNote = pmsg.highlightNote;
  } else {
    const commShield = calculateCommercialTaxShield(grossCapex);
    subsidyAmount = commShield.taxShieldInr;
    schemeName = commShield.schemeLabel;
    highlightNote = commShield.highlightNote;
  }

  const netInvestment = Math.max(0, grossCapex - subsidyAmount);

  // Annual generation: 1 kWp = 1,450 kWh base in year 1
  const annualGenYear1 = Math.round(recommendedSize * 1450);

  // 25-Year Projection with 5% annual tariff escalation
  const projections: YearProjection[] = [];
  let cumulativeSavings = 0;
  let paybackYearFound = 0;
  let fractionalMonths = 0;

  for (let year = 1; year <= 25; year++) {
    // 5% annual compounding electricity tariff increase
    const tariffEscalationFactor = Math.pow(1.05, year - 1);
    const escalatedTariff = Number((baseTariff * tariffEscalationFactor).toFixed(2));

    // 0.7% annual solar panel degradation
    const degradationFactor = Math.pow(0.993, year - 1);
    const generationThisYear = Math.round(annualGenYear1 * degradationFactor);

    // Bill without solar (escalates with 5% tariff inflation)
    const billWithoutSolar = Math.round(annualConsumptionKwh * escalatedTariff);

    // Generation offsets consumption up to 100%
    const unitsOffset = Math.min(annualConsumptionKwh, generationThisYear);
    const billWithSolar = Math.round((annualConsumptionKwh - unitsOffset) * escalatedTariff);

    const annualSavings = billWithoutSolar - billWithSolar;
    cumulativeSavings += annualSavings;

    if (paybackYearFound === 0 && cumulativeSavings >= netInvestment) {
      paybackYearFound = year;
      const priorCumulative = cumulativeSavings - annualSavings;
      const needed = netInvestment - priorCumulative;
      fractionalMonths = Math.min(11, Math.max(1, Math.round((needed / annualSavings) * 12)));
    }

    projections.push({
      year,
      tariffPerKwh: escalatedTariff,
      solarGenerationKwh: generationThisYear,
      billWithoutSolarInr: billWithoutSolar,
      billWithSolarInr: billWithSolar,
      annualSavingsInr: annualSavings,
      cumulativeSavingsInr: cumulativeSavings,
    });
  }

  const year1Savings = projections[0]?.annualSavingsInr || 0;
  const lifetimeSavings = cumulativeSavings;

  // Payback period formatting
  let paybackDisplay = '';
  let paybackNum = 0;
  if (paybackYearFound > 0) {
    paybackNum = Number((paybackYearFound - 1 + fractionalMonths / 12).toFixed(1));
    paybackDisplay = `${paybackYearFound - 1} Years, ${fractionalMonths} Months`;
  } else {
    paybackNum = netInvestment > 0 && year1Savings > 0 ? Number((netInvestment / year1Savings).toFixed(1)) : 4.5;
    paybackDisplay = `${paybackNum} Years`;
  }

  // Environmental impact
  const annualCo2 = Number(((annualGenYear1 * 0.82) / 1000).toFixed(1)); // 0.82 kg CO2 / kWh Indian grid factor
  const trees = Math.round(annualCo2 * 45); // ~45 trees absorb 1 ton CO2/year

  // Generate Bill of Quantities (BOQ)
  const boq = generateBoq(techType, recommendedSize, category);

  return {
    category,
    techType,
    selectedDiscom: `${discom.state} (${discom.discom})`,
    monthlyBillInr,
    monthlyUnitsKwh: resolvedUnits,
    sanctionedLoadKw: sanctionedLoadKw || Math.ceil(recommendedSize),
    recommendedSystemSizeKw: recommendedSize,
    estimatedGrossCapexInr: grossCapex,
    subsidyOrTaxShieldInr: subsidyAmount,
    netInvestmentInr: netInvestment,
    subsidySchemeName: schemeName,
    subsidyDetailNote: highlightNote,
    year1SavingsInr: year1Savings,
    lifetime25YrSavingsInr: lifetimeSavings,
    paybackPeriodYears: paybackNum,
    paybackPeriodDisplay: paybackDisplay,
    annualCo2AbatedTonnes: annualCo2,
    treesPlantedEquivalent: trees,
    twentyFiveYearProjections: projections,
    boq,
  };
}

function generateBoq(techType: TechnologyType, sizeKw: number, category: 'residential' | 'commercial') {
  if (techType === 'solar-paai') {
    const matCount = Math.ceil((sizeKw * 1000) / 380); // 380W flexible mat
    return [
      { item: 'Solar Paai (Flexible CIGS Mats)', specification: '380Wp Ultra-lightweight (2.9 kg/m²) Peel & Stick Panels', quantity: `${matCount} Units` },
      { item: 'Grid-Tie String Inverter', specification: `${Math.ceil(sizeKw * 0.95)} kW Transformerless MPPT Inverter (IP66)`, quantity: '1 Set' },
      { item: 'Structural Adhesive & Primer', specification: 'Industrial 3M Structural Bonding Film for PEB Roofs', quantity: `${Math.ceil(sizeKw * 7)} m²` },
      { item: 'DC / AC Distribution Box', specification: 'Dual-circuit IP65 enclosures with Type-2 SPDs and MCBs', quantity: '1 Set' },
      { item: 'Solar DC & AC Cabling', specification: '4 sq.mm 1500V UV-resistant copper solar cables + conduits', quantity: `${Math.ceil(sizeKw * 15)} Meters` },
      { item: 'Earthing & Lightning Kit', specification: '3-Pit Chemical Earthing with Maintenance-free Copper Electrodes', quantity: '1 Kit' },
      { item: 'Smart Net-Metering Telemetry', specification: 'Bidirectional DISCOM meter + 4G IoT Gateway with Mobile App', quantity: '1 Unit' },
    ];
  }

  if (techType === 'ev-charging') {
    const guns = Math.max(2, Math.round(sizeKw / 30));
    return [
      { item: 'DC Fast Charging Station', specification: '60 kW to 240 kW Dual-Gun CCS2 High-Power Dispenser', quantity: `${Math.ceil(guns / 2)} Dispenser(s)` },
      { item: 'Transformer & Compact Substation', specification: `${Math.ceil(sizeKw * 1.25)} kVA 11kV/415V HT Step-Down CSS`, quantity: '1 Unit' },
      { item: 'Dynamic Load Balancer (CSMS)', specification: 'Certified OCPP 1.6J / 2.0.1 Cloud Management Server', quantity: 'Included' },
      { item: 'Heavy Power Busway / Cables', specification: 'Armored Aluminum XLPE 3.5C 300 sq.mm HT/LT cables', quantity: 'As per site SLD' },
      { item: 'Emergency Stop & Safety RCD', specification: 'Type-B RCCB, Class-I Surge Arresters & Fire Extinguishers', quantity: '1 Lot' },
    ];
  }

  if (techType === 'sodium-bess') {
    return [
      { item: 'Sodium-ion Battery Pack', specification: 'High-safety Na-ion prismatic cells (4,000 cycles @ 90% DoD)', quantity: `${Math.ceil(sizeKw * 2)} kWh Capacity` },
      { item: 'Bi-Directional Inverter (PCS)', specification: `${Math.ceil(sizeKw)} kVA 4-Quadrant Power Conversion System`, quantity: '1 Set' },
      { item: 'Battery Management System (BMS)', specification: 'Cell-level voltage, impedance, and multi-sensor thermal monitoring', quantity: '1 System' },
      { item: 'Liquid / Forced-Air Thermal Enclosure', specification: 'NEMA-3R / IP55 Outdoor Enclosure with aerosol fire suppression', quantity: '1 Enclosure' },
      { item: 'SCADA Energy Management (EMS)', specification: 'Automated peak shaving, ToD arbitrage & microgrid islanding switch', quantity: '1 Unit' },
    ];
  }

  if (techType === 'hydrogen-plant') {
    return [
      { item: 'Electrolyzer Stack Module', specification: 'Pressurized Alkaline / PEM Stack (50–200 Nm³/hr H₂)', quantity: '1 Modular Block' },
      { item: 'Gas Purification & DeOxo Unit', specification: 'Catalytic deoxygenation & dual-bed desiccant dryer (99.999% purity)', quantity: '1 Skid' },
      { item: 'Ultra-Pure Deionized Water System', specification: 'Double-pass RO + Continuous Electrodeionization (CEDI)', quantity: '1 System' },
      { item: 'H₂ Compression & Buffer Vessel', specification: '30-bar to 350-bar diaphragm compressor with ASME buffer tanks', quantity: '1 Set' },
      { item: 'Safety Sensors & Vent Stacks', specification: 'SIL-2 Hydrogen detection, ATEX ventilation & flame arresters', quantity: '1 Lot' },
    ];
  }

  if (techType === 'telecom-tower') {
    return [
      { item: 'Telecom Solar PV Array', specification: '550Wp High-Yield Bifacial Mono PERC Modules with elevated rack', quantity: '12–24 Modules' },
      { item: 'Telecom Sodium / LFP Battery Bank', specification: '48V 300Ah–600Ah Rack-Mount Telecom Battery Pack', quantity: '1–2 Cabinets' },
      { item: 'Hybrid Telecom Controller', specification: 'Integrated MPPT Solar Charger + SMPS Rectifier + DG Auto-Start', quantity: '1 Unit' },
      { item: 'Remote Tower Telemetry (NOC)', specification: 'SNMP / MQTT gateway connected to Central Telecom NOC', quantity: '1 Gateway' },
      { item: 'Anti-Theft Enclosure & Mounts', specification: 'Tamper-proof galvanized steel brackets with caged battery box', quantity: '1 Set' },
    ];
  }

  // Default: Solar Rooftop
  const moduleCount = Math.ceil((sizeKw * 1000) / 550); // 550Wp modules
  return [
    { item: 'Solar PV Modules', specification: '550Wp Tier-1 Bifacial N-Type TOPCon / Mono PERC (ALMM Approved)', quantity: `${moduleCount} Modules` },
    { item: 'Grid-Tie String Inverter', specification: category === 'residential' ? `${sizeKw <= 5 ? 'Single Phase' : 'Three Phase'} On-Grid Inverter (98.6% Efficiency)` : 'High-power 3-Phase Multi-MPPT Inverter', quantity: '1 Unit' },
    { item: 'Mounting Structure', specification: 'Hot Dip Galvanized (HDG) / Anodized Aluminum rated for 150 km/h wind', quantity: '1 Set' },
    { item: 'AC & DC Distribution Boards', specification: 'IP65 enclosures with Type-II DC/AC Surge Protective Devices (SPDs)', quantity: '1 Set' },
    { item: 'Solar DC & AC Cabling', specification: 'TUV certified 4 sq.mm 1500V DC cables + Polycab/Havells AC copper cables', quantity: `${Math.ceil(sizeKw * 12)} Meters` },
    { item: 'Chemical Earthing & LA', specification: '3-Pit Chemical Earthing with Maintenance-Free Electrodes + ESE Arrester', quantity: '1 Kit' },
    { item: 'Net Metering & Cloud Telemetry', specification: 'DISCOM approved bidirectional meter + WiFi/4G Data Logger', quantity: '1 Kit' },
  ];
}
