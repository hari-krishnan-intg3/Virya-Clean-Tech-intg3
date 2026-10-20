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
} satisfies Record<string, VisualAsset>;

export const industryVisuals: Record<string, VisualAsset> = {
  manufacturing: visualAssets.industrial,
  warehousing: visualAssets.solarInstallation,
  'fleet-logistics': visualAssets.ev,
  'real-estate': visualAssets.solar,
  hospitals: visualAssets.storage,
  hotels: visualAssets.ev,
  retail: visualAssets.solar,
  education: visualAssets.wind,
};
