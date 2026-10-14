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
    title: 'A person reads it',
    body: 'Not an automated sequence. Your submission arrives as a ticket with your requirements attached, so nothing you wrote here gets lost between forms and inboxes.',
  },
  {
    title: 'You will not have to repeat yourself',
    body: 'The pages you visited, what you asked about, and how long you spent on the site all travel with the enquiry. You are not starting from zero when someone calls.',
  },
  {
    title: 'We say no when it is no',
    body: 'If your scale is wrong for us, or the numbers do not work, you will hear that plainly. We would rather lose the enquiry than sell you a system that gets challenged in year two.',
  },
];