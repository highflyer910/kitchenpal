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
  dietaryProfile, 
  handleDietaryChange, 
  customAllergen, 
  setCustomAllergen,
  handleAddCustomAllergen,
  handleRemoveCustomAllergen
}) => {
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