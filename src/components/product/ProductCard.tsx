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
import { Product } from '@types';
import { useCart } from '@hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      quantity: 1,
    });
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

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
          to={`/product/${product.id}`}
          sx={{
            height: 200,
            textDecoration: 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={product.images[0]}
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
          <FavoriteBorder />
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          component={Link}
          to={`/product/${product.id}`}
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
          <Rating value={product.rating} precision={0.1} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviewCount})
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {product.description.substring(0, 100)}...
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            ${product.price}
          </Typography>
          {product.originalPrice && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 1, textDecoration: 'line-through' }}
            >
              ${product.originalPrice}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          fullWidth
          disabled={!product.inStock}
          sx={{
            borderRadius: 2,
            py: 1,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;