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
  SelectChangeEvent,
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import FilterSidebar from '@components/filters/FilterSidebar';
import ProductGrid from '@components/product/ProductGrid';
import { useAlgoliaSearchWithFacets } from '@hooks/useAlgolia';
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
  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subCategory');
  const colorParam = searchParams.get('color');
  const sizeParam = searchParams.get('size');

  useEffect(() => {
    if (genderParam) updateFilter('gender', genderParam.split(',').map(g => g.trim()));
    if (categoryParam) updateFilter('category', categoryParam.split(',').map(c => c.trim()));
    if (subCategoryParam) updateFilter('subCategory', subCategoryParam.split(',').map(sc => sc.trim()));
    if (colorParam) updateFilter('color', colorParam.split(',').map(col => col.trim()));
    if (sizeParam) updateFilter('size', sizeParam.split(',').map(s => s.trim()));
  }, [genderParam, categoryParam, subCategoryParam, colorParam, sizeParam, updateFilter]);

  // Prepare search parameters for Algolia
  const searchParamsForAlgolia = {
    q: searchQuery,
    gender: filters.gender.length > 0 ? filters.gender : undefined,
    category: filters.category.length > 0 ? filters.category : undefined,
    subCategory: filters.subCategory.length > 0 ? filters.subCategory : undefined,
    color: filters.color.length > 0 ? filters.color : undefined,
    size: filters.size.length > 0 ? filters.size : undefined,
    sortBy: sortBy as 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular',
  };

  const { data: searchResponse, isLoading, error, facets } = useAlgoliaSearchWithFacets(searchParamsForAlgolia);
  const products = searchResponse?.hits || [];
  const totalHits = searchResponse?.nbHits || 0;

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();

    if (searchQuery) {
      newSearchParams.set('q', searchQuery);
    }

    if (filters.gender.length > 0) {
      newSearchParams.set('gender', filters.gender.join(','));
    }

    if (filters.subCategory.length > 0) {
      newSearchParams.set('subCategory', filters.subCategory.join(','));
    }

    if (filters.category.length > 0) {
      newSearchParams.set('category', filters.category.join(','));
    }

    if (filters.color.length > 0) {
      newSearchParams.set('color', filters.color.join(','));
    }

    if (filters.size.length > 0) {
      newSearchParams.set('size', filters.size.join(','));
    }

    if (sortBy !== 'newest') {
      newSearchParams.set('sort', sortBy);
    }

    setSearchParams(newSearchParams);
  }, [filters, sortBy, searchQuery, setSearchParams]);

  const getFilterDisplayName = (param: string | null) => {
    if (!param) return '';
    const values = param.split(',').map(v => v.trim());
    if (values.length === 1) return values[0];
    return `${values[0]} +${values.length - 1} more`;
  };

  const pageTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : `${getFilterDisplayName(genderParam) || getFilterDisplayName(subCategoryParam) || getFilterDisplayName(categoryParam) || 'All Products'}`;

  const FilterContent = () => (
    <FilterSidebar
      filters={filters}
      onFilterChange={updateFilter}
      onResetFilters={resetFilters}
      facets={facets}
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
            {totalHits} products found
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {/* Desktop Filter Sidebar */}
          {!isMobile && (
            <Grid item md={3}>
              <Box
                sx={{
                  position: 'sticky',
                  top: 70,
                  height: 'fit-content',
                  maxHeight: 'calc(100vh - 80px)',
                  overflowY: 'auto',
                  paddingBottom: 1
                }}
              >
                <FilterContent />
              </Box>
            </Grid>
          )}

          {/* Products Section */}
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
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
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
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