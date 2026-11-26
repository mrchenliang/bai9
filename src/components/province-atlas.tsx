"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { provincesAtlas, REGIONS, totalRegionalHouses, type RegionId, type RegionalHouse } from "@/provinces";
import { useMuseum } from "@/components/shell";

type AromaFilter = "all" | RegionalHouse["aromaGroup"];

const AROMA_FILTERS: { id: AromaFilter; label: string; zh?: string }[] = [
  { id: "all", label: "All aromas" },
  { id: "nong", label: "Strong", zh: "浓香" },
  { id: "jiang", label: "Sauce", zh: "酱香" },
  { id: "qing", label: "Light", zh: "清香" },
  { id: "jian", label: "Mixed", zh: "兼香" },
  { id: "feng", label: "Feng", zh: "凤香" },
  { id: "mi", label: "Rice", zh: "米香" },
  { id: "chi", label: "Chi", zh: "豉香" },
  { id: "other", label: "Other", zh: "董/芝/特/馥郁/老白干" },
];

export function ProvinceAtlas() {
  const { query } = useMuseum();
  const [region, setRegion] = useState<RegionId | "all">("all");
  const [aroma, setAroma] = useState<AromaFilter>("all");
  const [archivedOnly, setArchivedOnly] = useState(false);

  const visibleProvinces = useMemo(() => {
    const q = query.trim().toLowerCase();
    return provincesAtlas
      .filter((prov) => region === "all" || prov.region === region)
      .map((prov) => {
        const houses = prov.houses.filter((house) => {
          if (aroma !== "all" && house.aromaGroup !== aroma) return false;
          if (archivedOnly && !house.brandId) return false;
          if (!q) return true;
          return [
            prov.nameZh,
            prov.nameEn,
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

  const showingCount = visibleProvinces.reduce((sum, p) => sum + p.houses.length, 0);

  return (
    <>
      <p className="kicker">Provincial Atlas · 中国各省白酒图谱</p>
      <h1>
        Provincial Atlas <span className="zh-inline">各省白酒</span>
      </h1>
      <p className="sub">
        {provincesAtlas.length} provinces and municipalities, {totalRegionalHouses} regional distilleries mapped by
        hometown and aroma family. Tinted cards link directly to a full distillery dossier in the archive.
      </p>
      <p className="count">
        {visibleProvinces.length} provinces · {showingCount} houses showing
      </p>

      <div className="filters">
        <button type="button" className="pill" aria-pressed={region === "all"} onClick={() => setRegion("all")}>
          All regions
        </button>
        {REGIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="pill"
            aria-pressed={region === item.id}
            onClick={() => setRegion(region === item.id ? "all" : item.id)}
          >
            {item.en} <span className="zh-chip">{item.zh}</span>
          </button>
        ))}
      </div>

      <div className="filters">
        {AROMA_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="pill"
            aria-pressed={aroma === item.id}
            onClick={() => setAroma(aroma === item.id ? "all" : item.id)}
          >
            {item.label}
            {item.zh ? <span className="zh-chip"> {item.zh}</span> : null}
          </button>
        ))}
        <span className="grow" />
        <button
          type="button"
          className="sort"
          aria-pressed={archivedOnly}
          onClick={() => setArchivedOnly((v) => !v)}
        >
          Full archive only
        </button>
      </div>

      {visibleProvinces.length === 0 ? <p className="empty">No regional distilleries match that filter.</p> : null}

      <div className="prov-list">
        {visibleProvinces.map((prov) => (
          <section key={prov.id} id={prov.id} className="prov-row">
            <div className="prov-head">
              <div className="prov-region">
                {prov.regionEn} · {prov.regionZh}
              </div>
              <h2 className="prov-title">{prov.nameEn}</h2>
              <div className="prov-zh">{prov.nameZh}</div>
              <div className="prov-count">
                {prov.houses.length} {prov.houses.length === 1 ? "house" : "houses"}
              </div>
            </div>
            <div className="prov-grid">
              {prov.houses.map((house) => {
                const body = (
                  <>
                    <div className="house-top">
                      <span className="house-zh">{house.nameZh}</span>
                      <span className="house-aroma">{house.aromaZh}</span>
                    </div>
                    <div className="house-en">{house.nameEn}</div>
                    <div className="house-meta">
                      {house.aromaEn} · {house.cityEn} {house.cityZh}
                    </div>
                  </>
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
        ))}
      </div>
    </>
  );
}
