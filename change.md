# Change Notes

## 2026-10-29

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
