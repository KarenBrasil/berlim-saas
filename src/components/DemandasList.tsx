import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { demandasService } from '../services/supabase'
import { Demanda } from '../types'
import { Plus, AlertCircle, Trash2 } from 'lucide-react'

interface DemandasListProps {
  obraId: string
}

export function DemandasList({ obraId }: DemandasListProps) {
  const { user } = useAuth()
  const [demandas, setDemandas] = useState<Demanda[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media' as const,
    data_vencimento: ''
  })

  useEffect(() => {
    loadDemandas()
  }, [obraId])

  async function loadDemandas() {
    setLoading(true)
    const { data } = await demandasService.listarPorObra(obraId)
    setDemandas(data || [])
    setLoading(false)
  }

  async function handleAddDemanda(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    const { data, error } = await demandasService.criar(obraId, user.id, formData)
    if (!error && data) {
      setDemandas([data[0], ...demandas])
      setFormData({ titulo: '', descricao: '', prioridade: 'media', data_vencimento: '' })
      setShowForm(false)
    }
  }

  async function handleStatusChange(demandaId: string, novoStatus: Demanda['status']) {
    await demandasService.atualizar(demandaId, { status: novoStatus })
    await loadDemandas()
  }

  const statusColors = {
    aberta: 'bg-red-100 text-red-800',
    em_andamento: 'bg-blue-100 text-blue-800',
    concluida: 'bg-green-100 text-green-800',
    cancelada: 'bg-gray-100 text-gray-800'
  }

  const prioridadeColors = {
    baixa: 'bg-gray-50 border-gray-200',
    media: 'bg-blue-50 border-blue-200',
    alta: 'bg-orange-50 border-orange-200',
    urgente: 'bg-red-50 border-red-200'
  }

  const prioridadeIndicator = {
    baixa: 'text-gray-600',
    media: 'text-blue-600',
    alta: 'text-orange-600',
    urgente: 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Demandas</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <Plus size={18} />
            Nova Demanda
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddDemanda} className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade *</label>
                <select
                  value={formData.prioridade}
                  onChange={(e) => setFormData({ ...formData, prioridade: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Vencimento *</label>
                <input
                  type="date"
                  value={formData.data_vencimento}
                  onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Carregando demandas...</div>
        ) : demandas.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Nenhuma demanda criada</div>
        ) : (
          demandas.map((demanda) => (
            <div key={demanda.id} className={`p-4 ${prioridadeColors[demanda.prioridade]} border-l-4 ${
              demanda.prioridade === 'urgente' ? 'border-l-red-500' :
              demanda.prioridade === 'alta' ? 'border-l-orange-500' :
              demanda.prioridade === 'media' ? 'border-l-blue-500' :
              'border-l-gray-500'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{demanda.titulo}</h4>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[demanda.status]}`}>
                      {demanda.status.replace('_', ' ')}
                    </span>
                  </div>

                  {demanda.descricao && (
                    <p className="text-sm text-gray-700 mb-2">{demanda.descricao}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className={`font-medium ${prioridadeIndicator[demanda.prioridade]}`}>
                      {demanda.prioridade.charAt(0).toUpperCase() + demanda.prioridade.slice(1)}
                    </span>
                    <span>Vence: {new Date(demanda.data_vencimento).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={demanda.status}
                    onChange={(e) => handleStatusChange(demanda.id, e.target.value as Demanda['status'])}
                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="aberta">Aberta</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
