import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { ProductDetails } from '../../types';
import ProductCard from './ProductCard';
import LoadingSkeleton from '@components/common/LoadingSkeleton';

interface ProductGridProps {
  products: ProductDetails[];
  isLoading?: boolean;
  error?: Error | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading, error }) => {
  if (isLoading) {
    return <LoadingSkeleton type="product" count={8} />;
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="error">
          Error loading products
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message}
        </Typography>
      </Box>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No products found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search or filter criteria
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.uid}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;