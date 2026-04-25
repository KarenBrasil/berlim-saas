import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Variáveis de ambiente Supabase não configuradas!');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ========================
// AUTENTICAÇÃO
// ========================
export const auth = {
  login: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  register: (email: string, password: string, nome: string) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome }
      }
    }),

  logout: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),

  getCurrentUser: () => supabase.auth.getUser(),

  resetPassword: (email: string) =>
    supabase.auth.resetPasswordForEmail(email)
};

// ========================
// OBRAS
// ========================
export const obras = {
  listar: () =>
    supabase
      .from('obras')
      .select('*')
      .order('criado_em', { ascending: false }),

  listarMestrado: () =>
    supabase
      .from('obras')
      .select('*')
      .order('status', { ascending: false })
      .order('data_inicio', { ascending: false }),

  obter: (id: string) =>
    supabase
      .from('obras')
      .select('*')
      .eq('id', id)
      .single(),

  obterComDetalhes: (id: string) =>
    supabase
      .from('obras')
      .select(`
        *,
        funcionarios:alocacoes(funcionario_id, funcionarios!alocacoes_funcionario_id_fkey(*)),
        demandas(count),
        materiais:consumos_material(count)
      `)
      .eq('id', id)
      .single(),

  criar: (obra: any) =>
    supabase
      .from('obras')
      .insert([{
        ...obra,
        responsavel_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select(),

  atualizar: (id: string, updates: any) =>
    supabase
      .from('obras')
      .update({ ...updates, atualizado_em: new Date().toISOString() })
      .eq('id', id)
      .select(),

  deletar: (id: string) =>
    supabase
      .from('obras')
      .delete()
      .eq('id', id),

  // Realtime - atualizações em tempo real
  subscribe: (callback: (payload: any) => void) =>
    supabase
      .channel('obras-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'obras' },
        callback
      )
      .subscribe()
};

// ========================
// DEMANDAS / TAREFAS
// ========================
export const demandas = {
  listarPorObra: (obra_id: string) =>
    supabase
      .from('demandas')
      .select(`
        *,
        funcionarios:atribuido_a (id, nome, cargo)
      `)
      .eq('obra_id', obra_id)
      .order('prioridade', { ascending: false })
      .order('data_vencimento', { ascending: true }),

  listarPendentes: (obra_id: string) =>
    supabase
      .from('demandas')
      .select(`
        *,
        funcionarios:atribuido_a (id, nome, cargo)
      `)
      .eq('obra_id', obra_id)
      .neq('status', 'concluida')
      .order('prioridade', { ascending: false }),

  obter: (id: string) =>
    supabase
      .from('demandas')
      .select(`
        *,
        funcionarios:atribuido_a (id, nome, cargo)
      `)
      .eq('id', id)
      .single(),

  criar: (demanda: any) =>
    supabase
      .from('demandas')
      .insert([demanda])
      .select(),

  atualizar: (id: string, updates: any) =>
    supabase
      .from('demandas')
      .update({ ...updates, atualizado_em: new Date().toISOString() })
      .eq('id', id)
      .select(),

  atualizarStatus: (id: string, status: string) =>
    supabase
      .from('demandas')
      .update({ status, atualizado_em: new Date().toISOString() })
      .eq('id', id),

  deletar: (id: string) =>
    supabase
      .from('demandas')
      .delete()
      .eq('id', id),

  // Realtime - vê mudanças em tempo real
  subscribeObra: (obra_id: string, callback: (payload: any) => void) =>
    supabase
      .channel(`demandas-obra-${obra_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'demandas',
          filter: `obra_id=eq.${obra_id}`
        },
        callback
      )
      .subscribe()
};

// ========================
// FUNCIONÁRIOS
// ========================
export const funcionarios = {
  listar: () =>
    supabase
      .from('funcionarios')
      .select('*')
      .eq('ativo', true)
      .order('nome'),

  obter: (id: string) =>
    supabase
      .from('funcionarios')
      .select(`
        *,
        alocacoes (*)
      `)
      .eq('id', id)
      .single(),

  listarPorObra: (obra_id: string) =>
    supabase
      .from('alocacoes')
      .select(`
        *,
        funcionarios (*)
      `)
      .eq('obra_id', obra_id),

  criar: (funcionario: any) =>
    supabase
      .from('funcionarios')
      .insert([funcionario])
      .select(),

  atualizar: (id: string, updates: any) =>
    supabase
      .from('funcionarios')
      .update(updates)
      .eq('id', id)
      .select(),

  deletar: (id: string) =>
    supabase
      .from('funcionarios')
      .update({ ativo: false })
      .eq('id', id)
};

// ========================
// ALOCAÇÕES (Funcionário em Obra)
// ========================
export const alocacoes = {
  criar: (alocacao: any) =>
    supabase
      .from('alocacoes')
      .insert([alocacao])
      .select(),

  listarPorObra: (obra_id: string) =>
    supabase
      .from('alocacoes')
      .select(`
        *,
        funcionarios (id, nome, cargo, especialidade)
      `)
      .eq('obra_id', obra_id),

  remover: (id: string) =>
    supabase
      .from('alocacoes')
      .delete()
      .eq('id', id)
};

// ========================
// MATERIAIS
// ========================
export const materiais = {
  listar: () =>
    supabase
      .from('materiais')
      .select('*')
      .order('categoria'),

  obter: (id: string) =>
    supabase
      .from('materiais')
      .select('*')
      .eq('id', id)
      .single(),

  criar: (material: any) =>
    supabase
      .from('materiais')
      .insert([material])
      .select(),

  atualizar: (id: string, updates: any) =>
    supabase
      .from('materiais')
      .update(updates)
      .eq('id', id)
      .select()
};

// ========================
// CONSUMO DE MATERIAIS
// ========================
export const consumos = {
  listarPorObra: (obra_id: string) =>
    supabase
      .from('consumos_material')
      .select(`
        *,
        materiais (id, nome, unidade, preco_unitario)
      `)
      .eq('obra_id', obra_id),

  criar: (consumo: any) =>
    supabase
      .from('consumos_material')
      .insert([consumo])
      .select(),

  atualizarEstoque: async (material_id: string, quantidade: number) => {
    const { data: material } = await supabase
      .from('materiais')
      .select('estoque_total')
      .eq('id', material_id)
      .single();

    if (!material) return;

    return supabase
      .from('materiais')
      .update({ estoque_total: material.estoque_total - quantidade })
      .eq('id', material_id);
  }
};

// ========================
// STORAGE (Arquivos/Fotos)
// ========================
export const storage_service = {
  uploadFoto: (arquivo: File, obra_id: string) => {
    const caminho = `obras/${obra_id}/${Date.now()}-${arquivo.name}`;
    return supabase.storage
      .from('obras')
      .upload(caminho, arquivo, { upsert: false });
  },

  getUrl: (caminho: string) =>
    supabase.storage
      .from('obras')
      .getPublicUrl(caminho),

  remover: (caminho: string) =>
    supabase.storage
      .from('obras')
      .remove([caminho])
};

// ========================
// DOCUMENTOS
// ========================
export const documentos = {
  listarPorObra: (obra_id: string) =>
    supabase
      .from('documentos_obra')
      .select('*')
      .eq('obra_id', obra_id),

  criar: (documento: any) =>
    supabase
      .from('documentos_obra')
      .insert([documento])
      .select(),

  deletar: (id: string) =>
    supabase
      .from('documentos_obra')
      .delete()
      .eq('id', id)
};
