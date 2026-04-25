import { useEffect, useState } from 'react';
import { User, Demanda } from '../types';
import Navigation from '../components/Navigation';
import { demandas } from '../services/supabase';
import { Plus, Edit2, Trash2, Clock, AlertCircle } from 'lucide-react';

interface DemandasProps {
  user: User;
}

export default function Demandas({ user }: DemandasProps) {
  const [demandasData, setDemandasData] = useState<Demanda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    obra_id: '',
    status: 'pendente' as const,
    prioridade: 'media' as const,
    atribuido_a: '',
    data_vencimento: '',
  });

  const loadDemandas = async () => {
    try {
      const result = await demandas.listarPorObra('');
      if (result.error) throw result.error;
      setDemandasData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar demandas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemandas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const result = await demandas.atualizar(editingId, formData);
        if (result.error) throw result.error;
      } else {
        const result = await demandas.criar(formData);
        if (result.error) throw result.error;
      }

      await loadDemandas();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar demanda');
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      obra_id: '',
      status: 'pendente',
      prioridade: 'media',
      atribuido_a: '',
      data_vencimento: '',
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta demanda?')) return;
    try {
      const result = await demandas.deletar(id);
      if (result.error) throw result.error;
      await loadDemandas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar demanda');
    }
  };

  const handleEdit = (demanda: Demanda) => {
    setFormData({
      titulo: demanda.titulo,
      descricao: demanda.descricao,
      obra_id: demanda.obra_id,
      status: demanda.status,
      prioridade: demanda.prioridade,
      atribuido_a: demanda.atribuido_a || '',
      data_vencimento: demanda.data_vencimento?.split('T')[0] || '',
    });
    setEditingId(demanda.id);
    setShowForm(true);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const result = await demandas.atualizarStatus(id, newStatus);
      if (result.error) throw result.error;
      await loadDemandas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critica':
        return 'badge-danger';
      case 'alta':
        return 'badge-warning';
      case 'media':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'badge-success';
      case 'em_andamento':
        return 'badge-warning';
      case 'cancelada':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
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
                <h1 className="text-3xl font-bold text-gray-900">Demandas</h1>
                <p className="text-gray-600 mt-1">Gerencie tarefas e demandas</p>
              </div>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingId(null);
                  resetForm();
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} />
                Nova Demanda
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
                {editingId ? 'Editar Demanda' : 'Nova Demanda'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      className="input"
                      placeholder="Título da demanda"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                    <select
                      value={formData.prioridade}
                      onChange={(e) => setFormData({ ...formData, prioridade: e.target.value as any })}
                      className="input"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                      <option value="critica">Crítica</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="input"
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluida">Concluída</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de Vencimento</label>
                    <input
                      type="date"
                      value={formData.data_vencimento}
                      onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
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
                    placeholder="Detalhes da demanda..."
                    rows={3}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingId ? 'Atualizar' : 'Criar'} Demanda
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      resetForm();
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Demandas List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando demandas...</p>
              </div>
            </div>
          ) : demandasData.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-500 mb-4">Nenhuma demanda cadastrada</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Criar Primeira Demanda
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {demandasData.map(demanda => (
                <div key={demanda.id} className="card p-6 fade-in">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{demanda.titulo}</h3>
                      <p className="text-sm text-gray-600 mt-1">{demanda.descricao}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`badge ${getStatusColor(demanda.status)}`}>
                        {demanda.status.replace('_', ' ')}
                      </span>
                      <span className={`badge ${getPriorityColor(demanda.prioridade)}`}>
                        {demanda.prioridade}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {demanda.data_vencimento && (
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>{new Date(demanda.data_vencimento).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={demanda.status}
                        onChange={(e) => handleStatusChange(demanda.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluida">Concluída</option>
                        <option value="cancelada">Cancelada</option>
                      </select>

                      <button
                        onClick={() => handleEdit(demanda)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(demanda.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
