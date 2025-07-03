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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Divider,
  Chip,
} from '@mui/material';
import { Delete, Add, Remove, ShoppingBag } from '@mui/icons-material';
import { useCart } from '@hooks/useCart';
import { useProducts } from '@hooks/useContentstack';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { data: allProducts = [] } = useProducts();

  const cartProductsWithDetails = cart.items.map(item => {
    const product = allProducts.find(p => p.id === item.productId);
    return {
      ...item,
      product,
    };
  }).filter(item => item.product);

  const subtotal = cartProductsWithDetails.reduce(
    (sum, item) => sum + (item.product!.price * item.quantity),
    0
  );

  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - EcoFit</title>
        </Helmet>
        
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2 }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Add some products to get started
          </Typography>
          <Button
            component={Link}
            to="/search"
            variant="contained"
            size="large"
          >
            Continue Shopping
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart ({cart.itemCount}) - EcoFit</title>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          Shopping Cart
        </Typography>

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
                  onClick={clearCart}
                  color="error"
                >
                  Clear Cart
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartProductsWithDetails.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              component="img"
                              src={item.product!.images[0]}
                              alt={item.product!.title}
                              sx={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 1,
                              }}
                            />
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {item.product!.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.product!.category}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Remove />
                            </IconButton>
                            <TextField
                              size="small"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                              sx={{ width: 60, mx: 1 }}
                              inputProps={{ min: 1, style: { textAlign: 'center' } }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Add />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            ${item.product!.price}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            ${(item.product!.price * item.quantity).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Order Summary
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Subtotal</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Shipping</Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography>${shipping.toFixed(2)}</Typography>
                  {shipping === 0 && (
                    <Chip label="Free" color="success" size="small" />
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Tax</Typography>
                <Typography>${tax.toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ${total.toFixed(2)}
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
                    Add ${(50 - subtotal).toFixed(2)} more to get free shipping!
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