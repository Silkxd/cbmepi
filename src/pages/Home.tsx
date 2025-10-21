import { Header } from '../components/Header';
import { Filters } from '../components/Filters';
import { CandidatosTable } from '../components/CandidatosTable';
import { Pagination } from '../components/Pagination';
import { useCandidatos } from '../hooks/useCandidatos';
import { Users, FileText } from 'lucide-react';

export function Home() {
  const { 
    candidatos, 
    filters, 
    setFilters, 
    situacoes, 
    convocacoes,
    condicoes,
    nomeadosMatriculados,
    totalCandidatos, 
    filteredCount,
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage
  } = useCandidatos();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 min-h-screen"
        style={{
          backgroundImage: 'url(/fundo_piaui.svg)',
          backgroundSize: '80%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-800">Total de Candidatos</h3>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">{totalCandidatos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-800">Candidatos Filtrados</h3>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{filteredCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Filters 
          filters={filters} 
          onFiltersChange={setFilters} 
          situacoes={situacoes} 
          convocacoes={convocacoes}
          condicoes={condicoes}
          nomeadosMatriculados={nomeadosMatriculados}
        />

        {/* Conteúdo principal */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando candidatos...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-600 mb-4">
              <FileText className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Erro ao carregar dados</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : candidatos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500 mb-4">
              <Users className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Nenhum candidato encontrado</p>
              <p className="text-sm">Tente ajustar os filtros de busca</p>
            </div>
          </div>
        ) : (
          <>
            {/* Tabela de candidatos */}
            <CandidatosTable candidatos={candidatos} />
            
            {/* Paginação */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredCount}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </>
        )}
      </main>
    </div>
  );
}