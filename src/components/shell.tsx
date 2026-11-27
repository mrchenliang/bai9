"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { skuById } from "@/catalog";

const COMPARE_KEY = "baijiu-museum-compare";
const TASTED_KEY = "baijiu-museum-tasted";

interface MuseumState {
  query: string;
  setQuery: (value: string) => void;
  compare: string[];
  toggleCompare: (id: string) => void;
  tasted: string[];
  toggleTasted: (id: string) => void;
  clearTasted: () => void;
}

const MuseumContext = createContext<MuseumState | null>(null);

export function useMuseum(): MuseumState {
  const value = useContext(MuseumContext);
  if (!value) throw new Error("Museum state is missing");
  return value;
}

function loadList(key: string, max?: number): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    const clean = parsed.filter((item): item is string => typeof item === "string");
    return max ? clean.slice(0, max) : clean;
  } catch {
    return [];
  }
}

const PRIMARY_NAV = [
  { href: "/", label: "Gallery" },
  { href: "/tiers", label: "Tiers", featured: true },
  { href: "/table", label: "Guide" },
  { href: "/passport", label: "Passport", isPassport: true },
];

const MORE_NAV = [
  { href: "/sheet", label: "Price Bands" },
  { href: "/banquets", label: "Gift Guide" },
  { href: "/provinces", label: "Provinces" },
  { href: "/brands", label: "Houses" },
  { href: "/aromas", label: "Aromas" },
  { href: "/about", label: "About Baijiu" },
];

const SEARCHABLE_PATHS = new Set(["/", "/tiers", "/brands", "/provinces", "/passport", "/aromas"]);

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQueryState] = useState("");
  const [compare, setCompare] = useState<string[]>([]);
  const [tasted, setTasted] = useState<string[]>([]);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setCompare(loadList(COMPARE_KEY, 3));
    setTasted(loadList(TASTED_KEY));
  }, []);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    function onPointerDown(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest(".nav-more")) return;
      setMoreOpen(false);
    }
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [moreOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key === "/" && target?.tagName !== "INPUT" && target?.tagName !== "TEXTAREA") {
        event.preventDefault();
        document.getElementById("q")?.focus();
      }
      if (event.key === "Escape") setMoreOpen(false);
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

  function toggleTasted(id: string) {
    setTasted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem(TASTED_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clearTasted() {
    localStorage.removeItem(TASTED_KEY);
    setTasted([]);
  }

  const moreActive = MORE_NAV.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <MuseumContext.Provider
      value={{ query, setQuery, compare, toggleCompare, tasted, toggleTasted, clearTasted }}
    >
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
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.featured ? "nav-featured" : undefined}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
              {item.featured ? <span className="nav-badge">I–IV</span> : null}
              {item.isPassport && tasted.length > 0 ? (
                <span className="nav-count">{tasted.length}</span>
              ) : null}
            </Link>
          ))}
          <div className="nav-more">
            <button
              type="button"
              className={moreActive || moreOpen ? "nav-more-btn is-active" : "nav-more-btn"}
              aria-expanded={moreOpen}
              aria-controls="nav-more-menu"
              onClick={() => setMoreOpen((open) => !open)}
            >
              More
            </button>
            {moreOpen ? (
              <div id="nav-more-menu" className="nav-more-menu" role="menu">
                {MORE_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
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
    <button type="button" className="btn" onClick={() => toggleCompare(id)}>
      {compare.includes(id) ? "Remove from compare" : "Add to compare"}
    </button>
  );
}

export function TastedButton({ id }: { id: string }) {
  const { tasted, toggleTasted } = useMuseum();
  const isTasted = tasted.includes(id);
  return (
    <button
      type="button"
      className={isTasted ? "btn stamp-active" : "btn solid"}
      onClick={() => toggleTasted(id)}
    >
      {isTasted ? "已饮 · Stamped in Passport" : "喝过 · Stamp as Tasted"}
    </button>
  );
}

export function TastedStamp({ id }: { id: string }) {
  const { tasted } = useMuseum();
  if (!tasted.includes(id)) return null;
  return (
    <span className="tasted-chop" title="Stamped in your Drinking Passport">
      已饮
    </span>
  );
}
