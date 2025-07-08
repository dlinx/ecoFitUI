import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  styled,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ProductDetails } from '../../types';
import ProductCard from './ProductCard';

// Styled Components
const SliderContainer = styled(Box)<{ bgcolor?: string }>(({ theme, bgcolor }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  backgroundColor: bgcolor || 'transparent',
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
  backgroundColor: 'white',
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

const PrevButton = styled(NavigationButton)({
  left: -20,
});

const NextButton = styled(NavigationButton)({
  right: -20,
});



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
  products: ProductDetails[];
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

  // Limit the number of products to display
  const displayProducts = products.slice(0, maxItems);
  const itemsPerView = isMobile ? 1 : 4;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (isLoading) {
    return (
      <SliderContainer bgcolor={backgroundColor}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
            Loading products...
          </Typography>
        </Container>
      </SliderContainer>
    );
  }

  if (error) {
    return (
      <SliderContainer bgcolor={backgroundColor}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center', color: 'error.main' }}>
            Error loading products
          </Typography>
        </Container>
      </SliderContainer>
    );
  }

  if (!displayProducts || displayProducts.length === 0) {
    return (
      <SliderContainer bgcolor={backgroundColor}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
            No products found
          </Typography>
        </Container>
      </SliderContainer>
    );
  }

  return (
    <SliderContainer bgcolor={backgroundColor}>
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
          {showNavigation && products.length > itemsPerView && (
            <>
              {currentIndex !== 0 && <PrevButton
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft />
              </PrevButton>}
              {currentIndex !== maxIndex && <NextButton
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
              >
                <ChevronRight />
              </NextButton>}
            </>
          )}

          <Grid container spacing={4}>
            {products.slice(currentIndex, currentIndex + itemsPerView).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.uid}>
                <ProductCard 
                  product={product}
                  showRating={showRating}
                  showCategory={showCategory}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </SliderContainer>
  );
};

export default ProductSlider; 