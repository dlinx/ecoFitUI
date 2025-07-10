import { useQuery } from '@tanstack/react-query';
import algoliaService from '@services/algolia';
import { SearchParams } from '../types';

export const useAlgoliaSearch = (params: SearchParams = {}) => {
  return useQuery({
    queryKey: ['algolia-search', params],
    queryFn: async () => {
      const algoliaParams = algoliaService.convertSearchParams(params);
      return algoliaService.searchProducts(algoliaParams);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAlgoliaSearchWithFacets = (params: SearchParams = {}) => {
  const searchQuery = useAlgoliaSearch(params);

  return {
    data: searchQuery.data,
    isLoading: searchQuery.isLoading ,
    error: searchQuery.error,
    facets: searchQuery.data?.facets,
    refetch: searchQuery.refetch,
  };
}; 