import React from 'react';
import { Typography, Box, useMediaQuery, Button, Container, IconButton } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import PaletteIcon from '@mui/icons-material/Palette';
import AuthPage from './AuthPage';
import { useTheme } from '../ThemeContext';
export default function Header({ isLoggedIn, onAuthSuccess, onSignOut, userName }) {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const { toggleTheme } = useTheme();

  return (
    <Box
      component="header"
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.default',
        py: 2,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        {isLoggedIn ? (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: 'text.primary',
              textAlign: { xs: 'center', sm: 'left' },
              mb: { xs: 2, sm: 0 },
            }}
          >
            Welcome, {userName.split(' ')[0]}
          </Typography>
        ) : (
          <Box sx={{ width: { xs: 60, md: 100 } }} /> 
        )}

        <Typography
          variant={isMobile ? 'h5' : 'h3'}
          component="h1"
          sx={{
            fontWeight: 700,
            letterSpacing: '0.02em',
            textAlign: 'center',
            color: 'text.primary',
            mb: { xs: 2, sm: 0 },
            flexGrow: 1,
            fontFamily: 'Quicksand, sans-serif'
          }}
        >
          Kitchen Pal
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            sx={{
              ml: 1,
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            onClick={toggleTheme}
            color="inherit"
            aria-label="Toggle theme"
          >
            <PaletteIcon />
          </IconButton>

          {isLoggedIn && (
            <Button
              color="primary"
              onClick={onSignOut}
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: { xs: 2, md: 3 },
                py: { xs: 0.5, md: 1 },
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
                mb: { xs: 2, sm: 0 },
                ml: 2,
              }}
            >
              Sign Out
            </Button>
          )}
        </Box>
      </Container>

      {!isLoggedIn && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            mt: 4, 
          }}
        >
          <Typography
            variant="h6"
            component="p"
            align="center"
            sx={{
              color: 'text.primary',
              maxWidth: '600px',
              fontWeight: 500,
              fontSize: { xs: '1rem', md: '1.25rem' },
              mb: 4,
              px: 2,
            }}
          >
            Save your ingredients, and discover delicious recipes in seconds!
          </Typography>

          <AuthPage onAuthSuccess={onAuthSuccess} />
        </Box>
      )}
    </Box>
  );
}