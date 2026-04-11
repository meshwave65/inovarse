import { createClient } from '@supabase/supabase-js';
import { ENV } from './_core/env';

const supabaseUrl = ENV.supabaseUrl;
const supabaseAnonKey = ENV.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ SUPABASE_URL e SUPABASE_ANON_KEY não foram configurados no .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createPartnerLead(data: any) {
  const dbData = {
    ...data,
    tipo_servico: data.tipoServico, 
  };
  delete dbData.tipoServico;

  const { error } = await supabase
    .from('partner_leads')
    .insert(dbData);

  if (error) {
    console.error("Erro detalhado do Supabase (partner_leads):", error);
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
 * Retorna o ID gerado (UUID) para ser usado ao salvar o resultado.
 */
export async function createMceLead(data: {
  nome: string;
  telefone: string;
  email: string;
}): Promise<{ id: string }> {
  console.log("Tentando criar lead na tabela 'leads' (padrão UUID)...", data);
  
  const { data: inserted, error } = await supabase
    .from('leads')
    .insert({
      nome: data.nome,
      telefone: data.telefone,
      email: data.email,
    })
    .select('id');

  if (error) {
    console.error("ERRO SUPABASE (leads):", error.message);
    throw new Error(`Erro ao salvar lead: ${error.message}`);
  }

  if (!inserted || inserted.length === 0) {
    console.error("ERRO: Nenhum dado retornado após inserção na tabela 'leads'");
    throw new Error("Erro ao capturar ID do lead gerado");
  }

  // Retorna o ID como string (UUID)
  const leadId = String(inserted[0].id);
  console.log("Lead criado com sucesso! ID (UUID):", leadId);
  return { id: leadId };
}

/**
 * Cria o resultado do teste MBP Triangle na tabela `results`.
 * Garante que o leadId seja tratado como string (UUID).
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
  console.log("Tentando criar resultado na tabela 'results' para leadId (UUID):", data.leadId);
  
  const payload = {
    lead_id: String(data.leadId), // Garante que seja string (UUID)
    mind: Number(data.mind),
    body: Number(data.body),
    purpose: Number(data.purpose),
    pref_mind: Number(data.prefMind),
    pref_body: Number(data.prefBody),
    pref_purpose: Number(data.prefPurpose),
  };

  const { error } = await supabase
    .from('results')
    .insert(payload);

  if (error) {
    console.error("ERRO SUPABASE (results):", error.message);
    console.error("Payload enviado:", payload);
    
    // TENTATIVA DE BACKUP: Se falhou por lead_id, tenta com leadId (camelCase)
    if (error.message.includes("column \"lead_id\" does not exist")) {
      console.log("Tentando novamente com a coluna 'leadId'...");
      const backupPayload = { ...payload, leadId: String(data.leadId) };
      delete backupPayload.lead_id;
      
      const { error: error2 } = await supabase
        .from('results')
        .insert(backupPayload);
        
      if (!error2) {
        console.log("Resultado salvo com sucesso usando 'leadId'!");
        return { success: true };
      }
      throw new Error(`Erro ao salvar resultado (tentativa 2): ${error2.message}`);
    }
    
    throw new Error(`Erro ao salvar resultado: ${error.message}`);
  }

  console.log("Resultado salvo com sucesso na tabela 'results'!");
  return { success: true };
}

// ─── User Management (necessário para autenticação OAuth) ──────────────────

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

export async function getDb() {
  return supabase;
}
