import { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import Navigation from '../components/Navigation';
import { configuracoes } from '../services/supabase';
import { Plus, Trash2, Download, FileText } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface OrcamentosProps {
  user: User;
}

interface Servico {
  id: string;
  descricao: string;
  valor: number;
}

export default function Orcamentos({ user }: OrcamentosProps) {
  const [config, setConfig] = useState<any>(null);
  
  const [cliente, setCliente] = useState({
    nome: '',
    documento: '',
    telefone: '',
    endereco: ''
  });

  const [servicos, setServicos] = useState<Servico[]>([
    { id: '1', descricao: '', valor: 0 }
  ]);

  const [observacoes, setObservacoes] = useState('');
  
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadConfig = async () => {
      const { data } = await configuracoes.obter();
      if (data) {
        setConfig(data);
      }
    };
    loadConfig();
  }, []);

  const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleServicoChange = (id: string, field: keyof Servico, value: string | number) => {
    setServicos(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const addServico = () => {
    setServicos(prev => [...prev, { id: Date.now().toString(), descricao: '', valor: 0 }]);
  };

  const removeServico = (id: string) => {
    if (servicos.length > 1) {
      setServicos(prev => prev.filter(s => s.id !== id));
    }
  };

  const calcularTotal = () => {
    return servicos.reduce((total, s) => total + (Number(s.valor) || 0), 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const downloadPDF = () => {
    const element = invoiceRef.current;
    if (!element) return;

    const opt = {
      margin:       10,
      filename:     `Orcamento_${cliente.nome || 'Cliente'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation user={user} onLogout={() => {}} />

      <main className="flex-1 overflow-auto flex flex-col lg:flex-row">
        {/* Painel de Edição (Esquerda) */}
        <div className="w-full lg:w-1/2 p-6 lg:p-8 border-r border-gray-200 overflow-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gerador de Orçamentos</h1>
              <p className="text-gray-600 text-sm mt-1">Preencha os dados para gerar o PDF.</p>
            </div>
            <button onClick={downloadPDF} className="btn-primary flex items-center gap-2">
              <Download size={18} />
              Baixar PDF
            </button>
          </div>

          <div className="space-y-8">
            {/* Dados do Cliente */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-indigo-600"/> Dados do Cliente
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nome / Razão Social</label>
                  <input type="text" name="nome" value={cliente.nome} onChange={handleClienteChange} className="input text-sm" placeholder="Sr. Marcos" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">CPF / CNPJ (Opcional)</label>
                  <input type="text" name="documento" value={cliente.documento} onChange={handleClienteChange} className="input text-sm" placeholder="000.000.000-00" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Endereço (Opcional)</label>
                  <input type="text" name="endereco" value={cliente.endereco} onChange={handleClienteChange} className="input text-sm" placeholder="Rua da Obra, 123" />
                </div>
              </div>
            </div>

            {/* Serviços */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Serviços e Valores</h2>
              
              <div className="space-y-3">
                {servicos.map((s, index) => (
                  <div key={s.id} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Descrição do Serviço</label>
                      <input 
                        type="text" 
                        value={s.descricao} 
                        onChange={(e) => handleServicoChange(s.id, 'descricao', e.target.value)} 
                        className="input text-sm" 
                        placeholder="Ex: Fazer Revestimento da piscina" 
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Valor (R$)</label>
                      <input 
                        type="number" 
                        value={s.valor || ''} 
                        onChange={(e) => handleServicoChange(s.id, 'valor', parseFloat(e.target.value))} 
                        className="input text-sm" 
                        placeholder="0.00" 
                      />
                    </div>
                    <button 
                      onClick={() => removeServico(s.id)}
                      className="mt-6 p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover serviço"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={addServico}
                className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Plus size={16} /> Adicionar Serviço
              </button>
            </div>

            {/* Observações */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Observações Finais</h2>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="input text-sm"
                rows={3}
                placeholder="Ex: As peças de porcelanato e as bordas no tamanho de 2,5. Fornecimento apenas de Mão de Obra."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Painel de Preview (Direita) */}
        <div className="w-full lg:w-1/2 bg-gray-200 p-8 overflow-auto flex justify-center items-start">
          
          {/* Folha A4 do PDF */}
          <div 
            ref={invoiceRef}
            className="bg-white shadow-xl"
            style={{ width: '210mm', minHeight: '297mm', padding: '0' }}
          >
            {/* Header da Empresa */}
            <div className="bg-slate-900 text-white p-10 flex justify-between items-center">
              <div className="flex items-center gap-4 max-w-[50%]">
                {config?.logo_url ? (
                  <img src={config.logo_url} alt="Logo" className="h-16 object-contain bg-white p-1 rounded" />
                ) : (
                  <div className="w-16 h-16 bg-indigo-500 flex items-center justify-center rounded font-bold text-2xl">
                    {config?.nome_empresa?.charAt(0) || 'E'}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-orange-500">{config?.nome_empresa || 'Nome da Sua Empresa'}</h2>
                  {config?.cnpj && <p className="text-xs text-gray-400 mt-1">CNPJ: {config.cnpj}</p>}
                </div>
              </div>
              <div className="text-right text-xs text-gray-300 space-y-1">
                {config?.telefone && <p>{config.telefone}</p>}
                {config?.endereco && <p className="max-w-[200px]">{config.endereco}</p>}
              </div>
            </div>

            <div className="p-10">
              {/* Título e Cliente */}
              <div className="flex justify-between items-start mb-12 border-b border-gray-200 pb-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Orçamento Para</h3>
                  <p className="text-lg font-bold text-gray-900">{cliente.nome || 'Nome do Cliente'}</p>
                  {cliente.documento && <p className="text-sm text-gray-600 mt-1">Doc: {cliente.documento}</p>}
                  {cliente.endereco && <p className="text-sm text-gray-600 mt-1">{cliente.endereco}</p>}
                </div>
                <div className="text-right">
                  <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">ORÇAMENTO</h1>
                  <p className="text-sm text-gray-500 mt-2">Data: {new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              {/* Tabela de Serviços */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="bg-slate-900 text-white text-sm">
                    <th className="py-3 px-4 text-left font-semibold">Descrição do Serviço</th>
                    <th className="py-3 px-4 text-right font-semibold w-40">Valor</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {servicos.map((s, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-4 px-4">{s.descricao || '-'}</td>
                      <td className="py-4 px-4 text-right">{formatCurrency(s.valor || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totais */}
              <div className="flex justify-end mb-12">
                <div className="w-64 bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-lg font-bold text-slate-900">
                    <span>Valor Total:</span>
                    <span className="text-orange-600">{formatCurrency(calcularTotal())}</span>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {observacoes && (
                <div className="mb-12">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Observações:</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{observacoes}</p>
                </div>
              )}

              {/* Assinatura */}
              <div className="mt-20 flex justify-center">
                <div className="text-center w-64">
                  <div className="border-t border-gray-800 pt-2">
                    <p className="font-bold text-gray-900">{config?.nome_empresa || 'Sua Empresa'}</p>
                    <p className="text-xs text-gray-500 mt-1">Responsável Técnico</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
