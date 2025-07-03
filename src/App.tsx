import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import theme from './theme';
import Layout from '@components/layout/Layout';
import ErrorBoundary from '@components/common/ErrorBoundary';
import HomePage from '@pages/HomePage';
import SearchPage from '@pages/SearchPage';
import ProductDetailsPage from '@pages/ProductDetailsPage';
import CartPage from '@pages/CartPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/men" element={<SearchPage />} />
                  <Route path="/women" element={<SearchPage />} />
                  <Route path="/men/:class" element={<SearchPage />} />
                  <Route path="/women/:class" element={<SearchPage />} />
                  <Route path="/men/:class/:category" element={<SearchPage />} />
                  <Route path="/women/:class/:category" element={<SearchPage />} />
                  <Route path="/category/:category" element={<SearchPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                </Routes>
              </Layout>
            </Router>
          </ErrorBoundary>
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;