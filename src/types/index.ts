export interface Obra {
  id: string
  nome: string
  localizacao: string
  descricao: string
  status: 'planejamento' | 'em_andamento' | 'pausada' | 'finalizada'
  orcamento_total: number
  data_inicio: string
  data_fim_prevista: string
  user_id: string
  created_at: string
}

export interface Funcionario {
  id: string
  nome: string
  email: string
  telefone: string
  funcao: string
  habilidades: string[]
  user_id: string
  created_at: string
}

export interface Demanda {
  id: string
  obra_id: string
  titulo: string
  descricao: string
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  status: 'aberta' | 'em_andamento' | 'concluida' | 'cancelada'
  data_criacao: string
  data_vencimento: string
  user_id: string
}

export interface Alocacao {
  id: string
  obra_id: string
  funcionario_id: string
  data_inicio: string
  data_fim: string
  funcao: string
  user_id: string
}

export interface Material {
  id: string
  nome: string
  categoria: string
  estoque: number
  unidade: string
  preco_unitario: number
  user_id: string
  created_at: string
}

export interface ConsumoMaterial {
  id: string
  obra_id: string
  material_id: string
  quantidade: number
  data_consumo: string
  observacoes: string
  user_id: string
}

export interface PerfilUsuario {
  id: string
  user_id: string
  nome: string
  email: string
  empresa: string
  avatar_url: string
  created_at: string
}

export interface NovaObraInput {
  nome: string
  localizacao: string
  descricao: string
  orcamento_total: number
  data_inicio: string
  data_fim_prevista: string
}

export interface NovaDemandaInput {
  titulo: string
  descricao: string
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  data_vencimento: string
}
