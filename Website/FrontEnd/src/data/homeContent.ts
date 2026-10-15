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
    body: 'Site location, facility type, available bills or usage data and operating hours help frame an initial discussion. Include whether the facility is existing or planned and any near-term operational changes.',
  },
  {
    title: 'Consider how the site operates',
    body: 'Production schedules, occupancy, charging windows and critical loads can change which options are worth assessing. Describe when the site is busiest and what equipment or services must remain available.',
  },
  {
    title: 'Agree on a useful next step',
    body: 'A preliminary conversation can identify missing information and whether a more detailed technical review is appropriate. Project scope, site conditions and agreed responsibilities determine what happens after that discussion.',
  },
];

/** Strip that appears between the hero and the services grid. */
export const positioningLine =
  'Energy systems designed around how your site actually behaves.';