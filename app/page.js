'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Box, Container, Fade, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, CircularProgress, Zoom, Snackbar
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { keyframes } from '@mui/system';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { account, databases, getProducts, getDietaryProfile, saveDietaryProfile, saveRecipe } from './appwrite';
import Header from './components/Header';
import ActionButtons from './components/ActionsButtons';
import SearchAndDietary from './components/SearchAndDietary';
import ProductList from './components/ProductList';
import DietaryProfileDialog from './components/DietaryProfileDialog';
import AddProductDialog from './components/AddProductDialog';
import ReactMarkdown from 'react-markdown';

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
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const checkLoginStatus = useCallback(async () => {
    try {
      const user = await account.get();
      setIsLoggedIn(true);
      setUserName(user.name);
      setUserId(user.$id);
    } catch (error) {
      setIsLoggedIn(false);
      setUserName('');
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const loadProductList = useCallback(async () => {
    if (!userId) return; 
    try {
      const products = await getProducts(userId);
      setProductList(products);
      localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
      console.error('Error loading products from Appwrite:', error);
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProductList(JSON.parse(storedProducts));
      }
    }
  }, [userId]);
  
  useEffect(() => {
    if (isLoggedIn && userId) {
      loadProductList();
    }
  }, [isLoggedIn, userId, loadProductList]);

  useEffect(() => {
    if (isLoggedIn) {
      const loadProfileData = async () => {
        const storedProducts = localStorage.getItem('products');
        const storedProfile = localStorage.getItem('dietaryProfile');

        if (storedProducts) {
          setProductList(JSON.parse(storedProducts));
        } else {
          await loadProductList();
        }

        if (storedProfile) setDietaryProfile(JSON.parse(storedProfile));

        setIsProfileLoaded(true);
      };

      loadProfileData();
    }
  }, [isLoggedIn, loadProductList]);

  useEffect(() => {
    if (isProfileLoaded) {
      localStorage.setItem('dietaryProfile', JSON.stringify(dietaryProfile));
    }
  }, [dietaryProfile, isProfileLoaded]);

  const handleDietaryChange = async (category, item) => {
    console.log('Current category:', category);
    console.log('Current item:', item);
    
    const newProfile = {
      ...dietaryProfile,
      [category]: {
        ...dietaryProfile[category],
        [item]: !dietaryProfile[category][item]
      }
    };
    
    console.log('Updated profile:', newProfile);
    
    setDietaryProfile(newProfile);
    localStorage.setItem('dietaryProfile', JSON.stringify(newProfile));
  
    try {
      await saveDietaryProfile(userId, newProfile);
    } catch (error) {
      console.error('Error saving dietary profile:', error);
    }
  };
  

  const handleAddCustomAllergen = async () => {
    if (customAllergen && !dietaryProfile.allergens.customAllergens.includes(customAllergen)) {
      const newProfile = {
        ...dietaryProfile,
        allergens: {
          ...dietaryProfile.allergens,
          customAllergens: [...dietaryProfile.allergens.customAllergens, customAllergen]
        }
      };
      setDietaryProfile(newProfile);
      setCustomAllergen('');
      localStorage.setItem('dietaryProfile', JSON.stringify(newProfile));
      
      try {
        await saveDietaryProfile(userId, newProfile);
      } catch (error) {
        console.error('Error saving dietary profile:', error);
      }
    }
  };

  const handleRemoveCustomAllergen = async (allergen) => {
    const newProfile = {
      ...dietaryProfile,
      allergens: {
        ...dietaryProfile.allergens,
        customAllergens: dietaryProfile.allergens.customAllergens.filter(a => a !== allergen)
      }
    };
    setDietaryProfile(newProfile);
    localStorage.setItem('dietaryProfile', JSON.stringify(newProfile));
    
    try {
      await saveDietaryProfile(userId, newProfile);
    } catch (error) {
      console.error('Error saving dietary profile:', error);
    }
  };

  const handleAddProduct = async (productName) => {
    try {
      const newProduct = await saveProduct(productName, userId);
      setProductList(prevList => [...prevList, newProduct]);
      localStorage.setItem('products', JSON.stringify([...productList, newProduct]));
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const generateRecipe = async () => {
    setIsLoadingRecipe(true);
    setRecipeOpen(true);
  
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  
      const productNames = productList.map(product => product.name); 
  
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

      const prompt = `You are a friendly and enthusiastic chef assistant. Here's a list of ingredients available: ${productNames.join(', ')}. 

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
      Oh, let's make a (recipe name)! I see you have some fantastic ingredients in your kitchen! I've picked a few that will work wonderfully together..."
      8. End with an enthusiastic "Bon appétit! 🍽️" and a friendly closing note.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setRecipeContent(response.text());
      setRecipeContent(prevContent => prevContent);
    } catch (error) {
      console.error('Error generating recipe:', error);
      setRecipeContent('Sorry, there was an error generating your recipe. Please try again later.');
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  const handleSaveRecipe = async () => {
    try {
      if (!userId) {
        setSnackbarOpen(true);
        return;
      }
      await saveRecipe(userId, recipeContent);
      setSnackbarOpen(true);
      setRecipeOpen(false);
    } catch (error) {
      console.error('Error saving recipe:', error);
      if (error.message === 'User is not authenticated' || error.message === 'User is not authorized to save recipes') {
        setSnackbarOpen(true);
        handleSignOut();
      } else {
        setSnackbarOpen(true);
      }
    }
  };
  const handleAuthSuccess = async () => {
    try {
      const user = await account.get();
      setIsLoggedIn(true);
      setUserName(user.name);
      setUserId(user.$id);
      localStorage.setItem('userId', user.$id);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await account.deleteSession('current');
      setIsLoggedIn(false);
      setUserName('');
      setIsProfileLoaded(false);
      setProductList([]);
      setDietaryProfile(defaultDietaryProfile);
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
            userName={userName}
          />

          
          {isLoggedIn && (
            <>

          <Typography 
          variant="h5" 
          sx={{ 
          textAlign: 'center',
          fontFamily: 'Quicksand, sans-serif',
          color: 'text.secondary',
          fontWeight: 500
          }}>
          Your friendly AI-powered kitchen assistant
          </Typography>

          <Box 
          sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexDirection: 'column', 
          textAlign: 'center' 
          }}
          >
          <Typography variant="body1" sx={{ marginBottom: '16px', fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}>
          Hungry? KitchenPal will help you whip up something delicious using the ingredients you already have! 
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '16px', fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}>
          Got dietary restrictions? No problem—our recipes are tailor-made to fit your unique needs.
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '16px', fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}>
          Ready to get started? Dive into your pantry, adjust your dietary settings, and let’s cook up something amazing!
          </Typography>
          </Box>
            
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

              <Typography align="center" color="text.primary">
                You have {productList.length} products saved in your kitchen.
              </Typography>
              
              <ProductList 
                productList={productList} 
                searchTerm={searchTerm} 
                setProductList={setProductList}
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
                handleAddProduct={handleAddProduct}
                productName={productName}
                setProductName={setProductName}
                setProductList={setProductList}
                fadeInUp={fadeInUp}
                userId={userId} 
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
                  animation: `${fadeInUp} 0.5s ease-out`,
                  display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh',
                }
              }}
            >
              <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RestaurantIcon /> Recipe Suggestion
              </DialogTitle>
              <DialogContent sx={{ 
                flex: 1, 
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                width: '8px',
              },
                '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0,0,0,0.1)',
              },
                '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
              },
                '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: 'rgba(0,0,0,0.3)',
              },
              }}>
                {isLoadingRecipe ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <ReactMarkdown
                    components={{
                    h1: ({ node, ...props }) => <Typography variant="h4" gutterBottom {...props} />,
                    h2: ({ node, ...props }) => <Typography variant="h5" gutterBottom {...props} />,
                    h3: ({ node, ...props }) => <Typography variant="h6" gutterBottom {...props} />,
                    p: ({ node, ...props }) => <Typography variant="body1" paragraph {...props} />,
                    ul: ({ node, ...props }) => <ul style={{ paddingLeft: 20 }} {...props} />,
                    ol: ({ node, ...props }) => <ol style={{ paddingLeft: 20 }} {...props} />,
                    li: ({ node, ...props }) => <li style={{ marginBottom: 8 }} {...props} />,
                  }}
                  >
                    {recipeContent}
                    </ReactMarkdown>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleSaveRecipe} variant="contained" color="primary">
                  Save Recipe
                </Button>
                <Button onClick={() => setRecipeOpen(false)} variant="contained">
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={userId ? "Recipe saved successfully!" : "Please log in to save recipes."}
        />
          </>
        )}
      </Box>
    </Container>
  </Fade>
);
}