import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Container, 
    Tabs, 
    Tab,
    InputAdornment,
    IconButton,
    FormControlLabel,
    Checkbox,
    Grid,
    Paper,
    Stack,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { 
    Visibility, 
    VisibilityOff,
    Kitchen,
    RestaurantMenu,
    Settings,
    SmartToy
} from '@mui/icons-material';
import { appwriteAuth } from '../appwrite';
import Image from 'next/image';

const FeatureCard = ({ icon: Icon, title, description }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Paper
            elevation={2}
            sx={{
                p: { xs: 2, sm: 3 },
                height: '100%',
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[8]
                },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
        >
            <Stack spacing={1.5} alignItems="center" textAlign="center">
                <Icon sx={{ 
                    fontSize: { xs: 32, sm: 40, md: 48 },
                    color: 'primary.main' 
                }} />
                <Typography 
                    variant={isMobile ? "subtitle1" : "h6"}
                    component="h3" 
                    fontWeight={700}
                    color="text.primary"
                >
                    {title}
                </Typography>
                <Typography 
                    color="text.secondary" 
                    variant={isMobile ? "body2" : "body1"}
                    sx={{ lineHeight: 1.6 }}
                >
                    {description}
                </Typography>
            </Stack>
        </Paper>
    );
};

const AuthPage = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const session = await appwriteAuth.login(email, password);
                if (rememberMe) {
                    localStorage.setItem('session', session.$id); 
                } else {
                    sessionStorage.setItem('session', session.$id); 
                }
            } else {
                await appwriteAuth.createAccount(email, password, name);
                const session = await appwriteAuth.login(email, password);
                if (rememberMe) {
                    localStorage.setItem('session', session.$id);
                } else {
                    sessionStorage.setItem('session', session.$id);
                }
            }
            if (onAuthSuccess) {
                onAuthSuccess();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
            <Grid container spacing={{ xs: 3, md: 6 }} justifyContent="center">
                <Grid item xs={12} md={3} container direction="column" spacing={2} alignItems="center">
                    <Grid item xs>
                        <FeatureCard
                            icon={Kitchen}
                            title="Inventory Management"
                            description="Keep track of your kitchen ingredients effortlessly and never let anything go to waste."
                        />
                    </Grid>
                    <Grid item xs>
                        <FeatureCard
                            icon={Settings}
                            title="Dietary Preferences"
                            description="Set your dietary requirements and get perfectly tailored recipe suggestions."
                        />
                    </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box 
                        sx={{ 
                            maxWidth: 480,
                            mx: 'auto',
                            px: { xs: 2, md: 4 },
                            py: { xs: 2, md: 4 }
                        }}
                    >
                        <Box sx={{ 
                            mb: { xs: 3, md: 5 }, 
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'center' 
                        }}>
                            <Box sx={{ 
                                width: { xs: '280px', sm: '320px' },
                                height: { xs: '200px', sm: '240px' }, 
                                position: 'relative'
                            }}>
                                <Image 
                                    src="/illustration.svg" 
                                    alt="Authentication illustration"
                                    fill
                                    priority
                                    style={{ objectFit: 'contain' }} 
                                />
                            </Box>
                        </Box>

                        <Tabs 
                            value={isLogin ? 0 : 1} 
                            onChange={(_, newValue) => setIsLogin(newValue === 0)}
                            sx={{ 
                                mb: 4,
                                '& .MuiTabs-indicator': {
                                    height: 3,
                                    borderRadius: '3px 3px 0 0'
                                },
                                '& .MuiTab-root': {
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    fontWeight: 600,
                                    color: 'text.secondary',
                                }
                            }}
                        >
                            <Tab label="Sign In" />
                            <Tab label="Sign Up" />
                        </Tabs>

                        <Box component="form" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <TextField
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    sx={{ mb: 3 }}
                                />
                            )}
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 3 }}
                            />
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        name="rememberMe"
                                        color="primary"
                                        sx={{ 
                                            '&.Mui-checked': {
                                                color: 'primary.main'
                                            }
                                        }}
                                    />
                                }
                                label={
                                    <Typography 
                                        variant="body2" 
                                        sx={{ fontWeight: 500 }}
                                    >
                                        Remember Me
                                    </Typography>
                                }
                                sx={{ mb: 3 }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ 
                                    py: { xs: 1.2, sm: 1.5 },
                                    fontWeight: 700,
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    borderRadius: 2,
                                    textTransform: 'none'
                                }}
                            >
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </Button>
                            
                            {error && (
                                <Typography 
                                    color="error" 
                                    align="center" 
                                    sx={{ 
                                        mt: 2,
                                        fontSize: '0.875rem',
                                        fontWeight: 500
                                    }}
                                >
                                    {error}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={3} container direction="column" spacing={2} alignItems="center">
                    <Grid item xs>
                        <FeatureCard
                            icon={SmartToy}
                            title="AI-Powered Recipes"
                            description="Get instant, creative recipe suggestions based on your available ingredients."
                        />
                    </Grid>
                    <Grid item xs>
                        <FeatureCard
                            icon={RestaurantMenu}
                            title="Smart Recipe Planning"
                            description="Plan your meals efficiently with personalized recipe recommendations."
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AuthPage;