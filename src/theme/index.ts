import { createTheme } from '@mui/material/styles';

// Extend MUI theme types
declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
  }
  interface TypeBackground {
    glass: string;
    glassDark: string;
  }
  interface TypeText {
    hint: string;
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A1A1A',
      light: '#2D2D2D',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F5F5F5',
      light: '#FFFFFF',
      dark: '#E0E0E0',
      contrastText: '#1A1A1A',
    },
    accent: {
      main: '#D4AF37',
      light: '#E6C547',
      dark: '#B8941F',
      contrastText: '#1A1A1A',
    },
    error: {
      main: '#DC3545',
      light: '#E74C3C',
      dark: '#C0392B',
    },
    warning: {
      main: '#FF6B35',
      light: '#FF8A65',
      dark: '#E64A19',
    },
    success: {
      main: '#27AE60',
      light: '#2ECC71',
      dark: '#229954',
    },
    background: {
      default: '#FAFAFA',
      paper: 'rgba(255, 255, 255, 0.8)',
      glass: 'rgba(255, 255, 255, 0.15)',
      glassDark: 'rgba(26, 26, 26, 0.15)',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      disabled: '#BDBDBD',
      hint: '#9E9E9E',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 300,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 300,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '-0.005em',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.005em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      fontWeight: 400,
      letterSpacing: '0.015em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.025em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.02em',
    },
    overline: {
      fontSize: '0.625rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(5px)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            backdropFilter: 'blur(5px)',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(8px)',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontSize: '0.875rem',
          fontWeight: 500,
          padding: '12px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
          '&.Mui-disabled': {
            background: 'rgba(0, 0, 0, 0.12)',
            color: 'rgba(0, 0, 0, 0.38)',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            '& .MuiButton-label': {
              color: 'rgba(0, 0, 0, 0.38)',
            },
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
          boxShadow: '0 4px 20px rgba(26, 26, 26, 0.15)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 100%)',
            boxShadow: '0 8px 30px rgba(26, 26, 26, 0.25)',
            transform: 'translateY(-2px)',
            color: '#FFFFFF',
          },
          '&.Mui-disabled': {
            background: 'rgba(0, 0, 0, 0.12)',
            color: 'rgba(0, 0, 0, 0.38)',
            boxShadow: 'none',
          },
        },
        outlined: {
          border: '1px solid rgba(26, 26, 26, 0.2)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          color: '#1A1A1A',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(26, 26, 26, 0.3)',
            transform: 'translateY(-1px)',
            color: '#1A1A1A',
          },
          '&.Mui-disabled': {
            background: 'rgba(0, 0, 0, 0.08)',
            color: 'rgba(0, 0, 0, 0.38)',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            backdropFilter: 'blur(10px)',
          },
        },
        text: {
          color: '#1A1A1A',
          '&:hover': {
            background: 'rgba(26, 26, 26, 0.05)',
            transform: 'translateY(-1px)',
            color: '#1A1A1A',
          },
          '&.Mui-disabled': {
            color: 'rgba(0, 0, 0, 0.38)',
            background: 'transparent',
          },
        },
        // Danger/Error button variants
        containedError: {
          background: 'linear-gradient(135deg, #DC3545 0%, #E74C3C 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(220, 53, 69, 0.15)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E74C3C 0%, #DC3545 100%)',
            boxShadow: '0 8px 30px rgba(220, 53, 69, 0.25)',
            transform: 'translateY(-2px)',
            color: '#FFFFFF',
          },
          '&.Mui-disabled': {
            background: 'rgba(220, 53, 69, 0.12)',
            color: 'rgba(0, 0, 0, 0.38)',
            boxShadow: 'none',
          },
        },
        outlinedError: {
          border: '1px solid rgba(220, 53, 69, 0.3)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          color: '#DC3545',
          '&:hover': {
            background: 'rgba(220, 53, 69, 0.1)',
            border: '1px solid rgba(220, 53, 69, 0.5)',
            transform: 'translateY(-1px)',
            color: '#DC3545',
          },
          '&.Mui-disabled': {
            background: 'rgba(220, 53, 69, 0.08)',
            color: 'rgba(220, 53, 69, 0.38)',
            border: '1px solid rgba(220, 53, 69, 0.12)',
            backdropFilter: 'blur(10px)',
          },
        },
        textError: {
          color: '#DC3545',
          '&:hover': {
            background: 'rgba(220, 53, 69, 0.08)',
            transform: 'translateY(-1px)',
            color: '#DC3545',
          },
          '&.Mui-disabled': {
            color: 'rgba(220, 53, 69, 0.38)',
            background: 'transparent',
          },
        },
        // Warning button variants
        containedWarning: {
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(255, 107, 53, 0.15)',
          '&:hover': {
            background: 'linear-gradient(135deg, #FF8A65 0%, #FF6B35 100%)',
            boxShadow: '0 8px 30px rgba(255, 107, 53, 0.25)',
            transform: 'translateY(-2px)',
            color: '#FFFFFF',
          },
          '&.Mui-disabled': {
            background: 'rgba(255, 107, 53, 0.12)',
            color: 'rgba(0, 0, 0, 0.38)',
            boxShadow: 'none',
          },
        },
        outlinedWarning: {
          border: '1px solid rgba(255, 107, 53, 0.3)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          color: '#FF6B35',
          '&:hover': {
            background: 'rgba(255, 107, 53, 0.1)',
            border: '1px solid rgba(255, 107, 53, 0.5)',
            transform: 'translateY(-1px)',
            color: '#FF6B35',
          },
          '&.Mui-disabled': {
            background: 'rgba(255, 107, 53, 0.08)',
            color: 'rgba(255, 107, 53, 0.38)',
            border: '1px solid rgba(255, 107, 53, 0.12)',
            backdropFilter: 'blur(10px)',
          },
        },
        textWarning: {
          color: '#FF6B35',
          '&:hover': {
            background: 'rgba(255, 107, 53, 0.08)',
            transform: 'translateY(-1px)',
            color: '#FF6B35',
          },
          '&.Mui-disabled': {
            color: 'rgba(255, 107, 53, 0.38)',
            background: 'transparent',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)',
            '& .MuiCardMedia-root': {
              transform: 'scale(1.05)',
            },
          },
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              border: '1px solid rgba(0, 0, 0, 0.2)',
              background: 'rgba(255, 255, 255, 0.9)',
            },
            '&.Mui-focused': {
              border: '1px solid #1A1A1A',
              background: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 0 0 3px rgba(26, 26, 26, 0.1)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#666666',
            '&.Mui-focused': {
              color: '#1A1A1A',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          color: '#1A1A1A',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(26, 26, 26, 0.2)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'rgba(26, 26, 26, 1)',
            transform: 'translateY(-1px)',
            backdropFilter: 'blur(15px)',
            color: '#000000',
          },
          '&.Mui-disabled': {
            background: 'rgba(0, 0, 0, 0.08)',
            color: 'rgba(0, 0, 0, 0.38)',
            backdropFilter: 'blur(10px)',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          background: '#D4AF37',
          color: '#FFFFFF',
          fontWeight: 600,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(2px)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(5px)',
        },
        bar: {
          borderRadius: 4,
          background: 'linear-gradient(90deg, #1A1A1A 0%, #2D2D2D 100%)',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#1A1A1A',
          '& .MuiCircularProgress-circle': {
            backdropFilter: 'blur(5px)',
          },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          background: 'rgba(0, 0, 0, 0.08)',
          borderRadius: 8,
          backdropFilter: 'blur(5px)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: 8,
          fontSize: '0.75rem',
          padding: '8px 12px',
        },
        arrow: {
          color: 'rgba(26, 26, 26, 0.9)',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: 12,
            color: '#1A1A1A',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          color: '#1A1A1A',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#1A1A1A',
          '&:hover': {
            background: 'rgba(26, 26, 26, 0.08)',
            backdropFilter: 'blur(10px)',
          },
          '&.Mui-selected': {
            background: 'rgba(26, 26, 26, 0.12)',
            color: '#1A1A1A',
            '&:hover': {
              background: 'rgba(26, 26, 26, 0.16)',
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#1A1A1A',
          '& .MuiInputBase-input': {
            color: '#1A1A1A',
            '&::placeholder': {
              color: 'rgba(26, 26, 26, 0.6)',
              opacity: 1,
            },
          },
        },
      },
    },
  },
});

export default theme;