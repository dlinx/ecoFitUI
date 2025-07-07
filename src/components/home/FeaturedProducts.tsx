import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Product } from '../../types';
import ProductGrid from '@components/product/ProductGrid';

interface FeaturedProductsProps {
  products: Product[];
  isLoading?: boolean;
  error?: Error | null;
  title?: string;
  subtitle?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, isLoading, error, title, subtitle }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        component="h2"
        textAlign="center"
        sx={{
          fontWeight: 700,
          mb: 1,
          color: 'text.primary',
        }}
      >
        {title || 'Featured Products'}
      </Typography>
      <Typography
        variant="h6"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        {subtitle || 'Discover our most popular sustainable fitness gear'}
      </Typography>
      
      <ProductGrid products={products} isLoading={isLoading} error={error} />
    </Container>
  );
};

export default FeaturedProducts;