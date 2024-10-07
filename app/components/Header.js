import { Typography, Box, useMediaQuery, useTheme, Zoom } from '@mui/material';

export default function Header() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
    <Zoom in={true} timeout={800}>
    <Box sx={{ textAlign: 'center', marginTop: { xs: 2, sm: 4 } }}>
        <Typography 
        variant={isMobile ? "h3" : "h2"} 
        color="primary"
        sx={{
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
        }}
        >
            Kitchen Pal
        </Typography>
        <Typography 
        variant="subtitle1" 
        color="primary"
        sx={{ 
            marginBottom: 4,
            opacity: 1,
            animation: `$fadeInUp 0.8s ease-out forwards`,
            animationDelay: '0.3s'
        }}
        >
            Save your ingredients, and discover delicious recipes in seconds!
        </Typography>
    </Box>
    </Zoom>
    );
}