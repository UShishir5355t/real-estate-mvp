import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const AddPropertyPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Add Property
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Add property form will be implemented here. This includes:
        </Typography>
        <ul>
          <li>Property details form (title, description, price, type)</li>
          <li>Location information with coordinates</li>
          <li>Property specifications (bedrooms, bathrooms, area, furnishing)</li>
          <li>Amenities selection</li>
          <li>Image upload functionality</li>
          <li>Broker contact information</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default AddPropertyPage;
