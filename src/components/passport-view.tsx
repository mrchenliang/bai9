"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { brandById, skuAroma, skus, tierRank, tiers } from "@/catalog";
import { useMuseum } from "@/components/shell";
import { fieldNoteFor } from "@/field-notes";
import { downloadPassportCard, renderPassportCardBlob } from "@/lib/export-cards";
import { buildPassportTweetText, computePassportSummary, encodeStampedParam } from "@/lib/passport";
import type { TierId } from "@/types";

interface PassportViewProps {
  sharedIds?: string[];
}

export function PassportView({ sharedIds = [] }: PassportViewProps) {
  const router = useRouter();
  const { tasted, toggleTasted, clearTasted, query } = useMuseum();
  const [tierFilter, setTierFilter] = useState<TierId | "all">("all");
  const [dismissedShared, setDismissedShared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [selectionPrompt, setSelectionPrompt] = useState<"share" | "download" | "copy" | null>(null);
  const [promptPulse, setPromptPulse] = useState(0);
  const stampSectionRef = useRef<HTMLDivElement | null>(null);

  const viewingShared = sharedIds.length > 0 && !dismissedShared;
  const activeIds = viewingShared ? sharedIds : tasted;
  const showSelectionPrompt = selectionPrompt !== null && activeIds.length === 0;

  const summary = useMemo(() => computePassportSummary(activeIds), [activeIds]);

  const visibleSkus = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...skus]
      .filter((sku) => {
        if (tierFilter !== "all" && sku.tier !== tierFilter) return false;
        if (!q) return true;
        const b = brandById(sku.brandId);
        return [sku.nameEn, sku.nameZh, b?.nameEn ?? "", b?.provinceEn ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => tierRank[a.tier] - tierRank[b.tier] || (a.rank ?? 50) - (b.rank ?? 50));
  }, [tierFilter, query]);

  function getCardOptions() {
    return {
      rankZh: summary.rank.zh,
      rankEn: summary.rank.en,
      diagnosis: summary.rank.diagnosis,
      tastedCount: summary.tastedCount,
      totalCount: summary.totalCount,
      maxAbv: summary.maxAbv,
      provinceCount: summary.provinceCount,
      avgShock: summary.avgShock,
      pureRatio: summary.pureRatio,
      estBillYuan: summary.estBillYuan,
      topBottles: summary.topBottles,
    };
  }

  function buildShareUrl(): string {
    const encoded = encodeStampedParam(activeIds);
    const origin =
      typeof window !== "undefined" && window.location.origin ? window.location.origin : "https://www.bai9.app";
    return encoded ? `${origin}/passport?s=${encodeURIComponent(encoded)}` : `${origin}/passport`;
  }

  function promptToSelect(action: "share" | "download" | "copy") {
    setShareStatus(null);
    setSelectionPrompt(action);
    setPromptPulse((n) => n + 1);
  }

  function scrollToBottles() {
    stampSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleShareOnX() {
    if (activeIds.length === 0) {
      promptToSelect("share");
      return;
    }
    setSelectionPrompt(null);
    const shareUrl = buildShareUrl();
    const tweetText = buildPassportTweetText(summary);
    const intentUrl = `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;

    // Open X composer synchronously on user gesture so popup blockers do not block it
    window.open(intentUrl, "_blank", "noopener,noreferrer");

    // In parallel, copy the high-res PNG card to clipboard when supported so the user can also paste it directly
    if (typeof navigator !== "undefined" && "clipboard" in navigator && typeof ClipboardItem !== "undefined") {
      try {
        const pngPromise = renderPassportCardBlob(getCardOptions()).then((blob) => {
          if (!blob) throw new Error("Failed to render PNG");
          return blob;
        });
        navigator.clipboard
          .write([new ClipboardItem({ "image/png": pngPromise })])
          .then(() => {
            setShareStatus(
              "Opened X with your tweet & live card link — Passport PNG also copied to clipboard (press ⌘V / Ctrl+V in X to attach directly).",
            );
          })
          .catch(() => {
            setShareStatus(
              "Opened X with your tweet & personalized Passport Card preview link — or download the PNG to attach directly.",
            );
          });
        return;
      } catch {
        // Fall through to link-card status message
      }
    }

    setShareStatus(
      "Opened X with your tweet & personalized Passport Card preview link — or download the PNG to attach directly.",
    );
  }

  async function handleExport() {
    if (activeIds.length === 0) {
      promptToSelect("download");
      return;
    }
    setSelectionPrompt(null);
    setBusy(true);
    try {
      await downloadPassportCard(getCardOptions());
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    if (activeIds.length === 0) {
      promptToSelect("copy");
      return;
    }
    setSelectionPrompt(null);
    const shareUrl = buildShareUrl();
    const text = `${buildPassportTweetText(summary)}\n\n${shareUrl}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore if clipboard blocked
    }
  }

  function handleSwitchToOwn() {
    setDismissedShared(true);
    setShareStatus(null);
    setSelectionPrompt(null);
    router.replace("/passport", { scroll: false });
  }

  function handleClear() {
    setSelectionPrompt(null);
    setShareStatus(null);
    clearTasted();
  }

  function handleToggleBottle(id: string) {
    if (selectionPrompt !== null) setSelectionPrompt(null);
    if (viewingShared) handleSwitchToOwn();
    toggleTasted(id);
  }

  return (
    <>
      <p className="kicker">Visitor Record · Drinking Passport · 中国白酒博物馆酒证</p>
      <h1>
        Drinking Passport <span className="zh-inline">喝过酒证</span>
      </h1>
      <p className="sub">
        Tap every bottle you have actually survived at a real table. The museum assigns your curatorial rank, calculates
        your pure-grain ratio and estimated dinner bill, and generates a shareable Passport Card for X.
      </p>

      {viewingShared ? (
        <div className="passport-shared-banner" role="status">
          <span>
            Viewing a shared Drinking Passport ({sharedIds.length}{" "}
            {sharedIds.length === 1 ? "specimen" : "specimens"} stamped).
          </span>
          <button type="button" className="btn solid" onClick={handleSwitchToOwn}>
            Stamp your own passport →
          </button>
        </div>
      ) : null}

      <section className="passport-dossier" aria-label="Your drinking passport summary">
        <div className="passport-head">
          <div>
            <span className="signal-kicker">Curatorial Rank · 酒桌称号</span>
            <h2 className="passport-rank">
              {summary.rank.en} <span className="zh-inline">{summary.rank.zh}</span>
            </h2>
            <p className="passport-diag">{summary.rank.diagnosis}</p>
          </div>
          <div className="passport-seal" aria-hidden="true">
            <b>{summary.tastedCount}</b>
            <span>OF {summary.totalCount}</span>
          </div>
        </div>

        <div className="passport-metrics">
          <div className="p-metric">
            <span>Specimens</span>
            <b>
              {summary.tastedCount} / {summary.totalCount}
            </b>
          </div>
          <div className="p-metric">
            <span>Max ABV Survived</span>
            <b>{summary.maxAbv > 0 ? `${summary.maxAbv}%` : "—"}</b>
          </div>
          <div className="p-metric">
            <span>Provinces</span>
            <b>{summary.provinceCount}</b>
          </div>
          <div className="p-metric">
            <span>Avg Shock Index</span>
            <b>{summary.avgShock} / 5</b>
          </div>
          <div className="p-metric">
            <span>Pure-Grain Ratio</span>
            <b>{summary.pureRatio}%</b>
          </div>
          <div className="p-metric">
            <span>Est. Table Bill</span>
            <b>¥{summary.estBillYuan.toLocaleString()}</b>
          </div>
        </div>

        <div className="actions">
          <button
            type="button"
            className="btn solid btn-x"
            onClick={handleShareOnX}
            aria-describedby={showSelectionPrompt ? "passport-select-prompt" : undefined}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              />
            </svg>
            Share on X
          </button>
          <button
            type="button"
            className="btn"
            onClick={handleExport}
            disabled={busy}
            aria-describedby={showSelectionPrompt ? "passport-select-prompt" : undefined}
          >
            {busy ? "Printing passport PNG..." : "Download Card (PNG)"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={handleCopy}
            aria-describedby={showSelectionPrompt ? "passport-select-prompt" : undefined}
          >
            {copied ? "Copied Tweet & Link" : "Copy Tweet & Link"}
          </button>
          {!viewingShared && tasted.length > 0 ? (
            <button type="button" className="btn" onClick={handleClear}>
              Clear all stamps
            </button>
          ) : null}
        </div>
        {showSelectionPrompt ? (
          <div key={promptPulse} id="passport-select-prompt" className="passport-prompt" role="alert">
            <span className="passport-prompt-chop" aria-hidden="true">
              选
            </span>
            <p className="passport-prompt-copy">
              <strong>Select at least one bottle first.</strong>{" "}
              {selectionPrompt === "download"
                ? "Tap any bottle you’ve tried below to stamp 已饮 before downloading your Passport Card."
                : selectionPrompt === "share"
                  ? "Tap any bottle you’ve tried below to stamp 已饮 before sharing your Passport on X."
                  : "Tap any bottle you’ve tried below to stamp 已饮 before copying your Passport link."}
            </p>
            <button type="button" className="passport-prompt-jump" onClick={scrollToBottles}>
              Select bottles ↓
            </button>
          </div>
        ) : null}
        {shareStatus ? <p className="share-hint">{shareStatus}</p> : null}
      </section>

      <div ref={stampSectionRef} className="filters passport-filters">
        <button
          type="button"
          className="pill"
          aria-pressed={tierFilter === "all"}
          onClick={() => setTierFilter("all")}
        >
          All tiers
        </button>
        {tiers.map((t) => (
          <button
            key={t.id}
            type="button"
            className="pill"
            aria-pressed={tierFilter === t.id}
            onClick={() => setTierFilter(tierFilter === t.id ? "all" : t.id)}
          >
            {t.en}
          </button>
        ))}
        <span className="grow" />
        <span className={showSelectionPrompt ? "count-inline is-attention" : "count-inline"}>
          {viewingShared ? "Tap any bottle to start your own passport" : "Tap any bottle to stamp 已饮"}
        </span>
      </div>

      <div className="stamp-grid">
        {visibleSkus.map((sku) => {
          const isStamped = activeIds.includes(sku.id);
          const brand = brandById(sku.brandId);
          const note = fieldNoteFor(sku, skuAroma(sku)?.id);
          return (
            <div key={sku.id} className={isStamped ? "stamp-tile is-stamped" : "stamp-tile"}>
              <button
                type="button"
                className="stamp-btn"
                aria-pressed={isStamped}
                onClick={() => handleToggleBottle(sku.id)}
              >
                <div className="stamp-thumb">
                  {sku.image ? <img src={sku.image} alt={`${sku.nameEn} (${sku.nameZh})`} /> : null}
                  {isStamped ? <span className="tasted-chop">已饮</span> : null}
                </div>
                <div className="stamp-body">
                  <strong>{sku.nameEn}</strong>
                  <span className="stamp-zh">{sku.nameZh}</span>
                  <span className="stamp-meta">
                    {brand?.provinceEn} · {sku.abv} · {note.gbCode}
                  </span>
                </div>
              </button>
              <Link className="stamp-dossier-link" href={`/sku/${sku.id}`} title="Inspect full dossier">
                Dossier →
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
