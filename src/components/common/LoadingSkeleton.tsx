import React from 'react';
import { Box, Card, CardContent, Skeleton, Grid } from '@mui/material';

interface LoadingSkeletonProps {
  type: 'product' | 'banner' | 'category' | 'list';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, count = 1 }) => {
  const renderProductSkeleton = () => (
    <Card>
      <Skeleton variant="rectangular" width="100%" height={200} />
      <CardContent>
        <Skeleton variant="text" width="80%" height={24} />
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="40%" height={20} />
      </CardContent>
    </Card>
  );

  const renderBannerSkeleton = () => (
    <Skeleton variant="rectangular" width="100%" height={400} />
  );

  const renderCategorySkeleton = () => (
    <Card>
      <Skeleton variant="rectangular" width="100%" height={150} />
      <CardContent>
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="90%" height={16} />
      </CardContent>
    </Card>
  );

  const renderListSkeleton = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Skeleton variant="rectangular" width={60} height={60} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="60%" height={16} />
          </Box>
        </Box>
      ))}
    </Box>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'product':
        return renderProductSkeleton();
      case 'banner':
        return renderBannerSkeleton();
      case 'category':
        return renderCategorySkeleton();
      case 'list':
        return renderListSkeleton();
      default:
        return renderProductSkeleton();
    }
  };

  if (type === 'list') {
    return renderListSkeleton();
  }

  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          {renderSkeleton()}
        </Grid>
      ))}
    </Grid>
  );
};

export default LoadingSkeleton;