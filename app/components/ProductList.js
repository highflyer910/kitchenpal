import { Paper, Typography, Grid, Grow, IconButton, Box, Fade } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KitchenIcon from '@mui/icons-material/Kitchen';

export default function ProductList({ productList, searchTerm, handleDeleteProduct }) {
    const filteredProducts = productList.filter((product) =>
    product.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
<Fade in={true} timeout={1600}>
    <Paper 
    elevation={3}
    sx={{
        width: '100%',
        maxWidth: 800,
        margin: '0 auto',
        padding: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            boxShadow: 6
        }
    }}
>
    <Typography 
    variant="h5" 
    color="text.primary" 
    gutterBottom
    sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontWeight: 600
    }}
    >
        <KitchenIcon /> Your Products
    </Typography>
        
    <Box sx={{ mt: 2 }}>
        {filteredProducts.length > 0 ? (
        <Grid container spacing={2}>
            {filteredProducts.map((product, index) => (
            <Grid item xs={12} key={index}>
                <Grow 
                in={true} 
                timeout={400 + index * 100}
                style={{ transformOrigin: '0 0 0' }}
                >
                <Paper 
                elevation={2}
                sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: 2, 
                bgcolor: 'secondary.main',
                borderRadius: 1.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                transform: 'translateX(8px) scale(1.01)',
                boxShadow: 4
            }
        }}
        >
    <Typography 
    color="text.primary"
    sx={{ 
    fontWeight: 500,
    transition: 'color 0.3s ease'
}}
>
    {product}
    </Typography>
    <IconButton 
    onClick={() => handleDeleteProduct(product)} 
    color="error"
    sx={{
    '&:hover': {
    bgcolor: 'rgba(255, 0, 0, 0.1)'
}
}}
>
    <DeleteIcon />
    </IconButton>
    </Paper>
    </Grow>
    </Grid>
))}
    </Grid>
    ) : (
    <Typography variant="body2" color="text.secondary">
        No products found.
    </Typography>
)}
    </Box>
    </Paper>
    </Fade>
    );
}
