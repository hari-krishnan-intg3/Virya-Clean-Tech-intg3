import { useState } from 'react';
import { ExternalLink, MapPin, Navigation, Phone, Mail, Building } from 'lucide-react';
import { HUBS_ACROSS_INDIA } from '@/data/offeringsArchitecture';

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
  const [mapProvider, setMapProvider] = useState<'google' | 'osm'>('google');
  
  // Find full office hub profile or fallback to basic coords
  const hubInfo = HUBS_ACROSS_INDIA.find(
    (h) => h.city.toLowerCase() === activeLocation.toLowerCase() || activeLocation.toLowerCase().includes(h.city.toLowerCase())
  );

  const active = locations.find((l) => l.name === activeLocation) ?? locations[0] ?? {
    name: 'Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
  };

  const lat = hubInfo?.coordinates[0] ?? active.latitude;
  const lng = hubInfo?.coordinates[1] ?? active.longitude;

  // URLs for both map providers
  const googleMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(`${active.name}, India`)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  const osmMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.08}%2C${lat - 0.06}%2C${lng + 0.08}%2C${lat + 0.06}&layer=mapnik&marker=${lat}%2C${lng}`;

  const directGoogleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hubInfo?.address ?? `${active.name}, India`}`)}`;

  return (
    <div
      className="overflow-hidden rounded-xl border border-line bg-card shadow-soft"
      aria-label="CleanTech project and office locator map"
    >
      {/* Top Header & Map Provider Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-mist px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-400/10 text-emerald-400">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <span className="text-sm font-bold text-ink">{active.name}</span>
            <span className="ml-2 text-xs text-ink-faint">
              {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-line bg-white/5 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMapProvider('google')}
              className={`rounded-md px-2.5 py-1 font-semibold transition-colors ${
                mapProvider === 'google'
                  ? 'bg-emerald-400 text-[#07110f]'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Google Maps
            </button>
            <button
              type="button"
              onClick={() => setMapProvider('osm')}
              className={`rounded-md px-2.5 py-1 font-semibold transition-colors ${
                mapProvider === 'osm'
                  ? 'bg-emerald-400 text-[#07110f]'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Terrain Map
            </button>
          </div>

          <a
            href={directGoogleMapsLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-400/20"
          >
            <Navigation className="h-3.5 w-3.5" />
            Directions
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Map Embed Frame */}
      <div className="relative h-[340px] w-full bg-[#111e19] sm:h-[400px]">
        <iframe
          key={`${active.name}-${mapProvider}`}
          title={`Map view centered on ${active.name}`}
          src={mapProvider === 'google' ? googleMapUrl : osmMapUrl}
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
          allowFullScreen
        />
      </div>

      {/* Office Hub Details Card */}
      {hubInfo && (
        <div className="border-t border-line bg-[#0d1d17] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">{hubInfo.role}</h4>
                {hubInfo.isHeadquarters && (
                  <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-emerald-300">
                    Headquarters
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">{hubInfo.address}</p>
              <p className="mt-1.5 text-xs text-emerald-300/90">
                <span className="font-semibold text-white">Focus:</span> {hubInfo.specialization}
              </p>
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <a
                href={`tel:${hubInfo.phone}`}
                className="inline-flex items-center gap-2 text-ink-muted hover:text-white"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                {hubInfo.phone}
              </a>
              <a
                href={`mailto:${hubInfo.email}`}
                className="inline-flex items-center gap-2 text-ink-muted hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 text-emerald-400" />
                {hubInfo.email}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
