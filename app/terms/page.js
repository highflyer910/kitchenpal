'use client';

import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';

const StyledModalContent = styled(Box)(({ theme }) => ({
    '&::-webkit-scrollbar': {
    width: '10px',
},
    '&::-webkit-scrollbar-track': {
    background: theme.palette.background.paper,
},
    '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '5px',
},
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.primary.dark,
},
}));

export default function TermsPage() {
    const router = useRouter();
    return (
    <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1">
            Terms of Service
        </Typography>
        <Button 
            variant="contained" 
            color="primary"
            onClick={() => router.push('/')}
        >
            Back to Home
        </Button>
        </Box>
        <Paper 
        elevation={0} 
        sx={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            p: 3,
            mb: 4,
            borderRadius: 2
        }}
    >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            KitchenPal Terms of Service
        </Typography>
        </Paper>

        <Box sx={{ textAlign: 'left' }}>
        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
            1. Acceptance of Terms
        </Typography>
        <Typography paragraph sx={{ textAlign: 'left' }}>
            By accessing and using KitchenPal, you agree to be bound by these Terms of Service and all applicable laws. 
            If you do not agree with any of these terms, you are prohibited from using the service.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
            2. Service Description
        </Typography>
        <Typography paragraph>
            KitchenPal provides AI-powered kitchen assistance including:
        </Typography>
        <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><Typography>Generating recipes from your ingredients</Typography></li>
            <li><Typography>Customizing meals for dietary needs</Typography></li>
            <li><Typography>Creating shopping lists</Typography></li>
            <li><Typography>Meal planning</Typography></li>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
            3. User Responsibilities
        </Typography>
        <Typography paragraph>
            You agree to:
        </Typography>
        <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><Typography>Maintain account security</Typography></li>
            <li><Typography>Use the service for personal purposes only</Typography></li>
            <li><Typography>Not submit copyrighted recipes without permission</Typography></li>
        </Box>

        <Typography variant="body2" sx={{ mt: 6, color: 'text.secondary' }}>
            Last updated: {new Date().toLocaleDateString()}
        </Typography>
        </Box>
    </Container>
    ) ;
}