import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange
}: PaginationProps) {
  // Calcular range de páginas para exibir
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = totalPages > 1 ? getPageNumbers() : [];

  // Calcular range de itens sendo exibidos
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Informações sobre itens */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            Exibindo <span className="font-semibold">{startItem}</span> a{' '}
            <span className="font-semibold">{endItem}</span> de{' '}
            <span className="font-semibold">{totalItems}</span> candidatos
          </span>
          
          {/* Seletor de itens por página */}
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
              Por página:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
        </div>

        {/* Controles de navegação */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {/* Primeira página */}
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Primeira página"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Página anterior */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Números das páginas */}
            <div className="flex items-center gap-1 mx-2">
              {pageNumbers.map((pageNumber, index) => (
                <div key={index}>
                  {pageNumber === '...' ? (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => onPageChange(pageNumber as number)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-orange-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Próxima página */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Próxima página"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Última página */}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Última página"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}