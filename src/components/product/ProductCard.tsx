import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  IconButton,
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon, Favorite, FavoriteBorder } from '@mui/icons-material';
import { ProductDetails } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';

interface ProductCardProps {
  product: ProductDetails;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInCart, isLoading: isCartLoading } = useCart();
  const { isFavorite, toggleFavorite, isLoading: isFavoriteLoading } = useFavorites();

  // Get the first SKU for pricing and stock information
  const firstSku = product?.sku?.[0];
  const price = firstSku?.price || 0;
  const discount = firstSku?.discount || 0;
  const originalPrice = discount > 0 ? price / (1 - discount / 100) : undefined;
  const inStock = firstSku?.inventory !== null && firstSku?.inventory > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Transform ProductDetails to Product for cart compatibility
    const productForCart = {
      id: product.uid,
      title: product.title,
      description: product.description.details,
      price: Math.round(price * (1 - discount / 100)),
      originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
      images: product.images.map(img => img.permanent_url),
      category: product.category[0]?.uid || 'unknown',
      gender: (product.gender[0]?.uid === 'blt8fe78d2d00310008' ? 'men' : 
              product.gender[0]?.uid === 'blt947a3e4c7341f648' ? 'women' : 'unisex') as 'men' | 'women' | 'unisex',
      class: product.class[0]?.uid || 'unknown',
      tags: product.tags,
      inStock,
      rating: 4.5, // Default rating since it's not in ProductDetails
      reviewCount: Math.floor(Math.random() * 100) + 10, // Mock review count
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
    addToCart({ product: productForCart });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Transform ProductDetails to Product for favorites compatibility
    const productForFavorites = {
      id: product.uid,
      title: product.title,
      description: product.description.details,
      price: Math.round(price * (1 - discount / 100)),
      originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
      images: product.images.map(img => img.permanent_url),
      category: product.category[0]?.uid || 'unknown',
      gender: (product.gender[0]?.uid === 'blt8fe78d2d00310008' ? 'men' : 
              product.gender[0]?.uid === 'blt947a3e4c7341f648' ? 'women' : 'unisex') as 'men' | 'women' | 'unisex',
      class: product.class[0]?.uid || 'unknown',
      tags: product.tags,
      inStock,
      rating: 4.5,
      reviewCount: Math.floor(Math.random() * 100) + 10,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
    toggleFavorite(productForFavorites);
  };

  const discountPercentage = discount;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component={Link}
          to={`/product/${product.uid}`}
          sx={{
            height: 200,
            textDecoration: 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={product.images[0]?.permanent_url}
            alt={product.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        </CardMedia>
        
        {discountPercentage > 0 && (
          <Chip
            label={`-${discountPercentage}%`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 'bold',
            }}
          />
        )}
        
        <IconButton
          onClick={handleToggleFavorite}
          disabled={isFavoriteLoading}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'white',
            },
          }}
          size="small"
        >
          {isFavorite(product.uid) ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          component={Link}
          to={`/product/${product.uid}`}
          variant="h6"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            mb: 1,
            textDecoration: 'none',
            color: 'text.primary',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          {product.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={4.5} precision={0.1} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({Math.floor(Math.random() * 100) + 10})
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {product.description.details?.substring(0, 100)}...
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            ${Math.round(price * (1 - discount / 100))}
          </Typography>
          {discount > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 1, textDecoration: 'line-through' }}
            >
              ${Math.round(originalPrice || 0)}
            </Typography>
          )}
        </Box>

        {isInCart(product.uid) ? (
          <Button
            component={Link}
            to="/cart"
            variant="outlined"
            startIcon={<ShoppingCartIcon />}
            fullWidth
            disabled={isCartLoading}
            sx={{
              borderRadius: 2,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            View Cart
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            fullWidth
            disabled={isCartLoading || !inStock}
            sx={{
              borderRadius: 2,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;