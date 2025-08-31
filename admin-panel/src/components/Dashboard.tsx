import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import {
  Home,
  QuestionAnswer,
  TrendingUp,
  AttachMoney,
} from '@mui/icons-material';
import { Property, Inquiry } from '../types';
import { PropertyService } from '../services/propertyService';
import LoadingSpinner from './LoadingSpinner';

interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  totalInquiries: number;
  pendingInquiries: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    availableProperties: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
  });
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load properties and inquiries in parallel
      const [properties, inquiries] = await Promise.all([
        PropertyService.getAllProperties(),
        PropertyService.getAllInquiries(),
      ]);

      // Calculate stats
      const availableProperties = properties.filter(p => p.status === 'available').length;
      const pendingInquiries = inquiries.filter(i => i.status === 'pending').length;

      setStats({
        totalProperties: properties.length,
        availableProperties,
        totalInquiries: inquiries.length,
        pendingInquiries,
      });

      // Set recent data
      setRecentProperties(properties.slice(0, 5));
      setRecentInquiries(inquiries.slice(0, 5));

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color, fontSize: 48 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Properties"
            value={stats.totalProperties}
            icon={<Home />}
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available"
            value={stats.availableProperties}
            icon={<TrendingUp />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Inquiries"
            value={stats.totalInquiries}
            icon={<QuestionAnswer />}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Inquiries"
            value={stats.pendingInquiries}
            icon={<AttachMoney />}
            color="#F44336"
          />
        </Grid>
      </Grid>

      {/* Recent Properties and Inquiries */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Properties
            </Typography>
            {recentProperties.length === 0 ? (
              <Typography color="textSecondary">
                No properties found. Add some properties to get started.
              </Typography>
            ) : (
              recentProperties.map((property) => (
                <Box
                  key={property.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: '1px solid #eee',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {property.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {property.location.area}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography
                      variant="body2"
                      sx={{
                        color: PropertyService.getStatusColor(property.status),
                        fontWeight: 'medium',
                        textTransform: 'capitalize',
                      }}
                    >
                      {property.status}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {PropertyService.formatPrice(property.price, property.priceType)}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Inquiries
            </Typography>
            {recentInquiries.length === 0 ? (
              <Typography color="textSecondary">
                No inquiries yet.
              </Typography>
            ) : (
              recentInquiries.map((inquiry) => (
                <Box
                  key={inquiry.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: '1px solid #eee',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {inquiry.clientName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {inquiry.clientEmail}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography
                      variant="body2"
                      sx={{
                        color: inquiry.status === 'pending' ? '#F44336' : '#4CAF50',
                        fontWeight: 'medium',
                        textTransform: 'capitalize',
                      }}
                    >
                      {inquiry.status}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {inquiry.createdAt.toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
