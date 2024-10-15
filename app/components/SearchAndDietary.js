import React from 'react';
import { TextField, Button, Grid, Chip, Fade, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestrictionsIcon from '@mui/icons-material/NoMeals';
import Link from 'next/link';

export default function SearchAndDietary({ searchTerm, setSearchTerm, setDietaryProfileOpen, dietaryProfile }) {
  const getActiveRestrictions = () => {
    if (!dietaryProfile) return 0;

    const allergenCount = Object.values(dietaryProfile.allergens || {})
      .filter(v => v === true).length 
      + (dietaryProfile.allergens?.customAllergens?.length || 0);

    const prefCount = Object.values(dietaryProfile.preferences || {})
      .filter(v => v === true).length;

    const goalCount = Object.values(dietaryProfile.healthGoals || {})
      .filter(v => v === true).length;

    return allergenCount + prefCount + goalCount;
  };

  return (
    <Fade in={true} timeout={1400}>
      <Box sx={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={3} md={3}>
            <TextField
              variant="outlined"
              placeholder="Search products"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                height: '100%',
                '& .MuiInputBase-root': {
                  height: '100%',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5} md={4}>
            <Button
              variant="outlined"
              onClick={() => setDietaryProfileOpen(true)}
              startIcon={<RestrictionsIcon />}
              endIcon={
                getActiveRestrictions() > 0 && 
                <Chip 
                  size="small" 
                  label={getActiveRestrictions()} 
                  color="primary" 
                  sx={{ height: 30, minWidth: 20 }} 
                />
              }
              sx={{
                height: '100%',
                width: '100%',
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                padding: '10px 20px',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                },
              }}
            >
              Set Dietary Preferences
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Link href="/myrecipes" passHref>
              <Button
                variant="outlined"
                sx={{
                  height: '100%',
                  width: '100%',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  padding: '10px 20px',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                  },
                }}
              >
                My Recipes
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}
