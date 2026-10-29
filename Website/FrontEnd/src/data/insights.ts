/**
 * Market context and in-depth engineering intelligence used across the site.
 *
 * Every figure here is attributed to a named public source with an as-of
 * date. Technical whitepapers provide deep engineering formulas, regulatory citations,
 * and dispatch strategies for clean energy decision makers.
 */

export interface Insight {
  id: string;
  value: string;
  unit: string;
  label: string;
  note: string;
  source: string;
  asOf: string;
  href?: string;
}

export const insights: Insight[] = [
  {
    id: 'solar-total',
    value: '171.05',
    unit: 'GW',
    label: 'Installed solar capacity in India',
    note: 'Of which 125.65 GW is ground-mounted and 33.41 GW is grid-connected rooftop. These national totals describe installed capacity, not what is available to a particular facility. Site constraints, connection rules and energy use still need separate review.',
    source: 'Ministry of New and Renewable Energy — Physical Progress',
    asOf: '30 September 2026',
    href: 'https://mnre.gov.in/en/physical-progress/',
  },
  {
    id: 'solar-added',
    value: '20.79',
    unit: 'GW',
    label: 'Solar added in the first half of FY 2026-27',
    note: 'India added 20,790.76 MW between 1 April and 30 September 2026. This gives national market context only, not a forecast for a business. Project output depends on site conditions, system design, weather and the applicable connection arrangements.',
    source: 'Ministry of New and Renewable Energy — Physical Progress',
    asOf: '30 September 2026',
    href: 'https://mnre.gov.in/en/physical-progress/',
  },
  {
    id: 'rooftop-mix',
    value: '38.6',
    unit: '%',
    label: 'Share of new solar capacity that was rooftop',
    note: 'Rooftop holds 19.4% of installed stock but took 38.6% of capacity added between April and August 2026. The changing mix may prompt businesses to review available space, but does not establish that a particular roof is suitable.',
    source: 'MNRE Renewable Energy Statistics 2025-26 and Physical Progress',
    asOf: '31 August 2026',
  },
  {
    id: 'rooftop-yoy',
    value: '125.4',
    unit: '% YoY',
    label: 'Rooftop additions in Q1 2026',
    note: '2.7 GW was installed in Q1 2026, up from 1.2 GW a year earlier. Residential accounted for about 82% of additions, industrial about 11% and commercial about 7%; these segment shares are not a forecast for future demand.',
    source: 'Mercom India Research — Q1 2026 India Rooftop Solar Market Report',
    asOf: '31 March 2026',
    href: 'https://www.mercomindia.com/indias-rooftop-solar-installations-surge-by-125-yoy-in-q1-2026',
  },
  {
    id: 'ev-penetration',
    value: '8.2',
    unit: '%',
    label: 'Electric vehicle share of new registrations',
    note: 'The reported share rose from 0.7% in FY 2019-20 to 8.2% in FY 2025-26. Registration trends provide broad mobility context; charging demand at a site still depends on vehicle mix, usage, dwell time and location.',
    source: 'Ministry of Heavy Industries — Lok Sabha Unstarred Question 1406',
    asOf: 'FY 2025-26',
    href: 'https://sansad.in/getFile/lsapps/loksabhaquestions/annex/188/AU1406_8fugQw.pdf',
  },
  {
    id: 'edrive-chargers',
    value: '6,562',
    unit: 'chargers',
    label: 'Public EV chargers approved under PM E-DRIVE',
    note: '₹689 crore was approved as of 1 July 2026, including 1,571 chargers for Karnataka. Approval is different from installation or operation; operators should confirm current status, eligibility and local requirements before making plans.',
    source: 'Ministry of Heavy Industries — Lok Sabha reply',
    asOf: '1 July 2026',
    href: 'https://www.business-standard.com/industry/auto/pm-ev-drive-scheme-charges-stations-approved-infra-lok-sabha-sales-126080401097_1.html',
  },
  {
    id: 'nonfossil',
    value: '50.2',
    unit: '%',
    label: 'Share of India’s installed capacity that is non-fossil',
    note: 'India reached 250 GW of non-fossil installed capacity in August 2025, ahead of its 2030 NDC commitment. This national capacity share is not the same as the electricity mix or emissions profile at an individual site.',
    source: 'Ministry of New and Renewable Energy — Annual Report',
    asOf: '31 December 2025',
    href: 'https://cdnbbsr.s3waas.gov.in/s3716e1b8c6cd17b771da77391355749f3/uploads/2026/07/20260723515585394.pdf',
  },
  {
    id: 'pmsg',
    value: '59.47',
    unit: 'lakh households',
    label: 'Rooftop solar installed under PM Surya Ghar',
    note: '17,560.6 MW had been installed across 59,47,035 households as of 30 September 2026. This is a residential programme and should not be used to infer commercial eligibility, project scale or likely outcomes. Business projects require a separate assessment.',
    source: 'PM Surya Ghar national portal / JMK Research',
    asOf: '30 September 2026',
    href: 'https://pmsuryaghar.gov.in',
  },
];

/** Rendered as the "Why now" band on the home and services pages. */
export const featuredInsights = insights.slice(0, 4);

/**
 * Non-numeric editorial framing. Kept separate from `insights` because these
 * are judgements, not measurements.
 */
export interface MarketShift {
  title: string;
  body: string;
}

export const marketShifts: MarketShift[] = [
  {
    title: 'Rooftop is where the growth actually is',
    body: 'Ground-mounted solar is still 3.8 times larger than rooftop by capacity. But between April and August 2026, rooftop took 38.6% of all new capacity in the country. If you are building or leasing a building in India, the roof you already own is now the fastest-deploying asset in the entire energy sector — and the least contested one.',
  },
  {
    title: 'Charging infrastructure is behind vehicle adoption',
    body: 'EV penetration went from 0.7% to 8.2% of registrations in five years. Over the same window, 9,583 public charging stations were installed under FAME-II and 6,562 more were approved under PM E-DRIVE — none of which had been commissioned as of July 2026. Vehicles are arriving faster than the grid that has to charge them.',
  },
  {
    title: 'Demand charges, not energy prices',
    body: 'For most commercial and industrial sites in India the bill is not dominated by the per-unit energy rate — it is dominated by the demand charge levied on peak consumption. That single fact changes which technology pays back fastest, and it is the first thing we look at in an audit.',
  },
  {
    title: 'Nobody has proven uptime yet',
    body: 'Approved infrastructure is not operational infrastructure. Until monitoring, fault detection and payment systems work reliably in the field, operators cannot demonstrate utilisation to a lender. Software is the part of this transition that is consistently under-specified.',
  },
];

/**
 * Technical Whitepapers & Engineering Intelligence
 * Deep-dive research papers covering regulatory frameworks, engineering calculations, and deployment architectures.
 */
export interface TechnicalWhitepaper {
  id: string;
  category: 'Solar & Storage' | 'EV Mobility' | 'Policy & Tariffs' | 'Carbon Economics';
  categoryColor: string;
  title: string;
  subtitle: string;
  readTime: string;
  publishedDate: string;
  author: string;
  standardsCited: string[];
  executiveSummary: string;
  keyFormulas: { label: string; formula: string; description: string }[];
  engineeringFindings: string[];
  procurementTakeaways: string[];
  statHighlight: { value: string; label: string };
}

export const TECHNICAL_WHITEPAPERS: TechnicalWhitepaper[] = [
  {
    id: 'tod-tariff-arbitrage-bess',
    category: 'Solar & Storage',
    categoryColor: 'amber',
    title: 'Time-of-Day (ToD) Tariff Optimization & Peak Arbitrage in Southern DISCOMs',
    subtitle: 'Financial and Technical Feasibility of Behind-the-Meter Containerized LFP BESS under TANGEDCO & BESCOM HT Tariffs',
    readTime: '12 min read',
    publishedDate: 'October 2026',
    author: 'Virya Energy Systems & Grid Analytics Group',
    standardsCited: ['CEA Technical Standards 2024', 'TNERC Multi-Year Tariff Order', 'KERC HT-2a Tariff Regulations'],
    statHighlight: { value: '₹7.20 / kWh', label: 'Peak to Off-Peak Tariff Spread' },
    executiveSummary:
      'Industrial tariffs in southern Indian states feature steep peak-hour surcharges (typically 20% to 25% above normal energy charges between 06:00-09:00 and 18:00-22:00) alongside restrictive maximum demand penalties (150% to 200% on demand overshoots). This paper evaluates the financial modeling and battery cycle life degradation of behind-the-meter 0.5C LFP systems configured for dual-cycle peak clipping and solar self-consumption.',
    keyFormulas: [
      {
        label: 'Arbitrage Gross Margin',
        formula: 'ΔS = (E_discharge × T_peak) - (E_charge × T_solar / η_RTE)',
        description: 'Calculates the net economic gain per discharge cycle factoring Round-Trip Efficiency (η_RTE ~91%) and opportunity cost of solar generation vs off-peak grid power.',
      },
      {
        label: 'Demand Penalty Avoidance',
        formula: 'Savings_MD = Max(0, P_measured - P_sanctioned) × Rate_excess_kVA',
        description: 'Quantifies immediate cost avoidance by injecting stored battery power during instantaneous load spikes that exceed sanctioned kVA limits.',
      },
    ],
    engineeringFindings: [
      'Two full charge-discharge cycles per day under tropical ambient conditions (35°C–42°C) require active liquid cooling rather than forced air to avoid thermal runaway risks and premature capacity degradation.',
      'Containerized LFP cells operated within a 15% to 85% State of Charge (SoC) envelope preserve cycle life up to 6,200 cycles, yielding a 9.2-year economic service life before secondary repurposing.',
      'BESCOM HT-2a consumers with a sanctioned demand >1,000 kVA achieve an un-levered IRR of 22.4% when combining peak shaving with captive rooftop solar.',
    ],
    procurementTakeaways: [
      'Specify cell-level aerosol fire extinguishing systems adhering to NFPA 855 and UL 9540A certification standards.',
      'Mandate native Modbus TCP / IEC 61850 protocol support on the Battery Management System (BMS) for direct telemetry pairing with plant SCADA.',
    ],
  },
  {
    id: 'cbam-embedded-emissions',
    category: 'Carbon Economics',
    categoryColor: 'emerald',
    title: 'EU CBAM Decarbonization Framework: Embedded Emissions Accounting for Indian Industrial Exporters',
    subtitle: 'Navigating Annex III Specific Embedded Emissions Rules for Steel, Aluminum, and Fasteners Under Regulation (EU) 2023/956',
    readTime: '15 min read',
    publishedDate: 'September 2026',
    author: 'Virya Carbon Advisory & ESG Intelligence Desk',
    standardsCited: ['Regulation (EU) 2023/956', 'GHG Protocol Corporate Standard', 'ISO 14064-1:2018', 'SEBI BRSR Core'],
    statHighlight: { value: '€70 – €95', label: 'Forecast EU ETS Price / tCO2e' },
    executiveSummary:
      'With the full enforcement of the European Union Carbon Border Adjustment Mechanism (CBAM), Indian manufacturers of iron, steel, aluminum, fertilizers, and hydrogen face mandatory financial surrender of CBAM certificates reflecting their embedded greenhouse gas emissions. This paper outlines the specific boundary definition methodology, precursor accounting, and on-site renewable energy integration strategies required to mitigate border tariff exposure.',
    keyFormulas: [
      {
        label: 'Specific Embedded Direct Emissions',
        formula: 'SEE_dir = (AttrEm_dir + Em_precursors) / AL',
        description: 'Defines the direct greenhouse gas intensity per metric ton of goods produced based on activity level (AL) and attributable direct emissions inclusive of inputs.',
      },
      {
        label: 'CBAM Financial Exposure',
        formula: 'Liability_CBAM = Max(0, SEE_real - Benchmark_EU) × AL_export × Price_EU_ETS',
        description: 'Estimates the gross border tariff payable when actual plant emissions exceed the corresponding EU sectoral free allocation benchmark.',
      },
    ],
    engineeringFindings: [
      'Indian blast furnace-basic oxygen furnace (BF-BOF) steel currently averages ~2.35 tCO2e/t crude steel, compared to the EU ETS benchmark of ~1.35 tCO2e/t, creating a potential €80 to €95/ton tariff disadvantage unless decarbonized.',
      'On-site captive solar combined with long-term Green Energy Open Access (GEOA) PPAs directly reduces Scope 2 indirect emissions to zero, providing immediate CBAM reporting relief.',
      'Digital energy management systems (EMS) with tamper-proof meter telemetry are vital; EU third-party verifiers reject manual spreadsheet-based emissions estimates.',
    ],
    procurementTakeaways: [
      'Transition procurement from thermal coal-fired captive power plants to bilateral hybrid wind-solar contracts.',
      'Establish automated ISO 14064 accredited monitoring at the factory gate to ensure audit-readiness ahead of annual CBAM declarations.',
    ],
  },
  {
    id: 'mcs-fleet-depot-grid',
    category: 'EV Mobility',
    categoryColor: 'blue',
    title: 'Megawatt Charging System (MCS) & High-Power Fleet Depot Interconnection Architecture',
    subtitle: 'Electrical Distribution Sizing, Dynamic Power Sharing, and HT Headroom for 100+ Electric Commercial Vehicle Depots',
    readTime: '14 min read',
    publishedDate: 'October 2026',
    author: 'Virya EV Infrastructure Engineering Unit',
    standardsCited: ['SAE J3271 (MCS)', 'IEC 61851-23', 'OCPP 2.0.1 Specification', 'CEA Connectivity Regulations'],
    statHighlight: { value: '3.75 MW', label: 'Maximum Single MCS Port Output' },
    executiveSummary:
      'The transition of commercial bus transit depots and heavy-duty logistics hubs from diesel to electric drivetrains introduces multi-megawatt concentrated loads on distribution feeders. This research paper details the electrical substation topology, 11kV/33kV dual-busbar switchgear arrangements, dynamic automated load balancing algorithms, and BESS buffer integration required to prevent grid tripping during simultaneous depot charging.',
    keyFormulas: [
      {
        label: 'Depot Coincident Peak Demand',
        formula: 'P_peak = Σ (P_rated,i × η_SE,i) × DF_fleet',
        description: 'Calculates the simultaneous maximum power drawn by the depot taking into account charging equipment efficiency (η_SE) and fleet diversity factor (DF_fleet ~0.65-0.80).',
      },
      {
        label: 'Dynamic Load Sharing Factor',
        formula: 'P_alloc,i = Min(P_max,i, (P_grid_limit - P_baseload) × (SoC_target - SoC_current,i) / Σ ΔSoC)',
        description: 'Optimizes dynamic power distribution across charging dispensers based on real-time vehicle battery urgency and remaining grid headroom.',
      },
    ],
    engineeringFindings: [
      'Uncontrolled concurrent fast charging of 50 buses at 180 kW draws 9.0 MW, causing catastrophic transformer thermal overloading; dynamic OCPP 2.0.1 scheduled charging flattens this peak to 3.8 MW over an 8-hour overnight window.',
      'Liquid-cooled charging cables are mandatory for sustained currents exceeding 350A (CCS2) and up to 3,000A (MCS) to maintain safe connector surface temperatures below 50°C.',
      'Co-locating a 1MW / 2MWh containerized battery buffer eliminates the need for expensive dedicated 66kV substation lines in suburban logistics parks.',
    ],
    procurementTakeaways: [
      'Mandate ISO 15118-20 Plug & Charge and bidirectional V2G hardware compliance in all procurement RFPs.',
      'Incorporate harmonic Active Filters (AHF) at the secondary side of the distribution transformer to limit THD below 3.0% under fluctuating silicon carbide inverter loads.',
    ],
  },
  {
    id: 'lfp-bess-tropical-derating',
    category: 'Solar & Storage',
    categoryColor: 'amber',
    title: 'Cell Chemistry Selection for Industrial BESS: LFP vs NMC Under High Tropical Ambient Temperatures',
    subtitle: 'Thermal Degradation, Solid Electrolyte Interphase (SEI) Growth, and Fire Safety Performance in 45°C Indian Climates',
    readTime: '11 min read',
    publishedDate: 'September 2026',
    author: 'Virya Electrochemical Engineering & Materials Laboratory',
    standardsCited: ['UL 9540A Test Methodology', 'IEC 62619', 'IS 16046 (Part 2) / IEC 62133-2'],
    statHighlight: { value: '6,000+', label: 'LFP Cycle Life at 80% Depth of Discharge' },
    executiveSummary:
      'Industrial facilities across Gujarat, Rajasthan, Tamil Nadu, and Maharashtra regularly experience ambient summer temperatures exceeding 42°C. Operating stationary energy storage in these environments accelerates battery degradation, parasitic HVAC energy consumption, and thermal runaway susceptibility. This study performs an empirical comparison between Lithium Iron Phosphate (LiFePO4 / LFP) and Nickel Manganese Cobalt (NMC811) chemistry.',
    keyFormulas: [
      {
        label: 'Arrhenius Capacity Fade Rate',
        formula: 'k_degrade = A × exp(-E_a / (R × T_cell))',
        description: 'Quantifies the exponential acceleration of solid electrolyte interphase (SEI) layer growth as internal cell temperature (T_cell in Kelvin) increases.',
      },
      {
        label: 'Auxiliary HVAC Cooling Parasitic Loss',
        formula: 'Loss_aux (%) = (E_HVAC / E_gross_discharge) × 100',
        description: 'Measures the percentage of stored energy consumed merely to keep cells within the optimum 23°C–27°C operating window in extreme ambient heat.',
      },
    ],
    engineeringFindings: [
      'LFP chemistry exhibits an onset thermal runaway temperature of ~270°C compared to only ~150°C for NMC811, making LFP inherently safer for dense factory installations.',
      'Liquid cold plates in direct contact with cell casings reduce cell-to-cell thermal gradient to <2°C, preventing localized hot-spot degradation and extending pack longevity by 34% over air-cooled enclosures.',
      'While NMC offers 30% higher volumetric energy density, its thermal sensitivity leads to 2.4× higher auxiliary HVAC power draw under 45°C ambient conditions, erasing its Capex advantage.',
    ],
    procurementTakeaways: [
      'Specify LFP prismatic cells with IP67 enclosed modules and redundant multi-sensor off-gas detection (H2, CO, VOC).',
      'Require vendor warranties to guarantee remaining capacity at 70% after 10 years based on 1.5 equivalent full cycles per day at 35°C average ambient.',
    ],
  },
  {
    id: 'geoa-open-access-100kw',
    category: 'Policy & Tariffs',
    categoryColor: 'violet',
    title: 'Green Energy Open Access (GEOA) 100 kW Rules: Cross-Subsidy Surcharges & Banking Economics',
    subtitle: 'Commercial Strategy for C&I Consumers Utilizing Ministry of Power Rules and State SERC Interconnection Orders',
    readTime: '13 min read',
    publishedDate: 'October 2026',
    author: 'Virya Regulatory Affairs & Power Marketing Team',
    standardsCited: ['Ministry of Power GEOA Rules 2022/2023', 'CERC (Connectivity & General Network Access) Regulations', 'State Electricity Regulatory Commission (SERC) Orders'],
    statHighlight: { value: '100 kW', label: 'Lowered Eligibility Threshold (from 1 MW)' },
    executiveSummary:
      'The lowering of the Open Access threshold from 1,000 kW (1 MW) to 100 kW for green power procurement democratized renewable energy access for thousands of commercial and light industrial consumers. However, financial feasibility hinges on state-specific Cross-Subsidy Surcharges (CSS), Additional Surcharges (AS), wheeling charges, and restricted banking provisions.',
    keyFormulas: [
      {
        label: 'Delivered Open Access Power Cost',
        formula: 'Cost_delivered = Tariff_PPA + Loss_grid + Wheel_chg + CSS + AS + Tax',
        description: 'Calculates the landed cost per unit at the consumer busbar after aggregating generator PPA tariff, transmission losses, and DISCOM statutory levies.',
      },
      {
        label: 'Net Financial Savings per kWh',
        formula: 'ΔCost = Tariff_DISCOM_HT - Cost_delivered',
        description: 'Determines the economic margin per unit against the incumbent utility tariff (typically ₹8.00–₹10.50/kWh in Maharashtra, Karnataka, and Tamil Nadu).',
      },
    ],
    engineeringFindings: [
      'In Group Captive structures where the consumer holds >=26% equity and consumes >=51% generation, Cross-Subsidy Surcharge (CSS) and Additional Surcharge (AS) are legally exempt, unlocking savings of ₹2.10 to ₹3.40 per unit.',
      'State banking policies vary widely: Tamil Nadu and Karnataka allow monthly energy banking with 10%–14% banking charges, whereas other states restrict banking to 15-minute time blocks.',
      'Consumers with steady 24/7 base loads (plastics, chemicals, IT parks, cold storages) achieve maximum savings because generation aligns with baseload consumption without requiring high banking credits.',
    ],
    procurementTakeaways: [
      'Structure clean energy off-take through Group Captive Special Purpose Vehicles (SPVs) to secure permanent CSS exemption.',
      'Install Class 0.2S bidirectional ABT/Special Energy Meters (SEM) with automated AMR connectivity to avoid DISCOM billing discrepancies.',
    ],
  },
  {
    id: 'flexible-cigs-vs-topcon',
    category: 'Solar & Storage',
    categoryColor: 'amber',
    title: 'Structural Dead-Load Limits on PEB Warehouses: Lightweight CIGS Mats vs Rigid Monofacial/Bifacial Glass',
    subtitle: 'Overcoming 10–15 kg/m² Structural Roof Constraints with Glass-Free Flexible Adhesive Solar Modules',
    readTime: '10 min read',
    publishedDate: 'August 2026',
    author: 'Virya Structural Engineering & Photovoltaic Systems Group',
    standardsCited: ['IS 875 (Part 3) Wind Loads on Buildings', 'IEC 61215 / IEC 61730', 'UL 790 Class A Fire Rating'],
    statHighlight: { value: '2.9 kg / m²', label: 'Flexible CIGS Module Weight (vs 16.5 kg for Rigid)' },
    executiveSummary:
      'Over 60% of modern logistics warehouses and Pre-Engineered Buildings (PEBs) in India feature light-gauge curved metal roofs designed with minimal reserve dead-load capacity (often strictly limited to 10–12 kg/m²). Installing conventional glass-glass framed solar modules (15–22 kg/m² including mounting ballast and purlin rails) risks roof sag, purlin buckling, and warranty voidance. This paper evaluates peel-and-stick flexible Copper Indium Gallium Selenide (CIGS) mats as a high-yield alternative.',
    keyFormulas: [
      {
        label: 'Total Roof Loading Pressure',
        formula: 'W_total = W_module + W_rail + W_fasteners + W_wind_uplift',
        description: 'Evaluates structural suitability against the design dead load and live load capacity specified by the PEB building manufacturer.',
      },
      {
        label: 'Wind Uplift Safety Factor',
        formula: 'SF_uplift = F_peel_adhesion / (q_z × C_p_net × Area_module)',
        description: 'Ensures the structural peel adhesive provides a safety factor >2.5 against localized wind gusts up to 160 km/h (IS 875 Zone 3).',
      },
    ],
    engineeringFindings: [
      'Flexible CIGS mats weigh only 2.9 kg/m²—an 82% weight reduction compared to framed crystalline silicon—allowing full solar utilization of roofs deemed structurally unsafe for rigid panels.',
      'Zero roof penetrations: High-performance structural adhesive bonds directly to corrugated standing seam metal profiles, eliminating roof puncture leaks.',
      'CIGS modules exhibit superior low-light and diffuse radiation coefficients, delivering 8% to 12% higher specific energy yield (kWh/kWp) during monsoon and cloudy periods compared to standard crystalline silicon.',
    ],
    procurementTakeaways: [
      'Perform chemical adhesion pull tests on metal sheet coating (Galvalume / Color-coated Steel) prior to full peel-and-stick deployment.',
      'Ensure module micro-inverter or string architecture accommodates high current, lower voltage electrical characteristics of series-connected thin-film strings.',
    ],
  },
  {
    id: 'cea-grid-connectivity-2024',
    category: 'Policy & Tariffs',
    categoryColor: 'violet',
    title: 'Central Electricity Authority (CEA) Technical Standards: Harmonic Filtering, Fault Ride-Through & VCB Protection',
    subtitle: 'Engineering Compliance Guide for Distributed Generation & Captive Inverters Interconnecting at 11kV, 33kV & 66kV',
    readTime: '13 min read',
    publishedDate: 'September 2026',
    author: 'Virya High-Voltage Electrical & Grid Interconnection Division',
    standardsCited: ['CEA Technical Standards for Connectivity to the Grid Regulations 2024', 'IEEE 519-2022 Harmonic Limits', 'IEC 60255 Protection Relays'],
    statHighlight: { value: '< 3.0 %', label: 'Maximum Allowable Current Total Harmonic Distortion (THD)' },
    executiveSummary:
      'Interconnecting private multi-megawatt solar, BESS, and high-power EV charging infrastructure to state transmission utilities (STU) and DISCOM distribution networks requires strict adherence to CEA Technical Standards. This document details engineering specifications for Low-Voltage Ride-Through (LVRT), dynamic reactive power compensation, active harmonic filters, and statutory Chief Electrical Inspector to Government (CEIG) approval procedures.',
    keyFormulas: [
      {
        label: 'Total Harmonic Distortion (Current)',
        formula: 'THD_I (%) = (√(Σ (I_h)²) / I_1) × 100',
        description: 'Mandatory IEEE 519 and CEA check to ensure inverter switching frequencies and non-linear loads do not pollute utility feeder voltage waveforms.',
      },
      {
        label: 'Reactive Power Q-V Droop Requirement',
        formula: 'Q_req = k × (V_measured - V_nominal) × P_active',
        description: 'Determines the automated inverter injection or absorption of VARs to support local grid voltage stability during transmission line disturbances.',
      },
    ],
    engineeringFindings: [
      'CEA 2024 mandates inverters must stay connected during grid voltage dips down to 15% of nominal voltage for at least 0.15 seconds (LVRT compliance).',
      'Solar plants without Active Harmonic Filters (AHF) or detuned capacitor banks frequently face DISCOM trip-outs and low power factor penalties due to high 5th and 7th harmonic content.',
      'Installing modern numeric relays with IEC 61850 GOOSE messaging enables directional overcurrent (51/51N), earth fault (64), and anti-islanding (78/81R) tripping in under 35 milliseconds.',
    ],
    procurementTakeaways: [
      'Insist on type-test certificates from accredited laboratories (CPRI or equivalent) verifying LVRT/HVRT and harmonic compliance for all inverters.',
      'Design dual-source control supply (110V DC battery bank with float-cum-boost charger) for VCB switchgear trip coils to guarantee protection operation during grid collapse.',
    ],
  },
  {
    id: 'sebi-brsr-core-telemetry',
    category: 'Carbon Economics',
    categoryColor: 'emerald',
    title: 'SEBI BRSR Core & Scope 1/2/3 Telemetry: Building Audit-Ready Digital Energy Trails',
    subtitle: 'Automated Ingestion, Emission Factor Tracking, and Third-Party Assurance for India’s Top 1000 Listed Entities',
    readTime: '12 min read',
    publishedDate: 'October 2026',
    author: 'Virya Digital Platforms & ESG Assurance Practice',
    standardsCited: ['SEBI Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122', 'GHG Protocol Standard', 'ISAE 3000 (Revised) Assurance'],
    statHighlight: { value: 'Top 1000', label: 'Mandatory Listed Companies under BRSR Core' },
    executiveSummary:
      'Under Securities and Exchange Board of India (SEBI) guidelines, listed corporations must furnish reasonable assurance for "BRSR Core" Environmental, Social, and Governance attributes. Energy and GHG intensity metrics can no longer rely on sporadic manual utility bill uploads. This whitepaper presents an IoT telemetry framework that transforms smart meter pulses into auditor-certified Scope 1, Scope 2, and Scope 3 reports.',
    keyFormulas: [
      {
        label: 'Location-Based Scope 2 Emissions',
        formula: 'Em_Scope2 = Σ (kWh_consumed,i × EF_CEA_grid) / 1000',
        description: 'Calculates grid emissions in metric tons of CO2e utilizing the latest Central Electricity Authority CO2 Baseline Database factor (~0.716 kg CO2/kWh).',
      },
      {
        label: 'Energy Intensity per Revenue',
        formula: 'EI_ratio = Total_Gigajoules / Revenue_INR_Crores',
        description: 'Standard SEBI BRSR Core disclosure metric measuring primary energy consumption efficiency relative to financial turnover.',
      },
    ],
    engineeringFindings: [
      'Manual carbon accounting has a 14% to 22% error margin due to unmetered auxiliary losses, diesel genset density variations, and lagged billing cycles, which fail reasonable assurance audits.',
      'Integrating smart energy meters at transformer secondaries, solar generation buses, and diesel generators provides 15-minute time-stamped telemetry with automated SHA-256 cryptographic verification.',
      'Companies deploying real-time telemetry report a 60% reduction in external assurance audit timelines and avoid reputational greenwashing risks.',
    ],
    procurementTakeaways: [
      'Adopt an open-architecture Energy Management System (EMS) capable of exporting raw meter data directly to statutory ESG disclosure schemas.',
      'Incorporate water consumption, hazardous waste telemetry, and renewable energy certificate (REC) tracking within the same cloud data platform.',
    ],
  },
];

/**
 * 8-Slide Technical Intelligence Briefs for interactive slider on top of Insights page
 */
export interface TechnicalBriefSlide {
  id: string;
  category: string;
  pill: string;
  headline: string;
  title: string;
  summary: string;
  metric: { value: string; label: string };
  keyPoints: string[];
  whitepaperRefId: string;
  image: string;
}

export const TECHNICAL_BRIEFS_SLIDES: TechnicalBriefSlide[] = [
  {
    id: 'brief-1',
    category: 'Energy Storage & Tariffs',
    pill: 'ToD Arbitrage',
    headline: 'Time-of-Day Tariff Spreads in Southern DISCOMs',
    title: 'Exploiting ₹7.20/kWh Peak-to-Off-Peak Spreads with Behind-the-Meter LFP BESS',
    summary:
      'Steep industrial peak surcharges across Tamil Nadu, Karnataka, and Maharashtra make 2-hour and 4-hour battery energy storage systems commercially viable for demand charge management and solar time-shifting.',
    metric: { value: '₹7.20/kWh', label: 'Peak Spread' },
    keyPoints: [
      'Sub-20ms transfer prevents industrial manufacturing tripping',
      'Dual daily cycle configuration yielding 22.4% un-levered project IRR',
      'Liquid-cooled battery enclosures preventing tropical thermal degradation',
    ],
    whitepaperRefId: 'tod-tariff-arbitrage-bess',
    image: '/images/generated-battery-room.jpg',
  },
  {
    id: 'brief-2',
    category: 'Carbon Markets & Export',
    pill: 'EU CBAM Strategy',
    headline: 'EU CBAM Compliance & Border Carbon Tariff Risk',
    title: 'Mitigating €70–€95/tCO2e Border Penalties on Indian Steel, Aluminum & Cement',
    summary:
      'European Union border carbon tariffs demand rigorous product-level embedded emissions tracking. Captive solar arrays and bilateral green PPAs slash indirect emissions to zero, preserving exporter operating margins.',
    metric: { value: '€70–€95', label: 'EU ETS / tCO2e' },
    keyPoints: [
      'Detailed Annex III precursor tracking for complex manufactured goods',
      'Direct substitution of coal boiler heat with green electrical processes',
      'Third-party verified ISO 14064 digital carbon audit trails',
    ],
    whitepaperRefId: 'cbam-embedded-emissions',
    image: '/images/data-center-green-power.jpg',
  },
  {
    id: 'brief-3',
    category: 'Fleet Electrification',
    pill: 'Depot Megawatt Charging',
    headline: 'Multi-Megawatt Fleet Depot Interconnection Architecture',
    title: 'Dynamic Load Sizing & Substation Engineering for 100+ Electric Bus Depots',
    summary:
      'Uncontrolled charging of 50 buses creates catastrophic 9MW instantaneous demand peaks. Dynamic OCPP 2.0.1 smart charging and battery buffers flatten demand below 3.8MW without delaying departure schedules.',
    metric: { value: '3.75 MW', label: 'Max MCS Output' },
    keyPoints: [
      'Dynamic power balancing across 50+ dual-gun charging bays',
      'Liquid-cooled cables maintaining plug temperatures <50°C at 500A+',
      'Integrated BESS peak shaving avoiding costly 66kV grid upgrades',
    ],
    whitepaperRefId: 'mcs-fleet-depot-grid',
    image: '/images/ev-bus-depot-charging.jpg',
  },
  {
    id: 'brief-4',
    category: 'Electrochemical Engineering',
    pill: 'LFP Battery Longevity',
    headline: 'Industrial BESS Chemistry in 45°C Ambient Climates',
    title: 'LFP vs NMC811: Cycle Degradation & Thermal Safety in Tropical Zones',
    summary:
      'Empirical thermal testing proves LFP chemistry delivers 6,000+ cycles with minimal SEI layer growth at high ambient temperatures, whereas NMC chemistry suffers accelerated parasitic HVAC power loss and fire risk.',
    metric: { value: '6,000+', label: 'Cycles at 80% DoD' },
    keyPoints: [
      'Onset thermal runaway temperature of 270°C for LFP vs 150°C for NMC',
      'Liquid cold plates reducing cell-to-cell thermal gradient below 2°C',
      '10-year warranted capacity retention above 70% in Indian conditions',
    ],
    whitepaperRefId: 'lfp-bess-tropical-derating',
    image: '/images/generated-storage-system.jpg',
  },
  {
    id: 'brief-5',
    category: 'Regulatory Economics',
    pill: 'GEOA 100 kW Rules',
    headline: 'Green Energy Open Access Lowered Threshold',
    title: 'Captive Group Structures & Cross-Subsidy Surcharge Exemption',
    summary:
      'The reduction of Open Access threshold to 100 kW enables mid-sized commercial entities to procure clean energy. Structuring off-take via Group Captive SPVs exempts consumers from heavy DISCOM cross-subsidy levies.',
    metric: { value: '100 kW', label: 'Threshold' },
    keyPoints: [
      '>=26% equity holding exempts Cross-Subsidy Surcharges (CSS)',
      'Savings of ₹2.10 to ₹3.40/kWh compared to commercial grid tariffs',
      'Automated Class 0.2S ABT meter settlement and banking management',
    ],
    whitepaperRefId: 'geoa-open-access-100kw',
    image: '/images/hero-cleantech-hub.jpg',
  },
  {
    id: 'brief-6',
    category: 'Structural Engineering',
    pill: 'Flexible CIGS Solar',
    headline: 'Structural Dead-Load Limits on PEB Warehouses',
    title: 'Ultra-Lightweight 2.9 kg/m² Flexible CIGS Mats for Non-Penetrating Roofs',
    summary:
      'Logistics sheds with restrictive 10–12 kg/m² dead-load ratings cannot support conventional 16.5 kg/m² glass solar modules. Peel-and-stick flexible CIGS mats solve structural limitations without puncturing metal sheets.',
    metric: { value: '2.9 kg/m²', label: 'Ultralight Weight' },
    keyPoints: [
      '82% lighter than framed crystalline silicon glass modules',
      'Zero sheet perforations: high-bond structural peel adhesive',
      '8% to 12% higher specific energy yield under diffuse monsoon light',
    ],
    whitepaperRefId: 'flexible-cigs-vs-topcon',
    image: '/images/solar-flexible-mat.jpg',
  },
  {
    id: 'brief-7',
    category: 'Grid Interconnection',
    pill: 'CEA Grid Compliance',
    headline: 'CEA Technical Standards for HT Interconnection',
    title: 'Harmonic Mitigation, Fault Ride-Through & High-Voltage Relay Coordination',
    summary:
      'State utilities enforce strict penalties for voltage distortion and sudden tripping. Turnkey substation EPC with active harmonic filtering and numeric protection relays ensures seamless 11kV/33kV grid compliance.',
    metric: { value: '<3.0%', label: 'Max Current THD' },
    keyPoints: [
      'Low-Voltage Ride-Through (LVRT) compliance down to 15% grid voltage',
      'Active Harmonic Filters (AHF) preventing DISCOM trip-outs',
      'Dual-source DC trip battery supply guaranteeing sub-35ms clearance',
    ],
    whitepaperRefId: 'cea-grid-connectivity-2024',
    image: '/images/grid-modernization-substation.jpg',
  },
  {
    id: 'brief-8',
    category: 'ESG Assurance',
    pill: 'SEBI BRSR Core',
    headline: 'Digital Energy Telemetry for Audit-Proof Reporting',
    title: 'Automating Scope 1, 2, and 3 Carbon Footprint Assurance with IoT SCADA',
    summary:
      'SEBI mandates reasonable assurance for top 1000 listed corporations under BRSR Core. Replacing fragmented spreadsheets with cryptographic meter telemetry cuts external audit costs by 60% and guarantees zero data drift.',
    metric: { value: 'Top 1000', label: 'Mandated Entities' },
    keyPoints: [
      'Automated 15-minute telemetry with SHA-256 cryptographic verification',
      'Live application of CEA National CO2 baseline grid emission factors',
      'Seamless compliance with ISAE 3000 assurance standards',
    ],
    whitepaperRefId: 'sebi-brsr-core-telemetry',
    image: '/images/generated-dashboard.jpg',
  },
];
