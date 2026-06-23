import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { CONTINENTS, DISTRIBUTION_MAP, ContinentKey } from "@/data/regions";

interface Props {
  distribution: string[];
  countries: string;
}

// Koordinat pusat untuk tiap benua (lat, lon)
const CONTINENT_COORDS: Record<ContinentKey, [number, number]> = {
  "north-america": [45, -100],
  "south-america": [-15, -60],
  "europe": [50, 10],
  "africa": [5, 20],
  "asia": [35, 90],
  "oceania": [-25, 135],
  "antarctica": [-75, 0],
};

// Radius lingkaran untuk setiap benua di peta
const CONTINENT_RADIUS: Record<ContinentKey, number> = {
  "north-america": 1200000,
  "south-america": 1000000,
  "europe": 700000,
  "africa": 900000,
  "asia": 1500000,
  "oceania": 800000,
  "antarctica": 600000,
};

// Pusat peta untuk berbagai skenario
function getMapCenter(distributionKeys: ContinentKey[]): [number, number] {
  if (distributionKeys.length === 0) return [20, 0];
  if (distributionKeys.length === 1) return CONTINENT_COORDS[distributionKeys[0]];  
  // Jika banyak benua, pusatkan di sekitar equator
  return [15, 60];
}

function getMapZoom(distributionKeys: ContinentKey[]): number {
  const count = distributionKeys.length;
  if (count <= 1) return 2; // Zoom in ke satu benua
  if (count <= 3) return 1.5;
  return 1;
}

function MapBounds({ keys }: { keys: ContinentKey[] }) {
  const map = useMap();
  useEffect(() => {
    if (keys.length === 0) {
      map.setZoom(1.5);
      return;
    }
    const center = getMapCenter(keys);
    const zoom = getMapZoom(keys);
    map.setView(center, zoom);
  }, [keys, map]);
  return null;
}

export function DistributionMapLeaflet({ distribution, countries }: Props) {
  const highlighted = useMemo(() => {
    const set = new Set<ContinentKey>();
    for (const region of distribution || []) {
      const entry = DISTRIBUTION_MAP[region];
      if (entry) entry.continentKeys.forEach((k) => set.add(k as ContinentKey));
    }
    return Array.from(set);
  }, [distribution]);

  const labels = useMemo(() => {
    const seen = new Set<string>();
    return (distribution || [])
      .map((r) => DISTRIBUTION_MAP[r]?.label)
      .filter((l): l is string => !!l && !seen.has(l) && !!seen.add(l));
  }, [distribution]);

  const mapCenter = useMemo(() => getMapCenter(highlighted), [highlighted]);
  const mapZoom = useMemo(() => getMapZoom(highlighted), [highlighted]);

  const tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

  return (
    <div className="mt-5">

      <div className="crayon-card p-2 bg-[var(--paper)] overflow-hidden">
        <div className="rounded-xl overflow-hidden" style={{ height: "250px" }}>
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={false}
            dragging={true}
            zoomControl={false}
            doubleClickZoom={false}
            touchZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url={tileUrl} attribution={attribution} />
            <MapBounds keys={highlighted} />
            {highlighted.map((key) => {
              const coords = CONTINENT_COORDS[key];
              const radius = CONTINENT_RADIUS[key];
              if (!coords) return null;
              return (
                <CircleMarker
                  key={key}
                  center={coords}
                  radius={15}
                  pathOptions={{
                    color: "#F2994A",
                    fillColor: "#F2994A",
                    fillOpacity: 0.35,
                    weight: 3,
                    opacity: 0.9,
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                    <span className="font-bold text-sm">{CONTINENTS[key]?.label || key}</span>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        <div className="mt-2 px-1 space-y-1">
          {labels.map((label) => (
            <span
              key={label}
              className="sticker-badge inline-block mr-1.5"
              style={{ background: "var(--orange)", transform: "rotate(-2deg)" }}
            >
              {label}
            </span>
          ))}
        </div>

        {countries && (
          <p className="mt-1.5 px-1 text-[11px] font-semibold text-[var(--ink-soft)] leading-relaxed">
            {countries}
          </p>
        )}
      </div>
    </div>
  );
}