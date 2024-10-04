'use client';

import { useEffect, useState } from 'react';
import {
  Button, TextField, Box, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Paper, Container, Grid, Fade,
  useTheme, useMediaQuery, Grow, Zoom, CircularProgress,
  FormGroup, FormControlLabel, Checkbox, Divider,
  Switch, Chip, InputAdornment as Adornment, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SearchIcon from '@mui/icons-material/Search';
import KitchenIcon from '@mui/icons-material/Kitchen';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RestrictionsIcon from '@mui/icons-material/NoMeals';
import InputAdornment from '@mui/material/InputAdornment';
import { keyframes } from '@mui/system';
import { GoogleGenerativeAI } from "@google/generative-ai";


// Gemini AI
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

const smoothScale = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.02);
  }
`;

const searchBarStyles = {
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: 2,
    '&:hover': {
      boxShadow: 1,
    },
    '&.Mui-focused': {
      boxShadow: 2,
    }
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 14px',
  }
};

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Recipe modal
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [recipeContent, setRecipeContent] = useState('');
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);

  const [dietaryProfileOpen, setDietaryProfileOpen] = useState(false);
  const [dietaryProfile, setDietaryProfile] = useState({
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
  });
  const [customAllergen, setCustomAllergen] = useState('');

  // Load products from local storage
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProductList(JSON.parse(storedProducts));
    }
  }, []);

  const getActiveRestrictions = () => {
    const allergenCount = Object.values(dietaryProfile.allergens).filter(v => v === true).length 
      + dietaryProfile.allergens.customAllergens.length;
    const prefCount = Object.values(dietaryProfile.preferences).filter(v => v === true).length;
    const goalCount = Object.values(dietaryProfile.healthGoals).filter(v => v === true).length;
    return allergenCount + prefCount + goalCount;
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setProductName('');
    setOpen(false);
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

  const handleDeleteProduct = (productToDelete) => {
    const updatedProductList = productList.filter((product) => product !== productToDelete);
    setProductList(updatedProductList);
    localStorage.setItem('products', JSON.stringify(updatedProductList));
  };

  // Handler for dietary profile changes
  const handleDietaryChange = (category, item) => {
    setDietaryProfile(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category][item]
      }
    }));
  };

  // Handler for custom allergens
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

  const generateRecipe = async () => {
    setIsLoadingRecipe(true);
    setRecipeOpen(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Create dietary restrictions string
      const allergens = Object.entries(dietaryProfile.allergens)
        .filter(([key, value]) => value === true && key !== 'customAllergens')
        .map(([key]) => key);
      const customAllergens = dietaryProfile.allergens.customAllergens;
      const preferences = Object.entries(dietaryProfile.preferences)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);
      const healthGoals = Object.entries(dietaryProfile.healthGoals)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);

      const dietaryRestrictions = [...allergens, ...customAllergens, ...preferences];
      const healthConsiderations = healthGoals;
      
      const prompt = `You are a friendly and enthusiastic chef assistant. Based on these ingredients: ${productList.join(', ')}, create a recipe that considers the following dietary restrictions and preferences:

      Dietary Restrictions: ${dietaryRestrictions.length ? dietaryRestrictions.join(', ') : 'None'}
      Health Considerations: ${healthConsiderations.length ? healthConsiderations.join(', ') : 'None'}

      Your response should follow this format:
      1. Start with "👩‍🍳"
      2. A friendly, enthusiastic greeting and brief reaction to the ingredients (1-2 sentences)
      3. An excited introduction to the recipe you're suggesting (1 sentence)
      4. Recipe name as a heading
      5. List of ingredients with quantities
      6. Step by step cooking instructions
      7. Important dietary notes (allergen warnings, cross-contamination risks, etc.)
      8. End with an enthusiastic "Bon appétit! 🍽️" and a friendly closing note.

      Keep the tone warm and encouraging throughout the response.
      Example start:
      "👩‍🍳
      Oh wow, I see you have some amazing ingredients in your kitchen! With these, I can help you create something really special.
      I know just the perfect dish that will make everyone at the table smile..."`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setRecipeContent(text);
    } catch (error) {
      console.error('Error generating recipe:', error);
      setRecipeContent('Sorry, there was an error generating your recipe. Please try again later.');
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  const handleCloseRecipe = () => {
    setRecipeOpen(false);
    setRecipeContent('');
  };

  const filteredProducts = productList.filter((product) =>
    product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
  <Fade in={true} timeout={1000}>
    <Container maxWidth="lg">
      <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: { xs: 2, sm: 4 },
        bgcolor: 'background.default',
        animation: `${fadeInUp} 0.8s ease-out`
      }}
      >
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
              opacity: 0,
              animation: `${fadeInUp} 0.8s ease-out forwards`,
              animationDelay: '0.3s'
            }}
            >
              Save your ingredients, and discover delicious recipes in seconds!
            </Typography>
          </Box>
        </Zoom>

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
            >Add new product
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
              disabled={productList.length === 0}
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
            >Get recipe suggestions
                </Button>
              </Grid>
            </Grow>
        </Grid>

        <Fade in={true} timeout={1400}>
          <Grid container spacing={2} alignItems="stretch" sx={{ maxWidth: 800, margin: '0 auto' }}>
            <Grid item xs={12} md={4}>
              <TextField
                variant="outlined"
                placeholder="Search products"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  ...searchBarStyles,
                  height: '100%',
                  '& .MuiInputBase-root': {
                    height: '100%',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Button
                variant="outlined"
                onClick={() => setDietaryProfileOpen(true)}
                startIcon={<RestrictionsIcon />}
                endIcon={
                  getActiveRestrictions() > 0 && 
                  <Chip 
                    size="small" 
                    label={getActiveRestrictions()} 
                    color="primary" 
                    sx={{ height: 20, minWidth: 20 }} 
                  />
                }
                sx={{
                  height: '100%',
                  width: '100%',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                  },
                }}
              >
                Dietary Profile
              </Button>
            </Grid>
          </Grid>
        </Fade>

      <Dialog
          open={dietaryProfileOpen}
          onClose={() => setDietaryProfileOpen(false)}
          fullWidth
          maxWidth="sm"
          TransitionComponent={Zoom}
          transitionDuration={400}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RestrictionsIcon /> Dietary Profile
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {/* Allergens Section */}
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                🚫 Allergens & Intolerances
              </Typography>
              <FormGroup>
                {['gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish'].map((allergen) => (
                  <FormControlLabel
                    key={allergen}
                    control={
                      <Checkbox
                        checked={dietaryProfile.allergens[allergen]}
                        onChange={() => handleDietaryChange('allergens', allergen)}
                      />
                    }
                    label={allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                  />
                ))}
              </FormGroup>

              {/* Custom Allergens */}
              <Box sx={{ mt: 2, mb: 3 }}>
                <TextField
                  size="small"
                  value={customAllergen}
                  onChange={(e) => setCustomAllergen(e.target.value)}
                  placeholder="Add custom allergen"
                  InputProps={{
                    endAdornment: (
                      <Button
                        size="small"
                        onClick={handleAddCustomAllergen}
                        disabled={!customAllergen}
                      >
                        Add
                      </Button>
                    ),
                  }}
                />
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {dietaryProfile.allergens.customAllergens.map((allergen) => (
                    <Chip
                      key={allergen}
                      label={allergen}
                      onDelete={() => handleRemoveCustomAllergen(allergen)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Dietary Preferences */}
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                🥗 Dietary Preferences
              </Typography>
              <FormGroup>
                {Object.keys(dietaryProfile.preferences).map((pref) => (
                  <FormControlLabel
                    key={pref}
                    control={
                      <Switch
                        checked={dietaryProfile.preferences[pref]}
                        onChange={() => handleDietaryChange('preferences', pref)}
                      />
                    }
                    label={pref.charAt(0).toUpperCase() + pref.slice(1)}
                  />
                ))}
              </FormGroup>

              <Divider sx={{ my: 3 }} />

              {/* Health Goals */}
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                ⚕️ Health Goals
              </Typography>
              <FormGroup>
                {Object.keys(dietaryProfile.healthGoals).map((goal) => (
                  <FormControlLabel
                    key={goal}
                    control={
                      <Switch
                        checked={dietaryProfile.healthGoals[goal]}
                        onChange={() => handleDietaryChange('healthGoals', goal)}
                      />
                    }
                    label={goal.split(/(?=[A-Z])/).join(' ')}
                  />
                ))}
              </FormGroup>
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: 2 }}>
            <Button
              onClick={() => setDietaryProfileOpen(false)}
              variant="contained"
            >
              Done
            </Button>
          </DialogActions>
        </Dialog>
      
      {/* Products List */}
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

          <Dialog 
            open={open} 
            onClose={handleClose} 
            fullWidth
            maxWidth="sm"
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
            <DialogTitle sx={{ fontWeight: 600 }}>Add New Product</DialogTitle>
            <DialogContent>
              <TextField
                variant="outlined"
                label="Product Name"
                fullWidth
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                autoFocus
                sx={{ 
                  mt: 1,
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&.Mui-focused': {
                      transform: 'translateY(-1px)',
                      boxShadow: 1
                    }
                  }
                }}
              />
            </DialogContent>
            <DialogActions sx={{ padding: 2 }}>
              <Button 
              onClick={handleClose} 
              color="secondary"
              variant="outlined"
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                transform: 'translateY(-1px)'
              },
                padding: { xs: '8px 16px', sm: '10px 20px' },
                fontSize: { xs: '0.8rem', sm: '1rem' },
              }}
              >
              Cancel
              </Button>
              <Button
              onClick={handleAddProduct}
              color="primary"
              variant="contained"
              disabled={!productName}
              startIcon={<AddIcon />}
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: 3
                },
                padding: { xs: '8px 16px', sm: '10px 20px' },
                fontSize: { xs: '0.8rem', sm: '1rem' },
                minWidth: { xs: 'auto', sm: '120px' },
              }}
              >
                Add Product
              </Button>
          </DialogActions>

          </Dialog>

          {/* Recipe Dialog */}
          <Dialog open={recipeOpen} onClose={handleCloseRecipe} fullWidth maxWidth="md" TransitionComponent={Zoom}
            transitionDuration={400}
            PaperProps={{
              sx: {
                borderRadius: 2,
                padding: 1,
                animation: `${fadeInUp} 0.5s ease-out`
              }
            }}>
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
                    <Button onClick={handleCloseRecipe} variant="contained">
                      Close
                    </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </Fade>
  );
}