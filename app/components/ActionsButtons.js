import { Button, Grid, Grow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export default function ActionButtons({ handleOpen, generateRecipe, productListLength }) {
    return (
    <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: 2 }}>
        <Grow in={true} timeout={1000}>
            <Grid item xs={12} sm={6} md={4}>
                <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOpen}
                fullWidth
                startIcon={<AddIcon />}
                sx={{
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 6
                }
                }}
                >
                Add new product
                </Button>
            </Grid>
        </Grow>
        <Grow in={true} timeout={1200}>
            <Grid item xs={12} sm={6} md={4}>
                <Button 
                variant="contained" 
                color="primary"
                fullWidth
                onClick={generateRecipe}
                disabled={productListLength === 0}
                startIcon={<RestaurantIcon />}
                sx={{
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 6
                    }
                }}
            >
                Get recipe suggestions
                </Button>
            </Grid>
        </Grow>
    </Grid>
    );
}
