import { useState, useEffect } from 'react';
import { User } from '../types';
import Navigation from '../components/Navigation';
import { configuracoes } from '../services/supabase';
import { Save, Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface ConfiguracoesProps {
  user: User;
}

export default function Configuracoes({ user }: ConfiguracoesProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    nome_empresa: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    logo_url: ''
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data, error } = await configuracoes.obter();
        if (data) {
          setFormData({
            nome_empresa: data.nome_empresa || '',
            cnpj: data.cnpj || '',
            endereco: data.endereco || '',
            telefone: data.telefone || '',
            logo_url: data.logo_url || ''
          });
          if (data.logo_url) setLogoPreview(data.logo_url);
        }
      } catch (err) {
        console.error('Erro ao carregar configurações', err);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      let finalLogoUrl = formData.logo_url;

      if (logoFile) {
        const uploadRes = await configuracoes.uploadLogo(logoFile);
        if (uploadRes.error) throw uploadRes.error;
        if (uploadRes.data) {
          finalLogoUrl = uploadRes.data;
        }
      }

      const res = await configuracoes.salvar({ ...formData, logo_url: finalLogoUrl });
      if (res.error) throw res.error;

      setFormData(prev => ({ ...prev, logo_url: finalLogoUrl }));
      setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao salvar configurações' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation user={user} onLogout={() => {}} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 lg:relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Configurações da Empresa</h1>
            <p className="text-gray-600 mt-1">Configure os dados que aparecerão no cabeçalho dos orçamentos.</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo da Empresa</label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden flex flex-col items-center justify-center bg-gray-50 relative group">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="text-gray-400 text-center p-4">
                          <Upload className="mx-auto mb-2" size={24} />
                          <span className="text-xs">Fazer Upload</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        Esta logo será utilizada no topo dos documentos e orçamentos em PDF. 
                        Recomendamos imagens com fundo transparente (PNG).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa / Razão Social</label>
                    <input
                      type="text"
                      name="nome_empresa"
                      value={formData.nome_empresa}
                      onChange={handleChange}
                      className="input"
                      placeholder="Ex: Berlim Construções"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ (Opcional)</label>
                    <input
                      type="text"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleChange}
                      className="input"
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="input"
                    placeholder="(00) 90000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endereço Completo</label>
                  <textarea
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    className="input"
                    rows={3}
                    placeholder="Rua Exemplo, 123, Bairro, Cidade - UF"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save size={20} />
                    {saving ? 'Salvando...' : 'Salvar Configurações'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
