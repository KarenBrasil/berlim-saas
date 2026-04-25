import { createClient } from '@supabase/supabase-js'
import { Obra, Funcionario, Demanda, Alocacao, Material, ConsumoMaterial, NovaObraInput, NovaDemandaInput } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export const auth = {
  async login(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password })
  },

  async register(email: string, password: string, nome: string) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (!error && data.user) {
      await supabase.from('perfis_usuario').insert({
        user_id: data.user.id,
        nome,
        email
      })
    }
    return { data, error }
  },

  async logout() {
    return supabase.auth.signOut()
  },

  async getSession() {
    return supabase.auth.getSession()
  },

  onAuthStateChange(callback: any) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export const obrasService = {
  async listar(userId: string) {
    const { data, error } = await supabase
      .from('obras')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async obter(id: string) {
    const { data, error } = await supabase
      .from('obras')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async criar(userId: string, input: NovaObraInput) {
    const { data, error } = await supabase
      .from('obras')
      .insert({
        ...input,
        user_id: userId,
        status: 'planejamento'
      })
      .select()
    return { data, error }
  },

  async atualizar(id: string, updates: Partial<Obra>) {
    const { data, error } = await supabase
      .from('obras')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  },

  subscribe(userId: string, callback: (data: Obra[]) => void) {
    return supabase
      .from('obras')
      .on('*', (payload: any) => {
        obrasService.listar(userId).then(({ data }) => {
          if (data) callback(data)
        })
      })
      .subscribe()
  }
}

export const demandasService = {
  async listarPorObra(obraId: string) {
    const { data, error } = await supabase
      .from('demandas')
      .select('*')
      .eq('obra_id', obraId)
      .order('data_criacao', { ascending: false })
    return { data, error }
  },

  async criar(obraId: string, userId: string, input: NovaDemandaInput) {
    const { data, error } = await supabase
      .from('demandas')
      .insert({
        obra_id: obraId,
        user_id: userId,
        ...input,
        status: 'aberta',
        data_criacao: new Date().toISOString()
      })
      .select()
    return { data, error }
  },

  async atualizar(id: string, updates: Partial<Demanda>) {
    const { data, error } = await supabase
      .from('demandas')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  },

  subscribeObra(obraId: string, callback: (data: Demanda[]) => void) {
    return supabase
      .from('demandas')
      .on('*', (payload: any) => {
        demandasService.listarPorObra(obraId).then(({ data }) => {
          if (data) callback(data)
        })
      })
      .eq('obra_id', obraId)
      .subscribe()
  }
}

export const funcionariosService = {
  async listar(userId: string) {
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('user_id', userId)
    return { data, error }
  },

  async criar(userId: string, funcionario: Omit<Funcionario, 'id' | 'created_at' | 'user_id'>) {
    const { data, error } = await supabase
      .from('funcionarios')
      .insert({ ...funcionario, user_id: userId })
      .select()
    return { data, error }
  }
}

export const materiaisService = {
  async listar(userId: string) {
    const { data, error } = await supabase
      .from('materiais')
      .select('*')
      .eq('user_id', userId)
    return { data, error }
  },

  async criar(userId: string, material: Omit<Material, 'id' | 'created_at' | 'user_id'>) {
    const { data, error } = await supabase
      .from('materiais')
      .insert({ ...material, user_id: userId })
      .select()
    return { data, error }
  }
}

export const alocacoesService = {
  async listarPorObra(obraId: string) {
    const { data, error } = await supabase
      .from('alocacoes')
      .select(`
        *,
        funcionario:funcionario_id(*)
      `)
      .eq('obra_id', obraId)
    return { data, error }
  }
}
