export interface Obra {
  id: string;
  nome: string;
  descricao: string;
  localizacao: string;
  status: 'planejamento' | 'em_andamento' | 'pausada' | 'concluida';
  data_inicio: string;
  data_fim_prevista?: string;
  data_fim_real?: string;
  responsavel_id: string;
  orcamento?: number;
  custo_atual?: number;
  criado_em: string;
  atualizado_em: string;
}

export interface Demanda {
  id: string;
  obra_id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  atribuido_a?: string;
  data_vencimento?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cargo: string;
  especialidade?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface Alocacao {
  id: string;
  obra_id: string;
  funcionario_id: string;
  funcao: string;
  data_inicio: string;
  data_fim?: string;
  ativo: boolean;
  criado_em: string;
}

export interface Material {
  id: string;
  nome: string;
  descricao?: string;
  categoria: string;
  unidade: string;
  preco_unitario: number;
  estoque_total: number;
  criado_em: string;
  atualizado_em: string;
}

export interface ConsumoMaterial {
  id: string;
  obra_id: string;
  material_id: string;
  quantidade: number;
  data_consumo: string;
  criado_em: string;
}

export interface User {
  id: string;
  email: string;
  nome: string;
  criado_em: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
