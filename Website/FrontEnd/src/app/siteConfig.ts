/**
 * Central configuration for VIRYA CLEANTECH.
 *
 * All copy, contact details and imagery here is verified against the public
 * website at https://viryacleantech.com/ (Home + Services pages).
 *
 * Items that could NOT be verified are flagged with `needsConfirmation` and are
 * intentionally kept out of the rendered UI until confirmed by the business.
 */

export const BUSINESS = {
  name: 'VIRYA CLEANTECH',
  shortName: 'VIRYA',
  legalSuffix: '',
  tagline: 'Pioneers innovative, sustainable energy solutions for a cleaner tomorrow.',
  founded: null as number | null, // Not published on the official website.
} as const;

/** Verified contact details (Home + footer of the official site). */
export const CONTACT = {
  phoneDisplay: '+91 8317494969',
  phoneHref: 'tel:+918317494969',
  /**
   * Decoded from the Cloudflare-protected mailto link published on both the
   * Home footer and the Contact Us page of the official site.
   * Both obfuscated payloads decode to the same address, so this is the
   * address the business publishes. Still worth a quick human confirmation
   * before launch (see PENDING_CONFIRMATION).
   */
  email: 'connect@viryacleantech.com',
  emailHref: 'mailto:connect@viryacleantech.com',
  address: {
    line1: 'VIRYA CLEANTECH, No. 2, 1st Floor, No. 113',
    line2: 'Yogjam Sai Charan Layout',
    locality: 'Bengaluru',
    region: 'Karnataka',
    postalCode: '560036',
    country: 'India',
  },
  /** Business hours are not published on the official website — do not invent them. */
  hours: null as string | null,
} as const;

export const ADDRESS_LINES = [
  CONTACT.address.line1,
  CONTACT.address.line2,
  `${CONTACT.address.locality}, ${CONTACT.address.region} ${CONTACT.address.postalCode}`,
  CONTACT.address.country,
];

export const ADDRESS_ONE_LINER = `${CONTACT.address.line1}, ${CONTACT.address.line2}, ${CONTACT.address.locality}, ${CONTACT.address.region} ${CONTACT.address.postalCode}, ${CONTACT.address.country}`;

export const MAP_QUERY = encodeURIComponent(
  'VIRYA CLEANTECH, No. 2, 1st Floor, No. 113, Yogjam Sai Charan Layout, Bengaluru, Karnataka 560036',
);

export const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;

/** Items explicitly listed as "requires confirmation" in the project brief. */
export const PENDING_CONFIRMATION = [
  'Contact email address (connect@viryacleantech.com) — decoded from Cloudflare email protection; confirm before launch.',
  'Privacy Policy and Terms pages — no public URLs exist yet, so links are omitted.',
  'Business hours — not published.',
  'Any certifications, project counts, capacity figures or testimonials — none verified.',
] as const;

export const SOCIAL_LINKS: { label: string; href: string }[] = [];
// Intentionally empty: no social profiles are published on the official website.