import React from 'react';
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
} from '@mui/material';
import { TrendingSection } from '../../types';
import { useProducts } from '@hooks/useContentstack';

interface TrendingProductsProps {
  trending: TrendingSection[];
  isLoading?: boolean;
  error?: any;
}

const TrendingProducts: React.FC<TrendingProductsProps> = ({ 
  trending, 
  isLoading = false, 
  error 
}) => {
  // Extract product UIDs from trending sections
  const productUids = trending.flatMap(section => 
    section.trending_1.trending_items.map(item => item.uid)
  );

  // Fetch products by UIDs (for now, we'll use all products and filter)
  const { data: allProducts = [] } = useProducts({ limit: 20 });
  
  // Filter products to match trending UIDs (mock implementation)
  const trendingProducts = allProducts.slice(0, Math.min(productUids.length, 4));

  if (isLoading) {
    return (
      <Box sx={{ py: 6, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
            Loading trending products...
          </Typography>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 6, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center', color: 'error.main' }}>
            Error loading trending products
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
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
          Trending Products
        </Typography>
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
          Discover our most popular and trending eco-friendly fitness products
        </Typography>

        <Grid container spacing={4}>
          {trendingProducts.map((product) => (
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
                <CardMedia
                  component="img"
                  height="200"
                  image={product.images[0]}
                  alt={product.title}
                  sx={{ objectFit: 'cover' }}
                />
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
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                      ({product.reviewCount})
                    </Typography>
                  </Box>

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

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TrendingProducts; 