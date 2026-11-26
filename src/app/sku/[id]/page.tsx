import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { accessionNumber, Card, CreditLine, tierNumeral } from "@/components/card";
import { CompareButton, TastedButton } from "@/components/shell";
import { SkuShareActions } from "@/components/sku-share-actions";
import { brandById, skuAroma, skuById, skus, skusForBrand, tierById } from "@/catalog";
import { fieldNoteFor, GB_KIND_META, SHOCK_LABELS } from "@/field-notes";
import { sheetSpot } from "@/sheet";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return skus.map((sku) => ({ id: sku.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const sku = skuById(id);
  if (!sku) return { title: { absolute: "Chinese Baijiu Museum · 酒" } };
  const aroma = skuAroma(sku);
  const note = fieldNoteFor(sku, aroma?.id);
  const title = `${sku.nameEn} (${sku.nameZh})`;
  const description = `${note.tableSignal} · ${note.gbCode} (${GB_KIND_META[note.gbKind].zh}) · ${sku.abv}`;
  return {
    title,
    description,
    openGraph: {
      title: `${title} · 酒`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · 酒`,
      description,
    },
  };
}

export default async function SkuPage({ params }: PageProps) {
  const { id } = await params;
  const sku = skuById(id);
  if (!sku) notFound();
  const brand = brandById(sku.brandId);
  if (!brand) notFound();
  const aroma = skuAroma(sku);
  const tier = tierById(sku.tier);
  const printed = sheetSpot(sku.id);
  const note = fieldNoteFor(sku, aroma?.id);
  const gbMeta = GB_KIND_META[note.gbKind];
  const shockMeta = SHOCK_LABELS[note.shock];
  const siblings = skusForBrand(brand.id).filter((item) => item.id !== sku.id);
  const accession = accessionNumber(sku.id);
  const tierNum = tierNumeral(sku.tier);

  return (
    <>
      <p className="crumb">
        <Link href="/">Gallery</Link> · <Link href={`/tiers#${sku.tier}`}>Tier {tierNum}</Link> ·{" "}
        <Link href={`/brand/${brand.id}`}>{brand.nameEn}</Link> · {sku.nameEn}
      </p>
      <div className="sku-layout">
        <div>
          <div className="sku-photo">
            {sku.image ? (
              <img
                src={sku.image}
                alt={`${sku.nameEn} (${sku.nameZh})`}
                style={sku.imagePosition ? { objectPosition: sku.imagePosition } : undefined}
              />
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
            Specimen {accession} · {brand.provinceEn} ({brand.provinceZh}) · Tier {tierNum} {tier?.zh}
          </p>
          <h1>
            {sku.nameEn} <span className="zh-inline">{sku.nameZh}</span>
          </h1>
          <p className="sub">
            {brand.nameEn} · {brand.distilleryZh}
          </p>
          {sku.chinaPrice ? <p className="price">{sku.chinaPrice}</p> : null}
          {sku.chinaNote ? <p className="caption">{sku.chinaNote}</p> : null}
          {printed ? (
            <p className="caption">
              The six-band price sheet prints {printed.yuan} for {printed.label}. That figure reflects the reference
              sheet rather than today’s spot quote.
            </p>
          ) : null}

          <div className="signal-box" role="note" aria-label="Table signal">
            <span className="signal-kicker">Table Signal · 局意</span>
            <p className="signal-quote">“{note.tableSignal}”</p>
          </div>

          <div className={`gb-card is-${note.gbKind} gb-inline`}>
            <div className="gb-head">
              <span className="gb-code">{note.gbCode}</span>
              <span className="gb-zh">{gbMeta.zh}</span>
            </div>
            <div className="gb-badge">{gbMeta.badge}</div>
            <p className="gb-explain">{gbMeta.explain}</p>
            <div className="shock-inline" aria-label={`Shock index ${note.shock} out of 5`}>
              <span className="shock-score">{note.shock}/5</span>
              <span className="shock-dots">
                {[1, 2, 3, 4, 5].map((level) => (
                  <span key={level} className={level <= note.shock ? "dot is-on" : "dot"} />
                ))}
              </span>
              <strong className="shock-title">
                {shockMeta.title} · {shockMeta.zh}
              </strong>
            </div>
            <p className="shock-truth">{note.flavorTruth}</p>
          </div>

          <dl className="spec">
            <dt>Aroma</dt>
            <dd>
              {aroma?.en} · <span className="zh-chip">{aroma?.zh}</span>
            </dd>
            <dt>ABV</dt>
            <dd>{sku.abv}</dd>
            <dt>Volume</dt>
            <dd>{sku.volume}</dd>
            <dt>Origin</dt>
            <dd>
              {brand.placeEn} · <span className="zh-chip">{brand.placeZh}</span>
            </dd>
            <dt>Tier</dt>
            <dd>
              <Link href={`/tiers#${sku.tier}`} className="tier-link">
                Tier {tierNum} · {tier?.en} <span className="zh-chip">{tier?.zh}</span> →
              </Link>
            </dd>
          </dl>
          <p>{sku.role}</p>
          <div className="actions">
            <TastedButton id={sku.id} />
            <CompareButton id={sku.id} />
            <SkuShareActions
              sku={sku}
              brand={brand}
              aromaEn={aroma?.en ?? "Baijiu"}
              aromaZh={aroma?.zh ?? "白酒"}
              tierNumeral={tierNum}
              tierZh={tier?.zh ?? ""}
              tierEn={tier?.en ?? ""}
              accession={accession}
              note={note}
            />
          </div>
          <p className="sku-links">
            <Link href={`/brand/${brand.id}`}>More from {brand.nameEn}</Link>
            {sku.specUrl ? (
              <>
                <span aria-hidden="true">·</span>
                <a href={sku.specUrl}>Distillery spec</a>
              </>
            ) : null}
            {brand.official ? (
              <>
                <span aria-hidden="true">·</span>
                <a href={brand.official.url}>{brand.official.label}</a>
              </>
            ) : null}
          </p>
        </div>
      </div>
      {siblings.length > 0 ? (
        <>
          <h2 className="section-label">
            Other bottles from {brand.nameEn} · {brand.nameZh}
          </h2>
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
