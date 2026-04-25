import { useEffect, useState } from 'react';
import { User, Material } from '../types';
import Navigation from '../components/Navigation';
import { materiais } from '../services/supabase';
import { Plus, Edit2, Trash2, Package, AlertCircle } from 'lucide-react';

interface MateriaisProps {
  user: User;
}

export default function Materiais({ user }: MateriaisProps) {
  const [materiaisData, setMateriaisData] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    unidade: '',
    preco_unitario: '',
    estoque_total: '',
  });

  const loadMateriais = async () => {
    try {
      const result = await materiais.listar();
      if (result.error) throw result.error;
      setMateriaisData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar materiais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMateriais();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const matData = {
        ...formData,
        preco_unitario: parseFloat(formData.preco_unitario),
        estoque_total: parseFloat(formData.estoque_total),
      };

      if (editingId) {
        const result = await materiais.atualizar(editingId, matData);
        if (result.error) throw result.error;
      } else {
        const result = await materiais.criar(matData);
        if (result.error) throw result.error;
      }

      await loadMateriais();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar material');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      categoria: '',
      unidade: '',
      preco_unitario: '',
      estoque_total: '',
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este material?')) return;
    try {
      // Note: Supabase doesn't have a delete method for materiais, we'll need to implement this differently
      // For now, we'll show a message
      alert('Funcionalidade ainda não implementada. Delete via banco de dados.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar material');
    }
  };

  const handleEdit = (material: Material) => {
    setFormData({
      nome: material.nome,
      descricao: material.descricao || '',
      categoria: material.categoria,
      unidade: material.unidade,
      preco_unitario: material.preco_unitario.toString(),
      estoque_total: material.estoque_total.toString(),
    });
    setEditingId(material.id);
    setShowForm(true);
  };

  const categorias = Array.from(new Set(materiaisData.map(m => m.categoria)));

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation user={user} onLogout={() => {}} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 lg:relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Materiais</h1>
                <p className="text-gray-600 mt-1">Gerencie estoque e preços</p>
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
                Novo Material
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
                {editingId ? 'Editar Material' : 'Novo Material'}
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
                      placeholder="Cimento, Tijolos, etc."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                    <input
                      type="text"
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className="input"
                      placeholder="Insumos, Acabamento, etc."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unidade</label>
                    <select
                      value={formData.unidade}
                      onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="">Selecione a unidade</option>
                      <option value="unidade">Unidade</option>
                      <option value="kg">Quilograma (kg)</option>
                      <option value="l">Litro (L)</option>
                      <option value="m">Metro (m)</option>
                      <option value="m2">Metro Quadrado (m²)</option>
                      <option value="m3">Metro Cúbico (m³)</option>
                      <option value="caixa">Caixa</option>
                      <option value="pacote">Pacote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preço Unitário</label>
                    <input
                      type="number"
                      value={formData.preco_unitario}
                      onChange={(e) => setFormData({ ...formData, preco_unitario: e.target.value })}
                      className="input"
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estoque</label>
                    <input
                      type="number"
                      value={formData.estoque_total}
                      onChange={(e) => setFormData({ ...formData, estoque_total: e.target.value })}
                      className="input"
                      placeholder="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="input"
                    placeholder="Detalhes do material..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingId ? 'Atualizar' : 'Criar'} Material
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

          {/* Materiais List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando materiais...</p>
              </div>
            </div>
          ) : materiaisData.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-500 mb-4">Nenhum material cadastrado</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Cadastrar Material
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {categorias.map(categoria => (
                <div key={categoria}>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">{categoria}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {materiaisData
                      .filter(m => m.categoria === categoria)
                      .map(material => (
                        <div key={material.id} className="card p-4 fade-in">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Package className="text-blue-600" size={20} />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{material.nome}</h3>
                                <p className="text-xs text-gray-600 mt-1">{material.unidade}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Preço Unitário:</span>
                              <span className="font-semibold">R$ {material.preco_unitario.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Estoque:</span>
                              <span className={`font-semibold ${material.estoque_total > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {material.estoque_total}
                              </span>
                            </div>
                            {material.descricao && (
                              <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200">
                                {material.descricao}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 pt-3 border-t border-gray-200">
                            <button
                              onClick={() => handleEdit(material)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded text-sm transition-colors"
                            >
                              <Edit2 size={14} />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(material.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded text-sm transition-colors"
                            >
                              <Trash2 size={14} />
                              Deletar
                            </button>
                          </div>
                        </div>
                      ))}
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
