/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Endpoint that receives consultation-form submissions. Defaults to
   * `/api/leads` when unset, which files a Jira task with subtasks and
   * writes to the Leads sheet.
   */
  readonly VITE_LEADS_ENDPOINT?: string;

  /**
   * Shared key sent as `x-leads-key`. Matches the server-side
   * LEADS_INGEST_KEY. NOTE: anything VITE_-prefixed is inlined into the
   * public JavaScript bundle and is readable by anyone who opens devtools.
   * It is an abuse-speed bump, not authentication.
   */
  readonly VITE_LEADS_KEY?: string;

  /** Generic webhook fallback, used only when VITE_LEADS_ENDPOINT is unset. */
  readonly VITE_BOOKING_ENDPOINT?: string;

  /** Where the session layer posts visitor telemetry. Defaults to `/api/session`. */
  readonly VITE_SESSION_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}