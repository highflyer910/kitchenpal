'use client';

import { useEffect, useState } from 'react';
import {
  Button, TextField, Box, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Paper, Container, Grid, Fade,
  useTheme, useMediaQuery, Grow, Zoom, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SearchIcon from '@mui/icons-material/Search';
import KitchenIcon from '@mui/icons-material/Kitchen';
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

  // Load products from local storage
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProductList(JSON.parse(storedProducts));
    }
  }, []);

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

  const generateRecipe = async () => {
    setIsLoadingRecipe(true);
    setRecipeOpen(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const prompt = `You are a friendly and enthusiastic chef assistant. Based on these ingredients: ${productList.join(', ')}, engage in a brief friendly conversation first, then provide a recipe suggestion.

      Your response should follow this format:
      1. Start with "👩‍🍳"
      2. A friendly, enthusiastic greeting and brief reaction to the ingredients (1-2 sentences)
      3. An excited introduction to the recipe you're suggesting (1 sentence)
      4. Recipe name as a heading
      5. List of ingredients with quantities
      6. Step by step cooking instructions
      7. End with an enthusiastic "Bon appétit! 🍽️" and a friendly closing note.

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
            color="text.secondary"
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
          <TextField
          variant="outlined"
          placeholder="Search products"
          fullWidth
          sx={{
            maxWidth: 800,
            margin: '0 auto',
            '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: 'background.paper',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: 2
          },
            '&.Mui-focused': {
            transform: 'translateY(-1px)',
            boxShadow: 3
          }
        }
      }}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
        <InputAdornment position="start">
        <SearchIcon color="action" />
        </InputAdornment>
        ),
      }}
      />
      </Fade>
      
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
                  }
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
                  }
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