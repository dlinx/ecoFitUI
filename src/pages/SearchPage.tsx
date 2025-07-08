import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import FilterSidebar from '@components/filters/FilterSidebar';
import ProductGrid from '@components/product/ProductGrid';
import { useProducts } from '@hooks/useContentstack';
import { useFilters } from '@hooks/useFilters';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { filters, updateFilter, resetFilters } = useFilters();
  
  const searchQuery = searchParams.get('q') || '';
  const genderParam = searchParams.get('gender');
  const classParam = searchParams.get('class');
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    if (genderParam) updateFilter('gender', [genderParam]);
    if (classParam) updateFilter('class', [classParam]);
    if (categoryParam) updateFilter('category', [categoryParam]);
  }, [genderParam, classParam, categoryParam, updateFilter]);

  const { data: products = [], isLoading, error } = useProducts({
    q: searchQuery,
    gender: filters.gender.length > 0 ? filters.gender[0] : undefined,
    class: filters.class.length > 0 ? filters.class[0] : undefined,
    category: filters.category.length > 0 ? filters.category[0] : undefined,
    sortBy: sortBy as 'newest' | 'price' | 'rating' | 'popular',
  });

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const pageTitle = searchQuery 
    ? `Search Results for "${searchQuery}"` 
    : `${genderParam || classParam || categoryParam || 'All Products'}`;

  const FilterContent = () => (
    <FilterSidebar
      filters={filters}
      onFilterChange={updateFilter}
      onResetFilters={resetFilters}
    />
  );

  return (
    <>
      <Helmet>
        <title>{pageTitle} - EcoFit</title>
        <meta name="description" content={`Browse sustainable fitness products${searchQuery ? ` for "${searchQuery}"` : ''}`} />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            {pageTitle}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {products.length} products found
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Desktop Filter Sidebar */}
          {!isMobile && (
            <Grid item md={3}>
              <FilterContent />
            </Grid>
          )}

          {/* Products Section */}
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              {/* Mobile Filter Button */}
              {isMobile && (
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  Filters
                </Button>
              )}

              {/* Sort Options */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={handleSortChange}
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                  <MenuItem value="popular">Most Popular</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <ProductGrid products={products} isLoading={isLoading} error={error} />
          </Grid>
        </Grid>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="left"
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              p: 2,
            },
          }}
        >
          <FilterContent />
        </Drawer>
      </Container>
    </>
  );
};

export default SearchPage;