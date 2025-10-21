export interface Candidato {
  id?: number;
  fed: number | null;
  notas_finais: number;
  candidato: string;
  condicao: string;
  convocacao: string;
  situacao: string;
  nomeados_matriculados: string;
}

export interface CandidatoFilters {
  nome: string;
  situacao: string;
  convocacao: string;
  condicao: string;
  nomeados_matriculados: string;
  orderBy: 'notas_finais' | 'candidato';
  orderDirection: 'asc' | 'desc';
}