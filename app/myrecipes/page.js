'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Card, 
  CardContent, 
  CardActions, 
  IconButton, 
  Button, 
  Grid, 
  Modal 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { getRecipes, deleteRecipe } from '../appwrite';
import { useRouter } from 'next/navigation';

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

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/');
          return;
        }
        const fetchedRecipes = await getRecipes(userId);
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [router]);

  const handleDelete = async (recipeId) => {
    try {
      await deleteRecipe(recipeId);
      setRecipes(recipes.filter(recipe => recipe.$id !== recipeId));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleOpenModal = (recipe) => setSelectedRecipe(recipe);
  const handleCloseModal = () => setSelectedRecipe(null);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ paddingTop: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0, pt: 2 }}>
        <Typography variant="h4" component="h1">
          My Recipes
        </Typography>
        <Button variant="contained" color="primary" onClick={() => router.push('/')}>
          Back to Home
        </Button>
      </Box>

      {recipes.length === 0 ? (
        <Typography sx={{ mt: 2 }}>You haven&apos;t saved any recipes yet.</Typography>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {recipes.map((recipe, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.$id}>
              <Card sx={{ height: 150, position: 'relative', cursor: 'pointer' }} onClick={() => handleOpenModal(recipe)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {recipe.recipeName || `Recipe ${index + 1}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {recipe.recipe.slice(0, 100)}...
                  </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ position: 'absolute', top: 0, right: 0 }}>
                  <IconButton onClick={(e) => { 
                    e.stopPropagation(); 
                    handleDelete(recipe.$id); 
                  }} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Modal 
        open={Boolean(selectedRecipe)} 
        onClose={handleCloseModal}
        aria-labelledby="recipe-modal-title"
        aria-describedby="recipe-modal-description"
      >
        <StyledModalContent sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 600,
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          overflow: 'auto',
        }}>
          {selectedRecipe && (
            <>
              <Typography id="recipe-modal-title" variant="h5" component="h2" gutterBottom>
                {selectedRecipe.recipeName}
              </Typography>
              <Typography id="recipe-modal-description" variant="body1" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
                {selectedRecipe.recipe}
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleCloseModal}>
                Close
              </Button>
            </>
          )}
        </StyledModalContent>
      </Modal>
    </Container>
  );
}
