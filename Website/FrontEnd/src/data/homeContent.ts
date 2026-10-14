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
    title: 'We start with your interval data',
    body: 'Twelve months of half-hourly consumption, before any proposal. It is free, and it settles most arguments.',
  },
  {
    title: 'We design for the load you have',
    body: 'Including headroom you do not have yet. Transformer augmentation is the cost line most proposals forget.',
  },
  {
    title: 'We hand over the monitoring',
    body: 'You keep the data and the alerting whether or not you engage us again. No lock-in by omission.',
  },
];

/** Strip that appears between the hero and the services grid. */
export const positioningLine =
  'Energy systems designed around how your site actually behaves.';