import assert from "node:assert/strict";
import { test } from "node:test";
import {
  VAGAS,
  detectarTipoCurriculo,
  formatarTelefone,
  montarEmailCandidatura,
  nomeArquivoSeguro,
  normalizarTelefone,
  validarCandidatura,
} from "../lib/vagas.ts";

const valido = {
  nome: "João da Silva",
  telefone: "(62) 99636-3830",
  email: "Joao@Exemplo.com",
  bairro: "Jardim Novo Mundo, Goiânia",
  vaga: "motorista",
  mensagem: "Tenho 5 anos de experiência.",
  consentimento: "on",
};

test("aceita candidatura completa e normaliza os campos", () => {
  const r = validarCandidatura(valido);

  assert.equal(r.ok, true);
  assert.equal(r.dados.telefone, "62996363830");
  assert.equal(r.dados.email, "joao@exemplo.com");
  assert.equal(r.dados.vaga, "motorista");
});

test("e-mail e mensagem são opcionais", () => {
  const r = validarCandidatura({ ...valido, email: "", mensagem: "  " });

  assert.equal(r.ok, true);
  assert.equal(r.dados.email, null);
  assert.equal(r.dados.mensagem, null);
});

test("recusa sem consentimento, vaga inexistente, nome sem sobrenome e telefone sem DDD", () => {
  const r = validarCandidatura({
    ...valido,
    nome: "João",
    telefone: "99636-3830",
    vaga: "gerente",
    consentimento: undefined,
  });

  assert.equal(r.ok, false);
  assert.deepEqual(Object.keys(r.erros).sort(), ["consentimento", "nome", "telefone", "vaga"]);
});

test("recusa e-mail malformado", () => {
  const r = validarCandidatura({ ...valido, email: "joao@" });
  assert.equal(r.ok, false);
  assert.ok(r.erros.email);
});

test("telefone: tira o 55 e aceita fixo ou celular", () => {
  assert.equal(normalizarTelefone("+55 62 99636-3830"), "62996363830");
  assert.equal(normalizarTelefone("(62) 3206-3513"), "6232063513");
  assert.equal(normalizarTelefone("123"), null);
  assert.equal(formatarTelefone("62996363830"), "(62) 99636-3830");
  assert.equal(formatarTelefone("6232063513"), "(62) 3206-3513");
});

test("identifica o currículo pelos bytes, não pela extensão", () => {
  const b = (...n) => new Uint8Array([...n, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  assert.equal(detectarTipoCurriculo(b(0x25, 0x50, 0x44, 0x46), "cv.pdf"), "pdf");
  assert.equal(detectarTipoCurriculo(b(0xff, 0xd8, 0xff), "foto.jpeg"), "jpg");
  assert.equal(detectarTipoCurriculo(b(0x89, 0x50, 0x4e, 0x47), "cv.png"), "png");
  assert.equal(detectarTipoCurriculo(b(0xd0, 0xcf, 0x11, 0xe0), "cv.doc"), "doc");
  assert.equal(detectarTipoCurriculo(b(0x50, 0x4b, 0x03, 0x04), "cv.docx"), "docx");
  // zip qualquer não passa como docx
  assert.equal(detectarTipoCurriculo(b(0x50, 0x4b, 0x03, 0x04), "cv.zip"), null);
  // executável renomeado para .pdf
  assert.equal(detectarTipoCurriculo(b(0x4d, 0x5a), "cv.pdf"), null);
});

test("nome do arquivo sem acento, espaço nem caminho", () => {
  assert.equal(nomeArquivoSeguro("Currículo João (2026).PDF", "pdf"), "Curriculo-Joao-2026.pdf");
  assert.equal(nomeArquivoSeguro("../../etc/passwd", "pdf"), "etc-passwd.pdf");
  assert.equal(nomeArquivoSeguro("ççç", "jpg"), "ccc.jpg");
  assert.equal(nomeArquivoSeguro("###", "jpg"), "curriculo.jpg");
});

test("e-mail do RH escapa HTML digitado pelo candidato", () => {
  const r = validarCandidatura({ ...valido, nome: "Ana <script>x</script>", mensagem: "<b>oi</b>" });
  const email = montarEmailCandidatura(r.dados, { anexo: "cv.pdf", origem: { utm_source: "meta" } });

  assert.doesNotMatch(email.html, /<script>/);
  assert.match(email.html, /&lt;b&gt;oi&lt;\/b&gt;/);
  assert.match(email.subject, /^Candidatura: Motorista \(categoria D \+ MOPP\) \| Ana/);
  assert.match(email.text, /wa\.me\/5562996363830/);
  assert.match(email.text, /utm_source: meta/);
});

test("toda vaga tem id único e requisitos", () => {
  const ids = VAGAS.map((v) => v.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const v of VAGAS) assert.ok(v.requisitos.length > 0);
});
