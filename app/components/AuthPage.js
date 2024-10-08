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
    Checkbox
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { appwriteAuth } from '../appwrite';
import Image from 'next/image';

const AuthPage = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false); 

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
        <Container maxWidth="sm" sx={{ width: '100%' }}>
            <Box 
                sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ 
                        width: '300px',
                        height: '220px', 
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 4
                    }}>
                        <Image 
                            src="/illustration.svg" 
                            alt="Authentication illustration"
                            fill
                            priority
                            style={{ 
                                objectFit: 'contain'
                            }} 
                        />
                    </Box>

                    <Typography 
                        component="h2" 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 400,
                            color: 'primary.main',
                            mb: 1
                        }}
                    >
                        {isLogin ? 'Welcome!' : 'Create Account'}
                    </Typography>

                    <Tabs 
                        value={isLogin ? 0 : 1} 
                        onChange={(_, newValue) => setIsLogin(newValue === 0)}
                        sx={{ 
                            mb: 3,
                            '& .MuiTabs-indicator': {
                                height: 3,
                                borderRadius: '3px 3px 0 0'
                            }
                        }}
                    >
                        <Tab label="Sign In" sx={{ fontWeight: 500 }} />
                        <Tab label="Sign Up" sx={{ fontWeight: 500 }} />
                    </Tabs>

                    <Box 
                        component="form" 
                        onSubmit={handleSubmit} 
                        sx={{ 
                            width: '100%', 
                            pb: 2 
                        }}
                    >
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
                                sx={{ mb: 2 }}
                                variant="outlined"
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
                            sx={{ mb: 2 }}
                            variant="outlined"
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
                            variant="outlined"
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
                            sx={{ mb: 1 }}
                        />

                        {/* "Remember Me" Checkbox */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    name="rememberMe"
                                    color="primary"
                                />
                            }
                            label="Remember Me"
                            sx={{ mb: 2 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            bgColor="text.primary"
                            sx={{ 
                                py: 1.5,
                                fontWeight: 400,
                                fontSize: '1rem',
                                borderRadius: 2
                            }}
                        >
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </Button>
                        {error && (
                            <Typography 
                                color="error" 
                                align="center" 
                                sx={{ 
                                    mt: 2,
                                    fontSize: '0.875rem'
                                }}
                            >
                                {error}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default AuthPage;
