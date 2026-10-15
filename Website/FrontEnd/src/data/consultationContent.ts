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
    body: 'A site location, facility type and project objective are useful starting points. Share additional details only when they are relevant to your enquiry.',
  },
  {
    title: 'Include useful context',
    body: 'Operating hours, available energy information and existing infrastructure can help explain the requirement. If details are not available yet, say so.',
  },
  {
    title: 'Clarify the scope',
    body: 'Ask which services, deliverables, assumptions and follow-up responsibilities are included before proceeding with a project.',
  },
];