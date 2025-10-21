import { useState } from 'react';
import { Header } from '../components/Header';
import { Upload, FileText, Users, Download, AlertCircle } from 'lucide-react';
import { useCandidatos } from '../hooks/useCandidatos';

export function Admin() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Usar o hook para obter dados dinâmicos
  const { candidatos, loading } = useCandidatos();

  // Calcular estatísticas dinamicamente
  const totalCandidatos = candidatos.length;
  const nomeados = candidatos.filter(c => c.situacao === 'NOMEADO').length;
  const matriculadosT2 = candidatos.filter(c => c.situacao === 'MATRICULADO T2').length;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    // Simular upload
    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus('success');
      setSelectedFile(null);
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    // Simular download do template
    alert('Template Excel será baixado em breve');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título da página */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h2>
          <p className="text-gray-600">
            Gerencie os dados dos candidatos do concurso do Corpo de Bombeiros Militar
          </p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-orange-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total de Candidatos</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {loading ? '...' : totalCandidatos}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Nomeados</h3>
                <p className="text-2xl font-bold text-red-600">
                  {loading ? '...' : nomeados}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Matriculados T2</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {loading ? '...' : matriculadosT2}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de upload */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Upload className="w-6 h-6 text-orange-600" />
            Upload de Dados
          </h3>
          
          <div className="space-y-4">
            {/* Template download */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">Template Excel</h4>
                <p className="text-sm text-gray-600">
                  Baixe o template para organizar os dados dos candidatos
                </p>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Baixar Template
              </button>
            </div>

            {/* File upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              
              {!selectedFile ? (
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Selecione um arquivo Excel
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Formatos aceitos: .xlsx, .xls
                  </p>
                  <label className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors">
                    <FileText className="w-4 h-4" />
                    Escolher Arquivo
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Arquivo selecionado:
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {selectedFile.name}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isUploading ? 'Enviando...' : 'Enviar Arquivo'}
                    </button>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Status messages */}
            {uploadStatus === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  ✅ Arquivo enviado com sucesso!
                </p>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">
                  ❌ Erro ao enviar arquivo. Tente novamente.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ações administrativas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Ações Administrativas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h4 className="font-medium text-gray-800 mb-1">Exportar Dados</h4>
              <p className="text-sm text-gray-600">
                Baixar todos os dados em formato Excel
              </p>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h4 className="font-medium text-gray-800 mb-1">Limpar Cache</h4>
              <p className="text-sm text-gray-600">
                Atualizar dados em cache do sistema
              </p>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h4 className="font-medium text-gray-800 mb-1">Relatórios</h4>
              <p className="text-sm text-gray-600">
                Gerar relatórios estatísticos
              </p>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h4 className="font-medium text-gray-800 mb-1">Configurações</h4>
              <p className="text-sm text-gray-600">
                Ajustar configurações do sistema
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}