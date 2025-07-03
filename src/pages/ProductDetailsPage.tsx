import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Chip,
  Breadcrumbs,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  LocalShipping,
  Security,
  Nature,
} from '@mui/icons-material';
import { useProduct } from '@hooks/useContentstack';
import { useCart } from '@hooks/useCart';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: product, isLoading, error } = useProduct(id!);
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Product not found
        </Typography>
      </Container>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity,
    });
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <Helmet>
        <title>{product.title} - EcoFit</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.images[0]} />
        <meta property="og:type" content="product" />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Home
          </Link>
          <Link to="/search" style={{ textDecoration: 'none', color: 'inherit' }}>
            Products
          </Link>
          <Typography color="text.primary">{product.title}</Typography>
        </Breadcrumbs>

        <Grid container spacing={6}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                <Box
                  component="img"
                  src={product.images[selectedImageIndex]}
                  alt={product.title}
                  sx={{
                    width: '100%',
                    height: 400,
                    objectFit: 'cover',
                    borderRadius: 2,
                  }}
                />
              </Paper>
              
              {product.images.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                  {product.images.map((image, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      onClick={() => setSelectedImageIndex(index)}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: selectedImageIndex === index ? '2px solid' : '1px solid',
                        borderColor: selectedImageIndex === index ? 'primary.main' : 'grey.300',
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {product.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Box>

            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
              {product.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                {product.rating} ({product.reviewCount} reviews)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                ${product.price}
              </Typography>
              {product.originalPrice && (
                <>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ${product.originalPrice}
                  </Typography>
                  <Chip
                    label={`Save ${discountPercentage}%`}
                    color="error"
                    size="small"
                  />
                </>
              )}
            </Box>

            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
              {product.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                sx={{ flex: 1 }}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <IconButton
                size="large"
                onClick={() => setIsFavorite(!isFavorite)}
                color={isFavorite ? 'error' : 'default'}
              >
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              
              <IconButton size="large">
                <Share />
              </IconButton>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocalShipping color="primary" />
                <Typography variant="body2">
                  Free shipping on orders over $50
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Security color="primary" />
                <Typography variant="body2">
                  30-day return policy
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Nature color="primary" />
                <Typography variant="body2">
                  Sustainably sourced materials
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ProductDetailsPage;