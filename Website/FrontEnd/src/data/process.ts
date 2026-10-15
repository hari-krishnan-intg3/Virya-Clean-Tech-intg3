export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

/** The four-step process published on the official website. */
export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery & Consultation',
    description:
      'Describe the facility, the operating challenge and what the organisation hopes to achieve. Available bills, usage data, site details and timelines help identify useful follow-up questions. This first discussion does not confirm technical suitability or commit the project to a solution.',
  },
  {
    number: '02',
    title: 'Custom Design & Planning',
    description:
      'If a deeper review is agreed, the scope can examine energy use, site conditions, infrastructure, operating patterns and local requirements. Options, assumptions and open questions should be made clear before design decisions are treated as final.',
  },
  {
    number: '03',
    title: 'Installation & Integration',
    description:
      'Implementation may involve equipment, electrical work, civil requirements, utility coordination and site access. Responsibilities, approvals, programme and deliverables depend on the signed scope and need to be agreed before work begins.',
  },
  {
    number: '04',
    title: 'Monitoring & Support',
    description:
      'Monitoring, maintenance, reporting or other follow-up can be discussed when relevant to the project. Confirm access, support contacts, response responsibilities and any ongoing charges as part of the service agreement.',
  },
];