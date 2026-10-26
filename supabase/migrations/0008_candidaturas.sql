-- ============================================================
-- LP /trabalhe-conosco (26/10/2026): cópia de segurança das candidaturas.
-- O caminho principal é o e-mail para o RH; esta tabela garante que nenhum
-- candidato se perde se o envio falhar (ex.: senha de app do Gmail revogada).
-- Só o servidor grava/lê (/api/candidatura, service role): RLS ligada e sem
-- policies. Currículos no bucket PRIVADO `curriculos` (sem leitura pública).
-- LGPD: dado pessoal de candidato — apagar o que tiver mais de 12 meses.
-- ============================================================

create table if not exists public.candidaturas (
  id             uuid primary key,
  created_at     timestamptz not null default now(),
  vaga           text not null check (char_length(vaga) <= 40),
  nome           text not null check (char_length(nome) between 3 and 120),
  telefone       text not null check (telefone ~ '^[0-9]{10,11}$'),
  email          text check (char_length(email) <= 120),
  bairro         text not null check (char_length(bairro) <= 120),
  mensagem       text check (char_length(mensagem) <= 1500),
  curriculo_path text check (char_length(curriculo_path) <= 200),
  origem         jsonb not null default '{}'::jsonb,
  email_enviado  boolean not null default false
);

create index if not exists candidaturas_created_at on public.candidaturas (created_at desc);

alter table public.candidaturas enable row level security;

insert into storage.buckets (id, name, public, file_size_limit)
values ('curriculos', 'curriculos', false, 4194304)
on conflict (id) do nothing;
