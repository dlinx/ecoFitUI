import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  IconButton,
  TextField,
  Divider,
  Chip
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useCart } from '@hooks/useCart';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, isLoading } = useCart();

  // Cart already contains full product objects, no need to fetch from API
  const cartItems = cart.items;

  const subtotal = cart.total; // Use the calculated total from the cart
  const shipping = subtotal > 500 ? 0 : 99; // Free shipping over ₹500
  const tax = subtotal * 0.18 + shipping * 0.12; // 18% GST on product and 12% GST on shipping
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (skuCode: string, newQuantity: number) => {
    updateQuantity({ skuCode, quantity: newQuantity });
  };

  const handleRemoveItem = (skuCode: string) => {
    removeFromCart(skuCode);
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" textAlign="center">
          Loading cart...
        </Typography>
      </Container>
    );
  }

  if (cart.items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - EcoFit</title>
          <meta name="description" content="Your shopping cart" />
        </Helmet>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
              Your Cart is Empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Looks like you haven't added any products to your cart yet.
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                px: 4,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - EcoFit</title>
        <meta name="description" content="Your shopping cart" />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Shopping Cart
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in your cart
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  {cart.itemCount} {cart.itemCount === 1 ? 'Item' : 'Items'}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearCart}
                  color="error"
                >
                  Clear Cart
                </Button>
              </Box>

              {/* Card-style cart items */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {cartItems.map((item) => (
                  <Paper key={item.skuCode} elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                    {/* Remove button */}
                    <IconButton
                      color="inherit"
                      onClick={() => handleRemoveItem(item.skuCode)}
                      sx={{ position: 'absolute', top: 12, right: 12 }}
                      aria-label="Remove item"
                    >
                      <Delete />
                    </IconButton>

                    {/* Product Image */}
                    <Box
                      component="img"
                      src={item.product.images[0]}
                      alt={item.product.title}
                      sx={{ width: 220, height: 220, objectFit: 'cover', borderRadius: 1, mr: 4 }}
                    />

                    {/* Product Details */}
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography
                        component={Link}
                        to={`/product/${item.product.id}`}
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          textDecoration: 'none',
                          color: 'text.primary',
                          '&:hover': {
                            color: 'primary.main',
                          },
                        }}
                      >
                        {item.product.title}
                      </Typography>
                      {item.product.description && (
                        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {item.product.description}
                        </Typography>
                      )}
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Rs. {item.product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </Typography>

                      {/* SKU Information */}
                      {item.skuCode && (
                        <Box>
                          {(item.color || item.size) && (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              {item.color && (
                                <Chip
                                  label={`Color: ${item.color}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                              {item.size && (
                                <Chip
                                  label={`Size: ${item.size}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* Quantity selector */}
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          QUANTITY
                        </Typography>
                        <Box sx={{ width: 120 }}>
                          <TextField
                            select
                            SelectProps={{ native: true }}
                            size="small"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                handleQuantityChange(item.skuCode, value);
                              }
                            }}
                            sx={{ width: '100%' }}
                            inputProps={{ style: { fontWeight: 500, textAlign: 'center' } }}
                          >
                            {[...Array(item.product.inventory)].slice(0, 10).map((_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                          </TextField>
                        </Box>
                      </Box>
                    </Box>

                    {/* Subtotal at bottom right */}
                    <Box sx={{ position: 'absolute', right: 32, bottom: 24, textAlign: 'right' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                        SUBTOTAL: Rs. {(item.product.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 64, zIndex: 1 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Order Summary
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Subtotal</Typography>
                <Typography>₹{subtotal.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Shipping</Typography>
                <Box sx={{ textAlign: 'right' }}>
                  {shipping !== 0 ? (
                    <Typography>₹{shipping.toFixed(2)}</Typography>) : (
                    <Chip label="Free" color="success" size="small" />
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Tax</Typography>
                <Typography>₹{tax.toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ₹{total.toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ mb: 2 }}
              >
                Proceed to Checkout
              </Button>

              <Button
                component={Link}
                to="/search"
                variant="outlined"
                size="large"
                fullWidth
              >
                Continue Shopping
              </Button>

              {shipping > 0 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="info.contrastText">
                    Add ₹{(500 - subtotal).toFixed(2)} more to get free shipping!
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CartPage;