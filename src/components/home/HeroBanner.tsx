import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { EntryBanner } from '../../types';

interface HeroBannerProps {
  banner: EntryBanner;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ banner }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 400, md: 500 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${banner.banner.banner_background.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          {banner.banner.banner_header}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            opacity: 0.9,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
          }}
        >
          {banner.banner.banner_subtitle}
        </Typography>
        {banner.banner.price && (
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 600,
              color: 'primary.main',
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            ₹{banner.banner.price}
          </Typography>
        )}
        <Button
          component={Link}
          to="/products"
          variant="contained"
          size="large"
          sx={{
            py: 1.5,
            px: 4,
            fontSize: '1.1rem',
            fontWeight: 600,
            textTransform: 'none',
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Shop Now
        </Button>
      </Container>
    </Box>
  );
};

export default HeroBanner;