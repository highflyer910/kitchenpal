import { TextField, Button, Grid, Chip, Fade, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestrictionsIcon from '@mui/icons-material/NoMeals';

export default function SearchAndDietary({ searchTerm, setSearchTerm, setDietaryProfileOpen, dietaryProfile }) {
  const getActiveRestrictions = () => {
    const allergens = dietaryProfile?.allergens || {}; 
    const preferences = dietaryProfile?.preferences || {}; 
    const healthGoals = dietaryProfile?.healthGoals || {}; 

    const allergenCount = Object.values(allergens).filter(v => v === true).length 
      + (allergens.customAllergens ? allergens.customAllergens.length : 0);
    const prefCount = Object.values(preferences).filter(v => v === true).length;
    const goalCount = Object.values(healthGoals).filter(v => v === true).length;

    return allergenCount + prefCount + goalCount;
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={8}>
        <TextField
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Button
          startIcon={<RestrictionsIcon />}
          onClick={() => setDietaryProfileOpen(true)}
          variant="contained"
          fullWidth
        >
          {`Dietary Profile (${getActiveRestrictions()})`}
        </Button>
      </Grid>
    </Grid>
  );
}
