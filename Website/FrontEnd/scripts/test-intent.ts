/**
 * Intent engine regression check.
 *
 *   npm run test:intent
 *
 * A rule-based matcher fails silently: one keyword edit can make every answer
 * fall through to "I did not follow that one" without breaking a build. This
 * asserts that representative real-world phrasings still route to the intent
 * they should, so that failure is loud.
 *
 * Add a case here whenever the assistant mis-routes something you see in
 * production.
 */
import assert from 'node:assert/strict';
import { openingChips, respond, type BotContext, type Reply } from '../src/lib/intent';

const base: BotContext = {
  path: '/',
  greeted: false,
  leadInterest: false,
  seenServices: [],
};

interface Case {
  query: string;
  /** Substring that must appear in the reply. */
  expect: string;
  context?: Partial<BotContext>;
  /** Service slug the intent should resolve to, when one applies. */
  service?: string;
  /** Entities the extractor should notice. */
  noted?: string[];
}

const CASES: Case[] = [
  // ── Greetings ────────────────────────────────────────────────────
  { query: 'hi', expect: 'assistant', service: undefined },
  { query: 'good morning', expect: 'assistant' },
  // A greeting must not swallow a question that follows it.
  {
    query:
      'hello, I am the CFO at a manufacturing plant in Pune, our bills have gone up 30% and I need a payback number',
    expect: 'Manufacturing',
    noted: ['Pune'],
  },

  // ── Services ─────────────────────────────────────────────────────
  {
    query: 'what is your EV charging turnaround time',
    expect: 'EV Charging Infrastructure',
    service: 'ev-charging',
  },
  { query: 'tell me about predictive maintenance', expect: 'Smart Energy', service: 'software-iot' },
  { query: 'can you do solar for our rooftop', expect: 'Solar', service: 'solar' },
  { query: 'we need battery storage', expect: 'Battery', service: 'battery' },
  { query: 'do you do energy audits', expect: 'Renewable Energy Consulting', service: 'consulting' },

  // ── Commercial triggers ──────────────────────────────────────────
  { query: 'our power cuts are killing us, we need backup', expect: 'storage', service: 'battery' },
  {
    query: 'I want to electrify a fleet of 40 trucks in Hyderabad',
    expect: 'Fleet electrification',
    service: 'ev-charging',
    noted: ['Hyderabad'],
  },
  { query: 'our electricity bill has gone up', expect: 'demand charge' },
  { query: 'we have ESG reporting obligations', expect: 'scope 2' },
  { query: 'we are setting up a new plant next month', expect: 'design' },
  { query: 'what is the payback period', expect: 'tariff' },

  // ── Industries ───────────────────────────────────────────────────
  { query: 'do you handle cold storage warehouses', expect: 'Cold Storage', service: 'solar' },
  { query: 'do you work with hotels?', expect: 'Hotels', service: 'ev-charging' },
  // Where a service and an industry both apply, the service wins — it is the
  // more specific of the two answers.
  { query: 'we run a hotel with EV charging for guests', expect: 'EV Charging Infrastructure' },
  { query: 'our school campus needs solar', expect: 'Education' },

  // ── Meta ─────────────────────────────────────────────────────────
  // Deliberately not asserting on "online"/"offline" — that depends on the
  // wall clock at the moment the test runs.
  { query: 'book a meeting', expect: 'team is' },
  { query: 'where are you located', expect: 'Bengaluru' },
  { query: 'what do you do', expect: 'five capabilities' },
  { query: 'are you certified? how many projects have you done?', expect: 'will not claim' },
  { query: 'how do you work', expect: 'Four stages' },
  { query: 'thanks, that was helpful', expect: '30-minute consultation' },

  // ── Entity extraction ────────────────────────────────────────────
  {
    query: 'how much does a 500 kW solar system cost?',
    expect: 'delivered cost',
    noted: ['500 kw'],
  },
  {
    query: 'we need 2 MW of capacity in Chennai by March',
    expect: 'Solar Power Plant',
    service: 'solar',
    noted: ['Chennai', '2 mw'],
  },

  // ── Honesty ──────────────────────────────────────────────────────
  // Gibberish must fall back rather than invent an answer.
  { query: 'xyzzy qwerty', expect: 'did not follow' },

  // ── Page context ─────────────────────────────────────────────────
  {
    query: 'tell me more',
    expect: 'Solar Power Plant Design',
    context: { path: '/services/solar', activeService: 'solar' },
  },
  {
    query: 'is this expensive',
    expect: 'delivered cost',
    context: { path: '/services/solar', activeService: 'solar' },
  },
];

let passed = 0;
const failures: string[] = [];

for (const testCase of CASES) {
  const context: BotContext = { ...base, ...testCase.context };
  const reply: Reply = respond(testCase.query, context);

  const problems: string[] = [];

  if (!reply.text.toLowerCase().includes(testCase.expect.toLowerCase())) {
    problems.push(`expected reply to contain "${testCase.expect}"`);
  }

  if (testCase.service && reply.service !== testCase.service) {
    problems.push(`expected service "${testCase.service}", got "${reply.service ?? 'none'}"`);
  }

  for (const note of testCase.noted ?? []) {
    if (!reply.noted.some((n) => n.toLowerCase().includes(note.toLowerCase()))) {
      problems.push(`expected entity "${note}" in noted=[${reply.noted.join(', ')}]`);
    }
  }

  // Chips must never repeat a label — that reads as a bug to a visitor.
  const labels = reply.chips.map((c) => c.label.toLowerCase());
  if (new Set(labels).size !== labels.length) {
    problems.push(`duplicate chip labels: ${labels.join(', ')}`);
  }

  if (problems.length) {
    failures.push(`✗ "${testCase.query}"\n    ${problems.join('\n    ')}`);
    console.log(`✗ ${testCase.query}`);
    for (const problem of problems) console.log(`    ${problem}`);
  } else {
    passed++;
    console.log(`✓ ${testCase.query}`);
  }
}

// Section-aware opening chips.
const solarChips = openingChips({ ...base, activeService: 'solar' });
assert.ok(
  solarChips.some((c) => c.label.toLowerCase().includes('load')),
  'Opening chips on a service page must be about that service',
);
assert.ok(
  new Set(solarChips.map((c) => c.label)).size === solarChips.length,
  'Opening chips must not repeat',
);

console.log(`\n${passed}/${CASES.length} intents routed correctly.`);

if (failures.length) {
  console.error(`\n${failures.length} regression(s):\n${failures.join('\n')}`);
  process.exit(1);
}

console.log('Intent engine OK.');