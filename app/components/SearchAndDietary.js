import { TextField, Button, Grid, Chip, Fade, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestrictionsIcon from '@mui/icons-material/NoMeals';

export default function SearchAndDietary({ searchTerm, setSearchTerm, setDietaryProfileOpen, dietaryProfile }) {
const getActiveRestrictions = () => {
    const allergenCount = Object.values(dietaryProfile.allergens).filter(v => v === true).length 
    + dietaryProfile.allergens.customAllergens.length;
    const prefCount = Object.values(dietaryProfile.preferences).filter(v => v === true).length;
    const goalCount = Object.values(dietaryProfile.healthGoals).filter(v => v === true).length;
    return allergenCount + prefCount + goalCount;
};

return (
<Fade in={true} timeout={1400}>
    <Grid container spacing={2} alignItems="stretch" sx={{ maxWidth: 800, margin: '0 auto' }}>
    <Grid item xs={12} md={4}>
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
    <Grid item xs={12} md={8}>
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
            sx={{ height: 20, minWidth: 20 }} 
        />
    }
    sx={{
    height: '100%',
    width: '100%',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': {
    backgroundColor: 'primary.light',
    color: 'primary.contrastText',
    },
}}
>
    Dietary Profile
    </Button>
    </Grid>
    </Grid>
    </Fade>
    );
}