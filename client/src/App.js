import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CephasProvider } from './contexts/CephasContext';
import { routes, getDashboardComponentByRole } from './routes';
import { ROLES } from './config';
import authService from './services/auth.service';
import LoadingScreen from './components/common/LoadingScreen';
import MainLayout from './components/layout/MainLayout';

/**
 * Lazy load page components
 */
const LoginPage = React.lazy(() => import('./pages/auth/Login'));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPasswordPage = React.lazy(() => import('./pages/auth/ResetPassword'));
const NotFoundPage = React.lazy(() => import('./pages/errors/NotFound'));
const UnauthorizedPage = React.lazy(() => import('./pages/errors/Unauthorized'));

/**
 * Main Application Component
 * Handles routing, authentication, and global application state
 */
const App = () => {
  return (
    <AuthProvider>
      <CephasProvider>
        <AppContent />
      </CephasProvider>
    </AuthProvider>
  );
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Authentication state
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthLoading(true);
      const isAuth = authService.isAuthenticated();
      
      if (isAuth) {
        // If on login page and already authenticated, redirect to dashboard
        if (location.pathname === '/login') {
          navigate('/dashboard');
        }
      } else {
        // If not authenticated and not on an auth page, redirect to login
        const authPaths = ['/login', '/forgot-password', '/reset-password'];
        if (!authPaths.includes(location.pathname) && !location.pathname.startsWith('/reset-password/')) {
          navigate('/login');
        }
      }
      
      setIsAuthLoading(false);
    };
    
    checkAuth();
  }, [location.pathname, navigate]);
  
  // Show loading screen while checking authentication
  if (isAuthLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Authentication Routes - accessible without authentication */}
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/forgot-password" element={<ForgotPasswordWrapper />} />
        <Route path="/reset-password" element={<ResetPasswordWrapper />} />
        <Route path="/reset-password/:token" element={<ResetPasswordWrapper />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Dashboard Route */}
            <Route path="/dashboard" element={<DashboardWrapper />} />
            
            {/* All other protected routes */}
            {routes
              .filter(route => route.auth && route.path !== '/dashboard')
              .map(route => {
                // If route has children, create nested routes
                if (route.children && route.children.length > 0) {
                  return (
                    <Route key={route.path} path={route.path}>
                      {/* If route has its own component, render it at the parent path */}
                      {route.component && (
                        <Route
                          index
                          element={
                            <ProtectedRouteComponent
                              component={route.component}
                              roles={route.roles}
                            />
                          }
                        />
                      )}
                      
                      {/* Render child routes */}
                      {route.children.map(child => (
                        <Route
                          key={child.path}
                          path={child.path.replace(route.path + '/', '')}
                          element={
                            <ProtectedRouteComponent
                              component={child.component}
                              roles={child.roles || route.roles}
                            />
                          }
                        />
                      ))}
                    </Route>
                  );
                } else {
                  // For routes without children
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <ProtectedRouteComponent
                          component={route.component}
                          roles={route.roles}
                        />
                      }
                    />
                  );
                }
              })}
            
            {/* Root path redirect to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Error routes */}
            <Route path="/unauthorized" element={<UnauthorizedWrapper />} />
            <Route path="*" element={<NotFoundWrapper />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

/**
 * Protected Route Component
 * Renders a component if the user has the required role
 */
const ProtectedRouteComponent = ({ component: Component, roles }) => {
  const userRole = authService.getUserRole();
  
  // If no roles specified or user has the required role, render the component
  if (!roles || roles.includes(userRole)) {
    return <Component />;
  }
  
  // Otherwise redirect to unauthorized page
  return <Navigate to="/unauthorized" />;
};

/**
 * Protected Route Wrapper
 * Only allows authenticated users to access protected routes
 */
const ProtectedRoute = () => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

/**
 * Dashboard Wrapper
 * Renders the appropriate dashboard based on user role
 */
const DashboardWrapper = () => {
  const userRole = authService.getUserRole();
  const DashboardComponent = getDashboardComponentByRole(userRole);
  
  if (!DashboardComponent) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <DashboardComponent />;
};

/**
 * Login Wrapper
 * Redirects authenticated users to dashboard
 */
const LoginWrapper = () => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />;
};

/**
 * Forgot Password Wrapper
 */
const ForgotPasswordWrapper = () => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPasswordPage />;
};

/**
 * Reset Password Wrapper
 */
const ResetPasswordWrapper = () => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <Navigate to="/dashboard" /> : <ResetPasswordPage />;
};

/**
 * Unauthorized Wrapper
 */
const UnauthorizedWrapper = () => {
  return <UnauthorizedPage />;
};

/**
 * Not Found Wrapper
 */
const NotFoundWrapper = () => {
  return <NotFoundPage />;
};

export default App;