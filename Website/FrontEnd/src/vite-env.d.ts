/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional override for the same-origin server-side lead intake endpoint. */
  readonly VITE_LEADS_ENDPOINT?: string;

  /** Where the session layer posts visitor telemetry. Defaults to `/api/session`. */
  readonly VITE_SESSION_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}