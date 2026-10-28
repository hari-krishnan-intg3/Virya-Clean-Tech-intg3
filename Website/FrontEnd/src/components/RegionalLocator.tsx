import { MapPin } from 'lucide-react';

export interface RegionalLocation {
  name: string;
  latitude: number;
  longitude: number;
}

interface RegionalLocatorProps {
  locations: RegionalLocation[];
  activeLocation: string;
  onSelect: (name: string) => void;
}

export function RegionalLocator({ locations, activeLocation, onSelect }: RegionalLocatorProps) {
  const longitudeValues = locations.map((location) => location.longitude);
  const latitudeValues = locations.map((location) => location.latitude);
  const minLongitude = Math.min(...longitudeValues);
  const maxLatitude = Math.max(...latitudeValues);
  const longitudeSpan = Math.max(0.5, Math.max(...longitudeValues) - minLongitude);
  const latitudeSpan = Math.max(0.65, maxLatitude - Math.min(...latitudeValues));

  const projectLocation = (location: RegionalLocation) => ({
    left: `${8 + ((location.longitude - minLongitude) / longitudeSpan) * 84}%`,
    top: `${8 + ((maxLatitude - location.latitude) / latitudeSpan) * 84}%`,
  });

  return (
    <div
      className="relative isolate h-[360px] overflow-hidden rounded-lg border border-line bg-[#11251e] sm:h-[440px]"
      aria-label="Regional project location map"
      role="group"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 520"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="regional-grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M42 0H0V42" fill="none" stroke="#8ab5a0" strokeOpacity=".12" strokeWidth="1" />
          </pattern>
        </defs>
        <path d="M0 0h1000v520H0z" fill="url(#regional-grid)" />
        <path d="M70 45 255 30 380 72 535 58 700 93 878 79 946 135 895 179 818 190 763 234 734 286 692 328 667 377 620 422 569 478 508 506 473 478 447 435 420 393 398 348 374 307 348 265 319 228 284 194 246 154 211 118 166 82 117 62Z" fill="#1c3930" stroke="#69a789" strokeOpacity=".48" strokeWidth="3" />
        <path d="M140 96C300 130 412 172 534 202S748 260 885 305M120 328C286 286 384 257 523 267S744 316 885 402M243 65C282 152 315 230 352 315S420 418 478 473M638 84C619 166 614 240 644 321S679 418 709 462" fill="none" stroke="#b4cabb" strokeOpacity=".22" strokeWidth="5" strokeDasharray="10 11" />
        <text x="64" y="482" fill="#9bb8a7" fillOpacity=".76" fontSize="16" letterSpacing="2">SOUTH INDIA · REGIONAL LOCATOR</text>
      </svg>

      {locations.map((location) => {
        const selected = location.name === activeLocation;
        return (
          <button
            key={location.name}
            type="button"
            title={location.name}
            aria-label={`Center map on ${location.name}`}
            aria-pressed={selected}
            onClick={() => onSelect(location.name)}
            style={projectLocation(location)}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <span className={`grid h-8 w-8 place-items-center rounded-full border shadow-lg transition-transform ${selected ? 'scale-110 border-emerald-200 bg-emerald-400 text-[#07110f]' : 'border-white/80 bg-[#10251d] text-white hover:scale-110'}`}>
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </span>
            {selected && <span className="absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap rounded bg-[#07110f]/90 px-2 py-1 text-[0.7rem] font-semibold text-white">{location.name}</span>}
          </button>
        );
      })}

      <span className="absolute bottom-3 right-3 rounded bg-[#07110f]/75 px-2 py-1 text-[0.65rem] font-medium text-white/75">Approximate city positions</span>
    </div>
  );
}