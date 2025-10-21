import { useState, useMemo, useEffect } from 'react';
import { Candidato, CandidatoFilters } from '../types/candidato';

// Função para normalizar strings (remover acentos e converter para minúsculas)
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
}

// Função para fazer parse do CSV
function parseCSV(csvText: string): Candidato[] {
  const lines = csvText.trim().split('\n');
  
  // Pular o cabeçalho (primeira linha)
  return lines.slice(1).map((line, index) => {
    // Usar ponto e vírgula como separador
    const values = line.split(';');
    
    // Mapear os campos conforme o novo formato:
    // fed;Notas Finais;Candidato;Condição;Convocação;Situação;Nomeados/ Matriculados (outros concursos)
    const fed = parseInt(values[0]) || 0;
    
    // Converter nota decimal de vírgula para ponto
    const notasFinaisStr = (values[1] || '').replace(',', '.');
    const notas_finais = parseFloat(notasFinaisStr) || 0;
    
    const candidato = (values[2] || '').trim();
    const condicao = (values[3] || '').trim();
    const convocacao = (values[4] || '').trim();
    const situacao = (values[5] || '').trim();
    const nomeados_matriculados = (values[6] || '').trim();

    return {
      id: index + 1,
      fed,
      notas_finais,
      candidato,
      condicao,
      convocacao,
      situacao,
      nomeados_matriculados
    };
  }).filter(candidato => candidato.fed > 0 && candidato.candidato.length > 0);
}

export function useCandidatos() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Carregar dados do CSV
  useEffect(() => {
    const loadCandidatos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/candidatos3.csv');
        if (!response.ok) {
          throw new Error('Erro ao carregar arquivo CSV');
        }
        const csvText = await response.text();
        const parsedCandidatos = parseCSV(csvText);
        setCandidatos(parsedCandidatos);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar candidatos:', err);
        setError('Erro ao carregar dados dos candidatos');
        setCandidatos([]);
      } finally {
        setLoading(false);
      }
    };

    loadCandidatos();
  }, []);
  
  const [filters, setFilters] = useState<CandidatoFilters>({
    nome: '',
    situacao: '',
    convocacao: '',
    condicao: '',
    nomeados_matriculados: '',
    orderBy: 'notas_finais',
    orderDirection: 'desc'
  });

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Resetar página quando itens por página mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Função para obter dados filtrados (usado para filtros em cascata)
  const getFilteredData = useMemo(() => {
    let filtered = [...candidatos];

    // Filtro por nome (ignorando maiúsculas/minúsculas e acentos)
    if (filters.nome) {
      const normalizedSearch = normalizeString(filters.nome);
      filtered = filtered.filter(candidato =>
        normalizeString(candidato.candidato).includes(normalizedSearch)
      );
    }

    // Filtro por situação (incluindo valores em branco)
    if (filters.situacao) {
      if (filters.situacao === 'SEM_SITUACAO') {
        filtered = filtered.filter(candidato =>
          !candidato.situacao || candidato.situacao.trim() === ''
        );
      } else {
        filtered = filtered.filter(candidato =>
          candidato.situacao === filters.situacao
        );
      }
    }

    // Filtro por convocação (incluindo valores em branco)
    if (filters.convocacao) {
      if (filters.convocacao === 'SEM_CONVOCACAO') {
        filtered = filtered.filter(candidato =>
          !candidato.convocacao || candidato.convocacao.trim() === ''
        );
      } else {
        filtered = filtered.filter(candidato =>
          candidato.convocacao === filters.convocacao
        );
      }
    }

    // Filtro por condição (incluindo valores em branco)
    if (filters.condicao) {
      if (filters.condicao === 'SEM_CONDICAO') {
        filtered = filtered.filter(candidato =>
          !candidato.condicao || candidato.condicao.trim() === ''
        );
      } else {
        filtered = filtered.filter(candidato =>
          candidato.condicao === filters.condicao
        );
      }
    }

    // Filtro por nomeados/matriculados (incluindo valores em branco)
    if (filters.nomeados_matriculados) {
      if (filters.nomeados_matriculados === 'SEM_NOMEADOS_MATRICULADOS') {
        filtered = filtered.filter(candidato =>
          !candidato.nomeados_matriculados || candidato.nomeados_matriculados.trim() === ''
        );
      } else {
        filtered = filtered.filter(candidato =>
          candidato.nomeados_matriculados === filters.nomeados_matriculados
        );
      }
    }

    return filtered;
  }, [candidatos, filters]);

  const filteredCandidatos = useMemo(() => {
    let filtered = getFilteredData;

    // Aplicar ordenação baseada nos filtros
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (filters.orderBy === 'notas_finais') {
        comparison = a.notas_finais - b.notas_finais;
      } else if (filters.orderBy === 'candidato') {
        comparison = a.candidato.localeCompare(b.candidato);
      }
      
      // Aplicar direção da ordenação
      if (filters.orderDirection === 'desc') {
        comparison = -comparison;
      }
      
      // Se os valores são iguais e estamos ordenando por notas, usar nome como critério secundário
      if (comparison === 0 && filters.orderBy === 'notas_finais') {
        comparison = a.candidato.localeCompare(b.candidato);
        if (filters.orderDirection === 'desc') {
          comparison = -comparison;
        }
      }
      
      return comparison;
    });

    return filtered;
  }, [getFilteredData, filters.orderBy, filters.orderDirection]);

  // Paginação
  const totalPages = Math.ceil(filteredCandidatos.length / itemsPerPage);
  const paginatedCandidatos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCandidatos.slice(startIndex, endIndex);
  }, [filteredCandidatos, currentPage, itemsPerPage]);

  // Obter valores únicos para os filtros (baseado nos dados já filtrados para cascata)
  const situacoes = useMemo(() => {
    // Para filtros em cascata, usar dados já filtrados (exceto pelo próprio campo situacao)
    const dataForSituacao = candidatos.filter(candidato => {
      let include = true;

      // Aplicar todos os filtros exceto situacao
      if (filters.nome) {
        const normalizedSearch = normalizeString(filters.nome);
        include = include && normalizeString(candidato.candidato).includes(normalizedSearch);
      }

      if (filters.convocacao) {
        if (filters.convocacao === 'SEM_CONVOCACAO') {
          include = include && (!candidato.convocacao || candidato.convocacao.trim() === '');
        } else {
          include = include && candidato.convocacao === filters.convocacao;
        }
      }

      if (filters.condicao) {
        if (filters.condicao === 'SEM_CONDICAO') {
          include = include && (!candidato.condicao || candidato.condicao.trim() === '');
        } else {
          include = include && candidato.condicao === filters.condicao;
        }
      }

      if (filters.nomeados_matriculados) {
        if (filters.nomeados_matriculados === 'SEM_NOMEADOS_MATRICULADOS') {
          include = include && (!candidato.nomeados_matriculados || candidato.nomeados_matriculados.trim() === '');
        } else {
          include = include && candidato.nomeados_matriculados === filters.nomeados_matriculados;
        }
      }

      return include;
    });

    const uniqueSituacoes = Array.from(new Set(dataForSituacao.map(c => c.situacao)));
    const filteredSituacoes = uniqueSituacoes.filter(s => s && s.trim() !== '');
    const hasEmptySituacao = dataForSituacao.some(c => !c.situacao || c.situacao.trim() === '');
    
    const result = filteredSituacoes.sort();
    
    if (hasEmptySituacao) {
      result.unshift('SEM_SITUACAO');
    }
    
    return result;
  }, [candidatos, filters.nome, filters.convocacao, filters.condicao, filters.nomeados_matriculados]);

  const convocacoes = useMemo(() => {
    // Para filtros em cascata, usar dados já filtrados (exceto pelo próprio campo convocacao)
    const dataForConvocacao = candidatos.filter(candidato => {
      let include = true;

      if (filters.nome) {
        const normalizedSearch = normalizeString(filters.nome);
        include = include && normalizeString(candidato.candidato).includes(normalizedSearch);
      }

      if (filters.situacao) {
        if (filters.situacao === 'SEM_SITUACAO') {
          include = include && (!candidato.situacao || candidato.situacao.trim() === '');
        } else {
          include = include && candidato.situacao === filters.situacao;
        }
      }

      if (filters.condicao) {
        if (filters.condicao === 'SEM_CONDICAO') {
          include = include && (!candidato.condicao || candidato.condicao.trim() === '');
        } else {
          include = include && candidato.condicao === filters.condicao;
        }
      }

      if (filters.nomeados_matriculados) {
        if (filters.nomeados_matriculados === 'SEM_NOMEADOS_MATRICULADOS') {
          include = include && (!candidato.nomeados_matriculados || candidato.nomeados_matriculados.trim() === '');
        } else {
          include = include && candidato.nomeados_matriculados === filters.nomeados_matriculados;
        }
      }

      return include;
    });

    const uniqueConvocacoes = Array.from(new Set(dataForConvocacao.map(c => c.convocacao)));
    const filteredConvocacoes = uniqueConvocacoes.filter(c => c && c.trim() !== '');
    const hasEmptyConvocacao = dataForConvocacao.some(c => !c.convocacao || c.convocacao.trim() === '');
    
    const result = filteredConvocacoes.sort();
    
    if (hasEmptyConvocacao) {
      result.unshift('SEM_CONVOCACAO');
    }
    
    return result;
  }, [candidatos, filters.nome, filters.situacao, filters.condicao, filters.nomeados_matriculados]);

  const condicoes = useMemo(() => {
    // Para filtros em cascata, usar dados já filtrados (exceto pelo próprio campo condicao)
    const dataForCondicao = candidatos.filter(candidato => {
      let include = true;

      if (filters.nome) {
        const normalizedSearch = normalizeString(filters.nome);
        include = include && normalizeString(candidato.candidato).includes(normalizedSearch);
      }

      if (filters.situacao) {
        if (filters.situacao === 'SEM_SITUACAO') {
          include = include && (!candidato.situacao || candidato.situacao.trim() === '');
        } else {
          include = include && candidato.situacao === filters.situacao;
        }
      }

      if (filters.convocacao) {
        if (filters.convocacao === 'SEM_CONVOCACAO') {
          include = include && (!candidato.convocacao || candidato.convocacao.trim() === '');
        } else {
          include = include && candidato.convocacao === filters.convocacao;
        }
      }

      if (filters.nomeados_matriculados) {
        if (filters.nomeados_matriculados === 'SEM_NOMEADOS_MATRICULADOS') {
          include = include && (!candidato.nomeados_matriculados || candidato.nomeados_matriculados.trim() === '');
        } else {
          include = include && candidato.nomeados_matriculados === filters.nomeados_matriculados;
        }
      }

      return include;
    });

    const uniqueCondicoes = Array.from(new Set(dataForCondicao.map(c => c.condicao)));
    const filteredCondicoes = uniqueCondicoes.filter(c => c && c.trim() !== '');
    const hasEmptyCondicao = dataForCondicao.some(c => !c.condicao || c.condicao.trim() === '');
    
    const result = filteredCondicoes.sort();
    
    if (hasEmptyCondicao) {
      result.unshift('SEM_CONDICAO');
    }
    
    return result;
  }, [candidatos, filters.nome, filters.situacao, filters.convocacao, filters.nomeados_matriculados]);

  const nomeadosMatriculados = useMemo(() => {
    // Para filtros em cascata, usar dados já filtrados (exceto pelo próprio campo nomeados_matriculados)
    const dataForNomeados = candidatos.filter(candidato => {
      let include = true;

      if (filters.nome) {
        const normalizedSearch = normalizeString(filters.nome);
        include = include && normalizeString(candidato.candidato).includes(normalizedSearch);
      }

      if (filters.situacao) {
        if (filters.situacao === 'SEM_SITUACAO') {
          include = include && (!candidato.situacao || candidato.situacao.trim() === '');
        } else {
          include = include && candidato.situacao === filters.situacao;
        }
      }

      if (filters.convocacao) {
        if (filters.convocacao === 'SEM_CONVOCACAO') {
          include = include && (!candidato.convocacao || candidato.convocacao.trim() === '');
        } else {
          include = include && candidato.convocacao === filters.convocacao;
        }
      }

      if (filters.condicao) {
        if (filters.condicao === 'SEM_CONDICAO') {
          include = include && (!candidato.condicao || candidato.condicao.trim() === '');
        } else {
          include = include && candidato.condicao === filters.condicao;
        }
      }

      return include;
    });

    const uniqueNomeados = Array.from(new Set(dataForNomeados.map(c => c.nomeados_matriculados)));
    const filteredNomeados = uniqueNomeados.filter(n => n && n.trim() !== '');
    const hasEmptyNomeados = dataForNomeados.some(c => !c.nomeados_matriculados || c.nomeados_matriculados.trim() === '');
    
    const result = filteredNomeados.sort();
    
    if (hasEmptyNomeados) {
      result.unshift('SEM_NOMEADOS_MATRICULADOS');
    }
    
    return result;
  }, [candidatos, filters.nome, filters.situacao, filters.convocacao, filters.condicao]);

  return {
    candidatos: paginatedCandidatos,
    filters,
    setFilters,
    situacoes,
    convocacoes,
    condicoes,
    nomeadosMatriculados,
    totalCandidatos: candidatos.length,
    filteredCount: filteredCandidatos.length,
    loading,
    error,
    // Paginação
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage
  };
}