import React, { useState } from 'react';
import { Typography, Box, useMediaQuery, IconButton, Container, Menu, MenuItem, Tooltip, Button } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import PaletteIcon from '@mui/icons-material/Palette';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AuthPage from './AuthPage';
import { useTheme } from '../ThemeContext';

export default function Header({ isLoggedIn, onAuthSuccess, onSignOut, userName }) {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const { toggleTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleClose();
    onSignOut();
  };

  const handleFeedbackClick = () => {
    window.location.href = 'https://tally.so/r/w4zE9B';
  };

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
            mb: { xs: 2, sm: 0 },
            position: 'relative',
          }}
        >
          {isLoggedIn ? (
            <Box 
              onClick={handleClick}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                }}
              >
                {userName.split(' ')[0]}
              </Typography>
              <ArrowDropDownIcon sx={{ color: 'text.primary' }} />
            </Box>
          ) : (
            <Box sx={{ width: 40, flexShrink: 0 }} />
          )}
          
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h1"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: 'text.primary',
              fontFamily: 'Quicksand, sans-serif',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'auto',
              textAlign: 'center',
            }}
          >
            Kitchen Pal
          </Typography>

          <Tooltip title="Choose your color theme">
            <IconButton
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'background.default',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={toggleTheme}
              color="inherit"
              aria-label="Choose your color theme"
            >
              <PaletteIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        </Menu>
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
              mb: 2,
              px: 2,
            }}
          >
            Save your ingredients, and discover delicious recipes in seconds!
          </Typography>
          
          {/* New Beta Message */}
          <Typography
            variant="body1"
            component="p"
            align="center"
            sx={{
              color: 'text.primary',
              maxWidth: '600px',
              fontWeight: 500,
              fontSize: { xs: '0.875rem', md: '1rem' },
              mb: 2,
              px: 2,
            }}
          >
            (🚧 KitchenPal is currently in beta! I'm improving features and would love your feedback.)
          </Typography>
          
          {/* Feedback Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleFeedbackClick}
            sx={{ mb: 4 }}
          >
            Give Feedback
          </Button>

          <AuthPage onAuthSuccess={onAuthSuccess} />
        </Box>
      )}
    </Box>
  );
}
