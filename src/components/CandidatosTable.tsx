import { Candidato } from '../types/candidato';

interface CandidatosTableProps {
  candidatos: Candidato[];
}

export function CandidatosTable({ candidatos }: CandidatosTableProps) {
  const getSituacaoColor = (situacao: string) => {
    if (situacao.includes('NOMEADO')) return 'text-green-700 bg-green-50';
    if (situacao.includes('DESLIGADO')) return 'text-red-700 bg-red-50';
    if (situacao.includes('MATRICULADO')) return 'text-blue-700 bg-blue-50';
    return 'text-gray-700 bg-gray-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Fed</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Notas Finais</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Candidato</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Condição</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Convocação</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Situação</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Nomeados/Matriculados</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {candidatos.map((candidato, index) => (
              <tr 
                key={candidato.id || index} 
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-4 py-3 text-sm text-gray-900">
                  {candidato.fed || '-'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {candidato.notas_finais.toFixed(1)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {candidato.candidato}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {candidato.condicao}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {candidato.convocacao}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSituacaoColor(candidato.situacao)}`}>
                    {candidato.situacao}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {candidato.nomeados_matriculados || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {candidatos.map((candidato, index) => (
          <div 
            key={candidato.id || index}
            className={`p-4 border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 text-sm">{candidato.candidato}</h3>
              <span className="text-sm font-bold text-orange-600">{candidato.notas_finais.toFixed(1)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Fed:</span>
                <span className="ml-1 text-gray-900">{candidato.fed || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">Condição:</span>
                <span className="ml-1 px-2 py-1 rounded-full bg-green-100 text-green-800">
                  {candidato.condicao}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Convocação:</span>
                <span className="ml-1 px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                  {candidato.convocacao}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Situação:</span>
                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getSituacaoColor(candidato.situacao)}`}>
                  {candidato.situacao}
                </span>
              </div>
            </div>
            
            {candidato.nomeados_matriculados && (
              <div className="mt-2 text-xs">
                <span className="text-gray-500">Nomeados/Matriculados:</span>
                <span className="ml-1 text-gray-600">{candidato.nomeados_matriculados}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {candidatos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum candidato encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
}