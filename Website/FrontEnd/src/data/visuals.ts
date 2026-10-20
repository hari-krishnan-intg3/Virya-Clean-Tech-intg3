export interface VisualAsset {
  src: string;
  alt: string;
}

export const visualAssets = {
  solar: {
    src: '/images/pexels-solar-rooftop.jpg',
    alt: 'Rows of solar panels installed across a rooftop.',
  },
  solarInstallation: {
    src: '/images/pexels-solar-installation.jpg',
    alt: 'Solar panels being installed at a clean-energy site.',
  },
  wind: {
    src: '/images/pexels-wind-farm.jpg',
    alt: 'Wind turbines generating renewable electricity.',
  },
  ev: {
    src: '/images/pexels-ev-charging.jpg',
    alt: 'A public electric-vehicle charging station ready for use.',
  },
  storage: {
    src: '/images/pexels-energy-storage.jpg',
    alt: 'Energy storage and power conversion equipment.',
  },
  industrial: {
    src: '/images/pexels-industrial-team.jpg',
    alt: 'Industrial technicians reviewing equipment on site.',
  },
  engineering: {
    src: '/images/pexels-engineering-team.jpg',
    alt: 'Engineers reviewing technical plans together.',
  },
  renewable: {
    src: '/images/pexels-renewable-landscape.jpg',
    alt: 'Renewable energy infrastructure across an open landscape.',
  },
  solarComplex: {
    src: '/images/pexels-industrial-solar-complex.jpg',
    alt: 'Aerial view of solar panels installed across an industrial rooftop.',
  },
  solarMarketRooftop: {
    src: '/images/pexels-solar-market-rooftop.jpg',
    alt: 'Solar panels arranged across a rooftop.',
  },
  solarMarketPanels: {
    src: '/images/pexels-solar-market-panels.jpg',
    alt: 'Solar panels capturing daylight at a renewable-energy site.',
  },
  rooftopSolarArray: {
    src: '/images/pexels-rooftop-solar-array.jpg',
    alt: 'Rows of solar panels covering a large rooftop.',
  },
  siteAssessment: {
    src: '/images/pexels-site-assessment.jpg',
    alt: 'Site professionals reviewing solar panels and project documents.',
  },
  energyControl: {
    src: '/images/pexels-energy-control.jpg',
    alt: 'An electrician reviewing industrial electrical equipment.',
  },
  engineeringBlueprints: {
    src: '/images/pexels-engineering-blueprints.jpg',
    alt: 'Architects reviewing technical blueprints together.',
  },
  serviceEvCharging: {
    src: '/images/pexels-service-ev-charging.jpg',
    alt: 'An electric vehicle connected to a public charging station.',
  },
  manufacturing: {
    src: '/images/industry-manufacturing.jpg',
    alt: 'A worker operating machinery on a manufacturing production line.',
  },
  warehousing: {
    src: '/images/industry-warehouse.jpg',
    alt: 'Warehouse workers handling packages between storage racks.',
  },
  fleetCharging: {
    src: '/images/industry-fleet-charging.jpg',
    alt: 'An electric vehicle plugged into a charging station.',
  },
  realEstate: {
    src: '/images/industry-real-estate.jpg',
    alt: 'Modern commercial buildings viewed against the sky.',
  },
  hospital: {
    src: '/images/industry-hospital.jpg',
    alt: 'A modern hospital building in an urban setting.',
  },
  hotel: {
    src: '/images/industry-hotel.jpg',
    alt: 'A resort property with a pool and landscaped grounds.',
  },
  retail: {
    src: '/images/industry-retail.jpg',
    alt: 'A multi-level shopping centre with retail stores and escalators.',
  },
  education: {
    src: '/images/industry-education.jpg',
    alt: 'The entrance to a university campus.',
  },
} satisfies Record<string, VisualAsset>;

export const industryVisuals: Record<string, VisualAsset> = {
  manufacturing: visualAssets.manufacturing,
  warehousing: visualAssets.warehousing,
  'fleet-logistics': visualAssets.fleetCharging,
  'real-estate': visualAssets.realEstate,
  hospitals: visualAssets.hospital,
  hotels: visualAssets.hotel,
  retail: visualAssets.retail,
  education: visualAssets.education,
};
