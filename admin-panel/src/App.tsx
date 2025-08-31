import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { AuthService } from './services/authService';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PropertiesPage from './components/PropertiesPage';
import AddPropertyPage from './components/AddPropertyPage';
import EditPropertyPage from './components/EditPropertyPage';
import InquiriesPage from './components/InquiriesPage';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FF9800',
    },
  },
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {!user ? (
          <LoginPage />
        ) : (
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/add" element={<AddPropertyPage />} />
              <Route path="/properties/edit/:id" element={<EditPropertyPage />} />
              <Route path="/inquiries" element={<InquiriesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
