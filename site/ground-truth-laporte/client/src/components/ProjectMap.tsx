/*
  ProjectMap — interactive map of the Microsoft LaPorte data center sites
  and the surrounding community zones. Dark-styled to match the ledger brand.
  Toggleable layers: water sources, power grid, environmental impact zones.
  Sites and zones are drawn from the sealed record; each marker carries its receipt.
*/
import { useRef, useState, useCallback } from "react";
import { MapView } from "@/components/Map";
import { Droplets, Zap, Leaf, Layers } from "lucide-react";

/* Dark map style matching the Ground Truth palette */
const DARK_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0a0d14" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0d14" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6f7d8d" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#2e3a4b" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#a6b0be" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#141b26" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6f7d8d" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#0d1420" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a2230" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#222c3a" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a97a5" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2a3648" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1a2230" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#141b26" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1520" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4a5a6d" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#0c1018" }] },
];

interface Site {
  id: string;
  name: string;
  kind: "phase1" | "expansion" | "utility" | "civic";
  position: google.maps.LatLngLiteral;
  note: string;
  receipt: string;
}

const SITES: Site[] = [
  {
    id: "phase1",
    name: "Phase 1 — Radius Industrial Park",
    kind: "phase1",
    position: { lat: 41.5735, lng: -86.6970 },
    note: "489 acres · 6 buildings + 1 substation · groundbreaking June 17, 2026 · first building spring 2029",
    receipt: "CITY 6/4/2024 · WSBT 6/17/2026",
  },
  {
    id: "expansion",
    name: "Expansion — Pleasant Township annexation",
    kind: "expansion",
    position: { lat: 41.5590, lng: -86.6850 },
    note: "~1,000–1,300 acres annexed April–May 2026 · total campus ~17 buildings (acreage figures flagged, not collapsed)",
    receipt: "WNDU 4/14 & 5/19/2026",
  },
  {
    id: "nipsco",
    name: "NIPSCO service territory",
    kind: "utility",
    position: { lat: 41.6106, lng: -86.7227 },
    note: "Electric utility for the site. No Microsoft-named IURC cause exists — the megawatt question is unanswered in the public record.",
    receipt: "IURC record",
  },
  {
    id: "downtown",
    name: "City of La Porte — downtown",
    kind: "civic",
    position: { lat: 41.6106, lng: -86.7227 },
    note: "Population ~22,000. City water utility serves the site. 15% of project property-tax revenue flows to La Porte schools from 2028.",
    receipt: "CITY 3/3/2026",
  },
  {
    id: "schools",
    name: "La Porte Community School Corporation",
    kind: "civic",
    position: { lat: 41.5990, lng: -86.7150 },
    note: "Recipient of the 15% / 20-year property-tax allocation and the $1M AI-proficiency commitment.",
    receipt: "CITY 3/3/2026 · DOC 5/18/2026",
  },
  {
    id: "ivytech",
    name: "Ivy Tech — La Porte County campus area",
    kind: "civic",
    position: { lat: 41.6300, lng: -86.7350 },
    note: "Indiana's first Microsoft Datacenter Academy — MOU signed June 17, 2026, launch targeted for the 2027-28 school year.",
    receipt: "IVY 6/17/2026",
  },
];

const KIND_COLOR: Record<Site["kind"], string> = {
  phase1: "#d1a84b",
  expansion: "#d9ab45",
  utility: "#31d296",
  civic: "#7fb2e8",
};

/* ── Layer definitions ── */

type LayerKey = "water" | "power" | "environment";

interface LayerDef {
  key: LayerKey;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const LAYERS: LayerDef[] = [
  {
    key: "water",
    label: "Water sources",
    icon: <Droplets size={13} />,
    color: "#4a9de8",
    description: "Municipal water utility, Travis Ditch, and nearby surface water relevant to the site's supply and discharge.",
  },
  {
    key: "power",
    label: "Power grid",
    icon: <Zap size={13} />,
    color: "#e8c94a",
    description: "NIPSCO transmission corridors and the planned on-site substation. No public filing prices this site's load.",
  },
  {
    key: "environment",
    label: "Environmental zones",
    icon: <Leaf size={13} />,
    color: "#4ae8a0",
    description: "Stormwater restoration corridor, Travis Ditch improvement area, and the ecological restoration commitment zone.",
  },
];

/* Water layer features */
const WATER_FEATURES = [
  { type: "marker" as const, position: { lat: 41.6150, lng: -86.7100 }, title: "La Porte Water Utility", note: "Municipal water supplier for the site. ~1,000 gal/day/building described by the water superintendent." },
  { type: "marker" as const, position: { lat: 41.5650, lng: -86.6920 }, title: "Travis Ditch", note: "$300,000 improvement commitment. Stormwater conveyance near the site." },
  { type: "polyline" as const, path: [
    { lat: 41.5700, lng: -86.6950 },
    { lat: 41.5650, lng: -86.6920 },
    { lat: 41.5580, lng: -86.6880 },
    { lat: 41.5520, lng: -86.6820 },
  ], title: "Travis Ditch corridor" },
];

/* Power grid layer features */
const POWER_FEATURES = [
  { type: "marker" as const, position: { lat: 41.5755, lng: -86.6955 }, title: "Planned substation", note: "On-site substation included in Phase 1 plans (6 buildings + 1 substation)." },
  { type: "marker" as const, position: { lat: 41.6080, lng: -86.7200 }, title: "NIPSCO La Porte service center", note: "Electric utility. No Microsoft-named IURC cause exists — the megawatt question is unanswered." },
  { type: "polyline" as const, path: [
    { lat: 41.6080, lng: -86.7200 },
    { lat: 41.5950, lng: -86.7100 },
    { lat: 41.5800, lng: -86.7000 },
    { lat: 41.5755, lng: -86.6955 },
  ], title: "Transmission corridor (approximate)" },
];

/* Environmental layer features */
const ENV_FEATURES = [
  { type: "polygon" as const, paths: [
    { lat: 41.5720, lng: -86.6980 },
    { lat: 41.5720, lng: -86.6880 },
    { lat: 41.5660, lng: -86.6880 },
    { lat: 41.5660, lng: -86.6980 },
  ], title: "Stormwater restoration zone", note: "~$4M ecological & stormwater restoration commitment (council record 5/18/2026)." },
  { type: "polygon" as const, paths: [
    { lat: 41.5660, lng: -86.6940 },
    { lat: 41.5660, lng: -86.6900 },
    { lat: 41.5620, lng: -86.6900 },
    { lat: 41.5620, lng: -86.6940 },
  ], title: "Travis Ditch improvement area", note: "$300,000 Travis Ditch improvements (council record 5/18/2026)." },
  { type: "marker" as const, position: { lat: 41.5690, lng: -86.6930 }, title: "Restoration commitment zone", note: "Ecological restoration tied to the annexation agreement." },
];

export default function ProjectMap() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selected, setSelected] = useState<Site | null>(SITES[0]);
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(new Set());
  const layerObjectsRef = useRef<Map<LayerKey, (google.maps.Polygon | google.maps.Polyline | google.maps.marker.AdvancedMarkerElement)[]>>(new Map());

  const clearLayer = useCallback((key: LayerKey) => {
    const objs = layerObjectsRef.current.get(key) || [];
    objs.forEach((o) => {
      if ("setMap" in o) (o as google.maps.Polygon | google.maps.Polyline).setMap(null);
      else (o as google.maps.marker.AdvancedMarkerElement).map = null;
    });
    layerObjectsRef.current.set(key, []);
  }, []);

  const toggleLayer = useCallback((key: LayerKey) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        clearLayer(key);
      } else {
        next.add(key);
        drawLayer(key);
      }
      return next;
    });
  }, [clearLayer]);

  const drawLayer = useCallback((key: LayerKey) => {
    const map = mapRef.current;
    if (!map) return;
    const layer = LAYERS.find((l) => l.key === key)!;
    const objs: (google.maps.Polygon | google.maps.Polyline | google.maps.marker.AdvancedMarkerElement)[] = [];
    const features = key === "water" ? WATER_FEATURES : key === "power" ? POWER_FEATURES : ENV_FEATURES;

    features.forEach((f) => {
      if (f.type === "marker") {
        const el = document.createElement("div");
        el.style.cssText = `
          width: 14px; height: 14px; border-radius: 50%;
          background: ${layer.color}; border: 2.5px solid #0a0d14;
          box-shadow: 0 0 0 2px ${layer.color}55, 0 2px 6px rgba(0,0,0,.4);
          cursor: pointer;
        `;
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: f.position!,
          title: f.title,
          content: el,
        });
        if (f.note) {
          const info = new google.maps.InfoWindow({
            content: `<div style="background:#141b26;color:#e9eaee;padding:10px 14px;border-radius:8px;font-family:IBM Plex Sans,sans-serif;font-size:13px;max-width:260px;border:1px solid #2e3a4b;">
              <strong style="color:${layer.color};font-size:12px;text-transform:uppercase;letter-spacing:.08em;">${f.title}</strong>
              <p style="margin:6px 0 0;color:#a6b0be;line-height:1.5;">${f.note}</p>
            </div>`,
          });
          marker.addListener("click", () => info.open({ map, anchor: marker }));
        }
        objs.push(marker);
      } else if (f.type === "polyline") {
        objs.push(new google.maps.Polyline({
          map,
          path: f.path!,
          strokeColor: layer.color,
          strokeOpacity: 0.8,
          strokeWeight: 3,
          geodesic: true,
        }));
      } else if (f.type === "polygon") {
        objs.push(new google.maps.Polygon({
          map,
          paths: f.paths!,
          strokeColor: layer.color,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: layer.color,
          fillOpacity: 0.1,
        }));
      }
    });
    layerObjectsRef.current.set(key, objs);
  }, []);

  const onMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    map.setOptions({ styles: DARK_STYLE, mapTypeControl: false, streetViewControl: false });

    // Phase 1 site polygon
    new google.maps.Polygon({
      map,
      paths: [
        { lat: 41.5780, lng: -86.7040 },
        { lat: 41.5780, lng: -86.6900 },
        { lat: 41.5690, lng: -86.6900 },
        { lat: 41.5690, lng: -86.7040 },
      ],
      strokeColor: "#d1a84b",
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: "#d1a84b",
      fillOpacity: 0.12,
    });

    // Expansion zone polygon
    new google.maps.Polygon({
      map,
      paths: [
        { lat: 41.5690, lng: -86.7000 },
        { lat: 41.5690, lng: -86.6700 },
        { lat: 41.5490, lng: -86.6700 },
        { lat: 41.5490, lng: -86.7000 },
      ],
      strokeColor: "#d9ab45",
      strokeOpacity: 0.7,
      strokeWeight: 2,
      fillColor: "#d9ab45",
      fillOpacity: 0.07,
    });

    // City of La Porte boundary
    new google.maps.Polygon({
      map,
      paths: [
        { lat: 41.6300, lng: -86.7450 },
        { lat: 41.6300, lng: -86.7000 },
        { lat: 41.5910, lng: -86.7000 },
        { lat: 41.5910, lng: -86.7450 },
      ],
      strokeColor: "#7fb2e8",
      strokeOpacity: 0.55,
      strokeWeight: 1.5,
      fillColor: "#7fb2e8",
      fillOpacity: 0.05,
    });

    SITES.forEach((site) => {
      const color = KIND_COLOR[site.kind];
      const markerEl = document.createElement("div");
      markerEl.style.cssText = `
        width: 18px; height: 18px; border-radius: 50%;
        background: ${color}; border: 3px solid #0a0d14;
        box-shadow: 0 0 0 2px ${color}66, 0 2px 8px rgba(0,0,0,.5);
        cursor: pointer;
      `;
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: site.position,
        title: site.name,
        content: markerEl,
      });
      marker.addListener("click", () => {
        setSelected(site);
        map.panTo(site.position);
      });
    });
  };

  return (
    <div>
      {/* Layer toggles */}
      <div className="flex flex-wrap gap-2.5 mb-4">
        <div className="flex items-center gap-2 mr-2 text-[10.5px] tracking-[0.14em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
          <Layers size={13} style={{ color: "var(--gt-gold)" }} /> Layers
        </div>
        {LAYERS.map((l) => {
          const active = activeLayers.has(l.key);
          return (
            <button
              key={l.key}
              onClick={() => toggleLayer(l.key)}
              className="flex items-center gap-2 text-[11px] font-medium tracking-[0.06em] px-3.5 py-2 rounded-lg border transition-all duration-200 active:scale-[0.97]"
              style={{
                fontFamily: "var(--font-mono)",
                color: active ? l.color : "var(--gt-fg2)",
                borderColor: active ? l.color + "66" : "var(--gt-line2)",
                background: active ? l.color + "12" : "transparent",
              }}
            >
              {l.icon}
              {l.label}
              <span
                className="w-2 h-2 rounded-full transition-all duration-200"
                style={{ background: active ? l.color : "var(--gt-line2)" }}
              />
            </button>
          );
        })}
      </div>
      {/* Active layer descriptions */}
      {activeLayers.size > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {LAYERS.filter((l) => activeLayers.has(l.key)).map((l) => (
            <div
              key={l.key}
              className="text-[11.5px] leading-relaxed px-3 py-2 rounded-lg border max-w-[300px]"
              style={{ borderColor: l.color + "33", background: l.color + "08", color: "var(--gt-fg2)" }}
            >
              <span style={{ color: l.color, fontFamily: "var(--font-mono)" }}>{l.label.toUpperCase()} · </span>
              {l.description}
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_340px] gap-0 rounded-xl border overflow-hidden" style={{ borderColor: "var(--gt-line)" }}>
        <div className="relative">
          <MapView
            className="h-[420px] lg:h-[520px]"
            initialCenter={{ lat: 41.5950, lng: -86.7000 }}
            initialZoom={12}
            onMapReady={onMapReady}
          />
          <div
            className="absolute top-3 left-3 flex flex-wrap gap-2 text-[10px] tracking-[0.08em] uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {[
              ["Phase 1 site", "#d1a84b"],
              ["Annexation zone", "#d9ab45"],
              ["City of La Porte", "#7fb2e8"],
            ].map(([label, color]) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border"
                style={{ background: "rgba(10,13,20,.85)", borderColor: "var(--gt-line2)", color: "var(--gt-fg2)", backdropFilter: "blur(6px)" }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t lg:border-t-0 lg:border-l" style={{ borderColor: "var(--gt-line)", background: "var(--gt-panel)" }}>
          <div className="p-5 border-b" style={{ borderColor: "var(--gt-line)" }}>
            <div className="text-[10.5px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
              Sites & zones
            </div>
            <div className="text-[15px] font-semibold mt-1" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
              Click a marker or a row
            </div>
          </div>
          <div className="max-h-[300px] lg:max-h-[340px] overflow-y-auto">
            {SITES.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelected(s);
                  mapRef.current?.panTo(s.position);
                  mapRef.current?.setZoom(13);
                }}
                className="w-full text-left px-5 py-3.5 border-b transition-colors duration-150"
                style={{
                  borderColor: "var(--gt-line)",
                  background: selected?.id === s.id ? "var(--gt-gold-dim)" : "transparent",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: KIND_COLOR[s.kind] }} />
                  <span className="text-[13.5px] font-medium" style={{ color: selected?.id === s.id ? "var(--gt-gold)" : "var(--gt-fg)" }}>
                    {s.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
          {selected && (
            <div className="p-5 border-t" style={{ borderColor: "var(--gt-line)", background: "var(--gt-bg2)" }}>
              <div className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                {selected.name}
              </div>
              <p className="text-[12.5px] leading-relaxed mt-1.5" style={{ color: "var(--gt-fg2)" }}>
                {selected.note}
              </p>
              <div className="text-[10px] tracking-[0.08em] uppercase mt-2.5" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
                {selected.receipt}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
