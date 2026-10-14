/**
 * Market context used across the site.
 *
 * Every figure here is attributed to a named public source with an as-of
 * date. Do not add a number to this file without one — a clean-energy
 * website that misquotes a capacity figure loses the trust it is trying to
 * build, and procurement teams check.
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
    note: 'Of which 125.65 GW is ground-mounted and 33.41 GW is grid-connected rooftop.',
    source: 'Ministry of New and Renewable Energy — Physical Progress',
    asOf: '30 September 2026',
    href: 'https://mnre.gov.in/en/physical-progress/',
  },
  {
    id: 'solar-added',
    value: '20.79',
    unit: 'GW',
    label: 'Solar added in the first half of FY 2026-27',
    note: 'India added 20,790.76 MW between 1 April and 30 September 2026.',
    source: 'Ministry of New and Renewable Energy — Physical Progress',
    asOf: '30 September 2026',
    href: 'https://mnre.gov.in/en/physical-progress/',
  },
  {
    id: 'rooftop-mix',
    value: '38.6',
    unit: '%',
    label: 'Share of new solar capacity that was rooftop',
    note: 'Rooftop holds only 19.4% of installed stock but took 38.6% of all capacity added between April and August 2026. The build mix has already shifted.',
    source: 'MNRE Renewable Energy Statistics 2025-26 and Physical Progress',
    asOf: '31 August 2026',
  },
  {
    id: 'rooftop-yoy',
    value: '125.4',
    unit: '% YoY',
    label: 'Rooftop additions in Q1 2026',
    note: '2.7 GW installed in Q1 2026, up from 1.2 GW a year earlier. Residential accounted for ~82% of Q1 additions; industrial ~11% and commercial ~7%.',
    source: 'Mercom India Research — Q1 2026 India Rooftop Solar Market Report',
    asOf: '31 March 2026',
    href: 'https://www.mercomindia.com/indias-rooftop-solar-installations-surge-by-125-yoy-in-q1-2026',
  },
  {
    id: 'ev-penetration',
    value: '8.2',
    unit: '%',
    label: 'Electric vehicle share of new registrations',
    note: 'Up from 0.7% in FY 2019-20. EV penetration grew from 0.7% to 8.2% in five years, driven by PM E-DRIVE, FAME-II and state policy.',
    source: 'Ministry of Heavy Industries — Lok Sabha Unstarred Question 1406',
    asOf: 'FY 2025-26',
    href: 'https://sansad.in/getFile/lsapps/loksabhaquestions/annex/188/AU1406_8fugQw.pdf',
  },
  {
    id: 'edrive-chargers',
    value: '6,562',
    unit: 'chargers',
    label: 'Public EV chargers approved under PM E-DRIVE',
    note: '₹689 crore approved as of 1 July 2026 — including 1,571 chargers for Karnataka (₹153.10 crore). None were installed as of that date. Karnataka already has 788 FAME-II public stations, 99 of them in Bengaluru.',
    source: 'Ministry of Heavy Industries — Lok Sabha reply',
    asOf: '1 July 2026',
    href: 'https://www.business-standard.com/industry/auto/pm-ev-drive-scheme-charges-stations-approved-infra-lok-sabha-sales-126080401097_1.html',
  },
  {
    id: 'nonfossil',
    value: '50.2',
    unit: '%',
    label: 'Share of India’s installed capacity that is non-fossil',
    note: 'India reached 250 GW of non-fossil installed capacity in August 2025, five years ahead of its 2030 NDC commitment.',
    source: 'Ministry of New and Renewable Energy — Annual Report',
    asOf: '31 December 2025',
    href: 'https://cdnbbsr.s3waas.gov.in/s3716e1b8c6cd17b771da77391355749f3/uploads/2026/07/20260723515585394.pdf',
  },
  {
    id: 'pmsg',
    value: '59.47',
    unit: 'lakh households',
    label: 'Rooftop solar installed under PM Surya Ghar',
    note: '17,560.6 MW across 59,47,035 households as of 30 September 2026. Roughly 57 of every 100 applications convert to an installation, and the average system is about 3.5 kW.',
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