import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Activity, AlertTriangle, ArrowUpRight, Clock3, Cloud, Database, Play, Plus, RefreshCw, Settings2, ShieldCheck, TimerReset, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

type Lead = {
  key: string;
  summary: string;
  status: string;
  dueDate: string | null;
  countdownHours: number;
  slaState: 'On track' | 'Warning' | 'Breached' | 'Escalated';
  url: string;
  isTest: boolean;
};

type Snapshot = {
  projectKey: string;
  fields: { name: string; id?: string; configured: boolean }[];
  leads: Lead[];
};

type ApiResponse = {
  error?: string;
  snapshot?: Snapshot;
  result?: { checked: number; updated: number; warnings: number; escalated: number; errors: string[]; ranAt: string };
  created?: string[];
  existing?: number;
  errors?: string[];
  fields?: Snapshot['fields'];
};

function formatHours(hours: number) {
  if (hours <= 0) return '00h 00m';
  const whole = Math.floor(hours);
  return `${String(whole).padStart(2, '0')}h ${String(Math.round((hours - whole) * 60)).padStart(2, '0')}m`;
}

function stateTone(state: Lead['slaState']) {
  if (state === 'Breached' || state === 'Escalated') return 'border-red-400/30 bg-red-400/10 text-red-200';
  if (state === 'Warning') return 'border-amber-300/30 bg-amber-300/10 text-amber-200';
  return 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200';
}

export default function JiraPracticePage() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [busy, setBusy] = useState<'setup' | 'seed' | 'tick' | 'refresh' | null>('refresh');
  const [message, setMessage] = useState('Connecting to the VCT Jira project...');
  const [error, setError] = useState('');
  const [lastRun, setLastRun] = useState<ApiResponse['result']>();

  async function request(operation?: 'setup' | 'seed' | 'tick') {
    setBusy(operation ?? 'refresh');
    setError('');
    try {
      const response = await fetch('/api/jira-practice', operation ? {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ operation }),
      } : { credentials: 'same-origin', cache: 'no-store' });
      const body = (await response.json()) as ApiResponse;
      if (!response.ok) {
        if (response.status === 401) setError('Sign in through the controller before running Jira actions.');
        else setError(body.error ?? 'The Jira practice service is unavailable.');
        return;
      }
      if (body.snapshot) setSnapshot(body.snapshot);
      if (operation === 'setup') setMessage('Custom fields checked. The workflow is ready to seed.');
      if (operation === 'seed') setMessage(`${body.created?.length ?? 0} test leads created; ${body.existing ?? 0} practice issues already existed.`);
      if (operation === 'tick' && body.result) {
        setLastRun(body.result);
        setMessage(`Hourly run complete: ${body.result.updated} countdowns updated, ${body.result.escalated} escalated.`);
      }
      if (operation) {
        const refreshed = await fetch('/api/jira-practice', { credentials: 'same-origin', cache: 'no-store' });
        const refreshedBody = (await refreshed.json()) as ApiResponse;
        if (refreshedBody.snapshot) setSnapshot(refreshedBody.snapshot);
      }
    } catch {
      setError('Could not reach the Jira practice service.');
    } finally {
      setBusy(null);
    }
  }

  useEffect(() => { void request(); }, []);

  const leads = snapshot?.leads ?? [];
  const warningCount = leads.filter((lead) => lead.slaState === 'Warning').length;
  const breachedCount = leads.filter((lead) => lead.slaState === 'Breached' || lead.slaState === 'Escalated').length;
  const configuredCount = snapshot?.fields.filter((field) => field.configured).length ?? 0;

  return (
    <div className="min-h-screen bg-[#07110f] text-white">
      <header className="border-b border-white/10 bg-[#091612]/90">
        <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <Link to="/" className="flex items-center gap-3 text-white no-underline">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-emerald-400 text-[#07110f]"><TimerReset size={19} /></span>
            <span><strong className="block font-heading text-sm tracking-wide">VIRYA OPERATIONS</strong><span className="block text-xs text-emerald-200/60">Jira SLA practice</span></span>
          </Link>
          <div className="flex items-center gap-3 text-xs text-ink-muted">
            <span className="hidden items-center gap-1.5 sm:flex"><Cloud size={14} /> Vercel connected</span>
            <Link to="/controller" className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200">Controller <ArrowUpRight size={14} /></Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="flex flex-col justify-between gap-7 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow"><span className="rule-accent" /> Automation lab / VCT</p>
            <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">Countdown timers that refuse to go quiet.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">A live Jira practice board for lead response SLAs. The hourly trigger recalculates due time, updates custom fields, marks warnings, and escalates breached work.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button type="button" className="btn btn-outline rounded-md px-3 py-2 text-sm" onClick={() => void request()} disabled={busy !== null}><RefreshCw size={15} className={busy === 'refresh' ? 'animate-spin' : ''} /> Refresh</button>
            <button type="button" className="btn btn-primary rounded-md px-4 py-2 text-sm" onClick={() => void request('tick')} disabled={busy !== null}><Play size={15} /> {busy === 'tick' ? 'Running...' : 'Run hourly check'}</button>
          </div>
        </div>

        {error && <div className="mt-6 flex items-center gap-3 rounded-md border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-100"><AlertTriangle size={18} /><span>{error}</span><Link to="/controller" className="ml-auto text-emerald-300 underline">Sign in</Link></div>}
        {message && <p className="mt-5 text-sm text-emerald-200/80" role="status">{message}</p>}

        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={<Database size={18} />} label="Jira project" value={snapshot?.projectKey ?? '—'} detail="Server-side credentials" />
          <Metric icon={<Settings2 size={18} />} label="Custom fields" value={`${configuredCount}/3`} detail="Countdown, review, state" />
          <Metric icon={<AlertTriangle size={18} />} label="Threshold warnings" value={String(warningCount)} detail="Under 4 hours" tone="amber" />
          <Metric icon={<Zap size={18} />} label="Breached / escalated" value={String(breachedCount)} detail="Zero hours remaining" tone="red" />
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <section className="overflow-hidden rounded-lg border border-white/10 bg-[#0b1713]" aria-labelledby="leads-heading">
            <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div><div className="flex items-center gap-2"><Activity size={17} className="text-emerald-300" /><h2 id="leads-heading" className="text-lg">Practice leads</h2></div><p className="mt-1 text-sm text-ink-muted">Five idempotent test records, written to Jira with the SLA label.</p></div>
              <button type="button" className="btn btn-outline rounded-md px-3 py-2 text-xs" onClick={() => void request('seed')} disabled={busy !== null}><Plus size={14} /> {busy === 'seed' ? 'Seeding...' : 'Seed five test leads'}</button>
            </div>
            <div className="divide-y divide-white/10">
              {leads.length === 0 && <div className="p-8 text-center text-sm text-ink-muted">No practice issues yet. Set up fields, then seed the five test leads.</div>}
              {leads.map((lead) => <LeadRow key={lead.key} lead={lead} />)}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-lg border border-white/10 bg-[#0b1713] p-5" aria-labelledby="trigger-heading">
              <div className="flex items-center gap-2"><Clock3 size={17} className="text-emerald-300" /><h2 id="trigger-heading" className="text-base">Trigger recipe</h2></div>
              <ol className="mt-5 space-y-4 text-sm text-ink-muted"><Step n="01" title="Every hour" detail="Vercel calls the practice endpoint." /><Step n="02" title="Check due date" detail="Countdown and Time to Review are recalculated." /><Step n="03" title="Cross threshold" detail="Warning labels appear below four hours." /><Step n="04" title="Hit zero" detail="SLA State becomes Breached and Jira tries Escalated." /></ol>
              <button type="button" className="btn btn-primary mt-6 w-full rounded-md py-2.5 text-sm" onClick={() => void request('setup')} disabled={busy !== null}><Settings2 size={15} /> {busy === 'setup' ? 'Checking fields...' : 'Set up custom fields'}</button>
            </section>
            <section className="rounded-lg border border-white/10 bg-[#0b1713] p-5"><div className="flex items-center gap-2"><ShieldCheck size={17} className="text-emerald-300" /><h2 className="text-base">Run report</h2></div><dl className="mt-4 divide-y divide-white/10 text-sm"><div className="flex justify-between gap-3 py-3"><dt className="text-ink-muted">Last check</dt><dd>{lastRun ? new Date(lastRun.ranAt).toLocaleTimeString() : 'Not run'}</dd></div><div className="flex justify-between gap-3 py-3"><dt className="text-ink-muted">Issues checked</dt><dd>{lastRun?.checked ?? leads.length}</dd></div><div className="flex justify-between gap-3 py-3"><dt className="text-ink-muted">Fields live</dt><dd className="text-emerald-300">{configuredCount}/3</dd></div></dl></section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Metric({ icon, label, value, detail, tone = 'green' }: { icon: ReactNode; label: string; value: string; detail: string; tone?: 'green' | 'amber' | 'red' }) {
  const color = tone === 'red' ? 'text-red-300' : tone === 'amber' ? 'text-amber-200' : 'text-emerald-300';
  return <div className="rounded-lg border border-white/10 bg-[#0b1713] p-4"><div className={`flex items-center gap-2 text-xs uppercase tracking-[0.15em] ${color}`}>{icon}{label}</div><p className="mt-4 text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-ink-muted">{detail}</p></div>;
}

function LeadRow({ lead }: { lead: Lead }) {
  return <div className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_8rem_9rem] sm:items-center sm:p-6"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs text-emerald-300">{lead.key}</span><span className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-ink-muted">{lead.status}</span></div><p className="mt-2 truncate text-sm font-semibold">{lead.summary.replace('[TEST] ', '')}</p><p className="mt-1 text-xs text-ink-muted">Due {lead.dueDate ?? 'not set'} · {lead.isTest ? 'test lead' : 'live lead'}</p></div><div><p className="text-xs uppercase tracking-[0.13em] text-ink-faint">Countdown</p><p className={`mt-1 font-mono text-lg ${lead.countdownHours <= 4 ? 'text-amber-200' : 'text-emerald-200'}`}>{formatHours(lead.countdownHours)}</p></div><div className={`inline-flex w-fit items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-semibold ${stateTone(lead.slaState)}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{lead.slaState}</div></div>;
}

function Step({ n, title, detail }: { n: string; title: string; detail: string }) {
  return <li className="flex gap-3"><span className="font-mono text-xs text-emerald-300">{n}</span><span><strong className="block text-white">{title}</strong><span className="mt-0.5 block leading-5">{detail}</span></span></li>;
}
