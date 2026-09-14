import { CITY_ORIGINS, SERVED_CITIES, UF_LABELS, type CityUf } from "@/lib/cities";

/** Remove acentos para agrupar por letra ("Água" fica em "A"). */
function initial(name: string) {
  return name.normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase();
}

const UF_ORDER: CityUf[] = ["GO", "DF", "SP", "RJ"];

/**
 * Versão estática das cidades atendidas, usada apenas na impressão / PDF.
 * Lista as duas origens completas, sem abas, busca ou filtros.
 */
export function CitiesPrintList() {
  return (
    <div className="hidden print:block">
      {CITY_ORIGINS.map((origin) => {
        const cities = SERVED_CITIES.filter((c) => c.origin === origin.id);
        const ufs = UF_ORDER.filter((u) => cities.some((c) => c.uf === u));
        const grouped = new Map<string, typeof cities>();
        for (const city of cities) {
          const letter = initial(city.name);
          grouped.set(letter, [...(grouped.get(letter) ?? []), city]);
        }
        const groups = [...grouped.entries()]
          .sort(([a], [b]) => a.localeCompare(b, "pt-BR"))
          .map(([letter, list]) => [letter, [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))] as const);
        return (
          <div key={origin.id} className="mb-10 break-before-page first:break-before-auto">
            <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-ink pb-3">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">{origin.label}</h3>
                <p className="text-sm text-ink-muted">
                  {origin.unit} · {ufs.map((u) => UF_LABELS[u]).join(" e ")}
                </p>
              </div>
              <p className="font-display text-2xl font-bold text-ink">
                {cities.length} <span className="text-sm font-semibold text-ink-muted">cidades</span>
              </p>
            </div>
            <div className="columns-3 gap-x-8">
              {groups.map(([letter, list]) => (
                <section key={letter} className="mb-4 break-inside-avoid">
                  <h4 className="mb-1 flex items-center gap-2 font-display text-xs font-bold tracking-[0.18em] text-brand-action uppercase">
                    {letter}
                    <span aria-hidden className="h-px flex-1 bg-line" />
                  </h4>
                  <ul>
                    {list.map((city) => (
                      <li
                        key={`${city.name}-${city.uf}`}
                        className="flex items-baseline justify-between gap-2 text-[13px] leading-snug text-ink-body"
                      >
                        <span>{city.name}</span>
                        <span className="shrink-0 text-[11px] text-ink-muted">{city.uf}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
