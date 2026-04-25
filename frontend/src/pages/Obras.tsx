import { useEffect, useState } from 'react';
import { User, Obra } from '../types';
import Navigation from '../components/Navigation';
import { obras } from '../services/supabase';
import { Plus, Edit2, Trash2, Calendar, MapPin, AlertCircle } from 'lucide-react';

interface ObrasProps {
  user: User;
}

export default function Obras({ user }: ObrasProps) {
  const [obrasData, setObrasData] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    localizacao: '',
    status: 'planejamento' as const,
    data_inicio: '',
    data_fim_prevista: '',
    orcamento: '',
  });

  const loadObras = async () => {
    try {
      const result = await obras.listar();
      if (result.error) throw result.error;
      setObrasData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar obras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadObras();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const obraData = {
        ...formData,
        orcamento: formData.orcamento ? parseFloat(formData.orcamento) : null,
      };

      if (editingId) {
        const result = await obras.atualizar(editingId, obraData);
        if (result.error) throw result.error;
      } else {
        const result = await obras.criar(obraData);
        if (result.error) throw result.error;
      }

      await loadObras();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        nome: '',
        descricao: '',
        localizacao: '',
        status: 'planejamento',
        data_inicio: '',
        data_fim_prevista: '',
        orcamento: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar obra');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta obra?')) return;
    try {
      const result = await obras.deletar(id);
      if (result.error) throw result.error;
      await loadObras();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar obra');
    }
  };

  const handleEdit = (obra: Obra) => {
    setFormData({
      nome: obra.nome,
      descricao: obra.descricao,
      localizacao: obra.localizacao,
      status: obra.status,
      data_inicio: obra.data_inicio?.split('T')[0] || '',
      data_fim_prevista: obra.data_fim_prevista?.split('T')[0] || '',
      orcamento: obra.orcamento?.toString() || '',
    });
    setEditingId(obra.id);
    setShowForm(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation user={user} onLogout={() => {}} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 lg:relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Obras</h1>
                <p className="text-gray-600 mt-1">Gerencie todos os seus projetos</p>
              </div>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingId(null);
                  setFormData({
                    nome: '',
                    descricao: '',
                    localizacao: '',
                    status: 'planejamento',
                    data_inicio: '',
                    data_fim_prevista: '',
                    orcamento: '',
                  });
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} />
                Nova Obra
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Form Modal */}
          {showForm && (
            <div className="mb-8 card p-6 fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingId ? 'Editar Obra' : 'Nova Obra'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="input"
                      placeholder="Construção Residencial XYZ"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                    <input
                      type="text"
                      value={formData.localizacao}
                      onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                      className="input"
                      placeholder="Rua, Cidade, Estado"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="input"
                    >
                      <option value="planejamento">Planejamento</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="pausada">Pausada</option>
                      <option value="concluida">Concluída</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Orçamento</label>
                    <input
                      type="number"
                      value={formData.orcamento}
                      onChange={(e) => setFormData({ ...formData, orcamento: e.target.value })}
                      className="input"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início</label>
                    <input
                      type="date"
                      value={formData.data_inicio}
                      onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data Prevista</label>
                    <input
                      type="date"
                      value={formData.data_fim_prevista}
                      onChange={(e) => setFormData({ ...formData, data_fim_prevista: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="input"
                    placeholder="Detalhes do projeto..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingId ? 'Atualizar' : 'Criar'} Obra
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Obras List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando obras...</p>
              </div>
            </div>
          ) : obrasData.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-500 mb-4">Nenhuma obra cadastrada</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Criar Primeira Obra
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {obrasData.map(obra => (
                <div key={obra.id} className="card p-6 fade-in hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">{obra.nome}</h3>
                    <span className={`badge ${
                      obra.status === 'em_andamento' ? 'badge-warning' :
                      obra.status === 'concluida' ? 'badge-success' :
                      'badge-secondary'
                    }`}>
                      {obra.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span className="text-sm">{obra.localizacao}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span className="text-sm">{new Date(obra.data_inicio).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {obra.orcamento && (
                      <div className="text-sm">
                        <p className="text-gray-600">Orçamento: R$ {obra.orcamento.toLocaleString('pt-BR')}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{obra.descricao}</p>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(obra)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                      <span className="text-sm">Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(obra.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                      <span className="text-sm">Deletar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
