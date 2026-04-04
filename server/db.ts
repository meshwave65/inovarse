import { createClient } from '@supabase/supabase-js';
import { ENV } from './_core/env';

const supabaseUrl = ENV.supabaseUrl;
const supabaseAnonKey = ENV.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ SUPABASE_URL e SUPABASE_ANON_KEY não foram configurados no .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createPartnerLead(data: any) {
  const { error } = await supabase
    .from('partner_leads')
    .insert(data);

  if (error) {
    console.error("Erro ao criar partner lead:", error);
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

// Mantido para compatibilidade
export async function getDb() {
  return supabase;
}
