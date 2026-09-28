-- ============================================================
-- Gerador de assinatura: cadastro de colaboradores por filial.
-- Leitura e escrita SÓ pelo servidor (/api/assinatura/colaboradores, service
-- role). RLS ligada e sem policies: anon/authenticated não enxergam a tabela.
-- Seed = "Assinaturas Pré-Fixadas/Assinatura Email {SP,DF}.docx.pdf" (28/09/2026).
-- cidade/fone nulos = usa os da filial (definidos no gerador.html).
-- ============================================================

create table if not exists public.assinatura_colaboradores (
  id         uuid primary key default gen_random_uuid(),
  filial     text not null check (filial in ('SP', 'DF', 'GO')),
  nome       text not null check (char_length(nome) between 1 and 80),
  cargo      text check (char_length(cargo) <= 60),
  cidade     text check (char_length(cidade) <= 60),
  fone       text check (char_length(fone) <= 30),
  ramal      text check (char_length(ramal) <= 10),
  whatsapp   text check (char_length(whatsapp) <= 30),
  email      text not null check (char_length(email) <= 120),
  rotulo     text check (char_length(rotulo) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assinatura_colaboradores_filial_nome
  on public.assinatura_colaboradores (filial, nome);

alter table public.assinatura_colaboradores enable row level security;

drop trigger if exists assinatura_colaboradores_set_updated_at on public.assinatura_colaboradores;
create trigger assinatura_colaboradores_set_updated_at
  before update on public.assinatura_colaboradores
  for each row execute function public.set_updated_at();

-- ---------- Seed (só se a tabela estiver vazia) ----------
insert into public.assinatura_colaboradores (filial, nome, cargo, cidade, ramal, whatsapp, email, rotulo)
select * from (values
  ('SP', 'Adriana Gila',      'Gerência',       null,             '7771', '(11) 9 7463-7863', 'coletasp@solidatransporte.com.br',        null),
  ('SP', 'Camila Almeida',    'Pendência',      null,             '7763', null,               'pendenciasp@solidatransporte.com.br',     null),
  ('SP', 'Eduarda Silva',     'Expedição',      null,             '7767', null,               'expedicaosp@solidatransporte.com.br',     null),
  ('SP', 'Jaqueline Xavier',  'Expedição',      null,             '7765', null,               'expedicaosp@solidatransporte.com.br',     null),
  ('SP', 'Maria Eduarda',     'Coleta',         null,             '7764', null,               'administrativosp@solidatransporte.com.br', null),
  ('SP', 'Michele Pereira',   'Aux. Expedição', 'Guarulhos - SP', '7766', null,               'expedicaosp@solidatransporte.com.br',     null),
  ('SP', 'Onaldo Cavalcante', 'Expedição',      'Guarulhos - SP', '7770', null,               'expedicaosp@solidatransporte.com.br',     null),
  ('SP', 'Sara Júlia',        'Atendimento',    null,             '7761', null,               'coletaspsuporte@solidatransporte.com.br', null),
  ('SP', 'Sara Quezia',       'Atendimento',    null,             '7760', null,               'atendimentosp@solidatransporte.com.br',   null),
  ('SP', 'Thais Gomes',       'Coleta',         null,             '7768', null,               'coletasp1@solidatransporte.com.br',       null),
  ('SP', 'Gerência',          null,             null,             null,   null,               'gerenciasp@solidatransporte.com.br',      'Gerência (e-mail geral)'),
  ('DF', 'Ana Paula Alves',   'Comercial',      null,             '7702', '(61) 9 9653-2064', 'comercialdf4@solidatransporte.com.br',    null),
  ('DF', 'Marlene',           'Financeiro',     null,             '7700', null,               'financeirodf@solidatransporte.com.br',    null),
  ('DF', 'Sergio Alexandre',  'Operacional',    null,             '7707', '(61) 9 9956-0138', 'operacionaldf@solidatransporte.com.br',   null),
  ('DF', 'Virginia Tatiane',  'Expedição',      null,             '7705', '(61) 9 9825-3123', 'expedicaodf@solidatransporte.com.br',     null),
  ('DF', 'Willian Sousa',     'Expedição',      null,             '7706', '(61) 9 9825-3123', 'expedicaodf@solidatransporte.com.br',     null)
) as seed(filial, nome, cargo, cidade, ramal, whatsapp, email, rotulo)
where not exists (select 1 from public.assinatura_colaboradores);
