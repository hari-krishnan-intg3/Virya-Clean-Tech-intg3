import { loadConfig } from '../api/_lib/config.js';
import { syncJiraLeadsToSheet } from '../api/_lib/lead-sync.js';

const config = loadConfig();
const leadsTab = config.sheets.leadsTab;

if (!leadsTab) {
  throw new Error('SHEETS_LEADS_TAB must be configured before syncing Jira leads.');
}

const result = await syncJiraLeadsToSheet(
  config.jira,
  config.sheets,
  config.google,
  leadsTab,
);

console.log(`Jira leads found: ${result.jiraLeads}`);
console.log(`New Sheets rows: ${result.rowsAdded}`);