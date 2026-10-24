# VIRYA CLEANTECH — Frontend

Production-quality single-page marketing site for **VIRYA Cleantech**, built as a
React SPA. All business content was verified against the official website
(<https://viryacleantech.com/>) — Home and Services pages.

> **Status:** Frontend complete. The consultation form runs in **demo mode** by
> default (see [Integration points](#integration-points)).

---

## Quick start

```bash
cd Website/FrontEnd
npm install
npm run dev        # http://localhost:5173
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Type-check only |

Requires **Node 18+** (Node 20 LTS recommended).

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | React 18 + TypeScript (strict) |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion 11 |
| Carousel | Swiper 11 |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Class merging | `clsx` + `tailwind-merge` |

---

## Project structure

```text
Website/FrontEnd/
├── index.html                  # Meta, canonical, OG tags, JSON-LD, font preconnect
├── vite.config.ts              # @ alias, manual vendor chunks
├── tailwind.config.js          # Virya design tokens (emerald / sky / ink / mist / line)
├── .env.example
└── src/
    ├── main.tsx
    ├── vite-env.d.ts
    ├── app/
    │   ├── App.tsx             # Composition + lazy-loading boundaries
    │   └── siteConfig.ts       # VERIFIED contact details, address, map link
    ├── components/
    │   ├── layout/
    │   │   ├── NavbarContainer.tsx
    │   │   └── FooterContainer.tsx
    │   ├── sections/
    │   │   ├── HeroSliderContainer.tsx
    │   │   ├── AboutContainer.tsx
    │   │   ├── ServicesContainer.tsx
    │   │   ├── EnergyEcosystemContainer.tsx
    │   │   ├── WhyViryaContainer.tsx
    │   │   ├── ProcessContainer.tsx
    │   │   ├── ApplicationsContainer.tsx
    │   │   ├── BookingFormContainer.tsx
    │   │   └── ContactContainer.tsx
    │   ├── assistant/
    │   │   └── ChatAssistantContainer.tsx
    │   └── ui/
    │       ├── Button.tsx
    │       ├── SectionHeading.tsx
    │       ├── ServiceCard.tsx
    │       ├── FormField.tsx
    │       ├── Image.tsx
    │       ├── BookSlotButton.tsx
    │       ├── Logo.tsx
    │       ├── Reveal.tsx
    │       └── index.ts
    ├── data/
    │   ├── services.ts         # 4 services + icons + imagery
    │   ├── homeContent.ts      # Homepage positioning and illustrative use cases
    │   ├── process.ts          # 4-step process
    │   └── content.ts          # Hero slides, ecosystem, differentiators, applications
    ├── hooks/
    │   ├── useActiveSection.ts
    │   ├── useScrolled.ts
    │   └── usePrefersReducedMotion.ts
    ├── lib/
    │   ├── validation.ts       # Zod schema + submission transport
    │   ├── serviceIntent.ts    # Service card → booking form pub/sub
    │   └── utils.ts            # cn(), scrollToSection(), trackEvent()
    └── styles/index.css

public/
├── favicon.svg
├── images/
│   ├── ai-solar.svg
│   ├── ai-ev-charging.svg
│   ├── ai-storage.svg
│   ├── ai-energy-systems.svg
│   ├── ai-engineering.svg
│   ├── ai-wind.svg
│   ├── ai-industry.svg
│   └── ai-facility.svg
└── google-calendar/
    └── google-calendar-scheduler.js   # copy of the connector (see below)
```

A sibling folder at the repo root holds the booking connector:

```
Google Calender/
├── .using                                # original Google snippet
└── google-calendar-scheduler.js          # the connector itself
```

The connector is also copied to
`public/google-calendar/google-calendar-scheduler.js` so it can be loaded at
runtime if you ever switch to the embedded widget.

The website uses original, locally hosted SVG illustrations matched to its
energy and facility content; its image components do not fetch stock-photo
URLs. Homepage use cases describe illustrative scenarios, not completed Virya
projects. Any expected benefit or performance metric must be assessed against
the specific site's baseline and an agreed measurement period.

---

## Design system

| Token | Value | Use |
| --- | --- | --- |
| Surface | `#07110F` | Deep charcoal page canvas |
| Surface alt | `#0E1D18` | Alternating sections and raised surfaces |
| Primary | `#34D3A2` | Virya green — CTAs, accents, active states |
| Deep green | `#11271E` | Subtle green panels and icon surfaces |
| Tech | `#0EA5E9` | Cyan-blue secondary accents |
| Text | `#EDF6F1` | High-contrast headings and body |
| Text muted | `#A5B8AE` | Supporting copy |
| Border | `#20342C` | Quiet green-tinted hairlines |

Typography: **Inter** for headings and body, loaded from Google Fonts with
`preconnect` to match the reference's clean, technical typography.

The optimized WebP photos added for page heroes and service cards are sourced
from Unsplash and stored locally under `public/images/`.

### "Energy in Motion" signature language

- Thin animated energy-flow lines between the four ecosystem nodes (SVG
  `stroke-dasharray` loop, `flowDash` keyframes).
- Abstract circuit / distribution grid patterns (`grid-lines` utility).
- Dark charcoal surfaces with crisp green and cyan-blue accents.
- Small animated status indicators (hero eyebrow pulse, node pulse rings).
- Oversized editorial headings with gradient accents on key phrases.
- Locally hosted clean-energy photography for the three-slide hero.

---

## Sections

| # | Section | Anchor |
| --- | --- | --- |
| 1 | Hero slider (3 slides, autoplay + progress) | `#home` |
| 2 | Company introduction | `#about` |
| 3 | Services (4 cards) | `#services`, `#service-<id>` |
| 4 | Energy ecosystem diagram | `#ecosystem` |
| 5 | Why Virya (4 differentiators) | `#why-virya` |
| 6 | Process timeline (4 steps) | `#process` |
| 7 | Solutions across applications | `#applications` |
| 8 | Consultation form | `#booking` |
| 9 | Contact + map | `#contact` |
| 10 | Floating demo assistant | — |
| 11 | Footer | — |

---

## Integration points

### Consultation form → Jira

The form posts to the same-origin `/api/leads` endpoint by default. The
server-side route creates a Task in Jira project `VCT`; set `JIRA_BASE_URL`,
`JIRA_EMAIL`, and `JIRA_API_TOKEN` in the server environment (Vercel settings
for deployment). No Jira credential or API key is exposed to the browser.

`src/lib/validation.ts → submitBookingRequest()` sends JSON in this shape:

```json
{
  "fullName": "...", "email": "...", "phone": "...", "company": "...",
  "service": "solar", "location": "...", "details": "...",
  "consent": true, "submittedAt": "2026-01-01T00:00:00.000Z",
  "source": "booking-form"
}
```

Non-2xx responses surface the retryable error state. Jira and Sheets
credentials remain server-side; Google Sheets lead logging is optional.

### 2. Analytics / conversion tracking

`src/lib/utils.ts → trackEvent()` dispatches a `CustomEvent('virya:track')` on
`window` with `{ event, ...payload, at }`. Nothing is transmitted today.

To connect GA4, Plausible, Segment, etc., add a single listener:

```js
// anywhere in main.tsx
window.addEventListener('virya:track', (e) => {
  myAnalytics.track(e.detail.event, e.detail);
});
```

Events already emitted: `nav_click`, `cta_click`, `contact_click`,
`hero_cta_click`, `service_cta_click`, `application_click`, `back_to_top`,
`assistant_open`, `assistant_topic`, `assistant_action`, `assistant_reset`,
`booking_service_prefilled`, `booking_submit_start`,
`booking_submit_success`, `booking_submit_error`.

**Privacy note:** no PII is included in any event payload. If you later add
session recording or ad pixels, obtain consent and disclose it.

### 3. Google Calendar "Book a Slot"

Booking opens the business's Google Appointment Schedule in a **new tab**.

```
Google Calender/
├── .using                                # original Google snippet (source of truth)
└── google-calendar-scheduler.js          # connector: mounts Google's own widget
```

**What the site uses:** a plain, fully-styled anchor to the schedule URL:

```html
<a href="…/schedules/AcZssZ1-…?gv=true" target="_blank" rel="noopener noreferrer">
```

Chosen over embedding Google's widget because the embedded version injects
inline styles that clash with the design system, flashes an unstyled loading
state on every page load, and owns its own click behaviour. A plain anchor
fixes all three, and as a bonus works with JavaScript disabled and can never
leave a dead CTA on the page.

**New tab is guaranteed** by `target="_blank" rel="noopener noreferrer"` —
verified present in the compiled bundle. Each click also fires a
`booking_slot_opened` event carrying the placement id.

**The connector is still there** for anyone who wants the official
Google-hosted button instead. `google-calendar-scheduler.js` exposes:

```js
window.viryaCalendar.mount(targetElementId, { color, label, textColor });
```

It loads Google's script and stylesheet once, then calls
`calendar.schedulingButton.load(...)`. It also runs the injected button through
`enhanceButton()`, which restyles it to match the site and force-opens the
schedule in a new tab.

**Schedule URL** (from the `.using` snippet):

```
https://calendar.google.com/calendar/appointments/schedules/AcZssZ1-Myc88FYtEND8wgo8SVAbjqdR0VooEdkm1qr7NJlCLMl-u3qwJNZkU7sRk9UVE0FWjF6NPB6c?gv=true
```

**Brand change applied:** the original snippet used `#B39DDB` (a lilac purple
that clashes with the Virya palette). It is now `#10B981`, matching the brand
emerald.

`BookSlotButton` appears in the consultation section only — once above the
form, once in the success state.

### 4. Chat assistant → real AI backend

`ChatAssistantContainer` currently uses a deterministic local topic list
(`TOPICS` in that file). The UI is deliberately engine-agnostic: replace
`pushBotReply()` with a `fetch()` to your own endpoint and nothing else needs to
change. The panel already labels itself *"Demo — pre-written answers"* and does
not claim to provide quotes, live engineering advice, or confirmed bookings.

### 5. Additional future integrations

Deliberately modular and currently absent (no fake dashboards or badges):

- CRM / lead-management sync (HubSpot, Zoho, Salesforce)
- Automated email notifications
- Jira ticket creation for qualified enquiries
- Service-interest + consultation-conversion dashboard

---

## Content verification & open items

Verified from the official site: company name, tagline, positioning, the four
services, the four-step process, the four "Why Choose Us" differentiators, the
mission statement, phone number, and the postal address.

**Requires confirmation before going live** (tracked in
`src/app/siteConfig.ts → PENDING_CONFIRMATION`):

1. **Contact email** — the live site hides it behind Cloudflare email
   protection. `connect@viryacleantech.com` was decoded from the obfuscated
   `mailto` link on both the Home footer and the Contact Us page (both decode
   to the same address). Please verify before launch.
2. **Privacy Policy & Terms URLs** — none are published, so no footer links
   exist. The consent checkbox therefore links to nothing yet.
3. **Business hours** — not published, so omitted.
4. **Social profiles** — none published, so `SOCIAL_LINKS` is an empty array
   and the footer renders no social row.

**Intentionally not displayed:** the phone number remains in `siteConfig.ts` as
verified business data, but is **not rendered anywhere** on the site. Contact
is routed through the enquiry form, the email address, and the Book a Slot
calendar instead.

### Deliberately excluded content

Per the brief, nothing unverified was fabricated. The following were found on
the old site and **intentionally not carried over**:

- Testimonial quotes and reviewer names (unverifiable)
- Pricing plans (placeholder copy with lorem ipsum)
- "Wind Energy Innovation" project entry (lorem ipsum placeholder)
- Statistic counters (rendered as `0+` on the live site)
- "India's number one" style superlatives

The applications section is explicitly labelled as illustrative scenarios, not
completed projects.

---

## Performance

- **Code splitting** — hero, about and services ship in the entry chunk;
  everything below the fold is a separate lazy chunk (`Suspense` in `App.tsx`).
- **Vendor splitting** — React and Framer Motion are separate long-cache chunks.
- **No CLS** — `SmartImage` always declares intrinsic `width`/`height`, and
  fill-mode containers set an explicit `aspect-[…]` so space is reserved before
  the remote image loads.
- **Priority hints** — only the first hero image uses `fetchpriority="high"`;
  everything else lazy-loads.
- **Scroll animations** — `whileInView` with `once: true`; no scroll handlers
  driving per-frame React state. Navbar scroll state is rAF-throttled.
- **Lightweight diagram** — the ecosystem graphic is inline SVG + CSS, no
  animation library.

Build output (gzipped): entry ≈ 54 kB, vendor ≈ 43 kB, motion ≈ 43 kB.

---

## Accessibility

- Semantic landmarks (`header` / `nav` / `main` / `footer`), one `h1`, ordered
  heading levels.
- Skip-to-content link.
- Every form field has a persistent `<label>`, `aria-invalid`, and
  `aria-describedby` wiring to its error or hint; errors use `role="alert"`.
- Visible focus rings via a global `:focus-visible` rule.
- The ecosystem diagram is fully understandable without animation — nodes are
  real `<button>`s with `aria-pressed`, mirrored by a text list.
- Hero is a labelled `carousel` with keyboard navigation, an A11y module, and a
  pause/play control.
- **Reduced motion**: `prefers-reduced-motion: reduce` disables the hero
  autoplay and transitions, reveals content statically, and switches scrolling
  to instant. All content is readable with animation disabled.

---

## Automated Reports (Jira → Email → Sheets)

A serverless reporting system that emails daily/weekly/monthly summaries built
from the **VCT** Jira project, logs each send to the Google Sheets `Reports`
tab, and schedules itself on Vercel Cron.

```
api/
├── reports.ts      # main handler  (GET/POST, ?type=daily|weekly|monthly)
├── preview.ts      # dry run — same data, no email, no sheet write
├── health.ts       # config check
└── _lib/           # jira, sheets, periods, email, mailer, config
```

See **[`api/README.md`](./api/README.md)** for full setup instructions.

Quick start after adding the env vars:

```bash
curl -X POST https://<your-domain>/api/reports \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" -d '{"types":["daily","weekly","monthly"]}'
```

### ⚠️ Secrets must not go in `src/`

Everything under `src/` is shipped to the browser and is readable by anyone
who visits the site. All API credentials are read from **un-prefixed** env vars
(`JIRA_API_TOKEN`, `GOOGLE_PRIVATE_KEY`, …) and only ever touched inside `api/`.
Never add them as `VITE_`-prefixed variables — the build inlines those into
the public JS.

---

## Deployment

```bash
npm run build      # outputs to dist/
```

`dist/` is a static bundle — deploy to Netlify, Vercel, Cloudflare Pages, S3,
or any static host. If deploying under a subpath, set `base` in
`vite.config.ts`.

Environment note: `VITE_*` variables are **inlined at build time**. Rebuild
after changing `.env`.