import { existsSync, readFileSync } from 'node:fs';

function loadEnvLocal() {
  const envPath = existsSync('.env.local') ? '.env.local' : existsSync('Website/FrontEnd/.env.local') ? 'Website/FrontEnd/.env.local' : '';
  if (!envPath) return;
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    process.env[m[1]] ??= v.replace(/\\n/g, '\n');
  }
}
loadEnvLocal();

import { loadConfig } from '../api/_lib/config.js';
import { setupAllTrafficTabs } from '../api/_lib/traffic-analytics.js';
import { sendTrafficAnalyticsNotification, getTrafficReportSnapshot } from '../api/_lib/traffic-notification.js';

const config = loadConfig();

console.log('1. Setting up Traffic Analytics Tabs in Google Sheets...');
await setupAllTrafficTabs(config.sheets, config.google);
console.log('   All 6 traffic tabs verified & headers initialized.');

console.log('2. Inspecting Traffic Analytics Snapshot...');
const snapshot = await getTrafficReportSnapshot(config.sheets, config.google);
console.log('   Date:             ', snapshot.date);
console.log('   Total Sessions:   ', snapshot.totalSessions);
console.log('   Unique Visitors:  ', snapshot.uniqueVisitors);
console.log('   Total Page Views: ', snapshot.totalPageViews);
console.log('   Conversions:      ', snapshot.conversions);
console.log('   Top Interest:     ', snapshot.topInterest);

const liveFlag = process.argv.includes('--live');

if (liveFlag) {
  console.log('3. Sending Live Traffic Notification Email to', config.mail.to, '...');
  const result = await sendTrafficAnalyticsNotification(config.mail, config.sheets, config.google);
  console.log('   Notification sent successfully! Resend Message ID:', result.id);
} else {
  console.log('3. Dry run mode. Pass --live to dispatch real email to', config.mail.to);
}
