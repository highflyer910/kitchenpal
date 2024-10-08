import { Typography, Box, useMediaQuery, useTheme, Zoom, Button } from '@mui/material';
import AuthPage from './AuthPage';

export default function Header({ isLoggedIn, onAuthSuccess, onSignOut }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Zoom in={true} timeout={800}>
            <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: { xs: 2, sm: 4 }
            }}>
                <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'center', 
                    alignItems: 'center',
                    width: '100%',
                    position: 'relative', 
                }}>
                    <Typography 
                        variant={isMobile ? "h3" : "h2"} 
                        color="text.primary"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Kitchen Pal
                    </Typography>
                    {isLoggedIn && (
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={onSignOut}
                            sx={{
                                position: 'absolute',
                                right: 0 
                            }}
                        >
                            Sign Out
                        </Button>
                    )}
                </Box>
                <Typography 
                    variant="subtitle" 
                    color="text.primary"
                    sx={{ 
                        opacity: 1,
                        animation: `$fadeInUp 0.8s ease-out forwards`,
                        animationDelay: '0.3s',
                        maxWidth: '600px',
                        marginBottom: { xs: 3, sm: 5 },
                        textAlign: 'center',
                        fontSize: { xs: '1rem', sm: '1.2rem' },
                    }}
                >
                    Save your ingredients, and discover delicious recipes in seconds!
                </Typography>
                {!isLoggedIn && <AuthPage onAuthSuccess={onAuthSuccess} />}
            </Box>
        </Zoom>
    );
}
