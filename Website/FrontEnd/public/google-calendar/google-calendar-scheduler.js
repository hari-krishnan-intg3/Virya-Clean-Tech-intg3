/**
 * Google Calendar Appointment Scheduling — connector for VIRYA CLEANTECH
 * ======================================================================
 *
 * WHAT THIS IS
 * ------------
 * The Google Calendar "Appointment Schedules" page renders its own booking
 * button for you. All this module does is load Google's official widget script
 * and point it at the correct schedule URL and brand colours.
 *
 * The frontend (Website/FrontEnd) renders a *placeholder* <div> with a given
 * id and calls `mountBookingButton(targetId, options)`. Google replaces the
 * contents of that div with a real, functional booking button.
 *
 * WHY IT LIVES HERE
 * -----------------
 * Booking configuration is treated as a separate concern from the website so
 * it can be reviewed, changed or replaced without touching UI code.
 *
 * USAGE (plain HTML — the canonical Google pattern)
 * --------------------------------------------------
 *   <script src="google-calendar-scheduler.js" async></script>
 *   <div id="book-slot"></div>
 *   <script>
 *     window.viryaCalendar.mount('book-slot');
 *   </script>
 *
 * USAGE (the frontend uses this)
 * ------------------------------
 *   import { mountBookingButton } from './google-calendar-scheduler.js';
 *   mountBookingButton('book-slot');
 *
 * @typedef {Object} BookingButtonOptions
 * @property {string}  [color]        Hex colour for the button. Brand default.
 * @property {string}  [label]        Visible text on the button.
 * @property {string}  [textColor]    Hex colour for the button text.
 * @property {string}  [scheduleUrl]  Override the scheduling URL entirely.
 */

(function (global) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Configuration                                                       */
  /* ------------------------------------------------------------------ */

  /** The live Appointment Schedule URL (from the official .using snippet). */
  var SCHEDULE_URL =
    'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1-Myc88FYtEND8wgo8SVAbjqdR0VooEdkm1qr7NJlCLMl-u3qwJNZkU7sRk9UVE0FWjF6NPB6c?gv=true';

  /** Google's widget assets. Google advises loading this once per page. */
  var STYLESHEET_URL = 'https://calendar.google.com/calendar/scheduling-button-script.css';
  var SCRIPT_URL = 'https://calendar.google.com/calendar/scheduling-button-script.js';

  /** Defaults tuned to the Virya Cleantech brand. */
  var DEFAULTS = {
    color: '#10B981', //  brand emerald
    textColor: '#FFFFFF',
    label: 'Book a Slot',
    scheduleUrl: SCHEDULE_URL,
  };

  /* ------------------------------------------------------------------ */
  /* Script loading                                                      */
  /* ------------------------------------------------------------------ */

  var stylesheetPromise = null;
  var scriptPromise = null;

  /**
   * Injects the Google stylesheet exactly once.
   * @returns {Promise<void>}
   */
  function loadStylesheet() {
    if (stylesheetPromise) return stylesheetPromise;

    stylesheetPromise = new Promise(function (resolve, reject) {
      var existing = document.querySelector('link[href="' + STYLESHEET_URL + '"]');
      if (existing) return resolve();

      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = STYLESHEET_URL;
      link.onload = resolve;
      link.onerror = function () {
        reject(new Error('Failed to load Google scheduling stylesheet'));
      };
      document.head.appendChild(link);
    });

    return stylesheetPromise;
  }

  /**
   * Injects Google's scheduling script exactly once and waits for the global
   * `calendar.schedulingButton` API to be ready.
   *
   * Note: Google's script is not versioned and its API surface is stable, but
   * we defensively poll rather than assume it exists on script `load`, because
   * the file self-initialises asynchronously.
   *
   * @returns {Promise<{schedulingButton: Object}>}
   */
  function loadScheduler() {
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise(function (resolve, reject) {
      // Already present (e.g. the raw snippet was pasted into index.html).
      if (global.calendar && global.calendar.schedulingButton) {
        return resolve(global.calendar);
      }

      var existing = document.querySelector('script[src="' + SCRIPT_URL + '"]');
      if (!existing) {
        var script = document.createElement('script');
        script.src = SCRIPT_URL;
        script.async = true;
        document.head.appendChild(script);
      }

      var attempts = 0;
      var timer = global.setInterval(function () {
        attempts += 1;

        if (global.calendar && global.calendar.schedulingButton) {
          global.clearInterval(timer);
          return resolve(global.calendar);
        }

        // ~5s without the API appearing means something is wrong upstream.
        if (attempts > 50) {
          global.clearInterval(timer);
          reject(
            new Error(
              'Google schedulingButton did not initialise. Check that the ' +
                'schedule URL is public and the script is reachable.'
            )
          );
        }
      }, 100);
    });

    return scriptPromise;
  }

  /* ------------------------------------------------------------------ */
  /* Public API                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Renders Google's booking button inside `targetId`.
   *
   * The click behaviour is intercepted so the schedule always opens in a NEW
   * TAB with `noopener`, regardless of how Google's widget is configured or
   * how the browser treats its injected markup.
   *
   * @param {string} targetId Id of the placeholder element.
   * @param {BookingButtonOptions} [options]
   * @returns {Promise<HTMLButtonElement|null>} the rendered button, if any.
   */
  function mountBookingButton(targetId, options) {
    var settings = Object.assign({}, DEFAULTS, options || {});
    var target = document.getElementById(targetId);

    if (!target) {
      console.error('[viryaCalendar] No element found with id "' + targetId + '"');
      return Promise.resolve(null);
    }

    return Promise.all([loadStylesheet(), loadScheduler()])
      .then(function (results) {
        var calendar = results[1];

        // Google targets the element it is given and injects the button.
        calendar.schedulingButton.load({
          url: settings.scheduleUrl,
          color: settings.color,
          textColor: settings.textColor,
          label: settings.label,
          target: target,
        });

        // Resolve once Google has actually put a button in the DOM so the
        // caller can remove its own loading placeholder.
        return new Promise(function (resolve) {
          var attempts = 0;
          var poll = global.setInterval(function () {
            attempts += 1;
            var button = target.querySelector('button');
            if (button || attempts > 30) {
              global.clearInterval(poll);
              if (button) enhanceButton(button, settings);
              resolve(button);
            }
          }, 100);
        });
      })
      .catch(function (error) {
        console.error('[viryaCalendar]', error);
        target.setAttribute('data-booking-error', 'true');
        return null;
      });
  }

  /**
   * Takes over Google's generated <button> so that:
   *   1. clicking always opens the schedule in a NEW TAB (noopener), and
   *   2. the button inherits the site's own design language.
   *
   * Google renders an anchor-like button with inline styles; we restyle it
   * rather than replace it, so assistive tech still sees a real button.
   *
   * @param {HTMLButtonElement} button
   * @param {BookingButtonOptions} settings
   */
  function enhanceButton(button, settings) {
    button.removeAttribute('style');
    button.className = 'virya-book-slot';
    button.style.cssText = [
      'display:inline-flex',
      'align-items:center',
      'justify-content:center',
      'gap:0.5rem',
      'min-height:3.5rem',
      'padding:0 2rem',
      'border:1px solid ' + settings.color,
      'border-radius:9999px',
      'background:' + settings.color,
      'color:' + settings.textColor,
      'font-family:Manrope,system-ui,sans-serif',
      'font-size:1rem',
      'font-weight:700',
      'letter-spacing:-0.01em',
      'cursor:pointer',
      'transition:transform .2s ease,box-shadow .2s ease,background-color .2s ease',
      'box-shadow:0 8px 20px -8px ' + settings.color + '80',
    ].join(';');

    // Hover / active motion via inline handlers (no extra stylesheet needed).
    button.addEventListener('mouseenter', function () {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 14px 28px -10px ' + settings.color + '99';
    });
    button.addEventListener('mouseleave', function () {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 8px 20px -8px ' + settings.color + '80';
    });
    button.addEventListener('focus', function () {
      button.style.transform = 'translateY(-2px)';
    });
    button.addEventListener('blur', function () {
      button.style.transform = 'translateY(0)';
    });

    // NEW TAB — intercept before Google handles the click.
    button.addEventListener(
      'click',
      function (event) {
        event.preventDefault();
        event.stopPropagation();

        var opened = global.open(settings.scheduleUrl, '_blank', 'noopener,noreferrer');
        if (!opened) {
          // Popup blocked — fall back to same-tab navigation.
          global.location.href = settings.scheduleUrl;
        }
      },
      true
    );

    // Make the destination explicit for screen readers.
    if (!button.getAttribute('aria-label')) {
      button.setAttribute(
        'aria-label',
        settings.label + ' — opens the booking calendar in a new tab'
      );
    }
  }

  /**
   * Opens the booking page directly in a new tab.
   * Useful as a no-JS / fallback path: a plain <a href> works without scripts.
   *
   * @param {BookingButtonOptions} [options]
   */
  function openBookingPage(options) {
    var settings = Object.assign({}, DEFAULTS, options || {});
    global.open(settings.scheduleUrl, '_blank', 'noopener,noreferrer');
  }

  global.viryaCalendar = {
    SCHEDULE_URL: SCHEDULE_URL,
    DEFAULTS: DEFAULTS,
    mount: mountBookingButton,
    open: openBookingPage,
  };

  // Support direct use from a plain <script> tag before DOMContentLoaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      /* ready — callers can now mount */
    });
  }
})(window);