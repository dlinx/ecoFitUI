import { algoliasearch } from 'algoliasearch';
import { DetailedProduct, SearchParams } from '../types';

// Algolia configuration
const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_API_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY;
const ALGOLIA_INDEX_NAME = import.meta.env.VITE_ALGOLIA_INDEX_NAME;

// Initialize Algolia client
const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);

export interface AlgoliaSearchParams {
  query?: string;
  filters?: string;
  facets?: string[];
  facetFilters?: string[][];
  numericFilters?: string[];
  page?: number;
  hitsPerPage?: number;
  sortBy?: string;
}

export interface AlgoliaSearchResponse {
  hits: DetailedProduct[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  facets?: Record<string, Record<string, number>>;
  facetStats?: Record<string, { min: number; max: number }>;
}

export interface AlgoliaFacet {
  name: string;
  values: Array<{
    value: string;
    count: number;
  }>;
}

class AlgoliaService {
  /**
   * Search products with faceted filtering
   */
  async searchProducts(params: AlgoliaSearchParams = {}): Promise<AlgoliaSearchResponse> {
    try {
      const {
        query = '',
        filters = '',
        facets = ['gender.title', 'category.title', 'sub_category.title', 'sku.color.title', 'sku.size.title'],
        facetFilters = [],
        numericFilters = [],
        page = 0,
        hitsPerPage = 20,
        sortBy = 'newest'
      } = params;

      // Configure search parameters
      const searchParams: any = {
        query,
        page,
        hitsPerPage,
        facets,
        facetFilters,
        numericFilters,
        getRankingInfo: true,
        clickAnalytics: true,
      };

      // Add filters if provided
      if (filters) {
        searchParams.filters = filters;
      }

      // Handle sorting
      if (sortBy) {
        searchParams.sortFacetValuesBy = 'count';
      }

      const response = await searchClient.search([
        {
          indexName: ALGOLIA_INDEX_NAME,
          params: searchParams,
        },
      ]);

      const searchResults = response.results[0] as any;

      return {
        hits: searchResults.hits || [],
        nbHits: searchResults.nbHits || 0,
        page: searchResults.page || 0,
        nbPages: searchResults.nbPages || 0,
        hitsPerPage: searchResults.hitsPerPage || 20,
        facets: searchResults.facets,
        facetStats: searchResults.facetStats,
      };
    } catch (error) {
      console.error('Error searching products with Algolia:', error);
      throw error;
    }
  }

  /**
   * Convert SearchParams to Algolia search parameters
   */
  convertSearchParams(params: SearchParams): AlgoliaSearchParams {
    const algoliaParams: AlgoliaSearchParams = {
      query: params.q || '',
      page: (params.page || 1) - 1, // Algolia uses 0-based pagination
      hitsPerPage: params.limit || 20,
      sortBy: params.sortBy || 'newest',
    };

    const facetFilters: string[][] = [];
    const numericFilters: string[] = [];

    // Add gender filter
    if (params.gender) {
      if (Array.isArray(params.gender)) {
        // Multiple gender values - use OR logic within the same facet
        const genderFilters = params.gender.map(gender => `gender.title:${gender}`);
        facetFilters.push(genderFilters);
      } else {
        // Single gender value
        facetFilters.push([`gender.title:${params.gender}`]);
      }
    }

    // Add category filter
    if (params.category) {
      if (Array.isArray(params.category)) {
        // Multiple category values - use OR logic within the same facet
        const categoryFilters = params.category.map(category => `category.title:${category}`);
        facetFilters.push(categoryFilters);
      } else {
        // Single category value
        facetFilters.push([`category.title:${params.category}`]);
      }
    }

    // Add sub category filter
    if (params.subCategory) {
      if (Array.isArray(params.subCategory)) {
        // Multiple sub category values - use OR logic within the same facet
        const subCategoryFilters = params.subCategory.map(subCategory => `sub_category.title:${subCategory}`);
        facetFilters.push(subCategoryFilters);
      } else {
        // Single sub category value
        facetFilters.push([`sub_category.title:${params.subCategory}`]);
      }
    }

    // Add color filter
    if (params.color) {
      if (Array.isArray(params.color)) {
        // Multiple color values - use OR logic within the same facet
        const colorFilters = params.color.map(color => `sku.color.title:${color}`);
        facetFilters.push(colorFilters);
      } else {
        // Single color value
        facetFilters.push([`sku.color.title:${params.color}`]);
      }
    }

    // Add size filter
    if (params.size) {
      if (Array.isArray(params.size)) {
        // Multiple size values - use OR logic within the same facet
        const sizeFilters = params.size.map(size => `sku.size.title:${size}`);
        facetFilters.push(sizeFilters);
      } else {
        // Single size value
        facetFilters.push([`sku.size.title:${params.size}`]);
      }
    }

    // Handle sorting
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price-asc':
          algoliaParams.sortBy = 'price_asc';
          break;
        case 'price-desc':
          algoliaParams.sortBy = 'price_desc';
          break;
        case 'rating':
          algoliaParams.sortBy = 'rating_desc';
          break;
        case 'popular':
          algoliaParams.sortBy = 'popularity_desc';
          break;
        default:
          algoliaParams.sortBy = 'newest';
      }
    }

    // Add price range filter
    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      let priceFilter = '';
      if (params.minPrice !== undefined) {
        priceFilter += `price >= ${params.minPrice}`;
      }
      if (params.maxPrice !== undefined) {
        if (priceFilter) priceFilter += ' AND ';
        priceFilter += `price <= ${params.maxPrice}`;
      }
      if (priceFilter) {
        numericFilters.push(priceFilter);
      }
    }

    if (facetFilters.length > 0) {
      algoliaParams.facetFilters = facetFilters;
    }

    if (numericFilters.length > 0) {
      algoliaParams.numericFilters = numericFilters;
    }

    return algoliaParams;
  }
}

export default new AlgoliaService(); 