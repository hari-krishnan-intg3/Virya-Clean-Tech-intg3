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
      'We begin by understanding your energy goals and assessing the feasibility of your project.',
  },
  {
    number: '02',
    title: 'Custom Design & Planning',
    description:
      'Our team designs tailored solutions using relevant technologies to match your specific requirements.',
  },
  {
    number: '03',
    title: 'Installation & Integration',
    description:
      'We coordinate the installation and integration of your energy systems for a seamless implementation.',
  },
  {
    number: '04',
    title: 'Monitoring & Support',
    description:
      'We support ongoing monitoring, maintenance, and system optimization according to the agreed project scope.',
  },
];