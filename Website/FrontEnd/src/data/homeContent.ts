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
    title: 'Start with the information you have',
    body: 'Site location, facility type, energy bills or usage data, and operating hours can help frame an initial discussion.',
  },
  {
    title: 'Consider how the site operates',
    body: 'Production schedules, occupancy, charging windows and critical loads can change which options are worth assessing.',
  },
  {
    title: 'Agree on a useful next step',
    body: 'A preliminary conversation can identify missing information and whether a more detailed technical review is appropriate.',
  },
];

/** Strip that appears between the hero and the services grid. */
export const positioningLine =
  'Energy systems designed around how your site actually behaves.';