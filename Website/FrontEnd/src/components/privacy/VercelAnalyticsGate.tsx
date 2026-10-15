import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { trackingAllowed } from '@/lib/session';

export function VercelAnalyticsGate() {
  const [enabled, setEnabled] = useState(trackingAllowed);

  useEffect(() => {
    const update = () => setEnabled(trackingAllowed());
    window.addEventListener('virya:tracking-preference', update);
    return () => window.removeEventListener('virya:tracking-preference', update);
  }, []);

  if (!enabled) return null;

  return (
    <Analytics
      beforeSend={(event) => {
        if (!trackingAllowed()) return null;
        try {
          const url = new URL(event.url, window.location.origin);
          return { ...event, url: `${url.origin}${url.pathname}` };
        } catch {
          return null;
        }
      }}
    />
  );
}