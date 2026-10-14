import { sessionConfig } from '../api/_lib/config.js';
import { ensureSessionHeaders } from '../api/_lib/session.js';
import { ensureTab } from '../api/_lib/tabs.js';

const config = sessionConfig();
await ensureTab(config.sheets, config.google, config.sessionsTab);
await ensureSessionHeaders(config.sheets, config.google, config.sessionsTab);
console.log(`Ready: ${config.sessionsTab} tab has the current session headers.`);