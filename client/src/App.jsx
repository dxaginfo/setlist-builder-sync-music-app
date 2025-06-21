import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { selectAuth, checkAuthStatus } from './store/slices/authSlice';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import SetlistsPage from './pages/setlists/SetlistsPage';
import SetlistDetail from './pages/setlists/SetlistDetail';
import SongsPage from './pages/songs/SongsPage';
import SongDetail from './pages/songs/SongDetail';
import BandsPage from './pages/bands/BandsPage';
import BandDetail from './pages/bands/BandDetail';
import ProfilePage from './pages/profile/ProfilePage';
import NotFound from './pages/NotFound';

// Guards
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(selectAuth);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(selectAuth);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route element={<AuthLayout />}>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
        </Route>
        
        {/* Private Routes */}
        <Route element={<MainLayout />}>
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/setlists" 
            element={
              <PrivateRoute>
                <SetlistsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/setlists/:id" 
            element={
              <PrivateRoute>
                <SetlistDetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/songs" 
            element={
              <PrivateRoute>
                <SongsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/songs/:id" 
            element={
              <PrivateRoute>
                <SongDetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/bands" 
            element={
              <PrivateRoute>
                <BandsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/bands/:id" 
            element={
              <PrivateRoute>
                <BandDetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } 
          />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;