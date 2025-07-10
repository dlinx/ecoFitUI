import { SearchParams } from '../types';

// Chat service configuration
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE;

export interface ChatRequest {
  userQuery: string;
  chatHistory: string[];
  appliedFilter: Record<string, any>;
  availableFilters: Record<string, Record<string, number>>;
}

export interface ChatResponse {
  filters: Record<string, any>;
  llm_response: string;
  suggestion: string[];
}

export interface AvailableFilters extends Record<string, Record<string, number>> {
  'gender.title': Record<string, number>;
  'category.title': Record<string, number>;
  'sku.size.title': Record<string, number>;
  'sku.color.title': Record<string, number>;
  'sub_category.title': Record<string, number>;
}

class ChatService {
  /**
   * Send a chat message to the AI service
   */
  async sendMessage(
    userQuery: string,
    chatHistory: string[],
    appliedFilters: Record<string, any>,
    availableFilters: AvailableFilters
  ): Promise<ChatResponse> {
    try {
      // Check if AI service URL is configured
      if (!AI_SERVICE_URL) {
        throw new Error('AI service URL not configured');
      }

      const requestBody: ChatRequest = {
        userQuery,
        chatHistory,
        appliedFilter: appliedFilters,
        availableFilters,
      };

      const response = await fetch(`${AI_SERVICE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  /**
   * Convert applied filters to URL search params
   */
  convertFiltersToSearchParams(filters: Record<string, any>): SearchParams {
    const searchParams: SearchParams = {};

    // Handle gender filter
    if (filters.gender) {
      searchParams.gender = Array.isArray(filters.gender) ? filters.gender : [filters.gender];
    }

    // Handle sub category filter
    if (filters.subCategory) {
      searchParams.subCategory = Array.isArray(filters.subCategory) ? filters.subCategory : [filters.subCategory];
    }

    // Handle price range filter
    if (filters.price) {
      if (filters.price.$gte !== undefined) {
        searchParams.minPrice = filters.price.$gte;
      }
      if (filters.price.$lte !== undefined) {
        searchParams.maxPrice = filters.price.$lte;
      }
    }

    // Handle category filter
    if (filters.category) {
      searchParams.category = Array.isArray(filters.category) ? filters.category : [filters.category];
    }

    // Handle color filter
    if (filters.color) {
      searchParams.color = Array.isArray(filters.color) ? filters.color : [filters.color];
    }

    // Handle size filter
    if (filters.size) {
      searchParams.size = Array.isArray(filters.size) ? filters.size : [filters.size];
    }

    return searchParams;
  }

  /**
   * Convert search params to applied filters format
   */
  convertSearchParamsToFilters(searchParams: SearchParams): Record<string, any> {
    const filters: Record<string, any> = {};

    if (searchParams.gender) {
      filters.gender = Array.isArray(searchParams.gender) ? searchParams.gender : [searchParams.gender];
    }

    if (searchParams.category) {
      filters.category = Array.isArray(searchParams.category) ? searchParams.category : [searchParams.category];
    }

    if (searchParams.subCategory) {
      filters.subCategory = Array.isArray(searchParams.subCategory) ? searchParams.subCategory : [searchParams.subCategory];
    }

    if (searchParams.color) {
      filters.color = Array.isArray(searchParams.color) ? searchParams.color : [searchParams.color];
    }

    if (searchParams.size) {
      filters.size = Array.isArray(searchParams.size) ? searchParams.size : [searchParams.size];
    }

    if (searchParams.minPrice !== undefined || searchParams.maxPrice !== undefined) {
      filters.price = {};
      if (searchParams.minPrice !== undefined) {
        filters.price.$gte = searchParams.minPrice;
      }
      if (searchParams.maxPrice !== undefined) {
        filters.price.$lte = searchParams.maxPrice;
      }
    }

    return filters;
  }

  /**
   * Build URL with search parameters
   */
  buildSearchUrl(searchParams: SearchParams): string {
    const params = new URLSearchParams();

    if (searchParams.q) {
      params.set('q', searchParams.q);
    }

    if (searchParams.gender) {
      const genderValue = Array.isArray(searchParams.gender) ? searchParams.gender.join(',') : searchParams.gender;
      params.set('gender', genderValue);
    }

    if (searchParams.category) {
      const categoryValue = Array.isArray(searchParams.category) ? searchParams.category.join(',') : searchParams.category;
      params.set('category', categoryValue);
    }

    if (searchParams.subCategory) {
      const subCategoryValue = Array.isArray(searchParams.subCategory) ? searchParams.subCategory.join(',') : searchParams.subCategory;
      params.set('subCategory', subCategoryValue);
    }

    if (searchParams.color) {
      const colorValue = Array.isArray(searchParams.color) ? searchParams.color.join(',') : searchParams.color;
      params.set('color', colorValue);
    }

    if (searchParams.size) {
      const sizeValue = Array.isArray(searchParams.size) ? searchParams.size.join(',') : searchParams.size;
      params.set('size', sizeValue);
    }

    if (searchParams.minPrice !== undefined) {
      params.set('minPrice', searchParams.minPrice.toString());
    }

    if (searchParams.maxPrice !== undefined) {
      params.set('maxPrice', searchParams.maxPrice.toString());
    }

    if (searchParams.sortBy) {
      params.set('sortBy', searchParams.sortBy);
    }

    if (searchParams.page) {
      params.set('page', searchParams.page.toString());
    }

    const queryString = params.toString();
    return queryString ? `/search?${queryString}` : '/search';
  }
}

export default new ChatService(); 