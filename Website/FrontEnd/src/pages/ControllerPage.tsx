import { useEffect, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, CircleAlert, KeyRound, LoaderCircle, LogOut, Plus, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

type ControllerUser = {
  username: string;
  role: 'operator' | 'admin';
};

type LeadForm = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  location: string;
  consumption: string;
  capacity: string;
  details: string;
};

type ApiBody = {
  user?: ControllerUser;
  error?: string;
  issue?: {
    key: string;
    summary: string;
    subtasks: { key: string; summary: string }[];
  };
};

const EMPTY_LEAD: LeadForm = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  location: '',
  consumption: '',
  capacity: '',
  details: '',
};

const fieldClass = 'field rounded-md px-3 py-2.5 text-sm';

async function readBody(response: Response): Promise<ApiBody> {
  try {
    return (await response.json()) as ApiBody;
  } catch {
    return {};
  }
}

export default function ControllerPage() {
  const [user, setUser] = useState<ControllerUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginPending, setLoginPending] = useState(false);
  const [lead, setLead] = useState<LeadForm>(EMPTY_LEAD);
  const [leadPending, setLeadPending] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [createdIssue, setCreatedIssue] = useState<ApiBody['issue']>();
  const [logoutError, setLogoutError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/controller-auth/me', {
      cache: 'no-store',
      credentials: 'same-origin',
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = await readBody(response);
        if (response.ok && body.user) setUser(body.user);
        else if (response.status !== 401) setLoginError(body.error ?? 'Controller service is unavailable.');
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoginError('Could not reach the controller service.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setCheckingSession(false);
      });

    return () => controller.abort();
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginPending(true);
    setLoginError('');
    try {
      const response = await fetch('/api/controller-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username, password }),
      });
      const body = await readBody(response);
      if (!response.ok || !body.user) {
        setLoginError(body.error ?? 'Unable to sign in. Check your username and password.');
        return;
      }
      setUser(body.user);
      setPassword('');
    } catch {
      setLoginError('Could not reach the controller service.');
    } finally {
      setLoginPending(false);
    }
  }

  async function signOut() {
    setLogoutError('');
    try {
      const response = await fetch('/api/controller-auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (!response.ok) {
        setLogoutError('Sign out failed. Please try again.');
        return;
      }
      setUser(null);
      setLeadError('');
      setCreatedIssue(undefined);
    } catch {
      setLogoutError('Could not reach the controller service.');
    }
  }

  async function createLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLeadPending(true);
    setLeadError('');
    setCreatedIssue(undefined);
    try {
      const response = await fetch('/api/controller/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ operation: 'create', lead: { ...lead, source: 'controller' } }),
      });
      const body = await readBody(response);
      if (!response.ok || !body.issue) {
        if (response.status === 401) {
          setUser(null);
          setLoginError('Your session expired. Sign in again to continue.');
        }
        setLeadError(body.error ?? `Could not create the Jira lead (${response.status}).`);
        return;
      }
      setCreatedIssue(body.issue);
      setLead(EMPTY_LEAD);
    } catch {
      setLeadError('Could not reach the controller service.');
    } finally {
      setLeadPending(false);
    }
  }

  function updateLead(field: keyof LeadForm, value: string) {
    setLead((current) => ({ ...current, [field]: value }));
  }

  const roleLabel = user?.role === 'admin' ? 'Administrator' : 'Operator';

  return (
    <div className="min-h-screen bg-[#f4f7f4] text-ink">
      <header className="border-b border-line bg-white">
        <div className="shell flex min-h-16 max-w-6xl items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 text-ink no-underline" aria-label="Virya Cleantech home">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-600 text-white">
              <ShieldCheck size={19} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-sm font-bold">VIRYA CLEANTECH</span>
              <span className="block text-xs text-ink-muted">Controller</span>
            </span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink">
            Public site <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </header>

      {checkingSession ? (
        <main className="shell flex min-h-[70vh] max-w-6xl items-center justify-center" aria-busy="true">
          <LoaderCircle className="animate-spin text-emerald-700" size={24} aria-label="Checking session" />
        </main>
      ) : user ? (
        <main className="shell max-w-6xl py-8 sm:py-10">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <p className="eyebrow">Operations</p>
              <h1 className="mt-2 text-3xl">Jira lead intake</h1>
              <p className="mt-2 text-sm text-ink-muted">Create a lead task in the configured Jira leads project.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-ink">{user.username}</p>
                <p className="text-xs text-ink-muted">{roleLabel}</p>
              </div>
              <button type="button" className="btn btn-outline rounded-md px-3 py-2 text-sm" onClick={signOut}>
                <LogOut size={16} aria-hidden="true" />
                Sign out
              </button>
            </div>
          </div>

          {logoutError && <p className="mb-4 text-sm text-red-700" role="alert">{logoutError}</p>}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <section className="rounded-md border border-line bg-white p-5 sm:p-7" aria-labelledby="lead-heading">
              <div className="mb-6 flex items-start justify-between gap-4 border-b border-line pb-4">
                <div>
                  <h2 id="lead-heading" className="text-xl">New lead</h2>
                  <p className="mt-1 text-sm text-ink-muted">Contact details are required; add site context where available.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800">
                  <Plus size={14} aria-hidden="true" /> Create only
                </span>
              </div>

              {createdIssue && (
                <div className="mb-5 flex gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-4" role="status" aria-live="polite">
                  <Check className="mt-0.5 shrink-0 text-emerald-700" size={18} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">Jira task created: {createdIssue.key}</p>
                    <p className="mt-1 text-sm text-emerald-800">{createdIssue.summary}</p>
                    <p className="mt-1 text-xs text-emerald-800">{createdIssue.subtasks.length} follow-up tasks created.</p>
                  </div>
                </div>
              )}

              {leadError && (
                <div className="mb-5 flex gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
                  <CircleAlert className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
                  <p>{leadError}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={createLead}>
                <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <legend className="mb-3 text-xs font-semibold uppercase text-ink-faint">Contact</legend>
                  <label className="block">
                    <span className="label">Full name *</span>
                    <input className={fieldClass} name="fullName" autoComplete="name" required maxLength={120} value={lead.fullName} onChange={(event) => updateLead('fullName', event.target.value)} />
                  </label>
                  <label className="block">
                    <span className="label">Email *</span>
                    <input className={fieldClass} name="email" type="email" autoComplete="email" required maxLength={200} value={lead.email} onChange={(event) => updateLead('email', event.target.value)} />
                  </label>
                  <label className="block">
                    <span className="label">Company</span>
                    <input className={fieldClass} name="company" autoComplete="organization" maxLength={120} value={lead.company} onChange={(event) => updateLead('company', event.target.value)} />
                  </label>
                  <label className="block">
                    <span className="label">Phone</span>
                    <input className={fieldClass} name="phone" type="tel" autoComplete="tel" maxLength={40} value={lead.phone} onChange={(event) => updateLead('phone', event.target.value)} />
                  </label>
                </fieldset>

                <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <legend className="mb-3 text-xs font-semibold uppercase text-ink-faint">Site and project</legend>
                  <label className="block">
                    <span className="label">Service</span>
                    <select className={fieldClass} name="service" value={lead.service} onChange={(event) => updateLead('service', event.target.value)}>
                      <option value="">Select a service</option>
                      <option value="solar">Solar power</option>
                      <option value="ev-charging">EV charging</option>
                      <option value="battery">Battery and storage</option>
                      <option value="software-iot">Software and IoT</option>
                      <option value="consulting">Consulting and audits</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">Location</span>
                    <input className={fieldClass} name="location" maxLength={160} value={lead.location} onChange={(event) => updateLead('location', event.target.value)} />
                  </label>
                  <label className="block">
                    <span className="label">Monthly consumption</span>
                    <input className={fieldClass} name="consumption" maxLength={80} value={lead.consumption} onChange={(event) => updateLead('consumption', event.target.value)} />
                  </label>
                  <label className="block">
                    <span className="label">Target capacity</span>
                    <input className={fieldClass} name="capacity" maxLength={80} value={lead.capacity} onChange={(event) => updateLead('capacity', event.target.value)} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="label">Project notes</span>
                    <textarea className={`${fieldClass} min-h-28 resize-y`} name="details" maxLength={3000} value={lead.details} onChange={(event) => updateLead('details', event.target.value)} />
                  </label>
                </fieldset>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
                  <p className="text-xs text-ink-faint">Jira credentials remain server-side.</p>
                  <button type="submit" className="btn btn-primary rounded-md px-5 py-2.5 text-sm" disabled={leadPending}>
                    {leadPending ? <LoaderCircle className="animate-spin" size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                    {leadPending ? 'Creating...' : 'Create Jira task'}
                  </button>
                </div>
              </form>
            </section>

            <aside className="h-fit rounded-md border border-line bg-white p-5" aria-labelledby="access-heading">
              <h2 id="access-heading" className="text-base">Access</h2>
              <dl className="mt-4 divide-y divide-line text-sm">
                <div className="flex justify-between gap-3 py-3">
                  <dt className="text-ink-muted">Session</dt>
                  <dd className="font-medium text-emerald-800">Active</dd>
                </div>
                <div className="flex justify-between gap-3 py-3">
                  <dt className="text-ink-muted">Role</dt>
                  <dd className="font-medium">{roleLabel}</dd>
                </div>
                <div className="flex justify-between gap-3 py-3">
                  <dt className="text-ink-muted">Jira action</dt>
                  <dd className="font-medium">Create lead</dd>
                </div>
              </dl>
              <p className="mt-3 border-t border-line pt-4 text-xs leading-5 text-ink-muted">
                Updates and deletions are not available from this controller.
              </p>
            </aside>
          </div>
        </main>
      ) : (
        <main className="shell flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center py-10">
          <div className="w-full max-w-md hero-stagger">
            <div className="mb-6">
              <p className="eyebrow">Restricted access</p>
              <h1 className="mt-2 text-3xl">Controller sign in</h1>
              <p className="mt-2 text-sm text-ink-muted">Use your controller account to continue to Jira lead intake.</p>
            </div>
            <form className="rounded-md border border-line bg-white p-5 shadow-soft sm:p-7" onSubmit={signIn}>
              <div className="mb-6 flex items-center gap-3 border-b border-line pb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-800">
                  <KeyRound size={19} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-heading text-base font-semibold">Account credentials</h2>
                  <p className="mt-0.5 text-xs text-ink-muted">Jira access is managed by the server.</p>
                </div>
              </div>
              {loginError && (
                <div className="mb-4 flex gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
                  <CircleAlert className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
                  <p>{loginError}</p>
                </div>
              )}
              <label className="mb-4 block">
                <span className="label">Username</span>
                <input className={fieldClass} name="username" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} />
              </label>
              <label className="mb-6 block">
                <span className="label">Password</span>
                <input className={fieldClass} name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>
              <button type="submit" className="btn btn-primary w-full rounded-md py-3 text-sm" disabled={loginPending}>
                {loginPending ? <LoaderCircle className="animate-spin" size={17} aria-hidden="true" /> : <ShieldCheck size={17} aria-hidden="true" />}
                {loginPending ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-ink-faint">Session expires after eight hours.</p>
          </div>
        </main>
      )}
    </div>
  );
}