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
  Modal,
  TextField,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getRecipes, deleteRecipe, updateRecipe, toggleFavorite } from '../appwrite';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
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
      if (selectedRecipe?.$id === recipeId) {
        setSelectedRecipe(null);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleOpenModal = (recipe) => {
    setSelectedRecipe(recipe);
    setEditedTitle(recipe.recipeName || '');
    setEditedContent(recipe.recipe || '');
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedRecipe = await updateRecipe(
        selectedRecipe.$id,
        editedTitle,
        editedContent
      );
      
      setRecipes(recipes.map(recipe => 
        recipe.$id === selectedRecipe.$id ? updatedRecipe : recipe
      ));
      setSelectedRecipe(updatedRecipe);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(selectedRecipe.recipeName || '');
    setEditedContent(selectedRecipe.recipe || '');
  };

  const handleToggleFavorite = async (recipeId, currentStatus) => {
    try {
      if (!recipeId) throw new Error("No recipe ID provided");
      const updatedRecipe = await toggleFavorite(recipeId, currentStatus ?? false);
      setRecipes(prev => prev.map(r => r.$id === recipeId ? updatedRecipe : r));
    } catch (error) {
      console.error("Error toggling favorite:", error);
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
              <Card sx={{ 
                height: 150, 
                position: 'relative', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between' // This helps with bottom alignment
          }} onClick={() => handleOpenModal(recipe)}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
          {recipe.recipeName || `Recipe ${index + 1}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {recipe.recipe.slice(0, 100)}...
        </Typography>
        </CardContent>

        {/* Favorite Button - Top Right */}
        <IconButton 
        onClick={(e) => {
        e.stopPropagation();
        handleToggleFavorite(recipe.$id, recipe.isFavorite || false);
        }}
        aria-label="favorite"
        sx={{ 
          position: 'absolute',
          top: 8,
          right: 8,
          color: recipe.isFavorite ? 'primary.main' : 'inherit', // Changed from red
          '&:hover': {
            transform: 'scale(1.1)',
            color: recipe.isFavorite ? 'primary.dark' : 'action.active' // Hover states
          }
        }}
        >
        {recipe.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>

        {/* Delete Button - Bottom Right */}
        <IconButton 
        onClick={(e) => {
        e.stopPropagation();
        handleDelete(recipe.$id);
        }}
        aria-label="delete"
        sx={{ 
          position: 'absolute',
          bottom: 8,
          right: 8,
          transition: 'all 0.2s ease-in-out',
        }}
        >
        <DeleteIcon />
      </IconButton>
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
              {isEditing ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography id="recipe-modal-title" variant="h5" component="h2" gutterBottom>
                  {selectedRecipe.recipeName || `Recipe ${recipes.indexOf(selectedRecipe) + 1}`}
                </Typography>
              )}

              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  variant="outlined"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              ) : (
                <Typography id="recipe-modal-description" variant="body1" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
                  {selectedRecipe.recipe}
                </Typography>
              )}

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                {isEditing ? (
                  <>
                    <Button 
                      variant="contained" 
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<CloseIcon />}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="contained" 
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={handleCloseModal}
                    >
                      Close
                    </Button>
                  </>
                )}
              </Stack>
            </>
          )}
        </StyledModalContent>
      </Modal>
    </Container>
  );
}