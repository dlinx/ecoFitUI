import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  InputBase,
  alpha,
  styled,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useCart } from '@hooks/useCart';
import { useHomePage } from '@hooks/useContentstack';
import Navigation from './Navigation';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { data: homePage } = useHomePage();

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const searchTerm = (event.target as HTMLInputElement).value;
      if (searchTerm.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'primary.main' }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontWeight: 700,
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          EcoFit
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {homePage?.app_navigation && (
            <Navigation navigation={homePage.app_navigation} />
          )}
        </Box>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search products..."
            inputProps={{ 'aria-label': 'search' }}
            onKeyPress={handleSearch}
          />
        </Search>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="large"
            color="inherit"
            component={Link}
            to="/cart"
            aria-label="shopping cart"
          >
            <Badge badgeContent={cart.itemCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;