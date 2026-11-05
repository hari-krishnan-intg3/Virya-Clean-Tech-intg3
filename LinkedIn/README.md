# Virya CleanTech: 100 B2B LinkedIn Post Templates

A comprehensive, production-ready directory of 100 high-converting LinkedIn post templates designed for CleanTech leadership, commercial engineers, and corporate decision-makers.

## Files in this Directory

- `100_LinkedIn_Post_Templates.md`: The complete markdown catalog of all 100 posts, formatted for immediate copy-pasting into LinkedIn or social management tools (Buffer, Hootsuite, Sprout, etc.).
- `linkedinTemplates.ts`: Strongly typed TypeScript dataset with search, filter, and publishing helper functions.
- `previewPost.ts`: CLI utility to preview, search, and format any post.
- `index.ts`: Barrel export for programmatic integration.

## 10 Strategic Content Pillars

1. **Pillar 1: CFO & CleanTech Financial Leadership** (Posts #001 - #010)
   - 40% Accelerated Depreciation tax shield, demand charge elimination, LCOE economics, CAPEX vs RESCO, and green debt term sheets.
2. **Pillar 2: Fleet Electrification & Megawatt Depot Engineering** (Posts #011 - #020)
   - 9 MW depot load management, dynamic OCPP 2.0.1 balancing, CCS2 vs MCS, liquid-cooled 500A cables, and battery swapping.
3. **Pillar 3: Industrial Solar, Roof Physics & Flexible CIGS** (Posts #021 - #030)
   - 10 kg/m² PEB dead-load limits, 2.9 kg/m² peel-and-stick CIGS mats, non-penetrating clamps, N-Type TOPCon vs PERC, and robotic dry cleaning.
4. **Pillar 4: BESS, Peak Arbitrage & Battery Chemistry** (Posts #031 - #040)
   - ₹7.20/kWh ToD tariff spreads, LFP vs NMC thermal runaway at 45°C, sub-20ms transfer switching, liquid cold plates, and black-start microgrids.
5. **Pillar 5: Carbon Economics, CBAM & Border Tariffs** (Posts #041 - #050)
   - EU CBAM border tariff defense, Specific Embedded Emissions (SEE) formula, €85/ton carbon simulation, MACC curves, and CCTS domestic credits.
6. **Pillar 6: ESG Assurance, SEBI BRSR Core & Digital Telemetry** (Posts #051 - #060)
   - The death of sustainability spreadsheets, 15-minute IoT cryptographic meter trails, CEA baseline grid emission factors, and energy intensity ratios.
7. **Pillar 7: Grid Modernization, Substations & CEA Standards** (Posts #061 - #070)
   - CEA 2024 compliance checklists, Active Harmonic Filters (THD < 3%), Low-Voltage Ride-Through (LVRT), VCB protection, and ETAP simulations.
8. **Pillar 8: Contrarian CleanTech Takes & Hard Truths** (Posts #071 - #080)
   - Why low-ball solar bids cost ₹1.1 Cr in lost yield, unmanaged EV fleets, paper RECs vs physical offtake, and 25-year RESCO contract traps.
9. **Pillar 9: Step-by-Step Engineering Blueprints & How-To Guides** (Posts #081 - #090)
   - 3-step transformer headroom framework, Group Captive SPV structuring, 11kV solar SLD checklist, 10-minute ToD arbitrage math, and CleanTech RFPs.
10. **Pillar 10: Industry Vision, Policy Alerts & Future of Indian Energy** (Posts #091 - #100)
    - Green Energy Open Access 100 kW rules, PM E-DRIVE subsidies, 250 GW non-fossil milestone, hybrid wind-solar corridors, and Virtual Power Plants (VPPs).

## CLI Quick Reference

From `Website/FrontEnd`:

### List All 100 Post Titles and Pillars
```powershell
node .\node_modules\tsx\dist\cli.mjs "..\..\LinkedIn\previewPost.ts" --list
```

### Preview a Specific Post (e.g. Post #41 - EU CBAM)
```powershell
node .\node_modules\tsx\dist\cli.mjs "..\..\LinkedIn\previewPost.ts" 41
```

