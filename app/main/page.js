'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, Stack, Modal, Typography, TextField, Button, 
  Paper, Fade, Grow, IconButton, ThemeProvider, createTheme
} from "@mui/material";
import { collection, getDocs, query, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import Image from 'next/image';
import { GoogleGenerativeAI } from "@google/generative-ai";

const theme = createTheme({
  palette: {
    primary: {
      main: '#B35B38',
    },
    secondary: {
      main: '#FCF8E8',
    },
    background: {
      default: '#F2D09F',
      paper: '#C7954A',
    },
    text: {
      primary: '#5E6738',
    },
  },
});

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function Home() {
  const { user, loading } = useAuth();
  const [userName, setUserName] = useState('');
  const [userPhotoURL, setUserPhotoURL] = useState('');
  const router = useRouter();
  const [pantryProducts, setPantryProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [recipeSuggestions, setRecipeSuggestions] = useState([]);
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);

  const updatePantryProducts = async () => {
    if (!user) return;

    const snapshot = query(userInventoryRef);
    const docs = await getDocs(snapshot);
    const productList = [];
    docs.forEach((doc) => {
      const data = doc.data();
      if (!isNaN(data.quantity)) {
        productList.push({
          name: doc.id,
          ...data
        });
      }
    });
    setPantryProducts(productList);
  };

  const addProduct = async () => {
    console.log("addProduct called");
    if (!user || !productName || productQuantity <= 0) return; // Added validation

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + productQuantity }, { merge: true });
    } else {
      await setDoc(docRef, { quantity: productQuantity });
    }
    await updatePantryProducts();
    handleClose();
  };

  const removeProduct = async (productName) => {
    if (!user) return;

    if (productName === 'boxes') {
      console.log("Cannot delete 'boxes' product");
      return;
    }

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1 || isNaN(quantity)) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    } else {
      console.log("Product doesn't exist");
    }
    await updatePantryProducts();
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (user) {
      updatePantryProducts();
      const storedName = localStorage.getItem('userName');
      const storedPhotoURL = localStorage.getItem('userPhotoURL');
      setUserName(storedName || user.email.split('@')[0]);
      setUserPhotoURL(storedPhotoURL || '');
    }
  }, [user, loading, router]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredProducts = pantryProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getRecipeSuggestions = async () => {
    setLoadingRecipe(true);
    try {
      const ingredients = pantryProducts.map(product => product.name).slice(0, 5).join(", ");
      const chatSession = model.startChat({
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        },
        history: [],
      });
      const message = `Suggest a few recipes based on these ingredients: ${ingredients}. Keep the suggestions concise and practical. It is not necessary to include all the ingredients in the recipe. Provide recipe name and a brief description. add 👩🏻‍🍳 emoji in beginning of response. In the end wish a good appetite.`;

      const result = await chatSession.sendMessage(message);
      const suggestions = result.response.text()
        .split('\n')
        .filter(suggestion => suggestion.trim() !== '')
        .map(suggestion => suggestion.replace(/(\*\*.*?\*\*)/g, ''));
      setRecipeSuggestions(suggestions);
      setRecipeModalOpen(true);
    } catch (error) {
      console.error('Error fetching recipe suggestions:', error);
    }
    setLoadingRecipe(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  const isAddProductButtonDisabled = !productName.trim() || productQuantity <= 0;

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="background.default"
        overflow="auto"
        pt={4}
        pb={10}
        px={2}
        suppressHydrationWarning
        position="relative"
        width="100%"
      >
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 'calc(100% - 32px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {userPhotoURL && (
              <Image
                src={userPhotoURL}
                alt={userName}
                width={40}
                height={40}
                style={{ borderRadius: '50%', marginRight: '10px' }}
              />
            )}
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ mr: 2 }}
            >
              {userName}
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            onClick={handleSignOut}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'primary.light',
                color: 'secondary.main',
              },
            }}
          >
            Sign Out
          </Button>
        </Box>

        <Typography
          variant="h2"
          color="text.primary"
          fontWeight="bold"
          mb={4}
          mt={6}
          sx={{
            fontSize: '4rem',
            '@media (max-width: 900px)': {
              fontSize: '3.5rem',
            },
            '@media (max-width: 600px)': {
              fontSize: '3rem',
            },
          }}
        >
          Pantry Tracker
        </Typography>

        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          justifyContent="center" 
          gap={2} 
          mb={4}
          width="100%"
          maxWidth={800}
        >
          <Fade in={true} timeout={1000}>
            <Button 
              variant="contained" 
              onClick={handleOpen}
              size="large"
              sx={{ 
                color: 'secondary.main',
                minWidth: { xs: '90%', sm: 'auto' }
              }}
            >
              Add New Product
            </Button>
          </Fade>
          <Fade in={true} timeout={1000}>
            <Button 
              variant="contained" 
              onClick={getRecipeSuggestions}
              size="large"
              sx={{ 
                color: 'secondary.main', 
                backgroundColor: '#B35B38',
                '&:hover': { backgroundColor: '#684835' },
                minWidth: { xs: '90%', sm: 'auto' }
              }}
              disabled={loadingRecipe || pantryProducts.length === 0}
            >
              {loadingRecipe ? 'Loading...' : 'Get Recipe Suggestions'}
            </Button>
          </Fade>
        </Box>

        <TextField
          variant='outlined'
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products"
          sx={{
            maxWidth: 800,
            bgcolor: 'background.default',
            borderRadius: 1,
            p: 2,
            width: '100%',
            mb: 4
          }}
        />

        <Modal open={open} onClose={handleClose}>
          <Fade in={open}>
            <Paper
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                maxWidth: '90%',
                p: 4,
                borderRadius: 2,
                bgcolor: 'background.default',
              }}
            >
              <Typography variant="h6" mb={2}>Add New Product</Typography>
              <TextField
                label="Product Name"
                fullWidth
                margin="normal"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                margin="normal"
                value={productQuantity}
                onChange={(e) => setProductQuantity(Number(e.target.value))}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={addProduct}
                sx={{ mt: 2 }}
                disabled={isAddProductButtonDisabled} // Added disabled state
              >
                Add Product
              </Button>
            </Paper>
          </Fade>
        </Modal>

        <Paper elevation={3}
          sx={{
            width: '90%', 
            maxWidth: 800,
            borderRadius: 2,
            overflow: 'auto',
            mb: 6,
            '& ::-webkit-scrollbar': {
              width: '12px',
            },
            '& ::-webkit-scrollbar-track': {
              background: '#F2D09F',
            },
            '& ::-webkit-scrollbar-thumb': {
              background: '#B35B38',
            },
          }}
        >
          <Box p={2} bgcolor="primary.main">
            <Typography variant="h4" color="secondary.main" fontWeight="bold">Pantry Products</Typography>
          </Box>

          <Stack spacing={2} p={2} sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {filteredProducts.map(({ name, quantity }) => (
              <Grow in={true} key={name}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography variant="h6" color="secondary.main">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" color="secondary.main">
                      {quantity}
                    </Typography>
                    <IconButton
                      onClick={() => removeProduct(name)}
                      disabled={name === 'boxes'}
                      color="secondary"
                      sx={{ width: 30, height: 30, minWidth: 30 }}
                    >
                      -
                    </IconButton>
                  </Box>
                </Paper>
              </Grow>
            ))}
          </Stack>
        </Paper>

        <Modal open={recipeModalOpen} onClose={() => setRecipeModalOpen(false)}>
          <Fade in={recipeModalOpen}>
            <Paper
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                maxWidth: '90%',
                p: 4,
                borderRadius: 2,
                bgcolor: 'background.default',
                maxHeight: '80vh',
                overflow: 'auto',
                color: 'text.primary',
              }}
            >
              <Typography variant="h5" mb={2}>Recipe Suggestions</Typography>
              {recipeSuggestions.length > 0 ? (
                recipeSuggestions.map((suggestion, index) => (
                  <Typography key={index} variant="body1" mb={1}>{suggestion}</Typography>
                ))
              ) : (
                <Typography variant="body1">No suggestions available</Typography>
              )}
            </Paper>
          </Fade>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}
