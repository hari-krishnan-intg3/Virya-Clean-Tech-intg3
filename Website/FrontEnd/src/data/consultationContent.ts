/**
 * Copy for the consultation page that answers the hesitation rather than
 * repeating the form's own fields.
 */

export interface InsuranceHone {
  title: string;
  body: string;
}

export const INSURANCE_HONESTS: InsuranceHone[] = [
  {
    title: 'Start with what you know',
    body: 'A site location, facility type and project objective are useful starting points. Add the operating context or solution area you have in mind, and share other details only when they are relevant to the enquiry.',
  },
  {
    title: 'Include useful context',
    body: 'Operating hours, available energy information and existing infrastructure can help explain the requirement. Bills or usage data are useful when available, but you can still describe the question if those records are not ready.',
  },
  {
    title: 'Clarify the scope',
    body: 'Ask which services, deliverables, assumptions and follow-up responsibilities are included before proceeding. Project timing, site access, approvals and any continuing support should be clear in the agreed scope.',
  },
];