import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Chip,
  IconButton,
  Button,
  styled,
} from '@mui/material';
import { Favorite, FavoriteBorder, ShoppingCart } from '@mui/icons-material';
import { ProductDetails } from '../../types';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';

// Styled Components
const ProductCardContainer = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const DiscountChip = styled(Chip)(() => ({
  position: 'absolute',
  top: 8,
  left: 8,
  fontWeight: 'bold',
}));

const FavoriteButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  '&:hover': {
    backgroundColor: 'white',
  },
}));

const ProductCardContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

const RatingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const ReviewCount = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const PriceContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  fontWeight: 500,
}));

const ActionContainer = styled(Box)({
  display: 'flex',
  gap: 8,
});

interface ProductCardProps {
  product: ProductDetails;
  showRating?: boolean;
  showCategory?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showRating = true, 
  showCategory = true 
}) => {
  const { isFavorite, toggleFavorite, isLoading: isFavoriteLoading } = useFavorites();
  const { isInCart, addToCart, isLoading: isCartLoading } = useCart();

  // Get the first SKU for pricing and stock information
  const firstSku = product?.sku?.[0];
  const price = firstSku?.price || 0;
  const discount = firstSku?.discount || 0;
  const originalPrice = discount > 0 ? price / (1 - discount / 100) : undefined;
  const discountedPrice = price * (1 - discount / 100);
  const inStock = firstSku?.inventory !== null && firstSku?.inventory > 0;

  // Transform ProductDetails to Product for cart and favorites compatibility
  const transformToProduct = () => ({
    id: product.uid,
    title: product.title,
    description: product.description.details,
    price: Math.round(discountedPrice),
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
  });

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ product: transformToProduct() });
  };

  return (
    <ProductCardContainer>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={product.images[0]?.permanent_url}
          alt={product.title}
          sx={{ height: '264px', width: '264px', objectFit: 'fill' }}
        />
        {discount > 0 && (
          <DiscountChip
            label={`${Math.round(discount)}% Off`}
            color="error"
            size="small"
          />
        )}
        <FavoriteButton
          onClick={handleToggleFavorite}
          disabled={isFavoriteLoading}
          size="small"
        >
          {isFavorite(product.uid) ? <Favorite color="error" /> : <FavoriteBorder />}
        </FavoriteButton>
      </Box>
      <ProductCardContent>
        <Typography
          component={Link}
          to={`/product/${product.uid}`}
          variant="h6"
          sx={{
            mb: 1,
            fontWeight: 600,
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textDecoration: 'none',
            color: 'text.primary',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          {product.title}
        </Typography>
        
        {showRating && (
          <RatingContainer>
            <Rating value={4.5} precision={0.1} size="small" readOnly />
            <ReviewCount variant="body2">
              ({Math.floor(Math.random() * 100) + 10})
            </ReviewCount>
          </RatingContainer>
        )}

        <Typography
          variant="body2"
          sx={{
            mb: 2,
            color: 'text.secondary',
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description.details}
        </Typography>

        <PriceContainer>
          <Box>
            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: 700, color: 'primary.main' }}
            >
              ₹{Math.round(discountedPrice)}
            </Typography>
            {originalPrice && (
              <Typography
                variant="body2"
                component="span"
                sx={{
                  ml: 1,
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                }}
              >
                ₹{Math.round(originalPrice)}
              </Typography>
            )}
          </Box>
          {showCategory && (
            <CategoryChip
              label={product.category[0]?.uid || 'Unknown'}
              size="small"
            />
          )}
        </PriceContainer>

        <ActionContainer>
          {isInCart(product.uid) ? (
            <Button
              component={Link}
              to="/cart"
              variant="outlined"
              startIcon={<ShoppingCart />}
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
              startIcon={<ShoppingCart />}
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
        </ActionContainer>
      </ProductCardContent>
    </ProductCardContainer>
  );
};

export default ProductCard;