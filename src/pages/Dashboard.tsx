import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { obrasService, auth } from '../services/supabase'
import { ObraCard } from '../components/ObraCard'
import { Obra } from '../types'
import { Plus, LogOut, Building2, TrendingUp } from 'lucide-react'

export function Dashboard() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [obras, setObras] = useState<Obra[]>([])
  const [obraLoading, setObraLoading] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login')
      return
    }

    loadObras()
  }, [user, loading, navigate])

  async function loadObras() {
    setObraLoading(true)
    const { data } = await obrasService.listar(user?.id)
    if (data) setObras(data)
    setObraLoading(false)
  }

  async function handleLogout() {
    await auth.logout()
    navigate('/login')
  }

  if (loading || obraLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200">Carregando seu dashboard...</p>
        </div>
      </div>
    )
  }

  const totalOrcamento = obras.reduce((acc, obra) => acc + (obra.orcamento_total || 0), 0)
  const obraEmAndamento = obras.filter(o => o.status === 'em_andamento').length
  const obraFinalizadas = obras.filter(o => o.status === 'finalizada').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Premium */}
      <nav className="bg-white shadow-2xl border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Berlim SaaS</h1>
              <p className="text-xs text-blue-600 font-semibold">Gerenciamento de Obras</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/nova-obra')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md"
            >
              <Plus size={20} />
              Nova Obra
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* KPIs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total de Obras</p>
                <p className="text-4xl font-black text-gray-900 mt-2">{obras.length}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 size={28} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Em Andamento</p>
                <p className="text-4xl font-black text-gray-900 mt-2">{obraEmAndamento}</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp size={28} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Orçamento Total</p>
                <p className="text-2xl font-black text-gray-900 mt-2">R$ {(totalOrcamento / 1000000).toFixed(1)}M</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Obras Section */}
        <div>
          <div className="flex items-baseline gap-3 mb-8">
            <h2 className="text-3xl font-black text-gray-900">Minhas Obras</h2>
            <p className="text-gray-600 font-medium">{obras.length} {obras.length === 1 ? 'obra' : 'obras'}</p>
          </div>

          {obras.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg border-2 border-dashed border-blue-200">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 size={40} className="text-blue-600" />
              </div>
              <p className="text-xl font-semibold text-gray-900 mb-2">Comece sua primeira obra</p>
              <p className="text-gray-600 mb-6">Crie uma nova obra para gerenciar demandas, funcionários e materiais</p>
              <button
                onClick={() => navigate('/nova-obra')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
              >
                <Plus size={20} />
                Criar Primeira Obra
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {obras.map((obra) => (
                <ObraCard
                  key={obra.id}
                  obra={obra}
                  onClick={() => navigate(`/obra/${obra.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
