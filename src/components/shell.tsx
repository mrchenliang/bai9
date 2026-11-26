"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { skuById } from "@/catalog";

const COMPARE_KEY = "baijiu-museum-compare";

interface MuseumState {
  query: string;
  setQuery: (value: string) => void;
  compare: string[];
  toggleCompare: (id: string) => void;
}

const MuseumContext = createContext<MuseumState | null>(null);

export function useMuseum(): MuseumState {
  const value = useContext(MuseumContext);
  if (!value) throw new Error("Museum state is missing");
  return value;
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

const NAV = [
  { href: "/", label: "Gallery" },
  { href: "/tiers", label: "Tier System", featured: true },
  { href: "/sheet", label: "Price Bands" },
  { href: "/banquets", label: "Banquets" },
  { href: "/medals", label: "Medals" },
  { href: "/provinces", label: "Provinces" },
  { href: "/brands", label: "Houses" },
  { href: "/aromas", label: "Aromas" },
];

const SEARCHABLE_PATHS = new Set(["/", "/tiers", "/brands", "/provinces"]);

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQueryState] = useState("");
  const [compare, setCompare] = useState<string[]>([]);

  useEffect(() => {
    setCompare(loadCompare());
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key === "/" && target?.tagName !== "INPUT" && target?.tagName !== "TEXTAREA") {
        event.preventDefault();
        document.getElementById("q")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function setQuery(value: string) {
    setQueryState(value);
    if (!SEARCHABLE_PATHS.has(pathname)) router.push("/");
  }

  function toggleCompare(id: string) {
    setCompare((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-3);
      localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <MuseumContext.Provider value={{ query, setQuery, compare, toggleCompare }}>
      <a className="skip" href="#main">
        Skip to gallery
      </a>
      <header className="top">
        <Link className="brand-lock" href="/">
          <span className="seal-chop" aria-hidden="true">
            酒
          </span>
          <span className="word">
            <b>Chinese Baijiu Museum</b>
            <span>PERMANENT ARCHIVE · 中国白酒博物馆</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Museum exhibitions">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.featured ? "nav-featured" : undefined}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
              {item.featured ? <span className="nav-badge">I–IV</span> : null}
            </Link>
          ))}
        </nav>
        <label className="search">
          <span className="visually-hidden">Search archive</span>
          <input
            id="q"
            value={query}
            placeholder="Search Moutai, Fenjiu, 酱香"
            onChange={(event) => setQuery(event.target.value)}
          />
          <kbd>/</kbd>
        </label>
      </header>
      <main id="main" className={compare.length ? "wrap has-compare" : "wrap"}>
        {children}
        <footer className="foot">
          <span>
            酒 · Chinese Baijiu Museum — Permanent Editorial Archive. Distilled grain spirit, typically 40%–60% ABV.
          </span>
          <span className="foot-links">
            <a
              className="by-x"
              href="https://x.com/mr_chenliang"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
              by @mr_chenliang
            </a>
            <Link href="/about">Curatorial notes &amp; archive credits</Link>
          </span>
        </footer>
      </main>
      {compare.length > 0 ? (
        <div className="compare">
          {compare.map((id) => {
            const sku = skuById(id);
            if (!sku) return null;
            return (
              <Link key={id} href={`/sku/${id}`}>
                {sku.image ? (
                  <img src={sku.image} alt="" style={{ objectPosition: sku.imagePosition }} />
                ) : (
                  <span className="mini">{sku.nameZh.slice(0, 1)}</span>
                )}
                <span className="nm">
                  {sku.nameEn} <em className="nm-zh">{sku.nameZh}</em>
                </span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(COMPARE_KEY);
              setCompare([]);
            }}
          >
            Clear
          </button>
        </div>
      ) : null}
    </MuseumContext.Provider>
  );
}

export function CompareButton({ id }: { id: string }) {
  const { compare, toggleCompare } = useMuseum();
  return (
    <button type="button" className="btn solid" onClick={() => toggleCompare(id)}>
      {compare.includes(id) ? "Remove from compare" : "Add to compare"}
    </button>
  );
}
