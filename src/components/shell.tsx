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
  { href: "/", label: "藏品" },
  { href: "/tiers", label: "梯队" },
  { href: "/sheet", label: "价格带" },
  { href: "/brands", label: "品牌" },
  { href: "/aromas", label: "香型" },
  { href: "/shops", label: "何处买" },
];

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
    if (pathname !== "/") router.push("/");
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
            <span>中国白酒博物馆</span>
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
            placeholder="搜 飞天 / Fenjiu"
            onChange={(event) => setQuery(event.target.value)}
          />
          <kbd>/</kbd>
        </label>
      </header>
      <main id="main" className={compare.length ? "wrap has-compare" : "wrap"}>
        {children}
        <footer className="foot">
          <span>酒 · 白酒是蒸馏酒，常见四十到六十度。加拿大多数地方十九岁，美国二十一岁。</span>
          <Link href="/about">档案说明与图片来源</Link>
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
                <span className="nm">{sku.nameZh}</span>
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
            清空
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
      {compare.includes(id) ? "移出对照" : "放入对照"}
    </button>
  );
}
