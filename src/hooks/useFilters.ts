import { useState, useCallback } from 'react';
import { Filter } from '@types';

const initialFilters: Filter = {
  gender: [],
  class: [],
  category: [],
  priceRange: [0, 1000],
  inStock: false,
};

export const useFilters = () => {
  const [filters, setFilters] = useState<Filter>(initialFilters);

  const updateFilter = useCallback((key: keyof Filter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const clearFilter = useCallback((key: keyof Filter) => {
    setFilters(prev => ({
      ...prev,
      [key]: Array.isArray(prev[key]) ? [] : key === 'inStock' ? false : [0, 1000],
    }));
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    clearFilter,
  };
};