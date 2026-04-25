import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { obrasService } from '../services/supabase'
import { DemandasList } from '../components/DemandasList'
import { Obra } from '../types'
import { ArrowLeft, MapPin, Calendar, DollarSign } from 'lucide-react'

export function ObraDetalhes() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const [obra, setObra] = useState<Obra | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    async function load() {
      setLoading(true)
      const { data } = await obrasService.obter(id)
      setObra(data || null)
      setLoading(false)
    }

    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Carregando...</div>
      </div>
    )
  }

  if (!obra) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Obra não encontrada</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar com informações da obra */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{obra.nome}</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin size={18} className="flex-shrink-0 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Localização</p>
                    <p className="font-medium">{obra.localizacao}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <DollarSign size={18} className="flex-shrink-0 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Orçamento</p>
                    <p className="font-medium">R$ {obra.orcamento_total.toLocaleString('pt-BR')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar size={18} className="flex-shrink-0 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-500">Data de Fim</p>
                    <p className="font-medium">{new Date(obra.data_fim_prevista).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${
                      obra.status === 'finalizada' ? 'bg-green-500' :
                      obra.status === 'em_andamento' ? 'bg-blue-500' :
                      obra.status === 'pausada' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`} />
                    <span className="font-medium text-gray-900 capitalize">{obra.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {obra.descricao && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Descrição</p>
                  <p className="text-gray-700 text-sm">{obra.descricao}</p>
                </div>
              )}
            </div>
          </div>

          {/* Demandas */}
          <div className="lg:col-span-2">
            <DemandasList obraId={obra.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
