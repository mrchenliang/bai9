"use client";

import type { Brand, Sku } from "@/types";
import type { FieldNote } from "@/field-notes";
import { GB_KIND_META, SHOCK_LABELS } from "@/field-notes";

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = 4,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}

function triggerDownload(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function drawChop(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, char = "酒") {
  ctx.fillStyle = "#c81e1e";
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 5, y + 5, size - 10, size - 10);
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${Math.round(size * 0.56)}px "Noto Serif SC", Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, x + size / 2, y + size / 2 + 2);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

function drawFooter(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const y = height - 64;
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(64, y - 24);
  ctx.lineTo(width - 64, y - 24);
  ctx.stroke();

  ctx.fillStyle = "#767676";
  ctx.font = `500 20px "JetBrains Mono", monospace`;
  ctx.fillText("CHINESE BAIJIU MUSEUM · 中国白酒博物馆", 64, y + 10);
  ctx.textAlign = "right";
  ctx.fillText("X · by @mr_chenliang", width - 64, y + 10);
  ctx.textAlign = "left";
}

export async function downloadSpecimenCard(opts: {
  sku: Sku;
  brand: Brand;
  aromaEn: string;
  aromaZh: string;
  tierNumeral: string;
  tierZh: string;
  tierEn: string;
  accession: string;
  note: FieldNote;
}) {
  const { sku, brand, aromaEn, aromaZh, tierNumeral, tierZh, tierEn, accession, note } = opts;
  const W = 1200;
  const H = 1520;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, W - 56, H - 56);

  // Header
  drawChop(ctx, 64, 60, 56, "酒");
  ctx.fillStyle = "#111111";
  ctx.font = `700 24px "DM Sans", -apple-system, sans-serif`;
  ctx.fillText("CHINESE BAIJIU MUSEUM", 138, 86);
  ctx.fillStyle = "#767676";
  ctx.font = `500 18px "JetBrains Mono", monospace`;
  ctx.fillText(`SPECIMEN DOSSIER · ${accession} · TIER ${tierNumeral} ${tierZh}`, 138, 114);

  // Studio frame
  const boxX = 64;
  const boxY = 148;
  const boxW = W - 128;
  const boxH = 640;
  ctx.fillStyle = "#f6f6f8";
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  if (sku.image) {
    const img = await loadImage(sku.image);
    if (img) {
      const scale = Math.min((boxW - 40) / img.width, (boxH - 40) / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, boxX + (boxW - dw) / 2, boxY + (boxH - dh) / 2, dw, dh);
    }
  }

  // Tier pill top-left inside frame
  ctx.fillStyle = sku.tier === "guoyan" ? "#c81e1e" : "#111111";
  ctx.fillRect(boxX + 24, boxY + 24, 152, 42);
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 19px "JetBrains Mono", monospace`;
  ctx.fillText(`${tierNumeral} · ${tierZh}`, boxX + 42, boxY + 51);

  // GB badge top-right inside frame
  const gbText = `${note.gbCode} · ${GB_KIND_META[note.gbKind].zh}`;
  ctx.font = `600 18px "JetBrains Mono", monospace`;
  const gbW = ctx.measureText(gbText).width + 36;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(boxX + boxW - gbW - 24, boxY + 24, gbW, 42);
  ctx.strokeStyle = note.gbKind === "pure" ? "#111111" : "#b45309";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(boxX + boxW - gbW - 24, boxY + 24, gbW, 42);
  ctx.fillStyle = note.gbKind === "pure" ? "#111111" : "#92400e";
  ctx.fillText(gbText, boxX + boxW - gbW - 6, boxY + 51);

  // Title block
  let y = 852;
  ctx.fillStyle = "#111111";
  ctx.font = `700 54px "DM Sans", -apple-system, sans-serif`;
  ctx.fillText(sku.nameEn, 64, y);

  ctx.fillStyle = "#525252";
  ctx.font = `600 36px "Noto Serif SC", serif`;
  ctx.fillText(sku.nameZh, 64, y + 48);

  if (sku.chinaPrice) {
    ctx.textAlign = "right";
    ctx.fillStyle = "#c81e1e";
    ctx.font = `700 40px "JetBrains Mono", monospace`;
    ctx.fillText(sku.chinaPrice, W - 64, y);
    ctx.fillStyle = "#767676";
    ctx.font = `500 18px "JetBrains Mono", monospace`;
    ctx.fillText(`${sku.abv} · ${sku.volume}`, W - 64, y + 36);
    ctx.textAlign = "left";
  }

  // Table Signal callout
  y = 948;
  ctx.fillStyle = "#faf8f5";
  ctx.fillRect(64, y, W - 128, 174);
  ctx.fillStyle = "#c81e1e";
  ctx.fillRect(64, y, 6, 174);
  ctx.fillStyle = "#c81e1e";
  ctx.font = `600 17px "JetBrains Mono", monospace`;
  ctx.fillText("TABLE SIGNAL · 局意", 92, y + 36);

  ctx.fillStyle = "#111111";
  ctx.font = `600 30px "DM Sans", -apple-system, sans-serif`;
  const signalLines = wrapText(ctx, `“${note.tableSignal}”`, W - 200, 3);
  signalLines.forEach((line, idx) => {
    ctx.fillText(line, 92, y + 84 + idx * 40);
  });

  // Specs strip
  y = 1156;
  const cols = [
    { label: "PROVINCE", value: `${brand.provinceEn} · ${brand.provinceZh}` },
    { label: "AROMA STANDARD", value: `${aromaEn.replace(" aroma", "")} · ${aromaZh}` },
    { label: "TIER", value: `Tier ${tierNumeral} · ${tierEn}` },
    { label: "FIRST-TIMER SHOCK", value: `${"●".repeat(note.shock)}${"○".repeat(5 - note.shock)} ${note.shock}/5 (${SHOCK_LABELS[note.shock].title})` },
  ];
  const colW = (W - 128 - 24) / 2;
  cols.forEach((col, i) => {
    const cx = 64 + (i % 2) * (colW + 24);
    const cy = y + Math.floor(i / 2) * 86;
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx, cy, colW, 72);
    ctx.fillStyle = "#767676";
    ctx.font = `500 15px "JetBrains Mono", monospace`;
    ctx.fillText(col.label, cx + 18, cy + 26);
    ctx.fillStyle = "#111111";
    ctx.font = `600 22px "DM Sans", -apple-system, sans-serif`;
    ctx.fillText(col.value, cx + 18, cy + 56);
  });

  // Honest flavor truth
  y = 1356;
  ctx.fillStyle = "#767676";
  ctx.font = `600 16px "JetBrains Mono", monospace`;
  ctx.fillText("PALATE TRUTH", 64, y);
  ctx.fillStyle = "#262626";
  ctx.font = `400 23px "DM Sans", -apple-system, sans-serif`;
  const truthLines = wrapText(ctx, note.flavorTruth, W - 128, 2);
  truthLines.forEach((line, idx) => {
    ctx.fillText(line, 64, y + 34 + idx * 32);
  });

  drawFooter(ctx, W, H);
  triggerDownload(canvas, `bai9-${sku.id}-specimen.png`);
}

export async function downloadPassportCard(opts: {
  rankZh: string;
  rankEn: string;
  diagnosis: string;
  tastedCount: number;
  totalCount: number;
  maxAbv: number;
  provinceCount: number;
  avgShock: string;
  pureRatio: number;
  estBillYuan: number;
  topBottles: { nameEn: string; nameZh: string; image?: string }[];
}) {
  const W = 1200;
  const H = 1520;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#faf8f5";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, W - 64, H - 64);
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1;
  ctx.strokeRect(42, 42, W - 84, H - 84);

  drawChop(ctx, 76, 76, 72, "酒");
  ctx.fillStyle = "#767676";
  ctx.font = `600 18px "JetBrains Mono", monospace`;
  ctx.fillText("OFFICIAL DRINKING PASSPORT · 中国白酒博物馆酒证", 170, 102);
  ctx.fillStyle = "#111111";
  ctx.font = `700 32px "DM Sans", -apple-system, sans-serif`;
  ctx.fillText("BAIJIU SURVIVAL RECORD", 170, 140);

  // Stamp seal top-right
  ctx.save();
  ctx.translate(W - 165, 130);
  ctx.rotate(-0.12);
  ctx.strokeStyle = "#c81e1e";
  ctx.lineWidth = 4;
  ctx.strokeRect(-72, -32, 144, 64);
  ctx.fillStyle = "#c81e1e";
  ctx.font = `700 22px "JetBrains Mono", monospace`;
  ctx.textAlign = "center";
  ctx.fillText("VERIFIED", 0, -2);
  ctx.font = `600 18px "Noto Serif SC", serif`;
  ctx.fillText("已鉴酒证", 0, 22);
  ctx.restore();
  ctx.textAlign = "left";

  // Rank box
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(76, 188, W - 152, 240);
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(76, 188, W - 152, 240);
  ctx.fillStyle = "#c81e1e";
  ctx.fillRect(76, 188, 8, 240);

  ctx.fillStyle = "#c81e1e";
  ctx.font = `600 18px "JetBrains Mono", monospace`;
  ctx.fillText("CURATORIAL RANK · 酒桌称号", 112, 232);

  ctx.fillStyle = "#111111";
  ctx.font = `700 56px "DM Sans", -apple-system, sans-serif`;
  ctx.fillText(opts.rankEn, 112, 298);

  ctx.fillStyle = "#c81e1e";
  ctx.font = `700 36px "Noto Serif SC", serif`;
  ctx.fillText(opts.rankZh, 112, 348);

  ctx.fillStyle = "#404040";
  ctx.font = `400 24px "DM Sans", -apple-system, sans-serif`;
  const diagLines = wrapText(ctx, opts.diagnosis, W - 220, 2);
  diagLines.forEach((line, i) => ctx.fillText(line, 112, 390 + i * 32));

  // 6 Metrics grid
  const stats = [
    { label: "SPECIMENS TASTED", value: `${opts.tastedCount} / ${opts.totalCount}` },
    { label: "MAX ABV SURVIVED", value: opts.maxAbv > 0 ? `${opts.maxAbv}% vol` : "—" },
    { label: "PROVINCES COVERED", value: `${opts.provinceCount}` },
    { label: "AVG SHOCK INDEX", value: `${opts.avgShock} / 5` },
    { label: "PURE-GRAIN RATIO", value: `${opts.pureRatio}%` },
    { label: "EST. TABLE BILL", value: `¥${opts.estBillYuan.toLocaleString()}` },
  ];

  const startY = 468;
  const cardW = (W - 152 - 32) / 3;
  stats.forEach((s, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 76 + col * (cardW + 16);
    const y = startY + row * 126;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, cardW, 110);
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.strokeRect(x, y, cardW, 110);
    ctx.fillStyle = "#767676";
    ctx.font = `600 15px "JetBrains Mono", monospace`;
    ctx.fillText(s.label, x + 20, y + 34);
    ctx.fillStyle = "#111111";
    ctx.font = `700 38px "JetBrains Mono", monospace`;
    ctx.fillText(s.value, x + 20, y + 84);
  });

  // Top stamped specimens showcase
  ctx.fillStyle = "#767676";
  ctx.font = `600 17px "JetBrains Mono", monospace`;
  ctx.fillText("STAMPED SPECIMENS ON RECORD · 已饮藏品", 76, 766);

  const bottles = opts.topBottles.slice(0, 6);
  const bW = (W - 152 - 40) / 3;
  const bH = 266;
  for (let i = 0; i < bottles.length; i++) {
    const b = bottles[i];
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 76 + col * (bW + 20);
    const y = 792 + row * (bH + 20);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, bW, bH);
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.strokeRect(x, y, bW, bH);

    ctx.fillStyle = "#f6f6f8";
    ctx.fillRect(x + 12, y + 12, bW - 24, 182);
    if (b.image) {
      const img = await loadImage(b.image);
      if (img) {
        const scale = Math.min((bW - 36) / img.width, 168 / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, x + 12 + (bW - 24 - dw) / 2, y + 12 + (182 - dh) / 2, dw, dh);
      }
    }
    ctx.fillStyle = "#111111";
    ctx.font = `600 20px "DM Sans", -apple-system, sans-serif`;
    ctx.fillText(b.nameEn.slice(0, 22), x + 14, y + 222);
    ctx.fillStyle = "#767676";
    ctx.font = `500 17px "Noto Serif SC", serif`;
    ctx.fillText(b.nameZh, x + 14, y + 248);
  }

  drawFooter(ctx, W, H);
  triggerDownload(canvas, `bai9-drinking-passport.png`);
}

export async function downloadTablePrescriptionCard(opts: {
  occasion: string;
  region: string;
  budget: string;
  primarySku: Sku;
  primaryPrice: string;
  primaryNote: FieldNote;
  insiderName: string;
  whatGoesWrong: string;
  unspokenRule: string;
}) {
  const W = 1200;
  const H = 1440;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, W - 56, H - 56);

  drawChop(ctx, 64, 60, 56, "局");
  ctx.fillStyle = "#c81e1e";
  ctx.font = `600 18px "JetBrains Mono", monospace`;
  ctx.fillText("BANQUET SURVIVAL PRESCRIPTION · 局酒处方", 140, 84);
  ctx.fillStyle = "#111111";
  ctx.font = `700 30px "DM Sans", -apple-system, sans-serif`;
  ctx.fillText(`${opts.occasion} · ${opts.region}`, 140, 118);

  // Bottle box
  ctx.fillStyle = "#f6f6f8";
  ctx.fillRect(64, 156, 420, 420);
  if (opts.primarySku.image) {
    const img = await loadImage(opts.primarySku.image);
    if (img) {
      const scale = Math.min(380 / img.width, 380 / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, 64 + (420 - dw) / 2, 156 + (420 - dh) / 2, dw, dh);
    }
  }

  // Right-side summary
  const rx = 516;
  ctx.fillStyle = "#767676";
  ctx.font = `600 17px "JetBrains Mono", monospace`;
  ctx.fillText(`BRING THIS BOTTLE · BUDGET: ${opts.budget.toUpperCase()}`, rx, 194);

  ctx.fillStyle = "#111111";
  ctx.font = `700 46px "DM Sans", -apple-system, sans-serif`;
  const titleLines = wrapText(ctx, opts.primarySku.nameEn, W - rx - 64, 2);
  titleLines.forEach((line, i) => ctx.fillText(line, rx, 250 + i * 52));

  ctx.fillStyle = "#525252";
  ctx.font = `600 32px "Noto Serif SC", serif`;
  ctx.fillText(opts.primarySku.nameZh, rx, 250 + titleLines.length * 52 + 10);

  ctx.fillStyle = "#c81e1e";
  ctx.font = `700 34px "JetBrains Mono", monospace`;
  ctx.fillText(`${opts.primaryPrice}  ·  ${opts.primarySku.abv}`, rx, 400);

  ctx.fillStyle = "#111111";
  ctx.font = `500 22px "JetBrains Mono", monospace`;
  ctx.fillText(`${opts.primaryNote.gbCode} (${GB_KIND_META[opts.primaryNote.gbKind].zh})`, rx, 444);

  ctx.fillStyle = "#333333";
  ctx.font = `500 24px "DM Sans", -apple-system, sans-serif`;
  const sigLines = wrapText(ctx, `“${opts.primaryNote.tableSignal}”`, W - rx - 64, 3);
  sigLines.forEach((l, i) => ctx.fillText(l, rx, 496 + i * 34));

  // Risk & Rule cards
  const blocks = [
    { kicker: "INSIDER ALTERNATIVE · 懂行备选", body: opts.insiderName, accent: "#111111" },
    { kicker: "WHAT GOES WRONG IF YOU MISS · 踩雷后果", body: opts.whatGoesWrong, accent: "#c81e1e" },
    { kicker: "UNSPOKEN REGIONAL RULE · 席间潜规则", body: opts.unspokenRule, accent: "#b45309" },
  ];

  let by = 620;
  for (const b of blocks) {
    ctx.fillStyle = "#faf8f5";
    ctx.fillRect(64, by, W - 128, 210);
    ctx.fillStyle = b.accent;
    ctx.fillRect(64, by, 7, 210);
    ctx.font = `600 17px "JetBrains Mono", monospace`;
    ctx.fillText(b.kicker, 94, by + 40);
    ctx.fillStyle = "#111111";
    ctx.font = `500 28px "DM Sans", -apple-system, sans-serif`;
    const lines = wrapText(ctx, b.body, W - 200, 4);
    lines.forEach((line, i) => ctx.fillText(line, 94, by + 88 + i * 38));
    by += 234;
  }

  drawFooter(ctx, W, H);
  triggerDownload(canvas, `bai9-table-prescription.png`);
}

export async function downloadTierListCard(
  rows: { code: string; zh: string; en: string; accent: string; items: Sku[] }[],
) {
  const W = 1400;
  const headerH = 144;
  const footerH = 96;
  const tileSize = 112;
  const colsPerRow = 9;

  const rowHeights = rows.map((r) => {
    const lines = Math.max(1, Math.ceil(r.items.length / colsPerRow));
    return Math.max(144, lines * (tileSize + 28) + 28);
  });
  const H = headerH + rowHeights.reduce((a, b) => a + b, 0) + footerH + 40;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  drawChop(ctx, 56, 44, 56, "酒");
  ctx.fillStyle = "#111111";
  ctx.font = `700 34px "DM Sans", -apple-system, sans-serif`;
  ctx.fillText("MY BAIJIU TIER LIST · 自排白酒梯队", 130, 76);
  ctx.fillStyle = "#767676";
  ctx.font = `500 18px "JetBrains Mono", monospace`;
  ctx.fillText("CHINESE BAIJIU MUSEUM · CURATED PERSONAL RANKING", 130, 106);

  let y = headerH;
  const labelW = 216;
  for (let rIdx = 0; rIdx < rows.length; rIdx++) {
    const row = rows[rIdx];
    const rh = rowHeights[rIdx];

    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(56, y, W - 112, rh);

    // Left stele
    ctx.fillStyle = "#faf8f5";
    ctx.fillRect(56, y, labelW, rh);
    ctx.fillStyle = row.accent;
    ctx.fillRect(56, y, 7, rh);
    ctx.font = `700 40px "JetBrains Mono", monospace`;
    ctx.fillText(row.code, 80, y + 54);
    ctx.fillStyle = "#111111";
    ctx.font = `700 24px "Noto Serif SC", serif`;
    ctx.fillText(row.zh, 80, y + 90);
    ctx.fillStyle = "#767676";
    ctx.font = `500 15px "JetBrains Mono", monospace`;
    ctx.fillText(row.en.toUpperCase(), 80, y + 116);

    // Bottle tiles
    const startX = 56 + labelW + 18;
    for (let i = 0; i < row.items.length; i++) {
      const sku = row.items[i];
      const col = i % colsPerRow;
      const line = Math.floor(i / colsPerRow);
      const tx = startX + col * (tileSize + 10);
      const ty = y + 14 + line * (tileSize + 28);

      ctx.fillStyle = "#f6f6f8";
      ctx.fillRect(tx, ty, tileSize, tileSize);
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.strokeRect(tx, ty, tileSize, tileSize);
      if (sku.image) {
        const img = await loadImage(sku.image);
        if (img) {
          const s = Math.min((tileSize - 8) / img.width, (tileSize - 8) / img.height);
          const dw = img.width * s;
          const dh = img.height * s;
          ctx.drawImage(img, tx + (tileSize - dw) / 2, ty + (tileSize - dh) / 2, dw, dh);
        }
      }
      ctx.fillStyle = "#262626";
      ctx.font = `600 12px "DM Sans", -apple-system, sans-serif`;
      ctx.fillText(sku.nameEn.slice(0, 14), tx + 2, ty + tileSize + 16);
    }

    y += rh;
  }

  drawFooter(ctx, W, H);
  triggerDownload(canvas, `bai9-my-tier-list.png`);
}
