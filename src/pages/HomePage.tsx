import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';
import HeroBanner from '@components/home/HeroBanner';
import AIChatSection from '@components/home/AIChatSection';
import ProductSlider from '@components/product/ProductSlider';
import { useHomePage } from '@hooks/useContentstack';
import { useFavorites } from '@hooks/useFavorites';

const HomePage: React.FC = () => {
  const { data: homePage, isLoading: homePageLoading, error: homePageError } = useHomePage();
  const { favorites } = useFavorites();

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

        <AIChatSection />

        <ProductSlider
          products={homePage?.trending?.flatMap(section => section.trending_1.trending_items) || []}
          isLoading={homePageLoading}
          error={homePageError}
          title="Trending Products"
          subtitle="Discover our most popular and trending eco-friendly fitness products"
          maxItems={8}
          showRating={true}
          showCategory={true}
          showNavigation={true}
        />

        {favorites.length > 0 && (
          <ProductSlider
            products={favorites}
            isLoading={false}
            error={null}
            title="Your Wishlist"
            subtitle="Products you've added to your favorites"
            maxItems={4}
            showRating={true}
            showCategory={true}
            backgroundColor="transparent"
            showNavigation={favorites.length > 4}
          />
        )}
      </Box>
    </>
  );
};

export default HomePage;