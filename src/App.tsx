import { useEffect, useMemo, useState } from "react";
import {
  aromaById,
  aromas,
  brandById,
  brands,
  creditById,
  creditUrl,
  moutaiNotice,
  priceBoard,
  retailers,
  skuAroma,
  skuById,
  skus,
  skusForBrand,
  tierById,
  tierRank,
  tiers,
} from "./catalog";
import type { AromaId, Brand, Sku, TierId } from "./types";

const COMPARE_KEY = "baijiu-museum-compare";

type SortId = "tier" | "zh" | "shop";

function readHash(): string {
  const raw = window.location.hash.replace(/^#/, "");
  return raw.startsWith("/") ? raw : "/";
}

function useHash(): string {
  const [path, setPath] = useState(readHash);
  useEffect(() => {
    const onChange = () => {
      setPath(readHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return path;
}

function loadCompare(): string[] {
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string").slice(0, 3);
  } catch {
    return [];
  }
}

function Face({ sku, brand }: { sku: Sku; brand: Brand }) {
  const tier = tierById(sku.tier);
  if (!sku.image) {
    return (
      <div className="face">
        <div className="plate">
          <b>{brand.nameZh.slice(0, 2)}</b>
          <span>{brand.pinyin}</span>
        </div>
        <span className="tier-tag">{tier?.zh}</span>
      </div>
    );
  }
  return (
    <div className="face">
      <img src={sku.image} alt={sku.nameZh} style={{ objectPosition: sku.imagePosition ?? "50% 40%" }} />
      <span className="tier-tag">{tier?.zh}</span>
    </div>
  );
}

function Card({ sku }: { sku: Sku }) {
  const brand = brandById(sku.brandId);
  if (!brand) return null;
  return (
    <a className="card" href={`#/sku/${sku.id}`}>
      <Face sku={sku} brand={brand} />
      <div className="name-zh">{sku.nameZh}</div>
      <div className="name-en">{sku.nameEn}</div>
      <div className="meta">
        {sku.abv} · {sku.volume}
      </div>
      {sku.chinaPrice ? <div className="price">{sku.chinaPrice}</div> : null}
    </a>
  );
}

function CreditLine({ sku }: { sku: Sku }) {
  const credit = creditById(sku.creditId);
  if (!credit) return <p className="caption">{sku.caption}</p>;
  return (
    <p className="caption">
      {sku.caption} Photograph by {credit.by}, {credit.license},{" "}
      <a href={creditUrl(credit.file)}>Wikimedia Commons</a>.
    </p>
  );
}

export function App() {
  const path = useHash();
  const [query, setQuery] = useState("");
  const [aroma, setAroma] = useState<AromaId | "all">("all");
  const [tier, setTier] = useState<TierId | "all">("all");
  const [province, setProvince] = useState("all");
  const [sort, setSort] = useState<SortId>("tier");
  const [compare, setCompare] = useState<string[]>(loadCompare);

  useEffect(() => {
    const title =
      path.startsWith("/sku/")
        ? skuById(path.slice(5))
        : path.startsWith("/brand/")
          ? brandById(path.slice(7))
          : undefined;
    const name = title && "nameZh" in title ? `${title.nameZh} · ${title.nameEn}` : "中国白酒博物馆";
    document.title = `${name} · Chinese Baijiu Museum`;
  }, [path]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key === "/" && target?.tagName !== "INPUT") {
        event.preventDefault();
        document.getElementById("q")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function toggleCompare(id: string) {
    setCompare((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-3);
      localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
      return next;
    });
  }

  const provinces = useMemo(
    () => [...new Set(brands.map((brand) => brand.provinceZh))].sort((a, b) => a.localeCompare(b, "zh")),
    [],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = skus.filter((sku) => {
      const brand = brandById(sku.brandId);
      if (!brand) return false;
      if (aroma !== "all" && skuAroma(sku)?.id !== aroma) return false;
      if (tier !== "all" && sku.tier !== tier) return false;
      if (province !== "all" && brand.provinceZh !== province) return false;
      if (sort === "shop" && sku.shops.length === 0) return false;
      if (!q) return true;
      const hay = [sku.nameZh, sku.nameEn, brand.nameZh, brand.nameEn, brand.pinyin, brand.provinceEn, brand.provinceZh]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    const copy = [...rows];
    if (sort === "zh") copy.sort((a, b) => a.nameZh.localeCompare(b.nameZh, "zh"));
    else copy.sort(
        (a, b) =>
          tierRank[a.tier] - tierRank[b.tier] ||
          (a.rank ?? 50) - (b.rank ?? 50) ||
          a.nameZh.localeCompare(b.nameZh, "zh"),
      );
    return copy;
  }, [aroma, province, query, sort, tier]);

  const route = path.split("/").filter(Boolean);

  return (
    <>
      <a className="skip" href="#main">
        Skip to bottles
      </a>
      <header className="top">
        <a className="brand-lock" href="#/">
          <span className="seal">酒</span>
          <span className="word">
            <b>baijiu</b>
            <span>中国白酒博物馆</span>
          </span>
        </a>
        <nav className="nav">
          <a href="#/" aria-current={path === "/" ? "page" : undefined}>
            藏品
          </a>
          <a href="#/tiers" aria-current={path === "/tiers" ? "page" : undefined}>
            梯队
          </a>
          <a href="#/brands" aria-current={path === "/brands" ? "page" : undefined}>
            品牌
          </a>
          <a href="#/aromas" aria-current={path === "/aromas" ? "page" : undefined}>
            香型
          </a>
          <a href="#/shops" aria-current={path === "/shops" ? "page" : undefined}>
            何处买
          </a>
        </nav>
        <label className="search">
          <span className="visually-hidden">Search</span>
          <input
            id="q"
            value={query}
            placeholder="搜 飞天 / Fenjiu"
            onChange={(event) => {
              setQuery(event.target.value);
              if (path !== "/") window.location.hash = "#/";
            }}
          />
          <kbd>/</kbd>
        </label>
      </header>
      <main id="main" className={compare.length ? "wrap has-compare" : "wrap"}>
        {route.length === 0 ? (
          <Collection
            visible={visible}
            aroma={aroma}
            setAroma={setAroma}
            tier={tier}
            setTier={setTier}
            province={province}
            setProvince={setProvince}
            provinces={provinces}
            sort={sort}
            setSort={setSort}
            query={query}
          />
        ) : null}
        {route[0] === "tiers" ? <TierBoard /> : null}
        {route[0] === "brands" ? <BrandIndex query={query} /> : null}
        {route[0] === "brand" && route[1] ? <BrandPage id={route[1]} /> : null}
        {route[0] === "sku" && route[1] ? (
          <SkuPage id={route[1]} compare={compare} onCompare={toggleCompare} />
        ) : null}
        {route[0] === "aromas" ? <AromaIndex /> : null}
        {route[0] === "shops" ? <ShopIndex /> : null}
        {route[0] === "about" ? <About /> : null}
        <footer className="foot">
          <span>白酒是蒸馏酒，常见四十到六十度。加拿大多数地方十九岁，美国二十一岁。</span>
          <a href="#/about">档案说明与图片来源</a>
        </footer>
      </main>
      {compare.length > 0 ? (
        <div className="compare">
          {compare.map((id) => {
            const sku = skuById(id);
            if (!sku) return null;
            return (
              <a key={id} href={`#/sku/${id}`}>
                {sku.image ? (
                  <img src={sku.image} alt="" style={{ objectPosition: sku.imagePosition }} />
                ) : (
                  <span className="mini">{sku.nameZh.slice(0, 1)}</span>
                )}
                <span className="nm">{sku.nameZh}</span>
              </a>
            );
          })}
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(COMPARE_KEY);
              setCompare([]);
            }}
          >
            清空
          </button>
        </div>
      ) : null}
    </>
  );
}

function Collection({
  visible,
  aroma,
  setAroma,
  tier,
  setTier,
  province,
  setProvince,
  provinces,
  sort,
  setSort,
  query,
}: {
  visible: Sku[];
  aroma: AromaId | "all";
  setAroma: (id: AromaId | "all") => void;
  tier: TierId | "all";
  setTier: (id: TierId | "all") => void;
  province: string;
  setProvince: (id: string) => void;
  provinces: string[];
  sort: SortId;
  setSort: (id: SortId) => void;
  query: string;
}) {
  return (
    <>
      <p className="kicker">Collection · 藏品</p>
      <h1>中国白酒博物馆</h1>
      <p className="en-title">Chinese Baijiu Museum</p>
      <p className="sub">
        A fixed archive of the bottles China actually argues about. Chinese names, the variation in the glass, a short
        history, and the shops in Canada and the United States that list them. The order does not take votes.
      </p>
      <p className="count">
        {brands.length} brands · {skus.length} bottles
        {query || aroma !== "all" || tier !== "all" || province !== "all" || sort === "shop"
          ? ` · ${visible.length} showing`
          : ""}
      </p>
      <div className="filters">
        <button type="button" className="pill" aria-pressed={aroma === "all"} onClick={() => setAroma("all")}>
          全部香型
        </button>
        {aromas
          .filter((item) => item.id !== "prepared")
          .map((item) => (
            <button
              key={item.id}
              type="button"
              className="pill"
              aria-pressed={aroma === item.id}
              onClick={() => setAroma(aroma === item.id ? "all" : item.id)}
            >
              {item.zh}
            </button>
          ))}
      </div>
      <div className="filters">
        <button type="button" className="pill" aria-pressed={tier === "all"} onClick={() => setTier("all")}>
          全部梯队
        </button>
        {tiers.map((item) => (
          <button
            key={item.id}
            type="button"
            className="pill"
            aria-pressed={tier === item.id}
            onClick={() => setTier(tier === item.id ? "all" : item.id)}
          >
            {item.zh}
          </button>
        ))}
        <span className="grow" />
        <button type="button" className="sort" aria-pressed={sort === "tier"} onClick={() => setSort("tier")}>
          按梯队
        </button>
        <button type="button" className="sort" aria-pressed={sort === "zh"} onClick={() => setSort("zh")}>
          按中文
        </button>
        <button type="button" className="sort" aria-pressed={sort === "shop"} onClick={() => setSort(sort === "shop" ? "tier" : "shop")}>
          海外有货单
        </button>
        <select className="sort" value={province} onChange={(event) => setProvince(event.target.value)} aria-label="Province">
          <option value="all">全部省份</option>
          {provinces.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      {visible.length === 0 ? <p className="empty">No bottle under that name.</p> : null}
      <div className="grid">
        {visible.map((sku) => (
          <Card key={sku.id} sku={sku} />
        ))}
      </div>
    </>
  );
}

function TierBoard() {
  return (
    <>
      <p className="kicker">Tiers · 梯队</p>
      <h1>四档，加一行出口</h1>
      <p className="en-title">Four rows, and a leaving-China row</p>
      <p className="sub">
        The row is the job of the bottle. A November 2026 street price sits on the card and does not choose the row.
        出口 records a Canada or United States listing. This page does not take a vote or a submission.
      </p>
      <div className="tier-board">
        {tiers.map((tier) => (
          <section key={tier.id} className={`tier-row ${tier.id}`}>
            <div className="tier-label">
              <strong>{tier.zh}</strong>
              <em>{tier.en}</em>
            </div>
            <div className="tier-scroll">
              {skus
                .filter((sku) => sku.tier === tier.id)
                .sort((a, b) => (a.rank ?? 50) - (b.rank ?? 50) || a.nameZh.localeCompare(b.nameZh, "zh"))
                .map((sku) => (
                  <Card key={sku.id} sku={sku} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function BrandIndex({ query }: { query: string }) {
  const q = query.trim().toLowerCase();
  const rows = brands.filter((brand) => {
    if (!q) return true;
    return [brand.nameZh, brand.nameEn, brand.pinyin, brand.provinceZh, brand.provinceEn].join(" ").toLowerCase().includes(q);
  });
  return (
    <>
      <p className="kicker">Brands · 品牌</p>
      <h1>品牌</h1>
      <p className="en-title">{rows.length} houses. The seventeen of 1989 are marked with that year.</p>
      <div className="brand-list">
        {rows.map((brand) => {
          const aroma = aromaById(brand.aroma);
          return (
            <a key={brand.id} className="brand-row" href={`#/brand/${brand.id}`}>
              <div>
                <div className="name-zh">{brand.nameZh}</div>
                <div className="name-en">{brand.nameEn}</div>
              </div>
              <div className="place">
                {brand.provinceZh} · {brand.placeEn}
              </div>
              <div className="place">{aroma?.zh}</div>
              <div className="medals">{brand.medals.length ? brand.medals.join(" ") : "—"}</div>
            </a>
          );
        })}
      </div>
    </>
  );
}

function BrandPage({ id }: { id: string }) {
  const brand = brandById(id);
  if (!brand) return <p className="empty">No such house.</p>;
  const aroma = aromaById(brand.aroma);
  const bottles = skusForBrand(brand.id);
  return (
    <>
      <p className="crumb">
        <a href="#/brands">品牌</a> · {brand.provinceZh} · {brand.provinceEn}
      </p>
      <h1>{brand.nameZh}</h1>
      <p className="en-title">
        {brand.nameEn} · {brand.pinyin}
      </p>
      <p className="count">
        {brand.distilleryZh} · {aroma?.zh}
        {aroma ? ` ${aroma.en}` : ""} · {bottles.length} bottles
        {brand.medals.length ? ` · 国家名酒 ${brand.medals.join(" / ")}` : ""}
      </p>
      <div className="split prose">
        <p>{brand.historyEn}</p>
        <p className="zh-copy">{brand.historyZh}</p>
      </div>
      {brand.official ? (
        <p>
          <a className="btn" href={brand.official.url}>
            {brand.official.label}
          </a>
        </p>
      ) : null}
      <h2 className="section-label">Bottles</h2>
      <div className="grid">
        {bottles.map((sku) => (
          <Card key={sku.id} sku={sku} />
        ))}
      </div>
    </>
  );
}

function SkuPage({
  id,
  compare,
  onCompare,
}: {
  id: string;
  compare: string[];
  onCompare: (id: string) => void;
}) {
  const sku = skuById(id);
  if (!sku) return <p className="empty">No such bottle.</p>;
  const brand = brandById(sku.brandId);
  if (!brand) return null;
  const aroma = skuAroma(sku);
  const tier = tierById(sku.tier);
  const siblings = skusForBrand(brand.id).filter((item) => item.id !== sku.id);
  return (
    <>
      <p className="crumb">
        <a href="#/">藏品</a> · <a href={`#/brand/${brand.id}`}>{brand.nameZh}</a> · {sku.nameZh}
      </p>
      <div className="sku-layout">
        <div>
          <div className="sku-photo">
            {sku.image ? (
              <img src={sku.image} alt={sku.nameZh} style={{ objectPosition: sku.imagePosition ?? "50% 40%" }} />
            ) : (
              <div className="plate">
                <b>{brand.nameZh.slice(0, 2)}</b>
                <span>{brand.pinyin}</span>
              </div>
            )}
          </div>
          <CreditLine sku={sku} />
        </div>
        <div>
          <p className="kicker">
            {brand.provinceZh} · {brand.provinceEn} · {tier?.zh} {tier?.en}
          </p>
          <h1>{sku.nameZh}</h1>
          <p className="en-title">{sku.nameEn}</p>
          <p className="sub">
            {brand.nameZh} · {brand.distilleryZh}
          </p>
          {sku.chinaPrice ? <p className="price">{sku.chinaPrice}</p> : null}
          {sku.chinaNote ? <p className="caption">{sku.chinaNote}</p> : null}
          <dl className="spec">
            <dt>香型</dt>
            <dd>
              {aroma?.zh} · {aroma?.en}
            </dd>
            <dt>酒精度</dt>
            <dd>{sku.abv}</dd>
            <dt>净含量</dt>
            <dd>{sku.volume}</dd>
            <dt>产地</dt>
            <dd>
              {brand.placeZh} · {brand.placeEn}
            </dd>
            <dt>梯队</dt>
            <dd>
              {tier?.zh} · {tier?.en}
            </dd>
          </dl>
          <p>{sku.role}</p>
          <p className="zh-copy">{sku.roleZh}</p>
          <div className="actions">
            <button type="button" className="btn solid" onClick={() => onCompare(sku.id)}>
              {compare.includes(sku.id) ? "移出对照" : "放入对照"}
            </button>
            <a className="btn" href={`#/brand/${brand.id}`}>
              {brand.nameZh}的其他酒
            </a>
            {sku.specUrl ? (
              <a className="btn" href={sku.specUrl}>
                酒厂产品页
              </a>
            ) : null}
            {brand.official ? (
              <a className="btn" href={brand.official.url}>
                {brand.official.label}
              </a>
            ) : null}
          </div>
          <h2 className="section-label">Canada and the United States</h2>
          {sku.shops.length === 0 ? (
            <p className="caption">
              No verified retail page for this exact bottle. The 何处买 index lists the chains that carry the category.
            </p>
          ) : (
            <div className="shops">
              {sku.shops.map((shop) => (
                <a key={shop.url} className="shop" href={shop.url}>
                  <span className="meta">{shop.country === "Canada" ? "Canada" : "US"}</span>
                  <span>
                    <span className="shop-name">
                      {shop.retailer} · {shop.place}
                    </span>
                    <small>{shop.note}</small>
                  </span>
                  <span className="amt">{shop.price}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      {siblings.length > 0 ? (
        <>
          <h2 className="section-label">Other bottles · {brand.nameZh}</h2>
          <div className="grid">
            {siblings.map((item) => (
              <Card key={item.id} sku={item} />
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}

function AromaIndex() {
  return (
    <>
      <p className="kicker">Aroma · 香型</p>
      <h1>十二种香型</h1>
      <p className="en-title">The twelve national types, plus one steeped wine.</p>
      <p className="sub">
        Each type has a reference distillery. Yanghe’s “soft strong aroma” stays inside strong aroma. It is not a
        thirteenth type.
      </p>
      <div className="aroma-grid">
        {aromas.map((aroma) => {
          const brand = brandById(aroma.referenceBrandId);
          return (
            <a key={aroma.id} className="aroma" href={`#/brand/${aroma.referenceBrandId}`}>
              <div className="name-zh">
                {aroma.zh} · {aroma.en}
              </div>
              <p>{aroma.taste}</p>
              <p className="zh-copy">{aroma.tasteZh}</p>
              <p className="meta">标准 · {brand?.nameZh}</p>
            </a>
          );
        })}
      </div>
    </>
  );
}

function ShopIndex() {
  return (
    <>
      <p className="kicker">Shops · 何处买</p>
      <h1>加拿大与美国</h1>
      <p className="en-title">Where a bottle was actually listed.</p>
      <p className="sub">
        Provincial boards decide most of the Canadian shelf. A page can be out of stock the same week. United States
        chains often sell 200 ml, 375 ml or 750 ml, while the China price is for 500 ml. Read the label. Prices below
        were copied from the retailer page in November 2026.
      </p>
      <div className="shop-index">
        {(["Canada", "United States"] as const).map((country) => (
          <section key={country}>
            <h2 className="section-label">{country}</h2>
            {retailers
              .filter((shop) => shop.country === country)
              .map((shop) => (
                <a key={shop.url} className="retailer" href={shop.url}>
                  <strong>
                    {shop.name} · {shop.place}
                  </strong>
                  <p>{shop.note}</p>
                </a>
              ))}
          </section>
        ))}
      </div>
      <h2 className="section-label">Bottles with a direct page</h2>
      <div className="grid">
        {skus
          .filter((sku) => sku.shops.length > 0)
          .map((sku) => (
            <Card key={sku.id} sku={sku} />
          ))}
      </div>
    </>
  );
}

function About() {
  return (
    <>
      <p className="kicker">About · 说明</p>
      <h1>这份档案不收人投稿</h1>
      <p className="en-title">A fixed editorial order.</p>
      <div className="prose">
        <p>
          The rows are 国宴, 名酒, 佳酿, 口粮, then 出口. 出口 is a shopping fact: the bottle was made, or at least
          listed, for Canada or the United States. It is not a fifth rank. Nothing on this site is a vote, a rating, or
          a comment. 对照 stays in this browser and is never sent anywhere.
        </p>
        <p className="zh-copy">
          梯队是国宴、名酒、佳酿、口粮，然后一行出口。出口只说明这瓶酒是做给、或至少列给加拿大和美国的，不是第五个名次。这里没有投票、打分、留言。对照只留在这台浏览器里，不会送出去。
        </p>
        <p>
          China street prices, where shown as a single yuan figure with the date 23 November 2026, come from{" "}
          <a href={priceBoard.sourceUrl}>{priceBoard.sourceName}</a>. {priceBoard.method} That morning in China was the
          evening of {priceBoard.toronto}. The Flying Fairy i-Moutai price is the company’s own{" "}
          <a href={moutaiNotice.url}>{moutaiNotice.label}</a>. A yuan figure dated 9 November 2024 is a ticket visible
          in the photograph, not that national sample.
        </p>
        <p>
          National famous-liquor years follow the five tastings: four liquors in Beijing in 1952, eight in 1963, eight
          in Dalian in 1979, thirteen in Taiyuan in 1984, seventeen in Hefei in 1989. The state stopped the contest
          after that. Medal proofs are the proofs printed for that tasting. Current bottles are often lower.
        </p>
        <p>
          Shop links open the retailer. This archive does not sell alcohol. Stock, tax and the legal drinking age are
          the shop’s and the province’s or the state’s.
        </p>
      </div>
      <h2 className="section-label">Photographs</h2>
      <ul className="credits">
        {skus
          .filter((sku) => sku.creditId)
          .map((sku) => {
            const credit = creditById(sku.creditId);
            if (!credit) return null;
            return (
              <li key={sku.id}>
                {sku.nameZh} — {credit.by}, {credit.license},{" "}
                <a href={creditUrl(credit.file)}>{credit.file}</a>
              </li>
            );
          })}
      </ul>
    </>
  );
}
