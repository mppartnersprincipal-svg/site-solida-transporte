"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CITY_ORIGINS,
  SERVED_CITIES,
  UF_LABELS,
  type CityOrigin,
  type CityUf,
} from "@/lib/cities";

/** Remove acentos para a busca ("goiania" encontra "Goiânia"). */
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

const UF_ORDER: CityUf[] = ["GO", "DF", "SP", "RJ"];

/**
 * Explorador das 365 cidades atendidas — substitui os dois PDFs de
 * "Cidades atendidas" (39 páginas). Abas por origem, busca sem acento,
 * filtro por UF e lista agrupada por letra inicial.
 */
export function CitiesExplorer() {
  const [origin, setOrigin] = useState<CityOrigin>("sao-paulo");
  const [uf, setUf] = useState<CityUf | "all">("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const isSearching = normalize(deferredQuery).length > 0;

  // Quando há busca, procura em TODAS as origens (o visitante não sabe de onde parte).
  const results = useMemo(() => {
    const q = normalize(deferredQuery);
    return SERVED_CITIES.filter((city) => {
      if (!q && city.origin !== origin) return false;
      if (uf !== "all" && city.uf !== uf) return false;
      if (q && !normalize(city.name).includes(q)) return false;
      return true;
    });
  }, [origin, uf, deferredQuery]);

  const ufsForOrigin = useMemo(() => {
    const pool = isSearching ? SERVED_CITIES : SERVED_CITIES.filter((c) => c.origin === origin);
    return UF_ORDER.filter((u) => pool.some((c) => c.uf === u)).map((u) => ({
      id: u,
      count: pool.filter((c) => c.uf === u).length,
    }));
  }, [origin, isSearching]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof results>();
    for (const city of results) {
      const letter = normalize(city.name).charAt(0).toUpperCase();
      const list = map.get(letter) ?? [];
      list.push(city);
      map.set(letter, list);
    }
    return [...map.entries()];
  }, [results]);

  const originCounts = useMemo(
    () =>
      Object.fromEntries(
        CITY_ORIGINS.map((o) => [o.id, SERVED_CITIES.filter((c) => c.origin === o.id).length])
      ) as Record<CityOrigin, number>,
    []
  );

  function selectOrigin(next: CityOrigin) {
    setOrigin(next);
    setUf("all");
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      {/* Abas por origem */}
      <div role="tablist" aria-label="Origem da carga" className="grid gap-2 sm:grid-cols-2">
        {CITY_ORIGINS.map((o) => {
          const active = !isSearching && origin === o.id;
          return (
            <button
              key={o.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => selectOrigin(o.id)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors cursor-pointer",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-action",
                active
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-surface-alt text-ink hover:border-ink/40"
              )}
            >
              <span>
                <span className="block text-sm font-semibold">{o.label}</span>
                <span className={cn("block text-xs", active ? "text-white/70" : "text-ink-muted")}>
                  {o.unit}
                </span>
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 font-display text-sm font-bold",
                  active ? "bg-white/15 text-white" : "bg-white text-ink"
                )}
              >
                {originCounts[o.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Busca + filtro por UF */}
      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Buscar cidade</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-muted"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cidade (ex.: Anápolis, Campinas, Niterói)"
            autoComplete="off"
            className="w-full rounded-full border border-line bg-surface-alt py-3 pr-11 pl-11 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:bg-white focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpar busca"
              className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted hover:bg-line hover:text-ink cursor-pointer"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </label>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
          <FilterChip active={uf === "all"} onClick={() => setUf("all")}>
            Todos
          </FilterChip>
          {ufsForOrigin.map((u) => (
            <FilterChip key={u.id} active={uf === u.id} onClick={() => setUf(u.id)}>
              {u.id}
              <span className="ml-1 opacity-60">{u.count}</span>
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Resumo */}
      <p className="mt-5 text-sm text-ink-muted" aria-live="polite">
        {isSearching ? (
          <>
            <strong className="text-ink">{results.length}</strong>{" "}
            {results.length === 1 ? "cidade encontrada" : "cidades encontradas"} para{" "}
            <em>“{deferredQuery.trim()}”</em>
          </>
        ) : (
          <>
            <strong className="text-ink">{results.length}</strong>{" "}
            {results.length === 1 ? "cidade atendida" : "cidades atendidas"}{" "}
            {CITY_ORIGINS.find((o) => o.id === origin)?.label.toLowerCase()}
            {uf !== "all" ? ` em ${UF_LABELS[uf]}` : ""}
          </>
        )}
      </p>

      {/* Lista */}
      {results.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
          <MapPin className="mx-auto size-8 text-ink-muted" aria-hidden />
          <p className="mt-3 font-semibold text-ink">Não encontramos essa cidade na lista.</p>
          <p className="mt-1 text-sm text-ink-muted">
            Confira a grafia ou fale com o comercial: algumas cidades do interior são atendidas sob consulta.
          </p>
        </div>
      ) : (
        <div className="mt-6 columns-1 gap-x-8 sm:columns-2 lg:columns-3 xl:columns-4">
          {grouped.map(([letter, cities]) => (
            <section key={letter} className="mb-5 break-inside-avoid">
              <h3 className="mb-1.5 flex items-center gap-2 font-display text-xs font-bold tracking-[0.18em] text-brand-action uppercase">
                {letter}
                <span aria-hidden className="h-px flex-1 bg-line" />
              </h3>
              <ul className="space-y-0.5">
                {cities.map((city) => (
                  <li
                    key={`${city.origin}-${city.name}-${city.uf}`}
                    className="flex items-baseline justify-between gap-2 text-sm text-ink-body"
                  >
                    <span>{city.name}</span>
                    <span className="shrink-0 text-xs text-ink-muted">
                      {city.uf}
                      {isSearching ? (
                        <span className="ml-1.5 text-ink-muted/70">
                          · de {CITY_ORIGINS.find((o) => o.id === city.origin)?.short}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-action",
        active
          ? "border-brand-action bg-brand-action text-white"
          : "border-line bg-white text-ink hover:border-ink/40"
      )}
    >
      {children}
    </button>
  );
}
