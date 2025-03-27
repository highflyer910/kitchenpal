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

export default function PrivacyPage() {
    const router = useRouter();
    return (
    <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1">
            Privacy Policy
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
            KitchenPal Privacy Policy
        </Typography>
        </Paper>

        <Box sx={{ textAlign: 'left' }}>
        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
            1. Information We Collect
        </Typography>
        <Typography paragraph>
            We collect only what&apos;s necessary to provide our service:
        </Typography>
        <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><Typography>Account information (email, username)</Typography></li>
            <li><Typography>Your ingredient inventory</Typography></li>
            <li><Typography>Dietary preferences and restrictions</Typography></li>
            <li><Typography>Recipe customizations</Typography></li>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
            2. How We Use Your Information
        </Typography>
        <Typography paragraph>
            Your data helps us:
        </Typography>
        <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><Typography>Generate personalized recipes</Typography></li>
            <li><Typography>Improve our AI suggestions</Typography></li>
            <li><Typography>Maintain account security</Typography></li>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
            3. Your Rights
        </Typography>
        <Typography paragraph>
            You can:
        </Typography>
        <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><Typography>Access, correct, or delete your data</Typography></li>
            <li><Typography>Export your recipes anytime</Typography></li>
            <li><Typography>Opt-out of non-essential data collection</Typography></li>
        </Box>

        <Typography variant="body2" sx={{ mt: 6, color: 'text.secondary' }}>
            Last updated: {new Date().toLocaleDateString()}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Contact us at: kitchenpal@google.com
        </Typography>
        </Box>
    </Container>
);
}