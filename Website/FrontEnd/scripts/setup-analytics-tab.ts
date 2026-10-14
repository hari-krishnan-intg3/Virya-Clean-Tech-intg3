import { loadConfig } from '../api/_lib/config.js';
import { ensureVercelAnalyticsTab } from '../api/_lib/vercel-analytics.js';

const config = loadConfig();
const tab = config.sheets.analyticsTab || 'Vercel Analytics';

await ensureVercelAnalyticsTab(config.sheets, config.google, tab);
console.log(`Ready: ${tab} tab and analytics headers are present.`);