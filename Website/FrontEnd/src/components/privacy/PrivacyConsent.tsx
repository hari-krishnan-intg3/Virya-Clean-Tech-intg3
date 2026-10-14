import { useEffect, useState } from 'react';
import { setTrackingPreference, trackingChoiceRequired } from '@/lib/session';

const PRIVACY_SETTINGS_EVENT = 'virya:privacy-settings';
const TRACKING_PREFERENCE_EVENT = 'virya:tracking-preference';

export function PrivacyConsent() {
  const [visible, setVisible] = useState(() => trackingChoiceRequired());

  useEffect(() => {
    const openSettings = () => setVisible(true);
    window.addEventListener(PRIVACY_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(PRIVACY_SETTINGS_EVENT, openSettings);
  }, []);

  const choose = (enabled: boolean) => {
    setTrackingPreference(enabled);
    setVisible(false);
    window.dispatchEvent(new Event(TRACKING_PREFERENCE_EVENT));
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Privacy and session insights"
      aria-live="polite"
      className="fixed inset-x-4 top-20 z-[80] mx-auto max-w-2xl rounded-xl border border-line bg-white p-5 shadow-lift sm:p-6"
    >
      <h2 className="font-heading text-base font-bold text-ink">Choose session insights</h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted">
        With your permission, we remember the pages and services you visit and your assistant
        conversation on this browser, so you can continue next time. Session details such as
        timezone, device, and coarse location are sent to our reporting sheet, and pageview totals
        and non-sensitive interaction events go to Vercel Analytics. Chat text is kept in this
        browser only. You can change this choice in the footer.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => choose(true)} className="btn-primary btn-sm">
          Allow session insights
        </button>
        <button type="button" onClick={() => choose(false)} className="btn-outline btn-sm">
          Essential only
        </button>
      </div>
    </aside>
  );
}