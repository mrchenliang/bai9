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
  { href: "/", label: "Collection" },
  { href: "/tiers", label: "Tiers" },
  { href: "/sheet", label: "Price Bands" },
  { href: "/banquets", label: "Banquets" },
  { href: "/medals", label: "Medals" },
  { href: "/provinces", label: "Provinces" },
  { href: "/brands", label: "Houses" },
  { href: "/aromas", label: "Aromas" },
];

const SEARCHABLE_PATHS = new Set(["/", "/brands", "/provinces"]);

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
        Skip to bottles
      </a>
      <header className="top">
        <Link className="brand-lock" href="/">
          <span className="word">
            <b className="name-mark">酒</b>
            <span>Chinese Baijiu Museum</span>
          </span>
        </Link>
        <nav className="nav">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <label className="search">
          <span className="visually-hidden">Search</span>
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
            酒 · Baijiu is distilled grain spirit, typically 40%–60% ABV. Legal drinking age is 19 in most of Canada and
            21 in the United States.
          </span>
          <Link href="/about">Archive notes &amp; image credits</Link>
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
