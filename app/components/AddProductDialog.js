import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Zoom from '@mui/material/Zoom';

const AddProductDialog = ({ 
  open, 
  handleClose, 
  productName, 
  setProductName, 
  handleAddProduct,
  fadeInUp 
}) => {
  return (
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
  );
};

export default AddProductDialog;