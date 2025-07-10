import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Chip,
  Breadcrumbs,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  FormControl,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
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
import Carousel from 'react-material-ui-carousel';
import { useProduct } from '@hooks/useContentstack';
import { useCart } from '@hooks/useCart';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: product, isLoading, error } = useProduct(id!);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addToCart, isSkuInCart } = useCart();

  // Get distinct colors and sizes from SKU array
  const { distinctColors, distinctSizes } = useMemo(() => {
    if (!product?.sku) return { distinctColors: [], distinctSizes: [] };

    const colors = new Map();
    const sizes = new Map();

    product.sku.forEach((skuItem) => {
      skuItem.color?.forEach((color) => {
        if (!colors.has(color.uid)) {
          colors.set(color.uid, color);
        }
      });
      skuItem.size?.forEach((size) => {
        if (!sizes.has(size.uid)) {
          sizes.set(size.uid, size);
        }
      });
    });

    return {
      distinctColors: Array.from(colors.values()),
      distinctSizes: Array.from(sizes.values()),
    };
  }, [product]);

  // Get available SKU based on selected color and size
  const selectedSku = useMemo(() => {
    if (!product?.sku || !selectedColor || !selectedSize) return null;

    return product.sku.find((skuItem) =>
      skuItem.color?.some((color) => color.uid === selectedColor) &&
      skuItem.size?.some((size) => size.uid === selectedSize)
    );
  }, [product, selectedColor, selectedSize]);

  // Set initial selections when product loads
  React.useEffect(() => {
    if (distinctColors.length > 0 && !selectedColor) {
      setSelectedColor(distinctColors[0].uid);
    }
    if (distinctSizes.length > 0 && !selectedSize) {
      setSelectedSize(distinctSizes[0].uid);
    }
  }, [distinctColors, distinctSizes, selectedColor, selectedSize]);



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
    if (selectedSku) {
      const selectedColorObj = selectedSku.color?.find(c => c.uid === selectedColor);
      const selectedSizeObj = selectedSku.size?.find(s => s.uid === selectedSize);

      addToCart({
        product: {
          id: product.uid,
          title: product.title,
          description: product.description.details,
          price: Math.round(discountedPrice),
          originalPrice: selectedSku.price,
          images: product.images.map(img => img.permanent_url),
          inStock: selectedSku.inventory !== null && selectedSku.inventory !== undefined && selectedSku.inventory > 0,
          inventory: selectedSku.inventory || 0
        },
        skuCode: selectedSku.sku_code,
        size: selectedSizeObj?.title,
        color: selectedColorObj?.title,
        quantity: 1
      });
    }
  };

  // Calculate discount percentage and discounted price
  const discountPercentage = selectedSku?.discount || 0;
  const discountedPrice = selectedSku
    ? selectedSku.price - (selectedSku.price * (discountPercentage / 100))
    : product.sku[0]?.price || 0;

  return (
    <>
      <Helmet>
        <title>{product.title} - EcoFit</title>
        <meta name="description" content={product.description.details} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description.details} />
        <meta property="og:image" content={product.images[0].url} />
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
              <Carousel
                autoPlay={false}
                animation="slide"
                indicators={true}
                navButtonsAlwaysVisible={product.images.length > 1}
                navButtonsProps={{
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '50%',
                    minWidth: '40px',
                    width: '40px',
                    height: '40px',
                  }
                }}
                sx={{
                  '& .MuiButtonBase-root': {
                    color: 'primary.main',
                  },
                  '& .MuiButtonBase-root:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
                IndicatorIcon={product.images.map(i =>
                  <img style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }} src={i.url} alt={i.title} />)}
                indicatorIconButtonProps={{
                  style: {
                    opacity: 0.5,
                  }
                }}
                activeIndicatorIconButtonProps={{
                  style: {
                    opacity: 1,
                  }
                }}
              >
                {product.images.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image.url}
                    alt={`${product.title} ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: 400,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                ))}
              </Carousel>
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

            {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating value={} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                {product.rating} ({product?.reviewCount} reviews)
              </Typography>
            </Box> */}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                ₹{Math.round(discountedPrice).toLocaleString()}
              </Typography>
              {discountPercentage > 0 && (
                <>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ₹{Math.round(selectedSku?.price || product.sku[0]?.price || 0).toLocaleString()}
                  </Typography>
                  <Chip
                    label={`Save ${discountPercentage}%`}
                    color="error"
                    size="small"
                  />
                </>
              )}
            </Box>

            {/* Color Selection */}
            {distinctColors.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
                    Color
                  </FormLabel>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {distinctColors.map((color) => (
                      <Box
                        key={color.uid}
                        onClick={() => setSelectedColor(color.uid)}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: color?.colorcode?.hex || '#e0e0e0',
                          border: selectedColor === color.uid ? '2px solid' : '2px solid',
                          borderColor: selectedColor === color.uid ? 'primary.main' : 'grey.300',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            transition: 'transform 0.2s ease-in-out',
                          },
                        }}
                      >
                        {selectedColor === color.uid && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -2,
                              right: -2,
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              backgroundColor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: 'bold',
                            }}
                          >
                            ✓
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {distinctColors.find(c => c.uid === selectedColor)?.title}
                  </Typography>
                </FormControl>
              </Box>
            )}

            {/* Size Selection */}
            {distinctSizes.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
                    Size
                  </FormLabel>
                  <ToggleButtonGroup
                    value={selectedSize}
                    exclusive
                    onChange={(_, newSize) => newSize && setSelectedSize(newSize)}
                    sx={{ flexWrap: 'wrap' }}
                  >
                    {distinctSizes.map((size) => {
                      const isAvailable = product.sku.some((skuItem) =>
                        skuItem.size?.some((s) => s.uid === size.uid) &&
                        skuItem.color?.some((c) => c.uid === selectedColor) &&
                        skuItem.inventory && skuItem.inventory > 0
                      );

                      return (
                        <ToggleButton
                          key={size.uid}
                          value={size.uid}
                          disabled={!isAvailable}
                          sx={{
                            minWidth: 50,
                            height: 40,
                            border: '2px solid',
                            borderColor: 'grey.300',
                            backgroundColor: selectedSize === size.uid ? 'primary.main' : 'transparent',
                            color: selectedSize === size.uid ? 'white' : 'text.primary',
                            '&.Mui-selected': {
                              borderColor: 'primary.main',
                            },
                            '&:hover': {
                              backgroundColor: selectedSize === size.uid ? 'primary.dark' : 'grey.100',
                            },
                            '&.Mui-disabled': {
                              backgroundColor: 'grey.100',
                              color: 'grey.400',
                              borderColor: 'grey.200',
                            },
                          }}
                        >
                          {size.title}
                        </ToggleButton>
                      );
                    })}
                  </ToggleButtonGroup>
                </FormControl>
              </Box>
            )}

            {/* <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
              {product?.description}
            </Typography> */}

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                variant={selectedSku && isSkuInCart(selectedSku.sku_code) ? "outlined" : "contained"}
                size="large"
                startIcon={<ShoppingCart />}
                onClick={selectedSku && isSkuInCart(selectedSku.sku_code) ? () => window.location.href = '/cart' : handleAddToCart}
                disabled={!selectedSku?.inventory || !selectedColor || !selectedSize}
                sx={{ flex: 1 }}
              >
                {!selectedColor || !selectedSize
                  ? 'Select Color & Size'
                  : selectedSku && isSkuInCart(selectedSku.sku_code)
                    ? 'View Cart'
                    : selectedSku?.inventory
                      ? 'Add to Cart'
                      : 'Out of Stock'
                }
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
                  Free shipping on orders over ₹2000
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
      </Container >
    </>
  );
};

export default ProductDetailsPage;