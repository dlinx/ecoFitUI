import React, { useState, useMemo } from 'react';
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
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
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

const ImageContainer = styled(Box)({
  position: 'relative',
});

const ProductImage = styled(CardMedia)({
  height: '264px',
  width: '264px',
  objectFit: 'fill',
}) as typeof CardMedia;

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

const ProductTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontWeight: 600,
  lineHeight: 1.2,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textDecoration: 'none',
  color: theme.palette.text.primary,
  '&:hover': {
    color: theme.palette.primary.main,
  },
})) as typeof Typography;

const RatingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const ReviewCount = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const ProductDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
  flexGrow: 1,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));

const PriceContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
}));

const PriceBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const CurrentPrice = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
})) as typeof Typography;

const OriginalPrice = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  textDecoration: 'line-through',
  color: theme.palette.text.secondary,
})) as typeof Typography;


const ActionContainer = styled(Box)({
  display: 'flex',
  gap: 8,
});

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600,
})) as typeof Button;

const ColorSizeContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const ColorSelection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const ColorOption = styled(Box)(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  border: '2px solid',
  borderColor: 'grey.300',
  cursor: 'pointer',
  display: 'inline-block',
  marginRight: theme.spacing(0.5),
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.1)',
    transition: 'transform 0.2s ease-in-out',
  },
}));

const SizeSelection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const SizeButton = styled(ToggleButton)(({ theme }) => ({
  minWidth: 32,
  height: 32,
  fontSize: '0.75rem',
  border: '2px solid',
  borderColor: theme.palette.grey[300],
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  '&.Mui-selected': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.primary.main,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.grey[400],
    borderColor: theme.palette.grey[200],
  },
})) as typeof ToggleButton;

interface ProductCardProps {
  product: ProductDetails;
  showRating?: boolean;
  showCategory?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showRating = true
}) => {
  const { isFavorite, toggleFavorite, isLoading: isFavoriteLoading } = useFavorites();
  const { isSkuInCart, addToCart, isLoading: isCartLoading } = useCart();

  // State for color and size selection
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

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

  // Get the first SKU for pricing and stock information
  const firstSku = product?.sku?.[0];
  const price = firstSku?.price || 0;
  const discount = firstSku?.discount || 0;

  // Use selected SKU for pricing if available
  const finalPrice = selectedSku?.price || price;
  const finalDiscount = selectedSku?.discount || discount;
  const finalOriginalPrice = finalDiscount > 0 ? finalPrice / (1 - finalDiscount / 100) : undefined;
  const finalDiscountedPrice = finalPrice * (1 - finalDiscount / 100);
  const finalInStock = selectedSku?.inventory !== null && selectedSku?.inventory !== undefined && selectedSku?.inventory > 0;

  // Transform ProductDetails to Product for cart compatibility
  const transformToProduct = () => ({
    id: product.uid,
    title: product.title,
    description: product.description.details,
    price: Math.round(finalDiscountedPrice),
    originalPrice: finalOriginalPrice ? Math.round(finalOriginalPrice) : undefined,
    images: product.images.map(img => img.url),
    inStock: finalInStock,
    inventory: selectedSku?.inventory || 0,
  });

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedSku) {
      const selectedColorObj = selectedSku.color?.find(c => c.uid === selectedColor);
      const selectedSizeObj = selectedSku.size?.find(s => s.uid === selectedSize);

      addToCart({
        product: transformToProduct(),
        skuCode: selectedSku.sku_code,
        size: selectedSizeObj?.title,
        color: selectedColorObj?.title
      });
    }
  };

  return (
    <ProductCardContainer>
      <ImageContainer>
        <ProductImage
          component="img"
          image={product.images[0]?.url}
          alt={product.title}
        />
        {finalDiscount > 0 && (
          <DiscountChip
            label={`${Math.round(finalDiscount)}% Off`}
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
      </ImageContainer>
      <ProductCardContent>
        <ProductTitle
          component={Link}
          to={`/product/${product.uid}`}
          variant="h6"
        >
          {product.title}
        </ProductTitle>

        {/* {showRating && (
          <RatingContainer>
            <Rating value={4.5} precision={0.1} size="small" readOnly />
            <ReviewCount variant="body2">
              ({Math.floor(Math.random() * 100) + 10})
            </ReviewCount>
          </RatingContainer>
        )} */}

        <ProductDescription variant="body2">
          {product.description.details}
        </ProductDescription>

        {/* Color and Size Selection */}
        {(distinctColors.length > 0 || distinctSizes.length > 0) && (
          <ColorSizeContainer>
            {/* Color Selection */}
            {distinctColors.length > 0 && (
              <ColorSelection>
                <FormLabel component="legend" sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 0.5, display: 'block' }}>
                  Color
                </FormLabel>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {distinctColors.map((color) => (
                    <ColorOption
                      key={color.uid}
                      onClick={() => setSelectedColor(color.uid)}
                      sx={{
                        backgroundColor: color?.colorcode?.hex || '#e0e0e0',
                        borderColor: selectedColor === color.uid ? 'primary.main' : 'grey.300',
                      }}
                    >
                      {selectedColor === color.uid && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -1,
                            right: -1,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '8px',
                            fontWeight: 'bold',
                          }}
                        >
                          ✓
                        </Box>
                      )}
                    </ColorOption>
                  ))}
                </Box>
              </ColorSelection>
            )}

            {/* Size Selection */}
            {distinctSizes.length > 0 && (
              <SizeSelection>
                <FormLabel component="legend" sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 0.5, display: 'block' }}>
                  Size
                </FormLabel>
                <ToggleButtonGroup
                  value={selectedSize}
                  exclusive
                  onChange={(_, newSize) => newSize && setSelectedSize(newSize)}
                  size="small"
                  sx={{ flexWrap: 'wrap' }}
                >
                  {distinctSizes.map((size) => {
                    const isAvailable = product.sku.some((skuItem) =>
                      skuItem.size?.some((s) => s.uid === size.uid) &&
                      skuItem.color?.some((c) => c.uid === selectedColor) &&
                      skuItem.inventory && skuItem.inventory > 0
                    );

                    return (
                      <SizeButton
                        key={size.uid}
                        value={size.uid}
                        disabled={!isAvailable}
                      >
                        {size.title}
                      </SizeButton>
                    );
                  })}
                </ToggleButtonGroup>
              </SizeSelection>
            )}
          </ColorSizeContainer>
        )}

        <PriceContainer>
          <PriceBox>
            <CurrentPrice variant="h6" component="span">
              ₹{Math.round(finalDiscountedPrice)}
            </CurrentPrice>
            {finalOriginalPrice && (
              <OriginalPrice variant="body2" component="span">
                ₹{Math.round(finalOriginalPrice)}
              </OriginalPrice>
            )}
          </PriceBox>
        </PriceContainer>

        <ActionContainer>
          {selectedSku && isSkuInCart(selectedSku.sku_code) ? (
            <StyledButton
              component={Link}
              to="/cart"
              variant="outlined"
              startIcon={<ShoppingCart />}
              fullWidth
              disabled={isCartLoading}
            >
              View Cart
            </StyledButton>
          ) : (
            <StyledButton
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              fullWidth
              disabled={isCartLoading || !finalInStock || !selectedColor || !selectedSize}
            >
              {!selectedColor || !selectedSize
                ? 'Select Options'
                : finalInStock
                  ? 'Add to Cart'
                  : 'Out of Stock'
              }
            </StyledButton>
          )}
        </ActionContainer>
      </ProductCardContent>
    </ProductCardContainer>
  );
};

export default ProductCard;