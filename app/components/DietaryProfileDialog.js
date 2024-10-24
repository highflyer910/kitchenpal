import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, FormGroup, FormControlLabel, Checkbox,
  TextField, Button, Divider, Switch, Chip, Zoom
} from '@mui/material';
import RestrictionsIcon from '@mui/icons-material/NoMeals';

const DietaryProfileDialog = ({ 
  open, 
  onClose, 
  dietaryProfile = {}, 
  handleDietaryChange, 
  customAllergen, 
  setCustomAllergen,
  handleAddCustomAllergen,
  handleRemoveCustomAllergen
}) => {
  const safeProfile = {
  allergens: { customAllergens: [], ...dietaryProfile.allergens },
  preferences: { vegetarian: false, vegan: false, kosher: false, halal: false, ...dietaryProfile.preferences },
  healthGoals: { lowSodium: false, lowSugar: false, highProtein: false, lowCarb: false, ...dietaryProfile.healthGoals }
};


  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            🚫 Allergens & Intolerances
          </Typography>
          <FormGroup>
            {['gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish'].map((allergen) => (
              <FormControlLabel
                key={allergen}
                control={
                  <Checkbox
                    checked={safeProfile.allergens[allergen] || false}
                    onChange={() => handleDietaryChange('allergens', allergen)}
                  />
                }
                label={allergen.charAt(0).toUpperCase() + allergen.slice(1)}
              />
            ))}
          </FormGroup>

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
                    color= "text.primary"
                  >
                    Add
                  </Button>
                ),
              }}
            />
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {safeProfile.allergens.customAllergens.map((allergen) => (
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

          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            🥗 Dietary Preferences
          </Typography>
          <FormGroup>
            {Object.keys(safeProfile.preferences).map((pref) => (
              <FormControlLabel
                key={pref}
                control={
                  <Switch
                    checked={safeProfile.preferences[pref] || false}
                    onChange={() => handleDietaryChange('preferences', pref)}
                  />
                }
                label={pref.charAt(0).toUpperCase() + pref.slice(1)}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            ⚕️ Health Goals
          </Typography>
          <FormGroup>
            {Object.keys(safeProfile.healthGoals).map((goal) => (
              <FormControlLabel
                key={goal}
                control={
                  <Switch
                    checked={safeProfile.healthGoals[goal] || false}
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
          onClick={onClose}
          variant="contained"
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DietaryProfileDialog;