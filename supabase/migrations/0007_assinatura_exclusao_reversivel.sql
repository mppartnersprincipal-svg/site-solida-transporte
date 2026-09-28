-- ============================================================
-- Gerador de assinatura: exclusão reversível (pedido do cliente, 28/09/2026).
-- "Excluir" passa a marcar excluido_em em vez de apagar a linha; a pessoa sai
-- da lista, fica na área "Excluídos" do gerador e pode ser restaurada.
-- Rodar DEPOIS da 0006.
-- ============================================================

alter table public.assinatura_colaboradores
  add column if not exists excluido_em timestamptz;

create index if not exists assinatura_colaboradores_excluido_em
  on public.assinatura_colaboradores (excluido_em);
