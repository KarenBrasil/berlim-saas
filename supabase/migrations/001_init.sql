-- Criar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Perfis de Usuário
CREATE TABLE IF NOT EXISTS perfis_usuario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  empresa VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Obras
CREATE TABLE IF NOT EXISTS obras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  localizacao VARCHAR(255) NOT NULL,
  descricao TEXT,
  status VARCHAR(50) DEFAULT 'planejamento' CHECK (status IN ('planejamento', 'em_andamento', 'pausada', 'finalizada')),
  orcamento_total DECIMAL(15, 2),
  data_inicio DATE,
  data_fim_prevista DATE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Funcionários
CREATE TABLE IF NOT EXISTS funcionarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20),
  funcao VARCHAR(100),
  habilidades TEXT[] DEFAULT '{}',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Alocações (funcionários em obras)
CREATE TABLE IF NOT EXISTS alocacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  funcionario_id UUID NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  funcao VARCHAR(100),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Materiais
CREATE TABLE IF NOT EXISTS materiais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  categoria VARCHAR(100),
  estoque DECIMAL(10, 2) DEFAULT 0,
  unidade VARCHAR(50),
  preco_unitario DECIMAL(12, 2),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Consumo de Materiais
CREATE TABLE IF NOT EXISTS consumos_material (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materiais(id) ON DELETE CASCADE,
  quantidade DECIMAL(10, 2) NOT NULL,
  data_consumo TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  observacoes TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela de Demandas
CREATE TABLE IF NOT EXISTS demandas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  prioridade VARCHAR(50) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  status VARCHAR(50) DEFAULT 'aberta' CHECK (status IN ('aberta', 'em_andamento', 'concluida', 'cancelada')),
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  data_vencimento DATE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela de Documentos
CREATE TABLE IF NOT EXISTS documentos_obra (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  tipo VARCHAR(50),
  url TEXT NOT NULL,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_obras_user ON obras(user_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_user ON funcionarios(user_id);
CREATE INDEX IF NOT EXISTS idx_demandas_obra ON demandas(obra_id);
CREATE INDEX IF NOT EXISTS idx_demandas_user ON demandas(user_id);
CREATE INDEX IF NOT EXISTS idx_alocacoes_obra ON alocacoes(obra_id);
CREATE INDEX IF NOT EXISTS idx_alocacoes_funcionario ON alocacoes(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_consumos_obra ON consumos_material(obra_id);
CREATE INDEX IF NOT EXISTS idx_materiais_user ON materiais(user_id);
CREATE INDEX IF NOT EXISTS idx_documentos_obra ON documentos_obra(obra_id);

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE obras;
ALTER PUBLICATION supabase_realtime ADD TABLE demandas;
ALTER PUBLICATION supabase_realtime ADD TABLE funcionarios;

-- Row Level Security (RLS)
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandas ENABLE ROW LEVEL SECURITY;
ALTER TABLE alocacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumos_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_obra ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis_usuario ENABLE ROW LEVEL SECURITY;

-- RLS Policies - obras
CREATE POLICY "Users can view their own obras"
  ON obras FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own obras"
  ON obras FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own obras"
  ON obras FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own obras"
  ON obras FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies - demandas
CREATE POLICY "Users can view demandas in their obras"
  ON demandas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert demandas in their obras"
  ON demandas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update demandas in their obras"
  ON demandas FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies - funcionarios
CREATE POLICY "Users can view their own funcionarios"
  ON funcionarios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own funcionarios"
  ON funcionarios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own funcionarios"
  ON funcionarios FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies - materiais
CREATE POLICY "Users can view their own materiais"
  ON materiais FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own materiais"
  ON materiais FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own materiais"
  ON materiais FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies - perfis_usuario
CREATE POLICY "Users can view their own profile"
  ON perfis_usuario FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON perfis_usuario FOR UPDATE
  USING (auth.uid() = user_id);
