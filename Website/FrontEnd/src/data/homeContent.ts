/**
 * Home-page copy that is not part of a service or industry definition.
 */

export interface WhyWeStart {
  title: string;
  body: string;
}

/**
 * The three arguments that decide an engagement, stated up front rather than
 * buried in a brochure.
 */
export const whyWeStart: WhyWeStart[] = [
  {
    title: 'Site context',
    body: 'Facility type, location, energy data and existing systems frame the first review.',
  },
  {
    title: 'Operating needs',
    body: 'Hours, critical loads and charging windows shape the options worth assessing.',
  },
  {
    title: 'A clear next step',
    body: 'Agree on missing information, review scope and responsibilities before detailed work.',
  },
];

/** Strip that appears between the hero and the services grid. */
export const positioningLine =
  'Energy systems designed around how your site actually behaves.';