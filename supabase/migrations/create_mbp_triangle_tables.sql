-- ============================================================
-- MBP Triangle Tables Migration
-- Inovarse — Ecossistema de Bem-Estar Integral
-- ============================================================
-- Conceito: Os dados armazenados representam PREFERÊNCIAS PESSOAIS
-- do usuário (MBP Triangle), não diagnóstico ou nível de evolução.
-- ============================================================

-- Tabela de leads do teste MBP Triangle
CREATE TABLE IF NOT EXISTS mce_leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        VARCHAR(255) NOT NULL,
  telefone    VARCHAR(30)  NOT NULL,
  email       VARCHAR(320) NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Tabela de resultados do teste MBP Triangle (Preferências)
-- Armazena tanto os valores calculados (combinação de sliders + preferências pareadas)
-- quanto as preferências primárias brutas do usuário.
CREATE TABLE IF NOT EXISTS mce_results (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id      UUID         NOT NULL REFERENCES mce_leads(id) ON DELETE CASCADE,
  -- Valores calculados (MBP Triangle de Preferências)
  mind         NUMERIC(5,2) NOT NULL,
  body         NUMERIC(5,2) NOT NULL,
  purpose      NUMERIC(5,2) NOT NULL,
  -- Preferências primárias brutas (sliders principais, 0-10)
  pref_mind    NUMERIC(5,2) NOT NULL,
  pref_body    NUMERIC(5,2) NOT NULL,
  pref_purpose NUMERIC(5,2) NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Tabela para avaliação profissional — Real Actuality Triangle (Fase 8)
-- Representa o estado ATUAL do usuário, avaliado por profissionais Inovarse.
-- Diferente do MBP Triangle (preferências), este reflete a realidade presente.
CREATE TABLE IF NOT EXISTS mce_real_actuality (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id       UUID         NOT NULL REFERENCES mce_leads(id) ON DELETE CASCADE,
  evaluator_id  UUID         REFERENCES mce_leads(id),  -- Profissional que avaliou
  -- Estado atual em cada dimensão (0-10)
  mind          NUMERIC(5,2) NOT NULL,
  body          NUMERIC(5,2) NOT NULL,
  purpose       NUMERIC(5,2) NOT NULL,
  -- Fase do programa e benchmark
  phase         INTEGER      NOT NULL DEFAULT 1,
  benchmark     TEXT,
  notes         TEXT,
  evaluated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_mce_results_lead_id    ON mce_results(lead_id);
CREATE INDEX IF NOT EXISTS idx_mce_actuality_lead_id  ON mce_real_actuality(lead_id);
CREATE INDEX IF NOT EXISTS idx_mce_leads_email        ON mce_leads(email);

-- Row Level Security (RLS) — Supabase
ALTER TABLE mce_leads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE mce_results       ENABLE ROW LEVEL SECURITY;
ALTER TABLE mce_real_actuality ENABLE ROW LEVEL SECURITY;

-- Políticas: service_role tem acesso total (backend)
-- anon pode inserir leads e resultados (teste público)
CREATE POLICY "anon_insert_mce_leads"
  ON mce_leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "anon_insert_mce_results"
  ON mce_results FOR INSERT
  TO anon
  WITH CHECK (true);

-- Leitura apenas para service_role (backend/admin)
CREATE POLICY "service_select_mce_leads"
  ON mce_leads FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "service_select_mce_results"
  ON mce_results FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "service_all_mce_actuality"
  ON mce_real_actuality FOR ALL
  TO service_role
  USING (true);
