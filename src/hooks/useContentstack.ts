import { useQuery, useQueryClient } from '@tanstack/react-query';
import contentstackService from '@services/contentstack';
import { SearchParams } from '../types';

export const useProducts = (params: SearchParams = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => contentstackService.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => contentstackService.getProduct(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => contentstackService.getCategories(),
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: () => contentstackService.getBanners(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
  });
};

export const useHomePage = () => {
  return useQuery({
    queryKey: ['homePage'],
    queryFn: () => contentstackService.getHomePage(),
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useSearchProducts = (query: string, filters: any = {}) => {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: () => contentstackService.searchProducts(query, filters),
    enabled: !!query,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateProducts: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    invalidateProduct: (id: string) => queryClient.invalidateQueries({ queryKey: ['product', id] }),
    invalidateCategories: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    invalidateBanners: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
    invalidateHomePage: () => queryClient.invalidateQueries({ queryKey: ['homePage'] }),
    invalidateSearch: () => queryClient.invalidateQueries({ queryKey: ['search'] }),
  };
};