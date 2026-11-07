/**
 * Comprehensive CleanTech ROI Engine with 25-Year 5% Annual Compounding Tariff Escalation.
 * Aligned with PM Surya Ghar Muft Bijli Yojana, PM-KUSUM, PM E-DRIVE, and Commercial AD.
 */

export interface StateGovtScheme {
  centralScheme: string;
  centralSubsidyMaxInr: number;
  stateTopUpSubsidyInr: number;
  stateSchemeName: string;
  schemeSummary: string;
  commercialIncentive: string;
  gbiIncentivePerKwh?: number;
  netMeteringPolicy: string;
}

export interface DiscomTariff {
  state: string;
  discom: string;
  residentialAvgKwh: number;
  commercialAvgKwh: number;
  industrialAvgKwh: number;
  solarIrradianceHours: number; // Peak sun hours per day
  govtScheme: StateGovtScheme;
  statePerCapitaAvgKwhMonth: number; // State average monthly consumption per capita
}

export const DISCOM_TARIFFS: Record<string, DiscomTariff> = {
  'karnataka-bescom': {
    state: 'Karnataka',
    discom: 'BESCOM / HESCOM / MESCOM',
    residentialAvgKwh: 7.85,
    commercialAvgKwh: 9.45,
    industrialAvgKwh: 8.90,
    solarIrradianceHours: 5.2,
    statePerCapitaAvgKwhMonth: 112,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 0,
      stateSchemeName: 'KREDL Soura Belaku & BESCOM Rooftop Solar Policy 2026',
      schemeSummary: 'PM Surya Ghar ₹78,000 direct cash transfer + BESCOM zero-injection LT net-metering up to 100% sanctioned load with expedited 15-day clearance.',
      commercialIncentive: 'Section 32 40% Accelerated Depreciation + Green Energy Open Access (GEOA 100 kW threshold) + BESCOM ToD tariff rebate.',
      netMeteringPolicy: 'Bidirectional net metering allowed up to 100% of sanctioned contract demand with annual energy settlement.',
    },
  },
  'maharashtra-msedcl': {
    state: 'Maharashtra',
    discom: 'MSEDCL / Adani Electricity / Tata Power',
    residentialAvgKwh: 8.65,
    commercialAvgKwh: 11.80,
    industrialAvgKwh: 9.75,
    solarIrradianceHours: 5.1,
    statePerCapitaAvgKwhMonth: 128,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 0,
      stateSchemeName: 'MahaUrja MEDA Rooftop Solar Policy & Time-of-Day (ToD) Rebate',
      schemeSummary: 'PM Surya Ghar ₹78k DBT + MEDA fast-track grid interconnection + substantial peak-hour savings on high commercial tariffs (₹11.80/kWh).',
      commercialIncentive: '40% Year-1 tax depreciation write-off + ToD peak shaving tariff arbitrage + industrial open access.',
      netMeteringPolicy: 'Smart net metering with 15-minute time-of-day settlement and surplus banking.',
    },
  },
  'gujarat-guvnl': {
    state: 'Gujarat',
    discom: 'UGVCL / DGVCL / PGVCL / Torrent Power',
    residentialAvgKwh: 6.40,
    commercialAvgKwh: 8.25,
    industrialAvgKwh: 7.60,
    solarIrradianceHours: 5.5,
    statePerCapitaAvgKwhMonth: 195,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 0,
      stateSchemeName: 'SURYA Gujarat Scheme & GUVNL 110% Sanctioned Load Solar Policy',
      schemeSummary: 'PM Surya Ghar ₹78,000 DBT + GERC permission to install solar up to 110% of sanctioned load + complete waiver of banking charges for MSMEs.',
      commercialIncentive: 'Section 32 40% AD + zero cross-subsidy surcharge for green captive plants + annual surplus APPC buyback.',
      netMeteringPolicy: '110% of sanctioned load permitted for grid tie; surplus power credited annually.',
    },
  },
  'tamilnadu-tangedco': {
    state: 'Tamil Nadu',
    discom: 'TANGEDCO',
    residentialAvgKwh: 6.95,
    commercialAvgKwh: 9.80,
    industrialAvgKwh: 8.95,
    solarIrradianceHours: 5.4,
    statePerCapitaAvgKwhMonth: 142,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 0,
      stateSchemeName: 'TANGEDCO Solar Policy & LT Network Charge Exemption',
      schemeSummary: 'PM Surya Ghar ₹78,000 DBT + exemption from network charges for LT residential rooftop solar installations under 10 kW.',
      commercialIncentive: '40% AD tax shield + ToD peak commercial tariff mitigation + captive solar wheeling concessions.',
      netMeteringPolicy: 'Bi-monthly billing net feed-in with rolling banking credits for HT/LT consumers.',
    },
  },
  'delhi-bses': {
    state: 'Delhi NCR',
    discom: 'BSES Rajdhani / Yamuna / TPDDL',
    residentialAvgKwh: 7.20,
    commercialAvgKwh: 10.50,
    industrialAvgKwh: 9.10,
    solarIrradianceHours: 4.9,
    statePerCapitaAvgKwhMonth: 175,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 0,
      stateSchemeName: 'Delhi Solar Policy 2024–2027: Generation-Based Incentive (GBI)',
      schemeSummary: 'PM Surya Ghar ₹78k DBT + Delhi Govt GBI of ₹2.00 to ₹3.00/kWh credited directly to monthly electricity bills for 5 years!',
      commercialIncentive: 'GBI of ₹1.00/kWh for commercial + 40% Section 32 AD + zero municipal tax on rooftop solar.',
      gbiIncentivePerKwh: 2.50,
      netMeteringPolicy: 'Zero virtual net-metering fees for residential group housing societies & commercial complexes.',
    },
  },
  'telangana-tsspdcl': {
    state: 'Telangana',
    discom: 'TSSPDCL / TSNPDCL',
    residentialAvgKwh: 7.60,
    commercialAvgKwh: 10.30,
    industrialAvgKwh: 8.70,
    solarIrradianceHours: 5.3,
    statePerCapitaAvgKwhMonth: 160,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 0,
      stateSchemeName: 'TSREDCO Rooftop Solar Scheme & 100 kW Green Energy Open Access',
      schemeSummary: 'PM Surya Ghar ₹78k DBT + TSREDCO single-window online clearance within 14 days + fast bidirectional meter synchronization.',
      commercialIncentive: 'Green Energy Open Access (GEOA) eligible down to 100 kW load + 40% Accelerated Depreciation.',
      netMeteringPolicy: 'Net metering up to 100% of contracted load with bi-annual surplus energy settlement.',
    },
  },
  'rajasthan-jvvnl': {
    state: 'Rajasthan',
    discom: 'JVVNL / AVVNL / JdVVNL',
    residentialAvgKwh: 7.50,
    commercialAvgKwh: 9.90,
    industrialAvgKwh: 8.40,
    solarIrradianceHours: 5.7,
    statePerCapitaAvgKwhMonth: 130,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 0,
      stateSchemeName: 'RREC Solar Policy: 100% Electricity Duty Exemption & Highest Solar Yield',
      schemeSummary: 'PM Surya Ghar ₹78k DBT + 10-year 100% exemption on state electricity duty + highest irradiance in India (~1,650 kWh/kWp/yr).',
      commercialIncentive: 'Section 32 40% AD write-off + RREC priority transmission clearance + PM-KUSUM feeder solarization.',
      netMeteringPolicy: '100% sanctioned load with rolling energy banking and zero banking charges.',
    },
  },
  'uttarpradesh-uppcl': {
    state: 'Uttar Pradesh',
    discom: 'UPPCL (PVVNL / DVVNL / MVVNL / PuVVNL) / NPCL',
    residentialAvgKwh: 7.40,
    commercialAvgKwh: 9.70,
    industrialAvgKwh: 8.60,
    solarIrradianceHours: 5.0,
    statePerCapitaAvgKwhMonth: 85,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 30000,
      stateSchemeName: 'UP Solar Energy Policy: State Top-up Subsidy of ₹15,000–₹30,000',
      schemeSummary: 'Central PM Surya Ghar (₹78,000) + UPNEDA State Top-Up Cash Subsidy (₹30,000) = Direct cash subsidy of up to ₹1,08,000!',
      commercialIncentive: '100% stamp duty waiver on solar installation land + 40% AD corporate tax shield.',
      netMeteringPolicy: 'Net-metering up to 500 kW capacity with simplified DISCOM online portal.',
    },
  },
  'kerala-kseb': {
    state: 'Kerala',
    discom: 'KSEB',
    residentialAvgKwh: 7.10,
    commercialAvgKwh: 9.60,
    industrialAvgKwh: 7.80,
    solarIrradianceHours: 4.8,
    statePerCapitaAvgKwhMonth: 95,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 0,
      stateSchemeName: 'ANERT Soura Rooftop Scheme & KSEB 1:1 Net Metering',
      schemeSummary: 'PM Surya Ghar ₹78,000 DBT + ANERT state coordination and zero deposit net meter deployment.',
      commercialIncentive: '40% Accelerated Depreciation + KSEB high commercial slab bill avoidance.',
      netMeteringPolicy: '1:1 unit banking with annual financial settlement every September.',
    },
  },
  'andhrapradesh-apcpdcl': {
    state: 'Andhra Pradesh',
    discom: 'APCPDCL / APEPDCL / APSPDCL',
    residentialAvgKwh: 7.30,
    commercialAvgKwh: 9.85,
    industrialAvgKwh: 8.45,
    solarIrradianceHours: 5.3,
    statePerCapitaAvgKwhMonth: 125,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 0,
      stateSchemeName: 'NREDCAP AP Solar Policy 2024–2029 & Wheeling Concessions',
      schemeSummary: 'PM Surya Ghar ₹78,000 DBT + NREDCAP online processing with zero cross-subsidy surcharge for rooftop plants.',
      commercialIncentive: '50% concession on transmission and wheeling charges for captive commercial plants + 40% AD.',
      netMeteringPolicy: 'Up to 100% of sanctioned load net-metering with quarterly settlement.',
    },
  },
  'westbengal-wbsedcl': {
    state: 'West Bengal',
    discom: 'WBSEDCL / CESC Kolkata',
    residentialAvgKwh: 7.90,
    commercialAvgKwh: 10.40,
    industrialAvgKwh: 8.80,
    solarIrradianceHours: 4.7,
    statePerCapitaAvgKwhMonth: 92,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 0,
      stateSchemeName: 'WBSFDCL Rooftop Policy & 10% Green Building FAR Incentive',
      schemeSummary: 'PM Surya Ghar ₹78,000 DBT + Municipal 10% extra building Floor Area Ratio (FAR) for solar rooftop buildings.',
      commercialIncentive: 'CESC commercial peak slab mitigation (₹11.20 peak) + 40% Section 32 AD.',
      netMeteringPolicy: 'Net metering allowed for consumers with sanctioned load of 1 kW and above.',
    },
  },
  'haryana-dhbvn': {
    state: 'Haryana',
    discom: 'DHBVN / UHBVN',
    residentialAvgKwh: 7.15,
    commercialAvgKwh: 9.20,
    industrialAvgKwh: 8.10,
    solarIrradianceHours: 5.1,
    statePerCapitaAvgKwhMonth: 165,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 0,
      stateSchemeName: 'HAREDA Solar Policy & PM-KUSUM Feeder Solarization',
      schemeSummary: 'PM Surya Ghar ₹78,000 DBT + HAREDA institutional grants and agricultural solar subsidies.',
      commercialIncentive: 'Section 32 40% AD + complete waiver of cross-subsidy surcharge for rooftop solar.',
      netMeteringPolicy: '100% sanctioned load net-metering with bi-annual credit banking.',
    },
  },
  'punjab-pspcl': {
    state: 'Punjab',
    discom: 'PSPCL',
    residentialAvgKwh: 7.25,
    commercialAvgKwh: 9.40,
    industrialAvgKwh: 7.95,
    solarIrradianceHours: 5.2,
    statePerCapitaAvgKwhMonth: 180,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 0,
      stateSchemeName: 'PEDA Rooftop Solar Policy 2026',
      schemeSummary: 'PM Surya Ghar ₹78,000 DBT + PEDA simplified single-window net metering.',
      commercialIncentive: '40% AD tax depreciation write-off + industrial tariff stabilization.',
      netMeteringPolicy: 'Up to 100% of sanctioned load net-metering.',
    },
  },
  'madhyapradesh-mpmkvvcl': {
    state: 'Madhya Pradesh',
    discom: 'MPPKVVCL / MPMKVVCL / MPPoKVVCL',
    residentialAvgKwh: 7.35,
    commercialAvgKwh: 9.65,
    industrialAvgKwh: 8.25,
    solarIrradianceHours: 5.4,
    statePerCapitaAvgKwhMonth: 110,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 0,
      stateSchemeName: 'MP Urja Vikas Nigam Solar Policy & Smart Metering',
      schemeSummary: 'PM Surya Ghar ₹78k DBT + MP DISCOM smart bidirectional meter subsidy.',
      commercialIncentive: 'Section 32 40% AD + Mandi/Warehouse commercial solar tax exemptions.',
      netMeteringPolicy: 'Up to 100% sanctioned load with yearly solar banking.',
    },
  },
  'odisha-tpcodl': {
    state: 'Odisha',
    discom: 'TPCODL / TPSODL / TPNODL / TPWODL',
    residentialAvgKwh: 6.80,
    commercialAvgKwh: 8.90,
    industrialAvgKwh: 7.50,
    solarIrradianceHours: 5.0,
    statePerCapitaAvgKwhMonth: 102,
    govtScheme: {
      centralScheme: 'PM Surya Ghar: Muft Bijli Yojana (Up to ₹78,000 DBT)',
      centralSubsidyMaxInr: 78000,
      stateTopUpSubsidyInr: 0,
      stateSchemeName: 'OREDA Net-Metering & Renewable Energy Certificate (REC) Policy',
      schemeSummary: 'PM Surya Ghar ₹78k DBT + OREDA facilitation and net-metering within 21 days.',
      commercialIncentive: 'Captive green power duty exemption + 40% AD.',
      netMeteringPolicy: 'Net metering up to 100% contract demand.',
    },
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
  stateName: string;
  discomName: string;
  residentialTariffRate: number; // Residential rate on the bill (₹/kWh)
  commercialTariffRate: number;  // Commercial rate on the bill (₹/kWh)
  activeTariffRate: number;      // Active rate used for calculation
  monthlyBillInr: number;
  monthlyUnitsKwh: number;
  dailyUnitsKwh: number;
  annualConsumptionKwh: number;
  householdOrStaffCount: number;
  perCapitaMonthlyKwh: number;
  perCapitaAnnualKwh: number;
  nationalBenchmarkMonthlyKwh: number;
  perCapitaBenchmarkRatio: number;
  perCapitaStatus: string;
  perCapitaAnnualCo2Kg: number;
  commercialEnergyIntensityKwhSqFt?: number;
  sanctionedLoadKw: number;
  recommendedSystemSizeKw: number;
  estimatedGrossCapexInr: number;
  centralSubsidyInr: number;
  stateTopUpSubsidyInr: number;
  subsidyOrTaxShieldInr: number;
  netInvestmentInr: number;
  subsidySchemeName: string;
  subsidyDetailNote: string;
  stateGovtScheme: StateGovtScheme;
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
 * Plus adds State Top-Up Subsidy (e.g. UP provides ₹15,000 to ₹30,000 extra)
 */
export function calculatePmSuryaGharSubsidy(systemSizeKw: number, stateTopUp = 0): {
  centralSubsidyInr: number;
  stateTopUpInr: number;
  totalSubsidyInr: number;
  schemeLabel: string;
  highlightNote: string;
} {
  let central = 0;
  let topUp = 0;

  if (systemSizeKw <= 1) {
    central = 30000;
    topUp = Math.round(stateTopUp * 0.5);
  } else if (systemSizeKw <= 2) {
    central = 60000;
    topUp = stateTopUp;
  } else {
    central = 78000;
    topUp = stateTopUp;
  }

  const total = central + topUp;

  return {
    centralSubsidyInr: central,
    stateTopUpInr: topUp,
    totalSubsidyInr: total,
    schemeLabel: topUp > 0
      ? `PM Surya Ghar (₹${central.toLocaleString('en-IN')}) + State Top-Up (₹${topUp.toLocaleString('en-IN')})`
      : 'PM Surya Ghar: Muft Bijli Yojana',
    highlightNote: systemSizeKw >= 3
      ? `Direct Cash DBT Subsidy: ₹${total.toLocaleString('en-IN')} (Central ₹${central.toLocaleString('en-IN')}${topUp > 0 ? ` + State ₹${topUp.toLocaleString('en-IN')}` : ''})! Combined with Year-1 zero-bill savings, you save over ₹1 Lakh immediately.`
      : `Direct Cash DBT Subsidy: ₹${total.toLocaleString('en-IN')} credited to your Aadhaar-linked bank account within 30 days of net-meter commissioning.`,
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
    highlightNote: `Claim 40% Year-1 tax depreciation write-off. At standard 26% corporate tax rate, you recover ₹${effectiveShield.toLocaleString('en-IN')} as direct tax savings in Year 1.`,
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
  householdOrStaffCount,
  facilitySqFt,
}: {
  category: 'residential' | 'commercial';
  techType?: TechnologyType;
  discomKey?: string;
  monthlyBillInr: number;
  monthlyUnitsKwh?: number;
  sanctionedLoadKw?: number;
  customSystemSizeKw?: number;
  householdOrStaffCount?: number;
  facilitySqFt?: number;
}): RoiCalculationResult {
  const discom = DISCOM_TARIFFS[discomKey] || DISCOM_TARIFFS['karnataka-bescom'];
  const residentialTariffRate = discom.residentialAvgKwh;
  const commercialTariffRate = discom.commercialAvgKwh;
  const activeTariff = category === 'residential' ? residentialTariffRate : commercialTariffRate;

  // Resolve units using the selected tariff rate
  const resolvedUnits = monthlyUnitsKwh && monthlyUnitsKwh > 0
    ? monthlyUnitsKwh
    : Math.round(monthlyBillInr / activeTariff);
  const dailyUnits = Number((resolvedUnits / 30).toFixed(1));
  const annualConsumptionKwh = resolvedUnits * 12;

  // Per Capita Electricity Consumption
  const peopleCount = householdOrStaffCount && householdOrStaffCount > 0
    ? householdOrStaffCount
    : category === 'residential'
      ? 4
      : 45;
  const perCapitaMonthlyKwh = Math.round(resolvedUnits / peopleCount);
  const perCapitaAnnualKwh = perCapitaMonthlyKwh * 12;
  const nationalBenchmarkMonthlyKwh = 105; // ~1,255 kWh/capita/year in India
  const perCapitaBenchmarkRatio = Number((perCapitaMonthlyKwh / nationalBenchmarkMonthlyKwh).toFixed(2));

  let perCapitaStatus = '';
  if (category === 'residential') {
    if (perCapitaMonthlyKwh < 75) {
      perCapitaStatus = 'Energy Conscious (Below National Average)';
    } else if (perCapitaMonthlyKwh <= 140) {
      perCapitaStatus = 'Standard Household (Near National Average)';
    } else if (perCapitaMonthlyKwh <= 220) {
      perCapitaStatus = 'High Comfort Consumer (Multiple ACs)';
    } else {
      perCapitaStatus = 'Intense Energy Consumer (EV / Luxury Villa)';
    }
  } else {
    if (perCapitaMonthlyKwh < 100) {
      perCapitaStatus = 'Lean Commercial Operations';
    } else if (perCapitaMonthlyKwh <= 250) {
      perCapitaStatus = 'Standard Commercial / IT Facility';
    } else {
      perCapitaStatus = 'Energy-Intensive Commercial Hub';
    }
  }

  const perCapitaAnnualCo2Kg = Math.round(perCapitaAnnualKwh * 0.82);
  const commercialEnergyIntensityKwhSqFt = category === 'commercial'
    ? Number((annualConsumptionKwh / (facilitySqFt || 4000)).toFixed(1))
    : undefined;

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
  let centralSubsidy = 0;
  let stateTopUp = 0;
  let schemeName = '';
  let highlightNote = '';

  if (category === 'residential') {
    const pmsg = calculatePmSuryaGharSubsidy(recommendedSize, discom.govtScheme.stateTopUpSubsidyInr);
    centralSubsidy = pmsg.centralSubsidyInr;
    stateTopUp = pmsg.stateTopUpInr;
    subsidyAmount = pmsg.totalSubsidyInr;
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
    const escalatedTariff = Number((activeTariff * tariffEscalationFactor).toFixed(2));

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
    stateName: discom.state,
    discomName: discom.discom,
    residentialTariffRate,
    commercialTariffRate,
    activeTariffRate: activeTariff,
    monthlyBillInr,
    monthlyUnitsKwh: resolvedUnits,
    dailyUnitsKwh: dailyUnits,
    annualConsumptionKwh,
    householdOrStaffCount: peopleCount,
    perCapitaMonthlyKwh,
    perCapitaAnnualKwh,
    nationalBenchmarkMonthlyKwh,
    perCapitaBenchmarkRatio,
    perCapitaStatus,
    perCapitaAnnualCo2Kg,
    commercialEnergyIntensityKwhSqFt,
    sanctionedLoadKw: sanctionedLoadKw || Math.ceil(recommendedSize),
    recommendedSystemSizeKw: recommendedSize,
    estimatedGrossCapexInr: grossCapex,
    centralSubsidyInr: centralSubsidy,
    stateTopUpSubsidyInr: stateTopUp,
    subsidyOrTaxShieldInr: subsidyAmount,
    netInvestmentInr: netInvestment,
    subsidySchemeName: schemeName,
    subsidyDetailNote: highlightNote,
    stateGovtScheme: discom.govtScheme,
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

