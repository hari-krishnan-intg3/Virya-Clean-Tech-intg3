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
        With your permission, a random browser ID links your visits so we can remember the pages
        and services you viewed and offer a welcome-back assistant message. Session details such
        as timezone, device and coarse location are stored in our reporting sheet. This tracking
        does not collect your name or email; assistant chat text stays in this browser. You can
        change this choice in the footer.
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