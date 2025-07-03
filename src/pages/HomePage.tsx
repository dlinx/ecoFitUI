import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';
import HeroBanner from '@components/home/HeroBanner';
import FeaturedProducts from '@components/home/FeaturedProducts';
import CategoryShowcase from '@components/home/CategoryShowcase';
import { useBanners, useProducts, useCategories } from '@hooks/useContentstack';

const HomePage: React.FC = () => {
  const { data: banners = [], isLoading: bannersLoading } = useBanners();
  const { data: products = [], isLoading: productsLoading, error: productsError } = useProducts({ limit: 8 });
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();

  const featuredBanner = banners[0];

  return (
    <>
      <Helmet>
        <title>EcoFit - Sustainable Fitness Gear</title>
        <meta name="description" content="Discover eco-friendly fitness equipment, sustainable activewear, and green workout gear. Shop responsibly with EcoFit." />
        <meta name="keywords" content="sustainable fitness, eco-friendly workout gear, organic activewear, green fitness equipment" />
        <meta property="og:title" content="EcoFit - Sustainable Fitness Gear" />
        <meta property="og:description" content="Discover eco-friendly fitness equipment, sustainable activewear, and green workout gear." />
        <meta property="og:type" content="website" />
      </Helmet>

      <Box>
        {featuredBanner && !bannersLoading && (
          <HeroBanner banner={featuredBanner} />
        )}
        
        <FeaturedProducts
          products={products}
          isLoading={productsLoading}
          error={productsError}
        />
        
        <Box sx={{ bgcolor: 'grey.50' }}>
          <CategoryShowcase
            categories={categories}
            isLoading={categoriesLoading}
            error={categoriesError}
          />
        </Box>
      </Box>
    </>
  );
};

export default HomePage;