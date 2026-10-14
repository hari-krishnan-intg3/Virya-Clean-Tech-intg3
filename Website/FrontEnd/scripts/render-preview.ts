/**
 * Renders a sample report email to `preview.html` so the design can be
 * reviewed in a browser without any credentials or network access.
 *
 *   npx tsx scripts/render-preview.ts      (or: node --experimental-strip-types)
 */
import { writeFileSync } from 'node:fs';
import { getPeriod } from '../api/_lib/periods';
import { buildSubject, renderReportEmail, renderReportText } from '../api/_lib/email';
import type { JiraSnapshot } from '../api/_lib/jira';

const jira: JiraSnapshot = {
  total: 148,
  createdInRange: 7,
  resolvedInRange: 5,
  open: 23,
  byType: [
    { type: 'Task', count: 62 },
    { type: 'Story', count: 41 },
    { type: 'Bug', count: 27 },
    { type: 'Sub-task', count: 18 },
  ],
  byStatus: [
    { type: 'To Do', count: 34 },
    { type: 'In Progress', count: 23 },
    { type: 'In Review', count: 11 },
    { type: 'Done', count: 80 },
  ],
  recent: [
    { key: 'VCT-214', summary: 'Rooftop solar feasibility for Indiranagar site', status: 'In Progress', type: 'Task', created: '2026-10-11T04:10:00Z', updated: '2026-10-11T06:00:00Z', assignee: 'Hari Krishnan C', url: '/browse/VCT-214' },
    { key: 'VCT-213', summary: 'EV charger load management — 6 chargers', status: 'In Review', type: 'Story', created: '2026-10-10T09:00:00Z', updated: '2026-10-11T02:00:00Z', assignee: 'Hari Krishnan C', url: '/browse/VCT-213' },
    { key: 'VCT-212', summary: 'Battery storage sizing for commercial complex', status: 'Done', type: 'Task', created: '2026-10-09T11:30:00Z', updated: '2026-10-10T08:00:00Z', assignee: null, url: '/browse/VCT-212' },
  ],
};

const period = getPeriod('daily', new Date('2026-10-11T09:00:00Z'));

const html = renderReportEmail({
  period,
  jira,
  leads: 6,
  leadsNote: '6 of 41 rows dated in period',
  siteUrl: 'https://viryacleantech.com',
  projectName: 'Virya Clean Tech',
});

writeFileSync('preview.html', html, 'utf8');
console.log('subject:', buildSubject(period, 6, 7));
console.log('\n--- text preview ---');
console.log(
  renderReportText({
    period,
    jira,
    leads: 6,
    siteUrl: 'https://viryacleantech.com',
    projectName: 'Virya Clean Tech',
  }),
);
console.log('\nWrote preview.html — open it in a browser.');