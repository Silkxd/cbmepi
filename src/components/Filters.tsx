import { Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import { CandidatoFilters } from '../types/candidato';

interface FiltersProps {
  filters: CandidatoFilters;
  onFiltersChange: (filters: CandidatoFilters) => void;
  situacoes: string[];
  convocacoes: string[];
  condicoes: string[];
  nomeadosMatriculados: string[];
}

export function Filters({ 
  filters, 
  onFiltersChange, 
  situacoes, 
  convocacoes, 
  condicoes, 
  nomeadosMatriculados 
}: FiltersProps) {
  const handleFilterChange = (key: keyof CandidatoFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleOrder = () => {
    onFiltersChange({
      ...filters,
      orderDirection: filters.orderDirection === 'asc' ? 'desc' : 'asc'
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      nome: '',
      situacao: '',
      convocacao: '',
      condicao: '',
      nomeados_matriculados: '',
      orderBy: 'notas_finais',
      orderDirection: 'desc'
    });
  };

  // Função para renderizar o ícone de ordenação
  const renderSortIcon = () => {
    if (filters.orderDirection === 'asc') {
      return <ArrowUp className="w-4 h-4" />;
    } else {
      return <ArrowDown className="w-4 h-4" />;
    }
  };

  // Verificar se há filtros ativos
  const hasActiveFilters = filters.nome || filters.situacao || filters.convocacao || 
                          filters.condicao || filters.nomeados_matriculados ||
                          filters.orderBy !== 'notas_finais' || filters.orderDirection !== 'desc';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filtros de Busca</h3>
        </div>
        
        {/* Botão Limpar Filtros - visível apenas se há filtros ativos */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            title="Limpar todos os filtros"
          >
            <X className="w-4 h-4" />
            Limpar Filtros
          </button>
        )}
      </div>
      
      {/* Mobile-first responsive grid */}
      <div className="space-y-4">
        {/* Primeira linha: Busca por nome */}
        <div className="grid grid-cols-1">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por Nome
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Digite o nome do candidato..."
                value={filters.nome}
                onChange={(e) => handleFilterChange('nome', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Segunda linha: Filtros principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por situação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Situação
            </label>
            <select
              value={filters.situacao}
              onChange={(e) => handleFilterChange('situacao', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
              <option value="">Todas</option>
              {situacoes.map((situacao) => (
                <option key={situacao} value={situacao}>
                  {situacao === 'SEM_SITUACAO' ? 'Sem Situação' : situacao}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por convocação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Convocação
            </label>
            <select
              value={filters.convocacao}
              onChange={(e) => handleFilterChange('convocacao', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
              <option value="">Todas</option>
              {convocacoes.map((convocacao) => (
                <option key={convocacao} value={convocacao}>
                  {convocacao === 'SEM_CONVOCACAO' ? 'Sem Convocação' : convocacao}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por condição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condição
            </label>
            <select
              value={filters.condicao}
              onChange={(e) => handleFilterChange('condicao', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
              <option value="">Todas</option>
              {condicoes.map((condicao) => (
                <option key={condicao} value={condicao}>
                  {condicao === 'SEM_CONDICAO' ? 'Sem Condição' : condicao}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por nomeados/matriculados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomeados/Matriculados
            </label>
            <select
              value={filters.nomeados_matriculados}
              onChange={(e) => handleFilterChange('nomeados_matriculados', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
              <option value="">Todos</option>
              {nomeadosMatriculados.map((nomeado) => (
                <option key={nomeado} value={nomeado}>
                  {nomeado === 'SEM_NOMEADOS_MATRICULADOS' ? 'Sem Nomeação/Matrícula' : nomeado}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Terceira linha: Ordenação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-start-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <div className="flex gap-2">
              <select
                value={filters.orderBy}
                onChange={(e) => handleFilterChange('orderBy', e.target.value as 'notas_finais' | 'candidato')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              >
                <option value="notas_finais">Notas</option>
                <option value="candidato">Nome</option>
              </select>
              <button
                onClick={toggleOrder}
                className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex-shrink-0"
                title={`Ordenar ${filters.orderDirection === 'asc' ? 'decrescente' : 'crescente'}`}
              >
                {renderSortIcon()}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}