import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

const EditPropertyPage: React.FC = () => {
  const { id } = useParams();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Property
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Edit property form will be implemented here for property ID: {id}
        </Typography>
        <ul>
          <li>Pre-filled form with existing property data</li>
          <li>Ability to update all property fields</li>
          <li>Image management (add/remove images)</li>
          <li>Status updates (available/rented/sold/pending)</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default EditPropertyPage;
