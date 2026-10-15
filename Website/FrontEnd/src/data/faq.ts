import type { ServiceSlug } from './services';

export interface FaqItem {
  question: string;
  answer: string;
  /** Optional grouping used to filter the FAQ page. */
  category: 'Commercial' | 'Technical' | 'Process' | 'Commercial terms';
  relatedService?: ServiceSlug;
}

/**
 * Site-wide FAQ. Service-specific questions live on each service page in
 * `services.ts` so they stay next to the content they qualify.
 */
export const faqs: FaqItem[] = [
  {
    question: 'Where is Virya Clean Tech based, and where do you work?',
    answer:
      'Virya Cleantech is based in Bengaluru, Karnataka. Service availability and the ability to support a project in another location should be confirmed with the team.',
    category: 'Commercial',
  },
  {
    question: 'Do you work on residential projects?',
    answer:
      'This website focuses on business and organisational energy requirements. Please contact the team to confirm whether a residential enquiry is within the current service scope.',
    category: 'Commercial',
  },
  {
    question: 'What size of project do you take on?',
    answer:
      'There is no single project size that applies to every service. Requirements depend on the site, operating objective, available infrastructure and the scope the team can support.',
    category: 'Commercial',
  },
  {
    question: 'How does an engagement usually start?',
    answer:
      'Start by sharing your business context, site location and project objective. If a further review is appropriate, the team can discuss what information, scope and next steps may be needed.',
    category: 'Process',
  },
  {
    question: 'Do you sign NDAs?',
    answer:
      'Ask the team about confidentiality arrangements before sharing sensitive information. Avoid submitting confidential documents unless they are needed and an appropriate channel has been agreed.',
    category: 'Process',
  },
  {
    question: 'How do you price?',
    answer:
      'Pricing depends on the service, site conditions, design, equipment, approvals and responsibilities included. A written quotation should make the scope and exclusions clear so options can be compared fairly.',
    category: 'Commercial terms',
  },
  {
    question: 'Do you offer performance guarantees?',
    answer:
      'Do not assume a particular performance guarantee. Any performance commitments, measurement method, assumptions and exclusions must be stated in the project agreement.',
    category: 'Commercial terms',
  },
  {
    question: 'What happens to the system after handover?',
    answer:
      'Monitoring, maintenance, data access and support after handover depend on the agreed project scope. Confirm access, responsibilities, service levels and any ongoing charges before work begins.',
    category: 'Process',
  },
  {
    question: 'Can we get support outside Bengaluru?',
    answer:
      'Support outside Bengaluru depends on project location, service scope and available arrangements. Confirm coverage, travel requirements and response expectations with the team.',
    category: 'Process',
  },
  {
    question: 'How quickly can you start?',
    answer:
      'Start timing depends on the information available, the requested scope, site access and any approvals or specialist reviews required. The team can discuss a project-specific schedule after learning more.',
    category: 'Process',
    relatedService: 'consulting',
  },
];