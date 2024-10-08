import React from 'react';
import { Typography, Box, useMediaQuery, useTheme, Button, Container } from '@mui/material';
import AuthPage from './AuthPage';

export default function Header({ isLoggedIn, onAuthSuccess, onSignOut, userName }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="header"
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.default',
        py: 2
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            mb: 2
          }}
        >
          {isLoggedIn ? (
            <Typography 
              variant="h6"
              sx={{
                fontWeight: 500,
                color: 'text.primary',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '1rem',
                },
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
              textAlign: 'center',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: 'text.primary',
              [theme.breakpoints.up('md')]: {
                fontSize: '2.75rem',
              },
            }}
          >
            Kitchen Pal
          </Typography>

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
                px: { xs: 2, md: 3 },
                py: { xs: 0.5, md: 1 },
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                }
              }}
            >
              Sign Out
            </Button>
          ) : (
            <Box sx={{ width: { xs: 60, md: 100 } }} /> 
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
              fontSize: { xs: '1rem', md: '1.25rem' },
              mb: 4,
              px: 2
            }}
          >
            Save your ingredients, and discover delicious recipes in seconds!
          </Typography>
        )}

        {!isLoggedIn && <AuthPage onAuthSuccess={onAuthSuccess} />}
      </Container>
    </Box>
  );
}