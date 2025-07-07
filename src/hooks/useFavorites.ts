import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../types';

const FAVORITES_KEY = 'ecofit-favorites';

// Get favorites from localStorage
const getFavoritesFromStorage = (): Product[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

// Save favorites to localStorage
const saveFavoritesToStorage = (favorites: Product[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

export const useFavorites = () => {
  const queryClient = useQueryClient();

  // Query to get favorites
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavoritesFromStorage,
    staleTime: Infinity, // Never stale since it's local storage
    gcTime: Infinity, // Never garbage collected
  });

  // Mutation to add to favorites
  const addToFavoritesMutation = useMutation({
    mutationFn: async (product: Product): Promise<Product[]> => {
      const currentFavorites = getFavoritesFromStorage();
      const isAlreadyFavorite = currentFavorites.some(fav => fav.id === product.id);
      
      if (isAlreadyFavorite) {
        throw new Error('Product is already in favorites');
      }
      
      const newFavorites = [...currentFavorites, product];
      saveFavoritesToStorage(newFavorites);
      return newFavorites;
    },
    onSuccess: (newFavorites: Product[]) => {
      queryClient.setQueryData(['favorites'], newFavorites);
    },
  });

  // Mutation to remove from favorites
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (productId: string): Promise<Product[]> => {
      const currentFavorites = getFavoritesFromStorage();
      const newFavorites = currentFavorites.filter(fav => fav.id !== productId);
      saveFavoritesToStorage(newFavorites);
      return newFavorites;
    },
    onSuccess: (newFavorites: Product[]) => {
      queryClient.setQueryData(['favorites'], newFavorites);
    },
  });

  // Mutation to toggle favorite status
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (product: Product): Promise<{ newFavorites: Product[]; isFavorite: boolean }> => {
      const currentFavorites = getFavoritesFromStorage();
      const isFavorite = currentFavorites.some(fav => fav.id === product.id);
      
      if (isFavorite) {
        const newFavorites = currentFavorites.filter(fav => fav.id !== product.id);
        saveFavoritesToStorage(newFavorites);
        return { newFavorites, isFavorite: false };
      } else {
        const newFavorites = [...currentFavorites, product];
        saveFavoritesToStorage(newFavorites);
        return { newFavorites, isFavorite: true };
      }
    },
    onSuccess: (data: { newFavorites: Product[]; isFavorite: boolean }) => {
      queryClient.setQueryData(['favorites'], data.newFavorites);
    },
  });

  // Helper function to check if a product is favorite
  const isFavorite = (productId: string): boolean => {
    return favorites.some(fav => fav.id === productId);
  };

  return {
    favorites,
    isFavorite,
    addToFavorites: addToFavoritesMutation.mutate,
    removeFromFavorites: removeFromFavoritesMutation.mutate,
    toggleFavorite: toggleFavoriteMutation.mutate,
    isLoading: addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending || toggleFavoriteMutation.isPending,
  };
}; 