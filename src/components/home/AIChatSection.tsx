import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  useTheme,
  InputAdornment,
  IconButton,
  Fade,
  Chip,
  Collapse,
} from '@mui/material';
import {
  SmartToy as BotIcon,
  Send as SendIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import algoliaService from '@services/algolia';
import aiFilterExtractor from '@services/aiFilterExtractor';
import { DetailedProduct, SearchParams } from '../../types';
import ProductCard from '../product/ProductCard';

interface AIChatSectionProps {
  onProductClick?: (product: DetailedProduct) => void;
}

const AIChatSection: React.FC<AIChatSectionProps> = ({ onProductClick }) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<DetailedProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchParams>({});
  const [aiResponse, setAiResponse] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Extract filters using AI service
  const extractFiltersFromQuery = async (userQuery: string): Promise<any> => {
    try {
      const result = await aiFilterExtractor.extractFilters(userQuery, currentFilters);
      return result;
    } catch (error) {
      console.error('Error extracting filters:', error);
      // Return basic search query as fallback
      return { 
        filters: { q: userQuery },
        response: 'Here are the products matching your search.',
        suggestions: ['Show me yoga mats', 'Find running shoes', 'Browse gym equipment']
      };
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Extract filters from user query using AI
      const aiResult = await extractFiltersFromQuery(query);
      
      // Update current filters with the new extracted filters
      setCurrentFilters(aiResult.filters);
      
      // Set AI response and suggestions
      setAiResponse(aiResult.response);
      setSuggestions(aiResult.suggestions);
      
      // Convert to Algolia search parameters
      const algoliaParams = algoliaService.convertSearchParams(aiResult.filters);
      
      // Search products using Algolia
      const searchResults = await algoliaService.searchProducts(algoliaParams);
      
      setProducts(searchResults.hits || []);
      
      if (searchResults.hits.length === 0) {
        setError('No products found matching your criteria. Try adjusting your search terms.');
      }
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Sorry, I encountered an error while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    // Clear previous response and suggestions
    // setAiResponse('');
    // setSuggestions([]);
    // Trigger search after a short delay to allow state update
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        padding: theme.spacing(4),
        background: theme.palette.background.glassDark,
        borderRadius: 0,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.light}10 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, ${theme.palette.secondary.light}10 0%, transparent 50%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
          <BotIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
            AI Shopping Assistant
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary, maxWidth: 600, mx: 'auto' }}>
          Describe what you're looking for in natural language. I'll help you find and refine your search for fashion apparel!
        </Typography>
      </Box>

      <Box sx={{ mb: 3, position: 'relative', zIndex: 1, width: '60%', mx: 'auto' }}>
        <TextField
          fullWidth
          placeholder="Ask me anything about products... e.g., 'Show me yoga mats for women' or 'also show men'"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          multiline
          maxRows={2}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BotIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Fade in={query.length > 0}>
                  <IconButton
                    size="small"
                    onClick={() => setQuery('')}
                    sx={{ mr: 1 }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Fade>
                <IconButton
                  color="primary"
                  onClick={handleSearch}
                  disabled={!query.trim() || isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* AI Response */}
      <Collapse in={!!aiResponse} timeout={400}>
        <Box sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {aiResponse}
          </Typography>
          
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {suggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  size="small"
                  onClick={() => handleSuggestionClick(suggestion)}
                  variant="outlined"
                  sx={{
                    fontSize: '0.75rem',
                    height: 28,
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Collapse>

      <Collapse in={!!error} timeout={400}>
        <Box sx={{ mb: 3 }}>
          <Alert severity="warning">
            {error}
          </Alert>
        </Box>
      </Collapse>

      <Collapse in={hasSearched && products.length > 0} timeout={600}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Found {products.length > 8 ? 'more than 8' : products.length} products for you:
          </Typography>
          
          <Grid container spacing={3}>
            {products.slice(0, 8).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.uid}>
                <ProductCard 
                  product={product}
                  showRating={false}
                  showCategory={true}
                />
              </Grid>
            ))}
          </Grid>
          
          {products.length > 8 && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                There are many more products.
              </Typography>
            </Box>
          )}
        </Box>
      </Collapse>

      <Collapse in={hasSearched && !isLoading && products.length === 0 && !error} timeout={400}>
        <Box sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No products found
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Try adjusting your search terms or browse our categories
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AIChatSection; 