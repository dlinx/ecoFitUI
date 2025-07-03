import React from 'react';
import { Box, Container, Typography, Grid, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="white" gutterBottom>
              EcoFit
            </Typography>
            <Typography variant="body2" color="white" paragraph>
              Sustainable fitness gear for a healthier you and planet.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" size="small">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="white" gutterBottom>
              Shop
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/men" color="inherit" variant="body2">
                Men's Collection
              </Link>
              <Link href="/women" color="inherit" variant="body2">
                Women's Collection
              </Link>
              <Link href="/categories" color="inherit" variant="body2">
                All Categories
              </Link>
              <Link href="/sale" color="inherit" variant="body2">
                Sale
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="white" gutterBottom>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/help" color="inherit" variant="body2">
                Help Center
              </Link>
              <Link href="/contact" color="inherit" variant="body2">
                Contact Us
              </Link>
              <Link href="/returns" color="inherit" variant="body2">
                Returns
              </Link>
              <Link href="/shipping" color="inherit" variant="body2">
                Shipping Info
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="white" gutterBottom>
              About
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/about" color="inherit" variant="body2">
                Our Story
              </Link>
              <Link href="/sustainability" color="inherit" variant="body2">
                Sustainability
              </Link>
              <Link href="/careers" color="inherit" variant="body2">
                Careers
              </Link>
              <Link href="/press" color="inherit" variant="body2">
                Press
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: 1,
            borderColor: 'primary.light',
            mt: 4,
            pt: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" color="white">
            © 2024 EcoFit. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/privacy" color="inherit" variant="body2">
              Privacy Policy
            </Link>
            <Link href="/terms" color="inherit" variant="body2">
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;