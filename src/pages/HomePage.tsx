import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';
import HeroBanner from '@components/home/HeroBanner';
import FeaturedProducts from '@components/home/FeaturedProducts';
import TrendingProducts from '@components/home/TrendingProducts';
import { useHomePage, useProducts } from '@hooks/useContentstack';

const HomePage: React.FC = () => {
  const { data: homePage, isLoading: homePageLoading, error: homePageError } = useHomePage();
  console.log('homePage', homePage);
  const { data: products = [], isLoading: productsLoading, error: productsError } = useProducts({ 
    limit: 8 
  });

  // Get the first banner from entry_banner array
  const heroBanner = homePage?.entry_banner?.[0] || null;

  return (
    <>
      <Helmet>
        <title>{homePage?.metaTitle || 'EcoFit - Sustainable Fitness Gear'}</title>
        <meta name="description" content={homePage?.metaDescription || 'Discover eco-friendly fitness equipment, sustainable activewear, and green workout gear. Shop responsibly with EcoFit.'} />
        <meta name="keywords" content={homePage?.metaKeywords || 'sustainable fitness, eco-friendly workout gear, organic activewear, green fitness equipment'} />
        <meta property="og:title" content={homePage?.seoSection?.ogTitle || homePage?.metaTitle || 'EcoFit - Sustainable Fitness Gear'} />
        <meta property="og:description" content={homePage?.seoSection?.ogDescription || homePage?.metaDescription || 'Discover eco-friendly fitness equipment, sustainable activewear, and green workout gear.'} />
        <meta property="og:type" content="website" />
        {homePage?.seoSection?.ogImage && (
          <meta property="og:image" content={homePage.seoSection.ogImage} />
        )}
      </Helmet>

      <Box>
        {heroBanner && !homePageLoading && (
          <HeroBanner banner={heroBanner} />
        )}
        
        <FeaturedProducts
          products={products}
          isLoading={productsLoading || homePageLoading}
          error={productsError || homePageError}
          title="Featured Products"
          subtitle="Discover our handpicked eco-friendly fitness essentials"
        />
        
        {homePage?.trending && (
          <TrendingProducts
            trending={homePage.trending}
            isLoading={homePageLoading}
            error={homePageError}
          />
        )}
      </Box>
    </>
  );
};

export default HomePage;