import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Chip,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Favorite, FavoriteBorder, ShoppingCart } from '@mui/icons-material';
import { Product } from '../../types';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';

/**
 * Generic ProductSlider component for displaying products in a slider/carousel format.
 * 
 * @example
 * // Basic usage for featured products
 * <ProductSlider
 *   products={featuredProducts}
 *   title="Featured Products"
 *   subtitle="Discover our handpicked eco-friendly fitness essentials"
 * />
 * 
 * @example
 * // Advanced usage with navigation and custom styling
 * <ProductSlider
 *   products={trendingProducts}
 *   title="Trending Products"
 *   subtitle="Most popular items"
 *   maxItems={8}
 *   showNavigation={true}
 *   backgroundColor="grey.50"
 *   showRating={true}
 *   showCategory={true}
 * />
 * 
 * @example
 * // Minimal usage for related products
 * <ProductSlider
 *   products={relatedProducts}
 *   maxItems={4}
 *   showRating={false}
 *   showCategory={false}
 * />
 */
interface ProductSliderProps {
  products: Product[];
  isLoading?: boolean;
  error?: any;
  title?: string;
  subtitle?: string;
  maxItems?: number;
  showRating?: boolean;
  showCategory?: boolean;
  backgroundColor?: string;
  showNavigation?: boolean;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ 
  products, 
  isLoading = false, 
  error,
  title,
  subtitle,
  maxItems = 4,
  showRating = true,
  showCategory = true,
  backgroundColor = 'transparent',
  showNavigation = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isFavorite, toggleFavorite, isLoading: isFavoriteLoading } = useFavorites();
  const { isInCart, addToCart, isLoading: isCartLoading } = useCart();
  
  // Limit the number of products to display
  const displayProducts = products.slice(0, maxItems);
  const itemsPerView = isMobile ? 1 : 4;
  const maxIndex = Math.max(0, displayProducts.length - itemsPerView);
  
  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };
  
  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 6, bgcolor: backgroundColor }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
            Loading products...
          </Typography>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 6, bgcolor: backgroundColor }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center', color: 'error.main' }}>
            Error loading products
          </Typography>
        </Container>
      </Box>
    );
  }

  if (!displayProducts || displayProducts.length === 0) {
    return (
      <Box sx={{ py: 6, bgcolor: backgroundColor }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
            No products found
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, bgcolor: backgroundColor }}>
      <Container maxWidth="lg">
        {title && (
          <Typography
            variant="h4"
            component="h2"
            sx={{
              mb: 2,
              textAlign: 'center',
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography
            variant="body1"
            sx={{
              mb: 6,
              textAlign: 'center',
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            {subtitle}
          </Typography>
        )}

        <Box sx={{ position: 'relative' }}>
          {showNavigation && displayProducts.length > itemsPerView && (
            <>
              <IconButton
                onClick={handlePrev}
                disabled={currentIndex === 0}
                sx={{
                  position: 'absolute',
                  left: -20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1,
                  backgroundColor: 'white',
                  boxShadow: 2,
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
                sx={{
                  position: 'absolute',
                  right: -20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1,
                  backgroundColor: 'white',
                  boxShadow: 2,
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}
          
          <Grid container spacing={4}>
            {displayProducts.slice(currentIndex, currentIndex + itemsPerView).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      image={product.images[0]}
                      alt={product.title}
                      sx={{ height: '264px', width: '264px', objectFit: 'fill' }}
                    />
                    {product.originalPrice && product.originalPrice > product.price && (
                      <Chip
                        label={`${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off`}
                        color="error"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          fontWeight: 'bold',
                        }}
                      />
                    )}
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product);
                      }}
                      disabled={isFavoriteLoading}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          backgroundColor: 'white',
                        },
                      }}
                      size="small"
                    >
                      {isFavorite(product.id) ? <Favorite color="error" /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.title}
                    </Typography>
                    
                    {showRating && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={product.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                          ({product.reviewCount})
                        </Typography>
                      </Box>
                    )}

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        color: 'text.secondary',
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{ fontWeight: 700, color: 'primary.main' }}
                        >
                          ₹{product.price}
                        </Typography>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{
                              ml: 1,
                              textDecoration: 'line-through',
                              color: 'text.secondary',
                            }}
                          >
                            ₹{product.originalPrice}
                          </Typography>
                        )}
                      </Box>
                      {showCategory && (
                        <Chip
                          label={product.category}
                          size="small"
                          sx={{
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {isInCart(product.id) ? (
                        <Button
                          component={Link}
                          to="/cart"
                          variant="outlined"
                          startIcon={<ShoppingCart />}
                          fullWidth
                          disabled={isCartLoading}
                          sx={{
                            borderRadius: 2,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          View Cart
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<ShoppingCart />}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart({ product });
                          }}
                          fullWidth
                          disabled={isCartLoading || !product.inStock}
                          sx={{
                            borderRadius: 2,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductSlider; 