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
      'We are based in Bengaluru, Karnataka, and we work across India. The projects we take on are usually within reach of the teams we can put on site, but we are comfortable coordinating for larger or multi-state programmes.',
    category: 'Commercial',
  },
  {
    question: 'Do you work on residential projects?',
    answer:
      'For a home below about 5 kW we will point you to the PM Surya Ghar: Muft Bijli Yojana instead, which had installed rooftop solar for 59.47 lakh households as of 30 September 2026 and is a far better route than engaging an EPC. We take on residential only for larger villas and campus-scale housing.',
    category: 'Commercial',
  },
  {
    question: 'What size of project do you take on?',
    answer:
      'Realistically 100 kW upward for solar, 2 to 60 chargers per site for EV infrastructure, and 50 kWh to 5 MWh for storage. Below those thresholds an EPC quote is usually more cost-effective than a bespoke engagement.',
    category: 'Commercial',
  },
  {
    question: 'How does an engagement usually start?',
    answer:
      'With a conversation about the problem, then a data request. If there is a fit, we do a feasibility or audit study — normally 2 to 6 weeks — with a written investment summary. Only after you have seen the number do we talk about implementation.',
    category: 'Process',
  },
  {
    question: 'Do you sign NDAs?',
    answer:
      'Yes, and we will send ours before you send over interval consumption data, electricity bills or site drawings. It is a reasonable expectation and we do not push back on it.',
    category: 'Process',
  },
  {
    question: 'How do you price?',
    answer:
      'On delivered cost, after a survey — not per watt off a rate card. Delivered cost means modules, inverters, transformers, structure, cable, earthing, labour, commissioning and interconnection all inside the number. If you compare two proposals and they differ by a lot, they are almost certainly quoting different scopes, and the cheaper one is rarely the complete one.',
    category: 'Commercial terms',
  },
  {
    question: 'Do you offer performance guarantees?',
    answer:
      'On solar we will model generation with stated assumptions and tie the commercial terms to a measured yield. We will show you the degradation and downtime figures we used, because a guarantee built on optimistic assumptions is not a guarantee.',
    category: 'Commercial terms',
  },
  {
    question: 'What happens to the system after handover?',
    answer:
      'Monitoring is handed over with the system, not sold back to you. You get alerting configured for the failure modes that actually occur on your plant, a preventive maintenance schedule, and access to the raw data. We would rather you did not need us and kept the monitoring anyway.',
    category: 'Process',
  },
  {
    question: 'Can we get support outside Bengaluru?',
    answer:
      'Yes, with travel and response-time expectations agreed up front. Remote monitoring and support cover most issues without a site visit, which is usually faster than dispatching anyone.',
    category: 'Process',
  },
  {
    question: 'How quickly can you start?',
    answer:
      'An audit or feasibility study usually begins within two weeks of receiving your interval data. Installation scheduling depends on equipment lead times and DISCOM approval, which is why we start those processes in parallel during design rather than after.',
    category: 'Process',
    relatedService: 'consulting',
  },
];