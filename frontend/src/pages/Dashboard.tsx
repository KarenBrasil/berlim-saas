import { useEffect, useState } from 'react';
import { User, Obra, Demanda } from '../types';
import Navigation from '../components/Navigation';
import { obras, demandas } from '../services/supabase';
import { TrendingUp, AlertCircle, CheckCircle, Clock, Users, DollarSign, ArrowRight } from 'lucide-react';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [obrasData, setObrasData] = useState<Obra[]>([]);
  const [demandasData, setDemandasData] = useState<Demanda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [obrasRes, demandasRes] = await Promise.all([
          obras.listar(),
          demandas.listarPendentes(''),
        ]);

        if (obrasRes.error) throw obrasRes.error;
        setObrasData(obrasRes.data || []);

        if (!demandasRes.error) {
          setDemandasData(demandasRes.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const obrasEmAndamento = obrasData.filter(o => o.status === 'em_andamento').length;
  const demandasPendentes = demandasData.filter(d => d.status !== 'concluida').length;
  const orcamentoTotal = obrasData.reduce((sum, o) => sum + (o.orcamento || 0), 0);
  const gastoTotal = obrasData.reduce((sum, o) => sum + (o.custo_atual || 0), 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation user={user} onLogout={() => {}} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 lg:relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Bem-vindo, {user.nome}!</p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-600">Última atualização</p>
                <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString('pt-BR')}</p>
              </div>
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

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando dados...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Obras em Andamento</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{obrasEmAndamento}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Demandas Pendentes</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{demandasPendentes}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="text-yellow-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Orçamento Total</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        R$ {(orcamentoTotal / 1000).toFixed(0)}k
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Gasto Atual</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        R$ {(gastoTotal / 1000).toFixed(0)}k
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Obras */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Obras Recentes</h2>
                    <ArrowRight className="text-gray-400" size={20} />
                  </div>
                  {obrasData.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhuma obra registrada</p>
                  ) : (
                    <div className="space-y-3">
                      {obrasData.slice(0, 5).map(obra => (
                        <div key={obra.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{obra.nome}</h3>
                              <p className="text-sm text-gray-600 mt-1">{obra.localizacao}</p>
                            </div>
                            <span className={`badge ${
                              obra.status === 'em_andamento' ? 'badge-warning' :
                              obra.status === 'concluida' ? 'badge-success' :
                              'badge-secondary'
                            }`}>
                              {obra.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Demandas Críticas</h2>
                    <AlertCircle className="text-gray-400" size={20} />
                  </div>
                  {demandasData.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhuma demanda pendente</p>
                  ) : (
                    <div className="space-y-3">
                      {demandasData
                        .filter(d => d.prioridade === 'critica' || d.prioridade === 'alta')
                        .slice(0, 5)
                        .map(demanda => (
                          <div key={demanda.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{demanda.titulo}</h3>
                                <p className="text-sm text-gray-600 mt-1 truncate">{demanda.descricao}</p>
                              </div>
                              <span className={`badge ${
                                demanda.prioridade === 'critica' ? 'badge-danger' :
                                demanda.prioridade === 'alta' ? 'badge-warning' :
                                'badge-info'
                              }`}>
                                {demanda.prioridade}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
