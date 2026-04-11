import { createClient } from '@supabase/supabase-js';
import { ENV } from './_core/env';

const supabaseUrl = ENV.supabaseUrl;
const supabaseAnonKey = ENV.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ SUPABASE_URL e SUPABASE_ANON_KEY não foram configurados no .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createPartnerLead(data: any) {
  // Esta parte é CRUCIAL: Mapeia o nome do campo para o que o banco espera
  const dbData = {
    ...data,
    tipo_servico: data.tipoServico, 
  };
  delete dbData.tipoServico; // Remove a chave antiga para não dar erro de coluna inexistente

  const { error } = await supabase
    .from('partner_leads')
    .insert(dbData);

  if (error) {
    console.error("Erro detalhado do Supabase:", error);
    throw new Error("Erro ao salvar lead de parceiro");
  }
  return { success: true };
}

export async function createContact(data: any) {
  const { error } = await supabase
    .from('contacts')
    .insert(data);

  if (error) {
    console.error("Erro ao criar contato:", error);
    throw new Error("Erro ao salvar contato");
  }
  return { success: true };
}

// ─── MBP Triangle: Leads e Resultados ────────────────────────────────────

/**
 * Cria um lead do teste MBP Triangle na tabela `leads`.
 * Retorna o ID gerado para ser usado ao salvar o resultado.
 */
export async function createMceLead(data: {
  nome: string;
  telefone: string;
  email: string;
}): Promise<{ id: string }> {
  const { data: inserted, error } = await supabase
    .from('leads')
    .insert({
      nome: data.nome,
      telefone: data.telefone,
      email: data.email,
    })
    .select('id')
    .single();

  if (error) {
    console.error("Erro ao criar lead MBP na tabela leads:", error);
    throw new Error("Erro ao salvar lead do teste MBP Triangle");
  }

  return { id: inserted.id };
}

/**
 * Cria o resultado do teste MBP Triangle na tabela `results`.
 * Armazena tanto os valores calculados (combinação de sliders + preferências pareadas)
 * quanto as preferências primárias brutas do usuário.
 */
export async function createMceResult(data: {
  leadId: string;
  mind: number;
  body: number;
  purpose: number;
  prefMind: number;
  prefBody: number;
  prefPurpose: number;
}): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from('results')
    .insert({
      lead_id: data.leadId,
      mind: data.mind,
      body: data.body,
      purpose: data.purpose,
      pref_mind: data.prefMind,
      pref_body: data.prefBody,
      pref_purpose: data.prefPurpose,
    });

  if (error) {
    console.error("Erro ao criar resultado MBP na tabela results:", error);
    throw new Error("Erro ao salvar resultado do teste MBP Triangle");
  }

  return { success: true };
}

// ─── User Management (necessário para autenticação OAuth) ──────────────────

/**
 * Busca um usuário pelo openId (identificador OAuth).
 */
export async function getUserByOpenId(openId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('openId', openId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Erro ao buscar usuário:", error);
    throw new Error("Erro ao buscar usuário");
  }

  return data || null;
}

/**
 * Cria ou atualiza um usuário (upsert por openId).
 */
export async function upsertUser(data: {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  lastSignedIn?: Date;
}) {
  const { error } = await supabase
    .from('users')
    .upsert(
      {
        openId: data.openId,
        name: data.name ?? null,
        email: data.email ?? null,
        loginMethod: data.loginMethod ?? null,
        lastSignedIn: data.lastSignedIn?.toISOString() ?? new Date().toISOString(),
      },
      { onConflict: 'openId' }
    );

  if (error) {
    console.error("Erro ao upsert usuário:", error);
    throw new Error("Erro ao salvar usuário");
  }

  return { success: true };
}

// Mantido para compatibilidade
export async function getDb() {
  return supabase;
}
