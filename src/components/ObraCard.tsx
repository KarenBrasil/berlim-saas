import { Obra } from '../types'
import { MapPin, DollarSign, Calendar, ChevronRight } from 'lucide-react'

interface ObraCardProps {
  obra: Obra
  onClick: () => void
}

export function ObraCard({ obra, onClick }: ObraCardProps) {
  const statusConfig = {
    finalizada: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: '✓ Finalizada' },
    em_andamento: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', label: '⚡ Em Andamento' },
    pausada: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', label: '⏸ Pausada' },
    planejamento: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500', label: '📋 Planejamento' }
  }

  const config = statusConfig[obra.status as keyof typeof statusConfig] || statusConfig.planejamento
  const percentualloConcluido = Math.random() * 100 // Simulado - integrar com dados reais depois

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left p-6 h-full flex flex-col group overflow-hidden relative"
    >
      {/* Gradient top accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
        obra.status === 'finalizada' ? 'from-green-400 to-green-600' :
        obra.status === 'em_andamento' ? 'from-blue-400 to-blue-600' :
        obra.status === 'pausada' ? 'from-yellow-400 to-yellow-600' :
        'from-gray-400 to-gray-600'
      }`}></div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1">
          <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">{obra.nome}</h3>
          <p className="text-xs text-gray-500 mt-1">Criada em {new Date(obra.created_at).toLocaleDateString('pt-BR')}</p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.text} flex items-center gap-1.5 ml-2`}>
          <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`}></span>
          {config.label}
        </div>
      </div>

      {obra.descricao && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{obra.descricao}</p>
      )}

      {/* Progress bar */}
      <div className="mb-4 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${
            obra.status === 'finalizada' ? 'from-green-400 to-green-600 w-full' :
            obra.status === 'em_andamento' ? 'from-blue-400 to-blue-600' :
            'from-gray-300 to-gray-400'
          }`}
          style={{ width: `${obra.status === 'finalizada' ? 100 : percentualloConcluido}%` }}
        ></div>
      </div>

      <div className="space-y-3 mb-6 py-4 border-t border-b border-gray-100">
        <div className="flex items-center gap-3 text-gray-700">
          <MapPin size={16} className="text-blue-600 flex-shrink-0" />
          <span className="text-sm font-medium">{obra.localizacao}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <DollarSign size={16} className="text-green-600 flex-shrink-0" />
          <span className="text-sm font-semibold">R$ {obra.orcamento_total.toLocaleString('pt-BR')}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <Calendar size={16} className="text-orange-600 flex-shrink-0" />
          <span className="text-sm font-medium">Termina em {new Date(obra.data_fim_prevista).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs font-semibold text-blue-600">Ver detalhes</span>
        <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1" />
      </div>
    </button>
  )
}
