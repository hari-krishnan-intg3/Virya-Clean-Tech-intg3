import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const DISMISSED_KEY = 'virya.exit-prompt.shown';

export function ExitIntentPrompt() {
  const [visible, setVisible] = useState(false);
  const eligible = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const eligibilityTimer = window.setTimeout(() => {
      eligible.current = true;
    }, 12_000);

    const onMouseOut = (event: MouseEvent) => {
      if (!eligible.current || event.clientY > 0 || event.relatedTarget !== null) return;

      try {
        if (sessionStorage.getItem(DISMISSED_KEY)) return;
        sessionStorage.setItem(DISMISSED_KEY, '1');
      } catch {
        if (visible) return;
      }

      setVisible(true);
    };

    document.addEventListener('mouseout', onMouseOut);
    return () => {
      window.clearTimeout(eligibilityTimer);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [visible]);

  useEffect(() => {
    if (visible) closeRef.current?.focus();
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-ink/35 p-4"
      onKeyDown={(event) => {
        if (event.key === 'Escape') setVisible(false);
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-title"
        className="relative w-full max-w-md rounded-xl border border-line bg-white p-6 shadow-lift sm:p-7"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Stay on the site"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg text-ink-muted hover:bg-mist"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="eyebrow">Before you go</p>
        <h2 id="exit-intent-title" className="mt-2 font-heading text-xl font-bold text-ink">
          Would you like to keep your place?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Your visit can be resumed next time if you allow session insights. You can also leave
          without saving anything.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => setVisible(false)} className="btn-primary btn-sm">
            Keep browsing
          </button>
          <button type="button" onClick={() => setVisible(false)} className="btn-outline btn-sm">
            No thanks
          </button>
        </div>
      </section>
    </div>
  );
}