/**
 * Home-page copy that is not part of a service or industry definition.
 */
import { visualAssets } from './visuals';

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
    title: 'Site context',
    body: 'Facility type, location, energy data and existing systems frame the first review.',
  },
  {
    title: 'Operating needs',
    body: 'Hours, critical loads and charging windows shape the options worth assessing.',
  },
  {
    title: 'A clear next step',
    body: 'Agree on missing information, review scope and responsibilities before detailed work.',
  },
];

/** Strip that appears between the hero and the services grid. */
export const positioningLine =
  'Energy systems designed around how your site actually behaves.';

export interface UseCase {
  id: string;
  sector: string;
  title: string;
  problem: string;
  approach: string;
  benefit: string;
  metric: string;
  image: string;
  imageAlt: string;
}

/** Illustrative scenarios for project discovery, not completed-client case studies. */
export const useCases: UseCase[] = [
  {
    id: 'daytime-facility',
    sector: 'Manufacturing',
    title: 'Match on-site solar to a working day',
    problem:
      'A factory may have strong daytime demand, but roof condition, shading, shift patterns and grid constraints determine whether solar generation lines up with real consumption.',
    approach:
      'Compare interval meter data and operating hours with roof area, structural information, shading and connection details before sizing or procurement.',
    benefit:
      'Clarify the opportunity, key assumptions and missing site checks before the team commits to a design or investment decision.',
    metric:
      'Solar self-consumption = on-site solar used by the facility ÷ total on-site solar generated. Review alongside imported peak kW.',
    image: visualAssets.solar.src,
    imageAlt: 'Original illustration of a factory using rooftop solar energy.',
  },
  {
    id: 'fleet-depot',
    sector: 'Fleet & logistics',
    title: 'Plan depot charging around vehicle routes',
    problem:
      'Vehicles can return in tight windows and leave together before the next shift. Charger count alone will not reveal whether dwell time, routes and available electrical capacity align.',
    approach:
      'Map vehicle duty cycles, parking locations, charging windows and connection capacity; then compare phased charger and load-management options.',
    benefit:
      'Give operations and facilities teams a shared charging plan with capacity limits and rollout questions visible early.',
    metric:
      'Track kWh delivered per vehicle per shift, charger utilisation and depot peak kW against a representative operating week.',
    image: visualAssets.ev.src,
    imageAlt: 'Original illustration of electric fleet vehicles charging at a depot.',
  },
  {
    id: 'critical-loads',
    sector: 'Healthcare & critical facilities',
    title: 'Evaluate storage against critical loads',
    problem:
      'Critical equipment, backup arrangements and variable demand make a generic battery size or resilience claim unreliable without a clear load and continuity requirement.',
    approach:
      'Separate critical from flexible loads, review demand intervals and existing backup systems, and define operating scenarios and safety constraints.',
    benefit:
      'Make the intended role of storage explicit and identify the engineering, controls and resilience questions that still need validation.',
    metric:
      'Model peak kW reduction and critical-load runtime for a stated scenario; compare metered charge and discharge energy.',
    image: visualAssets.storage.src,
    imageAlt: 'Original illustration of battery storage supporting a critical facility.',
  },
  {
    id: 'multi-site-visibility',
    sector: 'Property & multi-site operations',
    title: 'Turn disconnected energy data into a usable view',
    problem:
      'Different meters, buildings, schedules and reporting conventions can make it hard to see where energy use changes or where a closer review is worthwhile.',
    approach:
      'Check meter coverage, data intervals, site schedules and device compatibility, then define a consistent dashboard and exception-review workflow.',
    benefit:
      'Help facilities teams compare like with like, spot data gaps and prioritise investigation without treating a dashboard as an automatic saving.',
    metric:
      'Monitor meter-data completeness, kWh per operating hour by site and the time taken to review flagged exceptions.',
    image: visualAssets.energyControl.src,
    imageAlt: 'Original illustration of an energy dashboard connecting multiple facilities.',
  },
];