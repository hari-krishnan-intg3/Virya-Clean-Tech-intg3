# Change Notes

## 2026-10-29

- Full Platform 6–8 Slider Minimum Rollout Across Digital Presence:
  - **Home Page Hero Slider** (`HeroSliderContainer.tsx` & `content.ts`): Expanded from 3 to **8 full slides** (1. Industrial Clean Energy, 2. Multi-MW Solar & Flexible CIGS Mats, 3. Megawatt Fleet EV Depots, 4. Containerized LFP BESS, 5. Utility Wind Corridors, 6. 24/7 Digital Hubs & Microgrids, 7. Cloud SCADA & VPPs, 8. Carbon Economics & CBAM).
  - **Home Page Use Cases Slider** (`UseCasesContainer.tsx` & `homeContent.ts`): Expanded from 4 static cards to an **8-slide interactive Swiper carousel** across all 8 market sectors (Manufacturing, Fleet Logistics, Healthcare, Multi-Site Real Estate, Hyperscale Data Centers, Retail & Hospitality, Utilities & Smart Grids, Heavy Industrial Exporters).
  - **Solutions Portfolio Showcase Slider** (`SolutionsShowcaseSlider.tsx` & `ServicesPage.tsx`): Built an **8-slide interactive Swiper showcase** representing the 8 CleanTech pillars with operational metrics, technical specifications, and category filters.
  - **Carbon Economics Strategic Blueprint Slider** (`CarbonEconomicsPage.tsx` & `carbonEconomics.ts`): Built an **8-slide Swiper slider** covering CBAM exposure, Indian Carbon Market CCTS, Marginal Abatement Cost Curves, BRSR Core, Group Captive Open Access, Behind-the-Meter BESS, Green Steel Transition, and Corporate Climate Governance.
  - **Insights Technical Intelligence Briefs Slider** (`InsightsPage.tsx` & `insights.ts`): Built an **8-slide Swiper slider** with high-level executive research briefs covering ToD tariff arbitrage, EU CBAM accounting, MCS fleet charging, and electrochemical thermal safety.

- Deep Technical Intelligence & Whitepaper Repository (`InsightsPage.tsx` & `insights.ts`):
  - Created 8 comprehensive, peer-level Technical Whitepapers with regulatory citations, executive summaries, field findings, and actionable procurement recommendations:
    1. Time-of-Day (ToD) Tariff Optimization & Peak Arbitrage in Southern DISCOMs (TANGEDCO & BESCOM).
    2. EU CBAM Decarbonization Framework: Embedded Emissions Accounting for Indian Industrial Exporters.
    3. Megawatt Charging System (MCS) & High-Power Fleet Depot Interconnection Architecture.
    4. Cell Chemistry Selection for Industrial BESS: LFP vs NMC Under High Tropical Ambient Temperatures.
    5. Green Energy Open Access (GEOA) 100 kW Rules: Cross-Subsidy Surcharges & Banking Economics.
    6. Structural Dead-Load Limits on PEB Warehouses: Lightweight CIGS Mats vs Rigid Monofacial/Bifacial Glass.
    7. Central Electricity Authority (CEA) Technical Standards: Harmonic Filtering, Fault Ride-Through & VCB Protection.
    8. SEBI BRSR Core & Scope 1/2/3 Telemetry: Building Audit-Ready Digital Energy Trails.
  - Implemented category filter tabs (`All`, `Solar & Storage`, `EV Mobility`, `Policy & Tariffs`, `Carbon Economics`) and expandable drawer views with engineering mathematical formulas (Arbitrage Gross Margin, Arrhenius Capacity Fade, THD Current, etc.).

- Interactive CleanTech ROI Calculators (`SolutionsRoiCalculators.tsx` in `ServicesPage.tsx`):
  - Integrated directly into the Offerings/Solutions page (`/services#roi-calculators`).
  - Multi-technology financial modeling suite with dynamic sliders:
    1. **Commercial Solar PV ROI**: Real-time generation yield, 40% Year 1 accelerated depreciation tax shields, IRR %, simple payback period, and 25-year cumulative savings.
    2. **Commercial Fleet EV Electrification TCO**: Fleet size (3W, LCV, Bus, Truck), diesel vs EV per-km expenditure differential, annual fuel savings, EVSE Capex payback in months, and CO2 emissions abated.
    3. **Industrial BESS Peak Shaving & Arbitrage**: Peak ToD spread, contract demand shaved off billing meters, monthly demand charge savings, and daily discharge arbitrage revenue.

- Interactive Energy Assessment Toolkits (`EnergyAssessmentToolkits.tsx` in `ServicesPage.tsx`):
  - Integrated directly into the Offerings/Solutions page (`/services#assessment-toolkits`).
  - 4 interactive sizing and screening tools with real-time engineering verdicts:
    1. **Transformer & HT Headroom Screener**: Computes safe loading headroom (85% thermal limit), spare kVA/kW, and flags load margins below 15%.
    2. **Rooftop Structural Screener**: Evaluates PEB metal sheet, RCC slab, curved standing seam, and asbestos roofs; auto-recommends rigid TOPCon vs lightweight 2.9 kg/m² flexible CIGS mats with annual yield forecast.
    3. **EV Charging Infrastructure Sizer**: Sizes depot connected kW, dual-gun bay count, and charging architecture (DC Fast vs AC Smart) based on fleet battery pack and dwell windows.
    4. **Diesel Displacement Auditor**: Models 70–85% diesel generator displacement via solar-storage microgrids, quantifying annual fuel cost avoided and Scope 1 metric tons of CO2 eliminated.

- Primary Navigation & Dedicated Page for Carbon Economics (`CarbonEconomicsPage.tsx` & `siteConfig.ts`):
  - Added primary navigation item `Carbon Economics` in `NavbarContainer.tsx` and full 4-column mega menu in `siteConfig.ts`.
  - Built interactive EU CBAM Financial Exposure Calculator with sector benchmarks (Iron & Steel, Aluminum & Alloys, Cement & Clinker, Fertilizers & Ammonia) and captive solar/BESS mitigation modeling.
  - Added Marginal Abatement Cost Curve (MACC) ranking matrix comparing ₹/tCO2e abatement cost, Capex tiers, and implementation lead times.

- Maintained Strict Vercel Serverless Function Limits (<= 12 Functions):
  - Kept total serverless function count in `api/` at 7 functions, ensuring full compatibility with Vercel Hobby plan.
  - Clean build verification: `npm run api:typecheck`, `npm run typecheck`, and `npm run build` all pass with 0 errors.

- Resolved Vercel Deployment Limit & Restored Build Compatibility:
  - Identified root cause of Vercel deployment failure: Vercel Hobby plan enforces a hard limit of 12 Serverless Functions. Adding `api/traffic-notify.ts` created a 13th function which exceeded the deployment cap.
  - Consolidated traffic notification handling directly into `api/reports.ts` (`GET/POST /api/reports?type=traffic`), eliminating the 13th function and bringing the total count back to exactly 12 functions.
  - Removed heavy `playwright` devDependency from `package.json` and restored clean `package-lock.json`.
  - Added `.vercelignore` to exclude local diagnostic test scripts and media from production build packaging.
  - Verified full TypeScript compilation (`api:typecheck` and `typecheck`) and production bundle build with zero errors.
- Restored Clean, Neat Hero Presentation:
  - Removed heavy directional smudge overlays, blurred background boxes, and the live facility telemetry mock widget.
  - Restored full-width, full-bleed hero carousel (`100svh`) with natural, high-resolution photography clearly visible across the entire frame.
  - Centered high-impact typography with the rich CleanTech intelligence content:
    - Slide 1: Multi-MW solar PV, high-power DC EV charging (3.3kW to 350kW MCS), containerized LFP storage, and cloud SCADA telemetry.
    - Slide 2: Multi-MW solar PV, flexible CIGS mats for curved roofs, and microgrids.
    - Slide 3: Megawatt fleet depots, transit bus charging, and highway corridors.
  - Added clean, transparent inline capability badges: `3.3–350 kW EV Charging`, `22.5%+ Multi-MW Solar PV`, `Containerized LFP Storage`, `OCPP 2.0.1 & ISO 15118 Telemetry`, and `10 Hubs Across India`.
  - Verified visual rendering via automated Playwright screenshot capture and passed full production build.
- Built Complete Traffic Analytics Google Sheets Infrastructure (*"The Reports"*, ID: `13hYacqrTMuR9QabZbLFukyhb5K6GNMZSdQZOa8ri3N4`):
  - Created 6 dedicated subsection tabs in the production Google Sheet:
    1. `Full_Traffic_Session_Analytics` (30 columns): Comprehensive telemetry per session (Visitor ID, Device, OS, Browser, Screen Resolution, Language, Country, Region, City, IP, Referrer, UTM parameters, Entry/Exit pages, Page Views, Active Seconds, Max Scroll Depth %, Intent Score, Lead Converted status, and Raw JSON payload).
    2. `Traffic_Page_Views` (10 columns): Granular page impression log per session and route.
    3. `Traffic_Geo_Demographics` (13 columns): Visitor location, ISP, network, device, screen, and language telemetry.
    4. `Traffic_Engagement_Events` (6 columns): In-session user interactions, click events, and route changes.
    5. `Traffic_Lead_Conversions` (9 columns): Qualified leads, high-intent conversions, contact forms, and assessment submits.
    6. `Traffic_Daily_Summary` (12 columns): Aggregated daily KPI rollup (Date, Sessions, Unique Visitors, Page Views, Avg Active Seconds, Avg Scroll Depth, Conversions, Conversion Rate %, Top City, Top Device, Top Interest).
- Implemented Automated Traffic Notification Engine (`api/_lib/traffic-notification.ts` & `api/traffic-notify.ts`):
  - Integrated Resend email delivery targeting `harikrishnan.int2027g3@gmail.com`.
  - Created responsive executive HTML email digest featuring KPI summary badges, high-intent conversion badges, recent session streams, and direct Google Sheet links to all subsections.
- Integrated Live Session API Forwarding (`api/session.ts`):
  - Enhanced session ingress to invoke `recordFullTrafficTelemetry` synchronously, writing all live visitor sessions into the 6 sheet tabs while maintaining backward compatibility with existing `Sessions` and `Reports KPI` tabs.
- Configured Google Cloud Service Account Permissions:
  - Verified and switched active service account credentials in `.env.local` to `virya-website-service@sage-now-511315-n5.iam.gserviceaccount.com` which possesses full Editor access to the spreadsheet.
- Implemented Playwright Automated Browser Testing (`scripts/test-traffic-playwright.ts`):
  - Installed `playwright` and Chromium browser binaries.
  - Built an automated end-to-end browser script that boots Chromium, visits Home, EV Charging, Solar, Energy Platforms, Industries, and Consultation routes, accepts privacy consent, simulates telemetry sync, captures visual verification screenshot (`scripts/playwright-traffic-test.png`), and triggers the live Resend notification email.
- Added NPM scripts to `Website/FrontEnd/package.json`:
  - `npm run traffic:setup` - Provision and format all 6 Google Sheet tabs with frozen header rows.
  - `npm run traffic:notify` - Send real-time traffic digest email to `harikrishnan.int2027g3@gmail.com`.
  - `npm run traffic:playwright` - Execute automated end-to-end browser test with Playwright.
- Redesigned Home Landing Page Hero: Aligned all primary content to the left side within a frosted, smudged backdrop card (`bg-[#071712]/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10`) with directional shading, leaving the right side photograph clear and prominently visible. Added a live facility telemetry snapshot widget over the right image.
- Generated and integrated 3 new high-resolution photorealistic images:
  1. `hero-cleantech-hub.jpg`: Indian CleanTech commercial energy hub with rooftop solar PV, containerized LFP BESS, and DC fleet fast-charging bays in daylight.
  2. `grid-modernization-substation.jpg`: High-voltage electrical substation and digital grid interconnection yard with step-up transformers, switchgear, and solar array.
  3. `data-center-green-power.jpg`: Hyperscale enterprise data center with solar carport canopies and containerized BESS backup power.
- Eliminated all negative space across the Home Page:
  - Replaced sparse 3-bullet positioning with a 4-card Consulting-Led Engineering Architecture grid (Interval Baseline, Multi-Asset Sync, Tariff & ROI, Audit-Ready Carbon Telemetry).
  - Expanded Offerings to all 8 CleanTech pillars in a balanced 4-column x 2-row grid with generated imagery and architecture links.
  - Expanded Market Segments to all 8 consulting sectors (Transportation, Manufacturing, Logistics, Real Estate, Utilities, Government, Retail, Data Centers) with concrete applications and business outcomes.
  - Integrated the Nationwide Regional Locator directly on the Home page featuring dual Google Maps + Terrain views across 10 operational hubs in India.
- Upgraded Mega Menu to a zero-scroll, compact, high-density layout: eliminated internal desktop scrollbars, reduced typography scale (crisp 0.65rem uppercase headings, 0.75rem item titles, 0.64rem single-line descriptions), streamlined padding, and engineered a 4-column balanced grid fitting comfortably within standard 768p/900p viewports.
- Replaced Projects with a dedicated "Energy Platforms" route (`/energy-platforms`): built complete software intelligence suite covering Operations SCADA telemetry, OCPP 1.6J/2.0.1 Charge Station Management Server (CSMS), day-ahead neural network generation forecasting, and Virtual Power Plant (VPP) microgrid orchestration. Set automatic 301-equivalent redirect from `/projects` to `/energy-platforms`.
- Moved About to the last position in the primary navigation order: `Home → Offerings → Industries → Energy Platforms → Insights → About`.
- Expanded Industries navigation to present all 8 consulting-led market segments (Transportation & Mobility, Manufacturing & Industrial, Logistics & Warehousing, Real Estate & Smart Buildings, Utilities & Energy Providers, Government & Smart Cities, Retail & Hospitality, Data Centers & Digital Infrastructure) with 3 concrete CleanTech applications per segment and direct hash anchors.
- Deleted cartoon doll image (`generated-logistics-yard.jpg`) completely from public assets.
- Generated and seeded 6 photo-realistic CleanTech images: electric auto-rickshaws, electric scooters, bus depot charging, rigid solar panels, flexible solar mats, and commercial rooftops.
- Rebuilt Offerings Mega Menu into an 8-pillar hierarchy: Electric Mobility, Renewable Energy, Battery & Storage, Smart Platforms, Grid Modernization, Sustainability & ESG, Engineering Delivery, and Managed Services.
- Re-architected Industries navigation and landing page to Schneider/Siemens consulting structure: Industry → CleanTech Applications → Business Outcomes across 8 market segments, each with 8 CleanTech offering cards.
- Seeded concrete EV vehicle database for Indian models (Tata Nexon EV, MG ZS EV, Hyundai Ioniq 5, Ather 450X, Ola S1 Pro, TVS iQube, Mahindra Treo, Piaggio Ape, Euler HiLoad, Olectra K9, Tata Starbus, Tata Ace EV, and 40–55T electric haulers) with exact battery capacities, AC/DC charging times, and connectors.
- Classified wind turbines by current generated (690V high-current vs 11kV medium-voltage) and rotor motor speed (low-speed direct-drive 9–18 RPM vs high-speed geared 1500 RPM) with hourly energy formulas and Kayathar / South Tamil Nadu corridor focus.
- Categorized solar panel modules into flat rigid framed panels (22.5%+ efficiency, 4.5 m²/kWp), lightweight flexible mats (17.5% efficiency, 2.8 kg/m² for curved/PEB roofs), and commercial rooftop installations.
- Upgraded Regional Locator with dual live Google Maps and Terrain view, complete office hub addresses, phone, email, and 1-click Google Maps directions across Bengaluru, Hyderabad, Panaji Goa, Mysuru, Mangaluru, Kozhikode, Kochi, Thiruvananthapuram, Visakhapatnam, and Kayathar.
- Added comprehensive CleanTech offering cards and vehicle showcase cards on the Home Page linking directly to sub-page routes.
- Streamlined consultation request page with instant top-level form access and CTA-friendly layout.
- Verified TypeScript compilation (`npm run typecheck`) and production bundle build (`npm run build`) with zero errors.

## 2026-10-28

- Added EV charging overview and shareable category pages for cars, two-wheelers, three-wheelers, buses and commercial fleets.
- Added charging model comparisons and short vehicle-specific charging examples with compatibility caveats.
- Added interactive charging-time, fleet ROI and carbon-reduction estimators with visible assumptions.
- Added Google Maps embeds centered on Bengaluru, Hyderabad, Goa, Mysuru, Mangaluru, Kozhikode, Kochi, Thiruvananthapuram and Visakhapatnam; locations are city views, not confirmed offices.
- Removed the consultation landing hero so the existing booking form is the first-page action; form/API behavior is unchanged.
- Added solar pages for rigid, flexible and rooftop configurations with generation, value, payback and carbon screening tools.
- Added wind pages for distributed, commercial and utility-scale screening bands, including power/current, RPM inputs, hourly energy estimates and Kayathar/South Tamil Nadu map views.
- Replaced the schematic regional locator with the real Google Maps embed, centered from the selected city or Kayathar-area coordinates.
- Kept detailed source research internal to content preparation; publication dates and reference cards are not displayed in public offering copy.
