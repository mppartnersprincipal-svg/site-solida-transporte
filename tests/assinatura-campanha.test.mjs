import assert from "node:assert/strict";
import { test } from "node:test";
import { campanhaDoMes } from "../lib/assinatura-campanha.ts";

test("cada mês de campanha serve o banner certo", () => {
  assert.equal(campanhaDoMes(new Date("2026-09-15T12:00:00-03:00")).slug, "setembro-amarelo");
  assert.equal(campanhaDoMes(new Date("2026-10-15T12:00:00-03:00")).slug, "outubro-rosa");
  assert.equal(campanhaDoMes(new Date("2026-11-15T12:00:00-03:00")).slug, "novembro-azul");
});

test("meses sem campanha caem no institucional", () => {
  for (const d of ["2026-12-10", "2027-01-10", "2027-08-10"]) {
    const c = campanhaDoMes(new Date(`${d}T12:00:00-03:00`));
    assert.equal(c.slug, "institucional");
    assert.equal(c.banner, "/assinatura/banner-institucional.jpg");
  }
});

test("a virada do mês segue o horário de Brasília, não o UTC", () => {
  // 31/10 às 22h em Brasília já é 01/11 em UTC — ainda é Outubro Rosa
  assert.equal(campanhaDoMes(new Date("2026-11-01T01:00:00Z")).slug, "outubro-rosa");
  // 01/11 à 00h01 em Brasília — Novembro Azul
  assert.equal(campanhaDoMes(new Date("2026-11-01T03:01:00Z")).slug, "novembro-azul");
});

test("link da campanha: telemedicina em setembro/novembro, site nos outros meses", () => {
  assert.match(campanhaDoMes(new Date("2026-11-15T12:00:00-03:00")).link, /brcarga\.com\.br\/telemedicina/);
  assert.match(campanhaDoMes(new Date("2026-12-15T12:00:00-03:00")).link, /solidatransporte\.com\.br\/\?utm_source=email/);
});
