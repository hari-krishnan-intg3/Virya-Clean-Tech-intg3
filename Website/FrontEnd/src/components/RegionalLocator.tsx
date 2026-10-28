export interface RegionalLocation {
  name: string;
  latitude: number;
  longitude: number;
}

interface RegionalLocatorProps {
  locations: RegionalLocation[];
  activeLocation: string;
}

export function RegionalLocator({ locations, activeLocation }: RegionalLocatorProps) {
  const active = locations.find((location) => location.name === activeLocation) ?? locations[0];
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(`${active.latitude},${active.longitude}`)}&z=12&output=embed`;

  return (
    <div
      className="h-[360px] overflow-hidden rounded-lg border border-line bg-mist sm:h-[440px]"
      aria-label="Regional project location map"
      role="group"
    >
      <iframe
        key={activeLocation}
        title={`Google Maps centered on ${activeLocation}`}
        src={mapUrl}
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
        allowFullScreen
      />
    </div>
  );
}