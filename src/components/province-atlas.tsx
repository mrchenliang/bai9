"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { skusForBrand } from "@/catalog";
import { BrandMark, brandMarkSpecFor } from "@/brand-marks";
import { CHINA_VIEWBOX, chinaMapProvinces, PROVINCE_PINS } from "@/china-map";
import {
  provinceLocalLore,
  provincesAtlas,
  REGIONS,
  totalRegionalHouses,
  type ProvinceEntry,
  type RegionId,
  type RegionalHouse,
} from "@/provinces";
import { useMuseum } from "@/components/shell";

type AromaFilter = "all" | RegionalHouse["aromaGroup"];
type ViewMode = "map" | "list";
type PinDensity = "all" | "major" | "off";

const AROMA_FILTERS: { id: AromaFilter; label: string; zh?: string }[] = [
  { id: "all", label: "All aromas" },
  { id: "nong", label: "Strong", zh: "浓香" },
  { id: "jiang", label: "Sauce", zh: "酱香" },
  { id: "qing", label: "Light", zh: "清香" },
  { id: "jian", label: "Mixed", zh: "兼香" },
  { id: "feng", label: "Feng", zh: "凤香" },
  { id: "mi", label: "Rice", zh: "米香" },
  { id: "chi", label: "Chi", zh: "豉香" },
  { id: "other", label: "Specialty", zh: "特色" },
];

function brandBottleThumb(brandId?: string): string | undefined {
  if (!brandId) return undefined;
  const list = skusForBrand(brandId);
  return list.find((s) => s.image)?.image;
}

function provinceFill(
  count: number,
  isSelected: boolean,
  isAllSelected: boolean,
  isHovered: boolean,
): string {
  if (count === 0) return "#f1efe9";
  if (isSelected) return "#c81e1e";
  if (isHovered) return "#1f1f24";
  if (isAllSelected) {
    if (count >= 10) return "#c95b49";
    if (count >= 6) return "#d87e6a";
    if (count >= 3) return "#e3a18f";
    return "#ecc0b3";
  }
  if (count >= 10) return "#d89a84";
  if (count >= 6) return "#e5bcab";
  if (count >= 3) return "#efd5c7";
  return "#f6e8df";
}

function flagshipHouseFor(prov: ProvinceEntry): RegionalHouse {
  const lore = provinceLocalLore[prov.id];
  const idx = lore?.flagshipIndex ?? 0;
  return prov.houses[idx] ?? prov.houses[0];
}

export function ProvinceAtlas() {
  const { query } = useMuseum();
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [region, setRegion] = useState<RegionId | "all">("all");
  const [aroma, setAroma] = useState<AromaFilter>("all");
  const [archivedOnly, setArchivedOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinDensity, setPinDensity] = useState<PinDensity>("all");

  const visibleProvinces = useMemo(() => {
    const q = query.trim().toLowerCase();
    return provincesAtlas
      .filter((prov) => region === "all" || prov.region === region)
      .map((prov) => {
        const lore = provinceLocalLore[prov.id];
        const houses = prov.houses.filter((house) => {
          if (aroma !== "all" && house.aromaGroup !== aroma) return false;
          if (archivedOnly && !house.brandId) return false;
          if (!q) return true;
          return [
            prov.nameZh,
            prov.nameEn,
            prov.regionEn,
            prov.regionZh,
            lore?.localTitle ?? "",
            lore?.localTitleZh ?? "",
            lore?.localPairing ?? "",
            house.nameZh,
            house.nameEn,
            house.cityZh,
            house.cityEn,
            house.aromaZh,
            house.aromaEn,
          ]
            .join(" ")
            .toLowerCase()
            .includes(q);
        });
        return { ...prov, houses };
      })
      .filter((prov) => prov.houses.length > 0);
  }, [aroma, archivedOnly, query, region]);

  const visibleById = useMemo(
    () => new Map(visibleProvinces.map((p) => [p.id, p])),
    [visibleProvinces],
  );

  // If a single selected province is filtered out, return cleanly to all-selected mode
  useEffect(() => {
    if (selectedId && !visibleById.has(selectedId)) {
      setSelectedId(null);
    }
  }, [visibleById, selectedId]);

  const selectedProv = selectedId ? visibleById.get(selectedId) ?? null : null;
  const hoveredProv = hoveredId ? visibleById.get(hoveredId) ?? null : null;
  const activeRegionMeta = region === "all" ? null : REGIONS.find((r) => r.id === region) ?? null;
  const showingCount = visibleProvinces.reduce((sum, p) => sum + p.houses.length, 0);
  const isAllSelected = selectedProv === null;
  const isFiltered = region !== "all" || aroma !== "all" || archivedOnly || query.trim().length > 0;

  function toggleProvinceSelection(provId: string) {
    setSelectedId((current) => (current === provId ? null : provId));
  }

  function focusProvinceOnMap(provId: string) {
    setSelectedId(provId);
    setViewMode("map");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div className="atlas-top">
        <div>
          <p className="kicker">Baijiu Map · 中国白酒地图</p>
          <h1>
            China Baijiu Map <span className="zh-inline">白酒地图</span>
          </h1>
          <p className="sub">
            {REGIONS.length} regions, {provincesAtlas.length} provinces, {totalRegionalHouses} regional distilleries
            mapped by hometown, local drinking culture, and house emblem. Click any province on the China map or switch
            to list view.
          </p>
        </div>

        <div className="atlas-view-switch" role="tablist" aria-label="Atlas display mode">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "map"}
            className={viewMode === "map" ? "view-seg is-on" : "view-seg"}
            onClick={() => setViewMode("map")}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
                d="M1.5 3.5l4-1.5 5 1.8 4-1.5v10.2l-4 1.5-5-1.8-4 1.5V3.5zm4-1.5v10.2m5-8.4V14"
              />
            </svg>
            Map View · 地图
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "list"}
            className={viewMode === "list" ? "view-seg is-on" : "view-seg"}
            onClick={() => setViewMode("list")}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                d="M2.5 4h11M2.5 8h11M2.5 12h11"
              />
            </svg>
            List View · 列表
          </button>
        </div>
      </div>

      {/* Compact Unified Filter Bar */}
      <div className="atlas-toolbar">
        <div className="atlas-select-group">
          <label className="atlas-filter-field">
            <span>Region</span>
            <select
              aria-label="Filter by region"
              value={region}
              onChange={(e) => {
                setRegion(e.target.value as RegionId | "all");
                setSelectedId(null);
              }}
            >
              <option value="all">All regions ({REGIONS.length})</option>
              {REGIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.en} · {item.zh}
                </option>
              ))}
            </select>
          </label>

          <label className="atlas-filter-field">
            <span>Aroma</span>
            <select
              aria-label="Filter by aroma"
              value={aroma}
              onChange={(e) => setAroma(e.target.value as AromaFilter)}
            >
              {AROMA_FILTERS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.zh ? `${item.label} · ${item.zh}` : item.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={archivedOnly ? "atlas-toggle is-on" : "atlas-toggle"}
            aria-pressed={archivedOnly}
            onClick={() => setArchivedOnly((v) => !v)}
          >
            Full archive only
          </button>

          {isFiltered || selectedId ? (
            <button
              type="button"
              className="atlas-reset"
              onClick={() => {
                setRegion("all");
                setAroma("all");
                setArchivedOnly(false);
                setSelectedId(null);
              }}
            >
              Reset
            </button>
          ) : null}
        </div>

        <span className="atlas-counter">
          {visibleProvinces.length} provinces · {showingCount} houses
        </span>
      </div>

      {visibleProvinces.length === 0 ? (
        <p className="empty">No regional distilleries match that filter.</p>
      ) : viewMode === "map" ? (
        <>
          <div className="atlas-map-layout">
            {/* Left: Interactive SVG Map of China */}
            <div className="china-map-card">
              <div className="china-map-head">
                <div className="china-map-status">
                  {hoveredProv ? (
                    <>
                      <strong>
                        {hoveredProv.nameEn} {hoveredProv.nameZh}
                      </strong>
                      <span>
                        {hoveredProv.houses.length} {hoveredProv.houses.length === 1 ? "house" : "houses"} ·{" "}
                        {provinceLocalLore[hoveredProv.id]?.localTitle}
                      </span>
                    </>
                  ) : selectedProv ? (
                    <>
                      <strong>
                        {selectedProv.nameEn} {selectedProv.nameZh}
                      </strong>
                      <span>
                        Focused province · click again or reset to select all {visibleProvinces.length}
                      </span>
                    </>
                  ) : activeRegionMeta ? (
                    <>
                      <strong>
                        {activeRegionMeta.en} · {activeRegionMeta.zh} (All {visibleProvinces.length} selected)
                      </strong>
                      <span>{activeRegionMeta.provincesSummary}</span>
                    </>
                  ) : (
                    <>
                      <strong>All {REGIONS.length} Regions · {visibleProvinces.length} Provinces Selected</strong>
                      <span>Click any province or brand crest to inspect local houses</span>
                    </>
                  )}
                </div>

                <div className="pin-density" role="group" aria-label="Brand pins on map">
                  <span>Pins</span>
                  {(
                    [
                      { id: "all", label: "All" },
                      { id: "major", label: "Major" },
                      { id: "off", label: "Off" },
                    ] as { id: PinDensity; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={pinDensity === opt.id ? "pin-btn is-on" : "pin-btn"}
                      onClick={() => setPinDensity(opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="china-svg-wrap">
                <svg
                  viewBox={CHINA_VIEWBOX}
                  className="china-svg"
                  role="img"
                  aria-label="Interactive SVG map of Chinese baijiu provinces and flagship brands"
                >
                  {/* Layer 1: Province vector polygons */}
                  <g className="china-provinces">
                    {chinaMapProvinces.map((prov) => {
                      const entry = prov.atlasId ? visibleById.get(prov.atlasId) : undefined;
                      const count = entry?.houses.length ?? 0;
                      const isSelected = Boolean(entry && selectedProv && entry.id === selectedProv.id);
                      const isHovered = Boolean(entry && hoveredId === entry.id);
                      const interactive = count > 0 && prov.atlasId !== null;
                      const activeAllHighlight = Boolean(entry && isAllSelected);

                      return (
                        <path
                          key={prov.svgId}
                          d={prov.path}
                          fill={provinceFill(count, isSelected, activeAllHighlight, isHovered)}
                          stroke={isSelected ? "#7f1d1d" : "#ffffff"}
                          strokeWidth={isSelected ? 1.5 : 0.9}
                          strokeLinejoin="round"
                          className={
                            interactive
                              ? isSelected || activeAllHighlight
                                ? "map-prov is-interactive is-selected"
                                : "map-prov is-interactive"
                              : "map-prov is-muted"
                          }
                          tabIndex={interactive ? 0 : undefined}
                          role={interactive ? "button" : undefined}
                          aria-label={
                            entry
                              ? `${entry.nameEn} (${entry.nameZh}), ${entry.houses.length} distilleries`
                              : prov.name
                          }
                          aria-pressed={interactive ? isSelected || activeAllHighlight : undefined}
                          onMouseEnter={() => {
                            if (interactive && prov.atlasId) setHoveredId(prov.atlasId);
                          }}
                          onMouseLeave={() => {
                            if (hoveredId === prov.atlasId) setHoveredId(null);
                          }}
                          onClick={() => {
                            if (interactive && prov.atlasId) toggleProvinceSelection(prov.atlasId);
                          }}
                          onKeyDown={(e) => {
                            if (interactive && prov.atlasId && (e.key === "Enter" || e.key === " ")) {
                              e.preventDefault();
                              toggleProvinceSelection(prov.atlasId);
                            }
                          }}
                        />
                      );
                    })}
                  </g>

                  {/* Layer 2: Flagship Brand Logo Pins tied to each province */}
                  {pinDensity !== "off" ? (
                    <g className="china-brand-pins">
                      {visibleProvinces.map((prov) => {
                        const pin = PROVINCE_PINS[prov.id];
                        if (!pin) return null;
                        const isSelected = selectedProv?.id === prov.id;
                        const isHovered = hoveredId === prov.id;
                        const showPin =
                          pinDensity === "all" ||
                          isFiltered ||
                          pin.tier === "major" ||
                          isSelected ||
                          isHovered;
                        if (!showPin) return null;

                        const flagship = flagshipHouseFor(prov);
                        const spec = brandMarkSpecFor(flagship);
                        const lore = provinceLocalLore[prov.id];
                        const labelZh = lore?.mapBrandZh ?? flagship.nameZh.slice(0, 3);
                        const px = pin.x + (pin.dx ?? 0);
                        const py = pin.y + (pin.dy ?? 0);
                        const hasLeader = Boolean(pin.dx || pin.dy);
                        const pillW = 20 + labelZh.length * 10.5;

                        return (
                          <g
                            key={`pin-${prov.id}`}
                            className={
                              isSelected
                                ? "map-pin is-selected"
                                : isHovered
                                  ? "map-pin is-hovered"
                                  : "map-pin"
                            }
                            onMouseEnter={() => setHoveredId(prov.id)}
                            onMouseLeave={() => {
                              if (hoveredId === prov.id) setHoveredId(null);
                            }}
                            onClick={() => toggleProvinceSelection(prov.id)}
                          >
                            {hasLeader ? (
                              <>
                                <line
                                  x1={pin.x}
                                  y1={pin.y}
                                  x2={px}
                                  y2={py}
                                  stroke={isSelected ? "#c81e1e" : "#1f1f24"}
                                  strokeWidth="0.9"
                                  strokeDasharray="2 1.5"
                                  opacity="0.7"
                                />
                                <circle
                                  cx={pin.x}
                                  cy={pin.y}
                                  r="2.2"
                                  fill={isSelected ? "#c81e1e" : "#1f1f24"}
                                />
                              </>
                            ) : null}

                            <g transform={`translate(${px - pillW / 2}, ${py - 10})`}>
                              <rect
                                width={pillW}
                                height="20"
                                rx="10"
                                fill={isSelected ? "#111111" : "#ffffff"}
                                stroke={isSelected ? "#111111" : "rgba(11,11,13,0.22)"}
                                strokeWidth={isSelected ? "1.2" : "0.9"}
                              />
                              <circle cx="10" cy="10" r="7.2" fill={spec.bg} />
                              <text
                                x="10"
                                y="10.4"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill={spec.fg}
                                fontFamily='"Noto Serif SC", "Songti SC", Georgia, serif'
                                fontWeight="700"
                                fontSize="8.8"
                              >
                                {spec.glyph}
                              </text>
                              <text
                                x="20"
                                y="10.4"
                                dominantBaseline="central"
                                fill={isSelected ? "#ffffff" : "#111111"}
                                fontFamily='"Noto Serif SC", "Songti SC", Georgia, serif'
                                fontWeight="600"
                                fontSize="9.5"
                              >
                                {labelZh}
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </g>
                  ) : null}
                </svg>
              </div>

              <div className="china-map-foot">
                <div className="map-legend" aria-label="House density legend">
                  <span>Houses:</span>
                  <i>
                    <em style={{ background: isAllSelected ? "#ecc0b3" : "#f6e8df" }} /> 1–2
                  </i>
                  <i>
                    <em style={{ background: isAllSelected ? "#e3a18f" : "#efd5c7" }} /> 3–5
                  </i>
                  <i>
                    <em style={{ background: isAllSelected ? "#d87e6a" : "#e5bcab" }} /> 6–9
                  </i>
                  <i>
                    <em style={{ background: isAllSelected ? "#c95b49" : "#d89a84" }} /> 10+
                  </i>
                  <i>
                    <em style={{ background: "#c81e1e" }} /> Focused
                  </i>
                </div>
                <span className="map-credit">Vector base: @svg-maps/china (CC BY 4.0)</span>
              </div>
            </div>

            {/* Right: All-Selected Overview OR Focused Province Local Lore & Brand Logo Dossier */}
            <aside className="atlas-inspector" aria-live="polite">
              {selectedProv ? (
                <>
                  <button
                    type="button"
                    className="inspector-back"
                    onClick={() => setSelectedId(null)}
                  >
                    ← Back to all {visibleProvinces.length} selected provinces
                  </button>

                  <div className="inspector-head">
                    <div>
                      <div className="prov-region">
                        {selectedProv.regionEn} · {selectedProv.regionZh}
                      </div>
                      <h2>
                        {selectedProv.nameEn} <span className="zh-inline">{selectedProv.nameZh}</span>
                      </h2>
                    </div>
                    <span className="inspector-count">
                      {selectedProv.houses.length} {selectedProv.houses.length === 1 ? "house" : "houses"}
                    </span>
                  </div>

                  {provinceLocalLore[selectedProv.id] ? (
                    <div className="atlas-local-card">
                      <div className="local-card-top">
                        <span className="signal-kicker">Local Drinking Culture · 本地酒俗</span>
                        <span className="local-zh-tag">{provinceLocalLore[selectedProv.id].localTitleZh}</span>
                      </div>
                      <h3>{provinceLocalLore[selectedProv.id].localTitle}</h3>
                      <p>{provinceLocalLore[selectedProv.id].localStory}</p>
                      <div className="local-pairing">
                        <span>Local pairing · 下酒菜</span>
                        <b>{provinceLocalLore[selectedProv.id].localPairing}</b>
                      </div>
                    </div>
                  ) : null}

                  <div className="inspector-houses-head">
                    <span>Distilleries &amp; House Marks</span>
                    <small>Tinted cards open full archive dossier</small>
                  </div>

                  <div className="inspector-houses">
                    {selectedProv.houses.map((house) => {
                      const bottleThumb = brandBottleThumb(house.brandId);
                      const inner = (
                        <>
                          <BrandMark house={house} size={36} />
                          <div className="inspector-house-info">
                            <div className="house-top">
                              <span className="house-zh">{house.nameZh}</span>
                              <span className="house-aroma">{house.aromaZh}</span>
                            </div>
                            <div className="house-en">{house.nameEn}</div>
                            <div className="house-meta">
                              {house.cityEn} {house.cityZh} · {house.aromaEn}
                            </div>
                          </div>
                          {bottleThumb ? (
                            <div className="inspector-bottle">
                              <img src={bottleThumb} alt={house.nameEn} />
                            </div>
                          ) : null}
                        </>
                      );

                      return house.brandId ? (
                        <Link
                          key={`${selectedProv.id}-${house.nameZh}`}
                          href={`/brand/${house.brandId}`}
                          className="inspector-house-card is-archived"
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div key={`${selectedProv.id}-${house.nameZh}`} className="inspector-house-card">
                          {inner}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="inspector-head">
                    <div>
                      <div className="prov-region">
                        {activeRegionMeta
                          ? `${activeRegionMeta.en} · ${activeRegionMeta.zh}`
                          : `All ${REGIONS.length} Regions · 全国总览`}
                      </div>
                      <h2>
                        {activeRegionMeta ? (
                          <>
                            {activeRegionMeta.en} <span className="zh-inline">{activeRegionMeta.zh}</span>
                          </>
                        ) : (
                          <>
                            All Provinces <span className="zh-inline">全国{visibleProvinces.length}省</span>
                          </>
                        )}
                      </h2>
                    </div>
                    <span className="inspector-count">{showingCount} houses</span>
                  </div>

                  {activeRegionMeta ? (
                    <div className="atlas-local-card">
                      <span className="signal-kicker">Regional Table Culture · {activeRegionMeta.zh}酒俗</span>
                      <p style={{ marginTop: 5 }}>{activeRegionMeta.tableRule}</p>
                    </div>
                  ) : null}

                  <div className="inspector-houses-head">
                    <span>Click a province to inspect its houses</span>
                    <small>{visibleProvinces.length} active</small>
                  </div>

                  <div className="inspector-houses">
                    {visibleProvinces.map((prov) => {
                      const flagship = flagshipHouseFor(prov);
                      const lore = provinceLocalLore[prov.id];
                      return (
                        <button
                          key={`overview-${prov.id}`}
                          type="button"
                          className="inspector-prov-btn"
                          onMouseEnter={() => setHoveredId(prov.id)}
                          onMouseLeave={() => {
                            if (hoveredId === prov.id) setHoveredId(null);
                          }}
                          onClick={() => setSelectedId(prov.id)}
                        >
                          <BrandMark house={flagship} size={34} />
                          <div className="inspector-house-info">
                            <div className="house-top">
                              <span className="house-zh">
                                {prov.nameEn} <em className="overview-zh">{prov.nameZh}</em>
                              </span>
                              <span className="overview-count">{prov.houses.length}</span>
                            </div>
                            <div className="overview-local">
                              {lore?.localTitle ?? flagship.nameEn} · {flagship.nameZh}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </aside>
          </div>

          {/* Quick 1-Tap Province Jump Strip */}
          <div className="atlas-prov-strip" aria-label="Quick province jump">
            <button
              type="button"
              className={isAllSelected ? "prov-chip is-on" : "prov-chip"}
              onClick={() => setSelectedId(null)}
            >
              <b>All selected</b>
              <span>{visibleProvinces.length}</span>
            </button>
            {visibleProvinces.map((prov) => {
              const isSelected = selectedProv?.id === prov.id;
              const flagship = flagshipHouseFor(prov);
              const spec = brandMarkSpecFor(flagship);
              return (
                <button
                  key={`strip-${prov.id}`}
                  type="button"
                  className={isSelected ? "prov-chip is-on" : "prov-chip"}
                  onClick={() => toggleProvinceSelection(prov.id)}
                >
                  <i className="prov-chip-dot" style={{ background: spec.bg }} aria-hidden="true" />
                  <b>{prov.nameEn}</b>
                  <span>{prov.houses.length}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        /* List View */
        <div className="prov-list">
          {visibleProvinces.map((prov) => {
            const lore = provinceLocalLore[prov.id];
            return (
              <section key={prov.id} id={prov.id} className="prov-row atlas-list-row">
                <div className="prov-head">
                  <div className="prov-region">
                    {prov.regionEn} · {prov.regionZh}
                  </div>
                  <h2 className="prov-title">{prov.nameEn}</h2>
                  <div className="prov-zh">{prov.nameZh}</div>
                  {lore ? (
                    <div className="list-local-note">
                      <strong>{lore.localTitle}</strong>
                      <p>{lore.localStory}</p>
                      <div className="list-pairing">下酒菜 · {lore.localPairing}</div>
                    </div>
                  ) : null}
                  <div className="prov-list-meta">
                    <span className="prov-count">
                      {prov.houses.length} {prov.houses.length === 1 ? "house" : "houses"}
                    </span>
                    <button
                      type="button"
                      className="locate-map-btn"
                      onClick={() => focusProvinceOnMap(prov.id)}
                    >
                      View on map →
                    </button>
                  </div>
                </div>
                <div className="prov-grid">
                  {prov.houses.map((house) => {
                    const bottleThumb = brandBottleThumb(house.brandId);
                    const body = (
                      <div className="house-card-row">
                        <BrandMark house={house} size={34} />
                        <div className="house-card-body">
                          <div className="house-top">
                            <span className="house-zh">{house.nameZh}</span>
                            <span className="house-aroma">{house.aromaZh}</span>
                          </div>
                          <div className="house-en">{house.nameEn}</div>
                          <div className="house-meta">
                            {house.aromaEn} · {house.cityEn} {house.cityZh}
                          </div>
                        </div>
                        {bottleThumb ? (
                          <div className="list-bottle-mini">
                            <img src={bottleThumb} alt="" />
                          </div>
                        ) : null}
                      </div>
                    );
                    return house.brandId ? (
                      <Link
                        key={`${prov.id}-${house.nameZh}`}
                        href={`/brand/${house.brandId}`}
                        className="house-card is-archived"
                      >
                        {body}
                      </Link>
                    ) : (
                      <div key={`${prov.id}-${house.nameZh}`} className="house-card">
                        {body}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
