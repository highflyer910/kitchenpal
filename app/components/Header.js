import React from 'react';
import { Typography, Box, useMediaQuery, useTheme, Button, Container } from '@mui/material';
import AuthPage from './AuthPage';

export default function Header({ isLoggedIn, onAuthSuccess, onSignOut, userName }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="header"
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.default',
        py: { xs: 1.5, sm: 2, md: 2.5 }
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: { xs: 1, sm: 2 }
          }}
        >
          <Typography
            variant={isMobile ? 'h5' : (isTablet ? 'h4' : 'h3')}
            component="h1"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: 'primary.main',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
              flexGrow: 1,
              textAlign: { xs: 'center', sm: 'left' },
              order: { xs: 1, sm: 2 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Kitchen Pal
          </Typography>

          {isLoggedIn && (
            <Typography 
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                order: { xs: 2, sm: 1 }
              }}
            >
              Welcome, {userName.split(' ')[0]}
            </Typography>
          )}

          {isLoggedIn ? (
            <Button
              color="primary"
              onClick={onSignOut}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: { xs: 1.5, sm: 2, md: 3 },
                py: { xs: 0.5, sm: 0.75, md: 1 },
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
                order: 3
              }}
            >
              Sign Out
            </Button>
          ) : (
            <Box sx={{ order: 3 }} /> 
          )}
        </Box>

        {!isLoggedIn && (
          <Typography 
            variant="h6" 
            component="p" 
            align="center" 
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              mt: { xs: 2, sm: 3 },
              mx: 'auto'
            }}
          >
            Save your ingredients, and discover delicious recipes in seconds!
          </Typography>
        )}
      </Container>
      
      {!isLoggedIn && (
        <Box sx={{ mt: { xs: 3, sm: 4, md: 5 } }}>
          <AuthPage onAuthSuccess={onAuthSuccess} />
        </Box>
      )}
    </Box>
  );
}