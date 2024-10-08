'use client';

import { useEffect, useState } from 'react';
import {
  Box, Container, Fade, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, CircularProgress, Zoom
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { keyframes } from '@mui/system';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { account } from './appwrite';
import Header from './components/Header';
import ActionButtons from './components/ActionsButtons';
import SearchAndDietary from './components/SearchAndDietary';
import ProductList from './components/ProductList';
import DietaryProfileDialog from './components/DietaryProfileDialog';
import AddProductDialog from './components/AddProductDialog';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const defaultDietaryProfile = {
  allergens: {
    gluten: false,
    dairy: false,
    nuts: false,
    eggs: false,
    soy: false,
    shellfish: false,
    customAllergens: []
  },
  preferences: {
    vegetarian: false,
    vegan: false,
    kosher: false,
    halal: false
  },
  healthGoals: {
    lowSodium: false,
    lowSugar: false,
    highProtein: false,
    lowCarb: false
  }
};

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [recipeContent, setRecipeContent] = useState('');
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [dietaryProfileOpen, setDietaryProfileOpen] = useState(false);
  const [dietaryProfile, setDietaryProfile] = useState(defaultDietaryProfile);
  const [customAllergen, setCustomAllergen] = useState('');
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  // Check login status and load user data
  // Check login status and load user data
useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      await account.get();
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  checkLoginStatus();
}, []);

// Load profile after successful login
useEffect(() => {
  if (isLoggedIn) {
    const loadProfileData = () => {
      const storedProducts = localStorage.getItem('products');
      const storedProfile = localStorage.getItem('dietaryProfile');

      if (storedProducts) setProductList(JSON.parse(storedProducts));
      if (storedProfile) setDietaryProfile(JSON.parse(storedProfile));

      setIsProfileLoaded(true);
    };

    loadProfileData();
  }
}, [isLoggedIn]); 


  // Save dietary profile changes
  useEffect(() => {
    if (isProfileLoaded) {
      localStorage.setItem('dietaryProfile', JSON.stringify(dietaryProfile));
    }
  }, [dietaryProfile, isProfileLoaded]);

  const handleAuthSuccess = () => setIsLoggedIn(true);


  const handleDietaryChange = (category, item) => {
    setDietaryProfile(prev => {
      const newProfile = {
        ...prev,
        [category]: {
          ...prev[category],
          [item]: !prev[category][item]
        }
      };
      return newProfile;
    });
  };

  const handleAddCustomAllergen = () => {
    if (customAllergen && !dietaryProfile.allergens.customAllergens.includes(customAllergen)) {
      setDietaryProfile(prev => ({
        ...prev,
        allergens: {
          ...prev.allergens,
          customAllergens: [...prev.allergens.customAllergens, customAllergen]
        }
      }));
      setCustomAllergen('');
    }
  };

  const handleRemoveCustomAllergen = (allergen) => {
    setDietaryProfile(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        customAllergens: prev.allergens.customAllergens.filter(a => a !== allergen)
      }
    }));
  };

  const handleAddProduct = () => {
    if (productName) {
      const updatedProductList = [...productList, productName];
      setProductList(updatedProductList);
      setProductName('');
      setOpen(false);
      localStorage.setItem('products', JSON.stringify(updatedProductList));
    }
  };

  const deleteProduct = (productToDelete) => {
    const updatedProductList = productList.filter(product => product !== productToDelete);
    setProductList(updatedProductList);
    localStorage.setItem('products', JSON.stringify(updatedProductList));
  };

  const generateRecipe = async () => {
    setIsLoadingRecipe(true);
    setRecipeOpen(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const dietaryRestrictions = [
        ...Object.entries(dietaryProfile.allergens)
          .filter(([key, value]) => value === true && key !== 'customAllergens')
          .map(([key]) => key),
        ...dietaryProfile.allergens.customAllergens,
        ...Object.entries(dietaryProfile.preferences)
          .filter(([_, value]) => value === true)
          .map(([key]) => key)
      ];

      const healthConsiderations = Object.entries(dietaryProfile.healthGoals)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);

      const prompt = `You are a friendly and enthusiastic chef assistant. Here's a list of ingredients available: ${productList.join(', ')}. 

      Create a recipe using some of these ingredients (you don't need to use all of them) while considering the following dietary restrictions and preferences:

      Dietary Restrictions: ${dietaryRestrictions.length ? dietaryRestrictions.join(', ') : 'None'}
      Health Considerations: ${healthConsiderations.length ? healthConsiderations.join(', ') : 'None'}

      Your response should follow this format:
      1. Start with "👩‍🍳"
      2. A friendly, enthusiastic greeting and brief reaction to the ingredients you've chosen to use (1-2 sentences)
      3. An excited introduction to the recipe you're suggesting (1 sentence)
      4. Recipe name as a heading
      5. List of ingredients with quantities (only include the ingredients you're using in the recipe)
      6. Step by step cooking instructions
      7. Important dietary notes (allergen warnings, cross-contamination risks, etc.)
      Keep the tone warm and encouraging throughout the response. Be creative with the ingredients, but make sure the recipe makes culinary sense.

      Example start:
      "👩‍🍳 
      Oh wow, I see you have some fantastic ingredients in your kitchen! I've picked a few that will work wonderfully together.
      I know just the perfect dish that will make everyone at the table smile..."
      8. End with an enthusiastic "Bon appétit! 🍽️" and a friendly closing note.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setRecipeContent(response.text());
    } catch (error) {
      console.error('Error generating recipe:', error);
      setRecipeContent('Sorry, there was an error generating your recipe. Please try again later.');
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await account.deleteSession('current');
      setIsLoggedIn(false);
      setIsProfileLoaded(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={1000}>
      <Container maxWidth="lg">
        <Box sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          padding: { xs: 2, sm: 4 },
          bgcolor: 'background.default',
          animation: `${fadeInUp} 0.8s ease-out`
        }}>
          <Header 
            isLoggedIn={isLoggedIn} 
            onAuthSuccess={handleAuthSuccess} 
            onSignOut={handleSignOut}
          />
          
          {isLoggedIn && (
            <>
              <ActionButtons 
                handleOpen={() => setOpen(true)} 
                generateRecipe={generateRecipe} 
                productListLength={productList.length} 
              />
              
              {isProfileLoaded && (
                <SearchAndDietary 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  setDietaryProfileOpen={setDietaryProfileOpen}
                  dietaryProfile={dietaryProfile}
                />
              )}
              
              <ProductList 
                productList={productList} 
                searchTerm={searchTerm} 
                handleDeleteProduct={deleteProduct} 
              />
              
              <DietaryProfileDialog 
                open={dietaryProfileOpen}
                onClose={() => setDietaryProfileOpen(false)}
                dietaryProfile={dietaryProfile}
                handleDietaryChange={handleDietaryChange}
                customAllergen={customAllergen}
                setCustomAllergen={setCustomAllergen}
                handleAddCustomAllergen={handleAddCustomAllergen}
                handleRemoveCustomAllergen={handleRemoveCustomAllergen}
              />
              
              <AddProductDialog 
                open={open}
                handleClose={() => setOpen(false)}
                productName={productName}
                setProductName={setProductName}
                handleAddProduct={handleAddProduct}
                fadeInUp={fadeInUp}
              />
              
              <Dialog 
                open={recipeOpen} 
                onClose={() => setRecipeOpen(false)} 
                fullWidth 
                maxWidth="md" 
                TransitionComponent={Zoom}
                transitionDuration={400}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    padding: 1,
                    animation: `${fadeInUp} 0.5s ease-out`
                  }
                }}
              >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RestaurantIcon /> Recipe Suggestion
                </DialogTitle>
                <DialogContent>
                  {isLoadingRecipe ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Typography
                      variant="body1"
                      component="div"
                      sx={{
                        whiteSpace: 'pre-line',
                        my: 2,
                        color: 'text.primary', 
                        '& h1, & h2, & h3': {
                          fontWeight: 600,
                          my: 2,
                          color: 'primary.main'
                        },
                        '& ul, & ol': {
                          pl: 3,
                          mb: 2
                        }
                      }}
                    >
                      {recipeContent}
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setRecipeOpen(false)} variant="contained">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Box>
      </Container>
    </Fade>
  );
}