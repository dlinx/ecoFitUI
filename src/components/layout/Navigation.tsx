import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemText
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { Menu as MenuType, NavigationGroup, CategoryChild } from '../../types';

interface NavigationProps {
  navigation: MenuType[];
}

const Navigation: React.FC<NavigationProps> = ({ navigation }) => {
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, groupId: string) => {
    setAnchorEl(prev => ({ ...prev, [groupId]: event.currentTarget }));
  };

  const handleMenuClose = (groupId: string) => {
    setAnchorEl(prev => ({ ...prev, [groupId]: null }));
  };

  const renderCategoryChildren = (categoryChild: CategoryChild) => (
    <Box key={categoryChild._metadata.uid} sx={{ minWidth: 200 }}>
      <MenuItem
        component={Link}
        to={categoryChild.category_title.href}
        onClick={() => handleMenuClose(categoryChild._metadata.uid)}
        sx={{
          px: 2,
          py: 1,
          fontWeight: 600,
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <ListItemText
          primary={categoryChild.category_title.title}
          primaryTypographyProps={{
            variant: 'subtitle2',
            fontWeight: 600,
          }}
        />
      </MenuItem>
      {categoryChild.category_childs.map((child, index) => (
        <MenuItem
          key={index}
          component={Link}
          to={child.href}
          onClick={() => handleMenuClose(categoryChild._metadata.uid)}
          sx={{
            px: 2,
            py: 1,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ListItemText
            primary={child.title}
            primaryTypographyProps={{
              variant: 'body2',
              color: 'text.secondary',
            }}
          />
        </MenuItem>
      ))}
    </Box>
  );

  const renderNavigationGroup = (group: NavigationGroup) => (
    <Box key={group._metadata.uid}>
      <Button
        component={Link}
        to={group.class_title.href}
        color="inherit"
        endIcon={anchorEl[group._metadata.uid] ? <ExpandLess /> : <ExpandMore />}
        onClick={(e) => {
          // If menu is open, close it
          if (anchorEl[group._metadata.uid]) {
            handleMenuClose(group._metadata.uid);
          }
        }}
        onMouseEnter={(e) => handleMenuOpen(e, group._metadata.uid)}
        sx={{
          mx: 1,
          textTransform: 'none',
          color: '#1A1A1A',
          '&:hover': {
            backgroundColor: 'rgba(26, 26, 26, 0.08)',
            backdropFilter: 'blur(2px)',
          },
        }}
      >
        {group.class_title.title}
      </Button>
      <Menu
        anchorEl={anchorEl[group._metadata.uid]}
        open={Boolean(anchorEl[group._metadata.uid])}
        onClose={() => handleMenuClose(group._metadata.uid)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            p: 2,
            minWidth: 400,
          },
        }}
      >
        {group.class_childrens.map((categoryChild) => 
          renderCategoryChildren(categoryChild)
        )}
      </Menu>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {navigation.map((menu) => 
        menu.navigation_group.map((group) => renderNavigationGroup(group))
      )}
    </Box>
  );
};

export default Navigation; 