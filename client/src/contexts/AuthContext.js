import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

// Create the context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize: check if user is already logged in
  useEffect(() => {
    const initUser = () => {
      const user = AuthService.getCurrentUser();
      setCurrentUser(user);
      setLoading(false);
    };
    
    initUser();
  }, []);
  
  // Login function
  const login = async (email, password) => {
    try {
      const response = await AuthService.login(email, password);
      
      if (response.success) {
        setCurrentUser(response.user);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  };
  
  // Logout function
  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return AuthService.isAuthenticated();
  };
  
  // Get user role
  const getUserRole = () => {
    return currentUser?.role || null;
  };
  
  // Context value
  const value = {
    currentUser,
    login,
    logout,
    loading,
    isAuthenticated,
    getUserRole
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;