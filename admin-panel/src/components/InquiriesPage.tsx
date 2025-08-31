import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const InquiriesPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Inquiries
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Inquiries management will be implemented here. This includes:
        </Typography>
        <ul>
          <li>List of all property inquiries from mobile app users</li>
          <li>Filter by status (pending/responded/closed)</li>
          <li>View client contact information</li>
          <li>Update inquiry status</li>
          <li>Property details associated with each inquiry</li>
          <li>Response tracking and management</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default InquiriesPage;
