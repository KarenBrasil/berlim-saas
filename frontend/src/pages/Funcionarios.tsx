import { useEffect, useState } from 'react';
import { User, Funcionario } from '../types';
import Navigation from '../components/Navigation';
import { funcionarios } from '../services/supabase';
import { Plus, Edit2, Trash2, Mail, Phone, Briefcase, AlertCircle } from 'lucide-react';

interface FuncionariosProps {
  user: User;
}

export default function Funcionarios({ user }: FuncionariosProps) {
  const [funcionariosData, setFuncionariosData] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    especialidade: '',
  });

  const loadFuncionarios = async () => {
    try {
      const result = await funcionarios.listar();
      if (result.error) throw result.error;
      setFuncionariosData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFuncionarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const funcData = { ...formData, ativo: true };

      if (editingId) {
        const result = await funcionarios.atualizar(editingId, funcData);
        if (result.error) throw result.error;
      } else {
        const result = await funcionarios.criar(funcData);
        if (result.error) throw result.error;
      }

      await loadFuncionarios();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar funcionário');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      cargo: '',
      especialidade: '',
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar este funcionário?')) return;
    try {
      const result = await funcionarios.deletar(id);
      if (result.error) throw result.error;
      await loadFuncionarios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar funcionário');
    }
  };

  const handleEdit = (func: Funcionario) => {
    setFormData({
      nome: func.nome,
      email: func.email,
      telefone: func.telefone || '',
      cargo: func.cargo,
      especialidade: func.especialidade || '',
    });
    setEditingId(func.id);
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
                <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
                <p className="text-gray-600 mt-1">Gerencie sua equipe</p>
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
                Novo Funcionário
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
                {editingId ? 'Editar Funcionário' : 'Novo Funcionário'}
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
                      placeholder="João Silva"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      placeholder="joao@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="input"
                      placeholder="(11) 9 9999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
                    <input
                      type="text"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className="input"
                      placeholder="Encanador, Eletricista, etc."
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Especialidade</label>
                    <input
                      type="text"
                      value={formData.especialidade}
                      onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                      className="input"
                      placeholder="Ex: Hidráulica Industrial"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingId ? 'Atualizar' : 'Criar'} Funcionário
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

          {/* Funcionários List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando funcionários...</p>
              </div>
            </div>
          ) : funcionariosData.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-500 mb-4">Nenhum funcionário cadastrado</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Cadastrar Funcionário
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {funcionariosData.map(func => (
                <div key={func.id} className="card p-6 fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{func.nome}</h3>
                      <div className="flex items-center gap-1 text-indigo-600 mt-1">
                        <Briefcase size={14} />
                        <span className="text-sm font-medium">{func.cargo}</span>
                      </div>
                    </div>
                    <span className="badge badge-success">Ativo</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      <span className="text-sm truncate">{func.email}</span>
                    </div>
                    {func.telefone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} />
                        <span className="text-sm">{func.telefone}</span>
                      </div>
                    )}
                    {func.especialidade && (
                      <div className="p-2 bg-blue-50 rounded text-blue-700 text-sm">
                        <span className="font-medium">Especialidade:</span> {func.especialidade}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(func)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                      <span className="text-sm">Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(func.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                      <span className="text-sm">Desativar</span>
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
