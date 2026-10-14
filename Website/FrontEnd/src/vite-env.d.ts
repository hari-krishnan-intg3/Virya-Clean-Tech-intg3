/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Optional. URL of your own API / CRM / form service endpoint for the
   * consultation form. Leave unset for demo mode (no data leaves the browser).
   */
  readonly VITE_BOOKING_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}