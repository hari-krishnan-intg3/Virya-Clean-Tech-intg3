export interface VisualAsset {
  src: string;
  alt: string;
}

export const visualAssets = {
  solar: {
    src: '/images/generated-solar.jpg',
    alt: 'Photograph of a commercial rooftop solar installation in warm evening light.',
  },
  solarInstallation: {
    src: '/images/generated-solar.jpg',
    alt: 'Photograph of a commercial rooftop solar installation in warm evening light.',
  },
  wind: {
    src: '/images/generated-wind.jpg',
    alt: 'Photograph of wind turbines operating across an open landscape.',
  },
  ev: {
    src: '/images/generated-ev-charging.jpg',
    alt: 'Photograph of an electric vehicle charging beside modern infrastructure.',
  },
  storage: {
    src: '/images/generated-operator.jpg',
    alt: 'Photograph of an engineer reviewing industrial energy equipment.',
  },
  industrial: {
    src: '/images/generated-industrial.jpg',
    alt: 'Photograph of a modern industrial facility with connected operations.',
  },
  engineering: {
    src: '/images/generated-engineering.jpg',
    alt: 'Photograph of engineers collaborating on a technical project.',
  },
  renewable: {
    src: '/images/generated-renewable.jpg',
    alt: 'Photograph of renewable energy infrastructure at sunrise.',
  },
  solarComplex: {
    src: '/images/generated-solar.jpg',
    alt: 'Original illustrated view of a commercial rooftop solar installation.',
  },
  solarMarketRooftop: {
    src: '/images/generated-solar.jpg',
    alt: 'Original illustrated view of a commercial rooftop solar installation.',
  },
  solarMarketPanels: {
    src: '/images/generated-solar.jpg',
    alt: 'Original illustrated view of a commercial rooftop solar installation.',
  },
  rooftopSolarArray: {
    src: '/images/generated-solar.jpg',
    alt: 'Original illustrated view of a commercial rooftop solar installation.',
  },
  siteAssessment: {
    src: '/images/generated-engineering.jpg',
    alt: 'Original illustrated view of a site review for a clean-energy project.',
  },
  energyControl: {
    src: '/images/generated-dashboard.jpg',
    alt: 'Photograph of an operations dashboard used to monitor performance.',
  },
  engineeringBlueprints: {
    src: '/images/generated-engineering.jpg',
    alt: 'Original illustrated view of engineers planning a clean-energy project.',
  },
  batteryStorage: {
    src: '/images/generated-operator.jpg',
    alt: 'Photograph of an engineer reviewing industrial energy equipment.',
  },
  electricMobility: {
    src: '/images/generated-ev-charging.jpg',
    alt: 'Photograph of an electric vehicle charging beside modern infrastructure.',
  },
  industrialAssessment: {
    src: '/images/generated-engineering.jpg',
    alt: 'Original illustrated view of a site review for a clean-energy project.',
  },
  solarArray: {
    src: '/images/generated-solar.jpg',
    alt: 'Original illustrated view of a commercial rooftop solar installation.',
  },
  viryaEnergy: {
    src: '/images/generated-dashboard.jpg',
    alt: 'Original illustrated view of connected clean-energy systems.',
  },
  viryaEngineering: {
    src: '/images/generated-engineering.jpg',
    alt: 'Original illustrated view of engineers planning a clean-energy project.',
  },
  viryaEvCharging: {
    src: '/images/generated-ev-charging.jpg',
    alt: 'Original illustrated view of electric-vehicle charging infrastructure.',
  },
  viryaSolar: {
    src: '/images/generated-solar.jpg',
    alt: 'Original illustrated view of a commercial rooftop solar installation.',
  },
  viryaWind: {
    src: '/images/generated-wind.jpg',
    alt: 'Original illustrated view of wind turbines generating clean electricity.',
  },
  windEnergy: {
    src: '/images/generated-wind.jpg',
    alt: 'Original illustrated view of wind turbines generating clean electricity.',
  },
  serviceEvCharging: {
    src: '/images/generated-ev-charging.jpg',
    alt: 'Original illustrated view of an electric vehicle charging at a depot.',
  },
  manufacturing: {
    src: '/images/generated-industrial.jpg',
    alt: 'Photograph of a modern industrial facility with connected operations.',
  },
  warehousing: {
    src: '/images/generated-warehouse.jpg',
    alt: 'Photograph of a warehouse aisle and logistics operations.',
  },
  fleetCharging: {
    src: '/images/generated-ev-charging.jpg',
    alt: 'Photograph of an electric vehicle charging beside modern infrastructure.',
  },
  realEstate: {
    src: '/images/generated-office.jpg',
    alt: 'Photograph of a bright commercial building interior.',
  },
  hospital: {
    src: '/images/generated-hospital.jpg',
    alt: 'Photograph of a modern hospital corridor.',
  },
  hotel: {
    src: '/images/generated-hotel.jpg',
    alt: 'Photograph of a modern hotel exterior.',
  },
  retail: {
    src: '/images/generated-retail.jpg',
    alt: 'Photograph of a contemporary retail environment.',
  },
  education: {
    src: '/images/generated-campus.jpg',
    alt: 'Photograph of a modern education campus.',
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
