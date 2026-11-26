"use client";

import { useState } from "react";
import type { Brand, Sku } from "@/types";
import type { FieldNote } from "@/field-notes";
import { downloadSpecimenCard } from "@/lib/export-cards";

interface Props {
  sku: Sku;
  brand: Brand;
  aromaEn: string;
  aromaZh: string;
  tierNumeral: string;
  tierZh: string;
  tierEn: string;
  accession: string;
  note: FieldNote;
}

export function SkuShareActions(props: Props) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    setBusy(true);
    try {
      await downloadSpecimenCard(props);
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    const line = `${props.sku.nameEn} (${props.sku.nameZh}) — “${props.note.tableSignal}” [${props.note.gbCode} · ${props.sku.abv}]`;
    try {
      await navigator.clipboard.writeText(line);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  }

  return (
    <>
      <button type="button" className="btn" onClick={handleDownload} disabled={busy}>
        {busy ? "Rendering card..." : "Save Specimen Card (PNG)"}
      </button>
      <button type="button" className="btn" onClick={handleCopy}>
        {copied ? "Copied for X" : "Copy Table Signal"}
      </button>
    </>
  );
}
