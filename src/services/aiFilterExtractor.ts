import { SearchParams } from '../types';

// AI Filter Extractor configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export interface FilterExtractionRequest {
  userQuery: string;
  currentFilters?: SearchParams;
  availableFilters?: Record<string, string[]>;
}

export interface FilterExtractionResponse {
  filters: SearchParams;
  confidence: number;
  explanation: string;
  response: string;
  suggestions: string[];
}

class AIFilterExtractor {
      /**
   * Extract filters from natural language query using Google Gemini
   */
  async extractFilters(
    userQuery: string, 
    currentFilters?: SearchParams,
    availableFilters?: Record<string, string[]>
  ): Promise<FilterExtractionResponse> {
    try {
      // Check if Gemini API key is configured
      if (!GEMINI_API_KEY) {
        console.warn('Gemini API key not configured, using fallback extraction');
        return this.fallbackExtraction(userQuery, currentFilters);
      }

      const prompt = this.buildPrompt(userQuery, currentFilters, availableFilters);

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                }),
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            const extractedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!extractedText) {
                throw new Error('No response from Gemini API');
            }

            return this.parseGeminiResponse(extractedText);
        } catch (error) {
            console.error('Error extracting filters with Gemini:', error);
            return this.fallbackExtraction(userQuery);
        }
    }

      /**
   * Build prompt for Gemini API
   */
  private buildPrompt(
    userQuery: string, 
    currentFilters?: SearchParams,
    availableFilters?: Record<string, string[]>
  ): string {
    const filterOptions = availableFilters ? 
      `Available filter options: ${JSON.stringify(availableFilters, null, 2)}` : 
      '';

    const currentFiltersContext = currentFilters && Object.keys(currentFilters).length > 0 ? 
      `Current active filters: ${JSON.stringify(currentFilters, null, 2)}` : 
      'No current filters applied';

    return `You are an AI assistant that extracts product search filters from natural language queries for a fashion apparel store.

All prices and currency should be in INR (₹). Do not use $ or USD. Use the ₹ symbol and Indian number formatting (e.g., ₹1,000, ₹50,000).

User Query: "${userQuery}"

${currentFiltersContext}

${filterOptions}

Please extract the following filters from the user query and respond in RAW JSON format:

IMPORTANT: The user query should be interpreted as modifications to the current filters. For example:
- If current filters show "Women" and user says "also show men", add "Men" to gender
- If current filters show "Tops" category and user says "change to bottoms", replace category with "Bottoms"
- If current filters show price under ₹500 and user says "make it under ₹300", update maxPrice to 300
- If user says "clear all filters", return empty filters object
- If user says "remove color filter", remove the color property from filters

{
  "filters": {
    "gender": ["Men", "Women", "Unisex"],
    "category": ["Tops", "Bottoms", "Dresses", "Outerwear", "Boys", "Girls", "Age Groups"],
    "subCategory": ["T-shirts","Shirts", "Blouses", "Jeans", "Shirts", "Shorts", "Jackets", "Coats","Polos", "Trousers"],
    "color": ["Rust Orange","Mustard Yellow","Pastel Pink","Navy Blue","White","Beige","Burgundy","Olive Green","Charcoal Gray","Black","Red"],
    "size": ["XS", "S", "M", "L", "XL", "XXL"]
  },
  "confidence": 0.95,
  "explanation": "Brief explanation of extracted filters",
  "response": "Conversational response describing what was found (use INR ₹). Do not use word filter in the response",
  "suggestions": ["Suggestion 1 (use INR ₹)", "Suggestion 2", "Suggestion 3"]
}`;
  }

    /**
     * Parse Gemini API response
     */
    private parseGeminiResponse(responseText: string): FilterExtractionResponse {
        try {
            // Extract JSON from response (handle markdown code blocks)
            const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
                responseText.match(/\{[\s\S]*\}/);

            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const parsed = JSON.parse(jsonStr);

                  return {
        filters: parsed.filters || {},
        confidence: parsed.confidence || 0.5,
        explanation: parsed.explanation || 'Filters extracted from query',
        response: parsed.response || 'Here are the products matching your criteria.',
        suggestions: parsed.suggestions || []
      };
        } catch (error) {
            console.error('Error parsing Gemini response:', error);
            throw new Error('Invalid response format from Gemini API');
        }
    }

      /**
   * Fallback filter extraction using simple keyword matching
   */
  private fallbackExtraction(userQuery: string, currentFilters?: SearchParams): FilterExtractionResponse {
    const query = userQuery.toLowerCase();
    const filters: SearchParams = { ...currentFilters }; // Start with current filters

            // Handle clear filters command
    if (query.includes('clear') || query.includes('reset') || query.includes('remove all')) {
      return {
        filters: {},
        confidence: 0.9,
        explanation: 'All filters cleared',
        response: 'I\'ve cleared all filters. You can now start a new search.',
        suggestions: ['Show me tops', 'Find dresses', 'Browse all clothing']
      };
    }

    // Extract search query
    if (!filters.q) {
      filters.q = userQuery;
    }

    // Extract gender modifications
    if (query.includes('men') || query.includes('male')) {
      if (query.includes('also') || query.includes('add') || query.includes('include')) {
        // Add to existing gender filters
        const currentGender = filters.gender || [];
        if (!currentGender.includes('Men')) {
          filters.gender = [...currentGender, 'Men'];
        }
      } else {
        // Replace gender filters
        filters.gender = ['Men'];
      }
    } else if (query.includes('women') || query.includes('female')) {
      if (query.includes('also') || query.includes('add') || query.includes('include')) {
        // Add to existing gender filters
        const currentGender = filters.gender || [];
        if (!currentGender.includes('Women')) {
          filters.gender = [...currentGender, 'Women'];
        }
      } else {
        // Replace gender filters
        filters.gender = ['Women'];
      }
    }

            // Extract category modifications
    if (query.includes('tops') || query.includes('shirts') || query.includes('t-shirts')) {
      if (query.includes('change to') || query.includes('switch to') || query.includes('instead')) {
        filters.category = ['Tops'];
      } else if (query.includes('also') || query.includes('add') || query.includes('include')) {
        const currentCategory = filters.category || [];
        if (!currentCategory.includes('Tops')) {
          filters.category = [...currentCategory, 'Tops'];
        }
      } else {
        filters.category = ['Tops'];
      }
    } else if (query.includes('bottoms') || query.includes('pants') || query.includes('jeans') || query.includes('trousers')) {
      if (query.includes('change to') || query.includes('switch to') || query.includes('instead')) {
        filters.category = ['Bottoms'];
      } else if (query.includes('also') || query.includes('add') || query.includes('include')) {
        const currentCategory = filters.category || [];
        if (!currentCategory.includes('Bottoms')) {
          filters.category = [...currentCategory, 'Bottoms'];
        }
      } else {
        filters.category = ['Bottoms'];
      }
    } else if (query.includes('dresses') || query.includes('dress')) {
      if (query.includes('change to') || query.includes('switch to') || query.includes('instead')) {
        filters.category = ['Dresses'];
      } else if (query.includes('also') || query.includes('add') || query.includes('include')) {
        const currentCategory = filters.category || [];
        if (!currentCategory.includes('Dresses')) {
          filters.category = [...currentCategory, 'Dresses'];
        }
      } else {
        filters.category = ['Dresses'];
      }
    } else if (query.includes('outerwear') || query.includes('jackets') || query.includes('coats')) {
      if (query.includes('change to') || query.includes('switch to') || query.includes('instead')) {
        filters.category = ['Outerwear'];
      } else if (query.includes('also') || query.includes('add') || query.includes('include')) {
        const currentCategory = filters.category || [];
        if (!currentCategory.includes('Outerwear')) {
          filters.category = [...currentCategory, 'Outerwear'];
        }
      } else {
        filters.category = ['Outerwear'];
      }
    }

        // Extract sub category
        if (query.includes('t-shirts') || query.includes('tshirts')) {
            filters.subCategory = ['T-shirts'];
        } else if (query.includes('shirts') || query.includes('formal shirts')) {
            filters.subCategory = ['Shirts'];
        } else if (query.includes('blouses')) {
            filters.subCategory = ['Blouses'];
        } else if (query.includes('jeans')) {
            filters.subCategory = ['Jeans'];
        } else if (query.includes('shorts')) {
            filters.subCategory = ['Shorts'];
        } else if (query.includes('jackets')) {
            filters.subCategory = ['Jackets'];
        } else if (query.includes('coats')) {
            filters.subCategory = ['Coats'];
        } else if (query.includes('polos')) {
            filters.subCategory = ['Polos'];
        } else if (query.includes('trousers')) {
            filters.subCategory = ['Trousers'];
        }

            // Extract price range modifications
    const priceMatch = query.match(/(?:under|less than|below|make it under|reduce to)\s*₹?(\d+)/);
    if (priceMatch) {
      filters.maxPrice = parseInt(priceMatch[1]);
    }

    const priceMatchOver = query.match(/(?:over|above|more than|make it over|increase to)\s*₹?(\d+)/);
    if (priceMatchOver) {
      filters.minPrice = parseInt(priceMatchOver[1]);
    }

    const priceRangeMatch = query.match(/(?:between|from)\s*₹?(\d+)\s*(?:and|to)\s*₹?(\d+)/);
    if (priceRangeMatch) {
      filters.minPrice = parseInt(priceRangeMatch[1]);
      filters.maxPrice = parseInt(priceRangeMatch[2]);
    }

        // Extract color
        const colors = ['black', 'blue', 'green', 'red', 'white', 'gray', 'grey', 'pink', 'purple', 'yellow', 'orange', 'beige', 'burgundy', 'olive', 'charcoal', 'navy', 'rust', 'mustard', 'pastel'];
        const foundColors = colors.filter(color => query.includes(color));
        if (foundColors.length > 0) {
            filters.color = foundColors.map(color => {
                if (color === 'gray' || color === 'grey') return 'Charcoal Gray';
                if (color === 'blue') return 'Navy Blue';
                if (color === 'pink') return 'Pastel Pink';
                if (color === 'yellow') return 'Mustard Yellow';
                if (color === 'orange') return 'Rust Orange';
                return color.charAt(0).toUpperCase() + color.slice(1);
            });
        }

        // Extract size
        const sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'small', 'medium', 'large'];
        const foundSizes = sizes.filter(size => query.includes(size));
        if (foundSizes.length > 0) {
            filters.size = foundSizes.map(size => size.toUpperCase());
        }

            // Generate response message based on extracted filters
    const response = this.generateResponseMessage(filters, userQuery);
    const suggestions = this.generateSuggestions(filters);

    return {
      filters,
      confidence: 0.7,
      explanation: 'Filters extracted using keyword matching',
      response,
      suggestions
    };
    }

      /**
   * Generate a conversational response message based on extracted filters
   */
  private generateResponseMessage(filters: SearchParams, userQuery: string): string {
    const parts: string[] = [];

    if (filters.gender) {
      const genderArray = Array.isArray(filters.gender) ? filters.gender : [filters.gender];
      if (genderArray.length > 0) {
        const genderText = genderArray.length === 1 ? genderArray[0] : genderArray.join(' and ');
        parts.push(`${genderText} clothing`);
      }
    }

    if (filters.category) {
      const categoryArray = Array.isArray(filters.category) ? filters.category : [filters.category];
      if (categoryArray.length > 0) {
        const categoryText = categoryArray.length === 1 ? categoryArray[0] : categoryArray.join(' and ');
        parts.push(categoryText);
      }
    }

    if (filters.color) {
      const colorArray = Array.isArray(filters.color) ? filters.color : [filters.color];
      if (colorArray.length > 0) {
        const colorText = colorArray.length === 1 ? colorArray[0] : colorArray.join(' and ');
        parts.push(`${colorText} colored`);
      }
    }

    if (filters.size) {
      const sizeArray = Array.isArray(filters.size) ? filters.size : [filters.size];
      if (sizeArray.length > 0) {
        const sizeText = sizeArray.length === 1 ? sizeArray[0] : sizeArray.join(' and ');
        parts.push(`size ${sizeText}`);
      }
    }

    if (filters.minPrice || filters.maxPrice) {
      if (filters.minPrice && filters.maxPrice) {
        parts.push(`between ₹${filters.minPrice.toLocaleString('en-IN')} and ₹${filters.maxPrice.toLocaleString('en-IN')}`);
      } else if (filters.maxPrice) {
        parts.push(`under ₹${filters.maxPrice.toLocaleString('en-IN')}`);
      } else if (filters.minPrice) {
        parts.push(`over ₹${filters.minPrice.toLocaleString('en-IN')}`);
      }
    }

    if (parts.length === 0) {
      return 'Here are the products matching your search.';
    }

    return `Here are the ${parts.join(' ')} which you requested.`;
  }

  /**
   * Generate suggestions based on current filters
   */
  private generateSuggestions(filters: SearchParams): string[] {
    const suggestions: string[] = [];

    // If no filters applied, suggest popular categories
    if (Object.keys(filters).length === 0 || (filters.q && Object.keys(filters).length === 1)) {
      suggestions.push('Show me tops', 'Find dresses', 'Browse outerwear');
      return suggestions;
    }

    // Suggest adding more options
    if (filters.gender) {
      const genderArray = Array.isArray(filters.gender) ? filters.gender : [filters.gender];
      if (genderArray.length === 1) {
        const currentGender = genderArray[0];
        const otherGender = currentGender === 'Men' ? 'Women' : 'Men';
        suggestions.push(`Also show ${otherGender}`);
      }
    }

    if (filters.category) {
      const categoryArray = Array.isArray(filters.category) ? filters.category : [filters.category];
      if (categoryArray.length === 1) {
        const currentCategory = categoryArray[0];
        if (currentCategory === 'Tops') {
          suggestions.push('Change to bottoms', 'Show dresses');
        } else if (currentCategory === 'Bottoms') {
          suggestions.push('Change to tops', 'Show outerwear');
        } else if (currentCategory === 'Dresses') {
          suggestions.push('Change to tops', 'Show bottoms');
        } else if (currentCategory === 'Outerwear') {
          suggestions.push('Change to tops', 'Show dresses');
        }
      }
    }

    // Price suggestions (INR)
    if (filters.maxPrice) {
      suggestions.push(`Make it under ₹${Math.round(Number(filters.maxPrice) * 0.7).toLocaleString('en-IN')}`);
    } else if (filters.minPrice) {
      suggestions.push(`Make it under ₹${Math.round(Number(filters.minPrice) * 1.5).toLocaleString('en-IN')}`);
    } else {
      suggestions.push('Show under ₹1,000', 'Show premium items');
    }

    // Color suggestions
    if (!filters.color) {
      suggestions.push('Show black items', 'Show blue items');
    }

    // Limit to 3 suggestions
    return suggestions.slice(0, 3);
  }

  /**
   * Get available filters from Algolia facets
   */
  getAvailableFiltersFromFacets(facets: Record<string, Record<string, number>>): Record<string, string[]> {
    const availableFilters: Record<string, string[]> = {};

    if (facets['gender.title']) {
      availableFilters.gender = Object.keys(facets['gender.title']);
    }

    if (facets['category.title']) {
      availableFilters.category = Object.keys(facets['category.title']);
    }

    if (facets['sub_category.title']) {
      availableFilters.subCategory = Object.keys(facets['sub_category.title']);
    }

    if (facets['sku.color.title']) {
      availableFilters.color = Object.keys(facets['sku.color.title']);
    }

    if (facets['sku.size.title']) {
      availableFilters.size = Object.keys(facets['sku.size.title']);
    }

    return availableFilters;
  }
}

export default new AIFilterExtractor(); 