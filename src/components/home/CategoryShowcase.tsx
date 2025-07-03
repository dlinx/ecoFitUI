import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
} from '@mui/material';
import { Category } from '@types';
import LoadingSkeleton from '@components/common/LoadingSkeleton';

interface CategoryShowcaseProps {
  categories: Category[];
  isLoading?: boolean;
  error?: Error | null;
}

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ categories, isLoading, error }) => {
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <LoadingSkeleton type="category" count={6} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h6" color="error" textAlign="center">
          Error loading categories
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        component="h2"
        textAlign="center"
        sx={{
          fontWeight: 700,
          mb: 1,
          color: 'text.primary',
        }}
      >
        Shop by Category
      </Typography>
      <Typography
        variant="h6"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Find the perfect gear for your fitness journey
      </Typography>

      <Grid container spacing={4}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={category.image}
                alt={category.name}
                sx={{
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                  {category.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {category.description}
                </Typography>
                <Button
                  component={Link}
                  to={`/category/${category.slug}`}
                  variant="outlined"
                  sx={{
                    alignSelf: 'flex-start',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Shop Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoryShowcase;