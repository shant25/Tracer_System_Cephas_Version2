import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import authService from '../services/auth.service';
import { ROLES } from '../config';

/**
 * Cephas Application Context
 * Provides global state and functions to components
 */
export const CephasContext = createContext(null);

export const CephasProvider = ({ children }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingData, setIsFetchingData] = useState(false);
  
  // Dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    today: {
      activations: 0,
      modifications: 0,
      assurances: 0,
      totalJobs: 0,
      assignedJobs: 0,
      unassignedJobs: 0
    },
    tomorrow: {
      activations: 0,
      modifications: 0,
      assurances: 0,
      totalJobs: 0,
      assignedJobs: 0,
      unassignedJobs: 0
    },
    future: {
      activations: 0,
      modifications: 0,
      assurances: 0,
      totalJobs: 0,
      assignedJobs: 0,
      unassignedJobs: 0
    }
  });
  
  // Reference data
  const [serviceInstallers, setServiceInstallers] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [materials, setMaterials] = useState([]);
  
  // Initialize auth state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = authService.isAuthenticated();
        setIsAuthenticated(isLoggedIn);
        
        if (isLoggedIn) {
          const user = authService.getCurrentUser();
          setCurrentUser(user);
          setUserRole(user.role);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Fetch initial data when authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchInitialData();
    }
  }, [isAuthenticated, currentUser]);
  
  // Function to fetch initial data
  const fetchInitialData = async () => {
    setIsFetchingData(true);
    
    try {
      // Fetch data in parallel with Promise.all
      await Promise.all([
        fetchDashboardStats(),
        fetchServiceInstallers(),
        fetchBuildings(),
        fetchMaterials()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load application data');
    } finally {
      setIsFetchingData(false);
    }
  };
  
  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      if (response.success) {
        setIsAuthenticated(true);
        setCurrentUser(response.user);
        setUserRole(response.user.role);
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'An error occurred during login' 
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserRole(null);
    // Reset all data
    setDashboardStats({
      today: {
        activations: 0,
        modifications: 0,
        assurances: 0,
        totalJobs: 0,
        assignedJobs: 0,
        unassignedJobs: 0
      },
      tomorrow: {
        activations: 0,
        modifications: 0,
        assurances: 0,
        totalJobs: 0,
        assignedJobs: 0,
        unassignedJobs: 0
      },
      future: {
        activations: 0,
        modifications: 0,
        assurances: 0,
        totalJobs: 0,
        assignedJobs: 0,
        unassignedJobs: 0
      }
    });
    setServiceInstallers([]);
    setBuildings([]);
    setMaterials([]);
  };
  
  // Data fetching functions
  const fetchDashboardStats = async () => {
    try {
      // For development, using mock data
      // In production, this would make an API call:
      // const response = await api.get('/dashboard/stats');
      // setDashboardStats(response.data);
      
      // Mock data for demonstration
      const mockData = {
        today: {
          activations: 12,
          modifications: 5,
          assurances: 3,
          totalJobs: 20,
          assignedJobs: 15,
          unassignedJobs: 5
        },
        tomorrow: {
          activations: 8,
          modifications: 3,
          assurances: 2,
          totalJobs: 13,
          assignedJobs: 7,
          unassignedJobs: 6
        },
        future: {
          activations: 35,
          modifications: 12,
          assurances: 8,
          totalJobs: 55,
          assignedJobs: 20,
          unassignedJobs: 35
        }
      };
      
      setDashboardStats(mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  };
  
  const fetchServiceInstallers = async () => {
    try {
      const response = await api.get('/service-installers');
      
      if (response.success) {
        setServiceInstallers(response.data);
        return response.data;
      } else {
        console.error('Error fetching service installers:', response.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching service installers:', error);
      return [];
    }
  };
  
  const fetchBuildings = async () => {
    try {
      const response = await api.get('/buildings');
      
      if (response.success) {
        setBuildings(response.data);
        return response.data;
      } else {
        console.error('Error fetching buildings:', response.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching buildings:', error);
      return [];
    }
  };
  
  const fetchMaterials = async () => {
    try {
      const response = await api.get('/materials');
      
      if (response.success) {
        setMaterials(response.data);
        return response.data;
      } else {
        console.error('Error fetching materials:', response.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      return [];
    }
  };
  
  // Context value
  const value = {
    // Authentication state
    isAuthenticated,
    currentUser,
    userRole,
    login,
    logout,
    isLoading,
    
    // Data
    dashboardStats,
    serviceInstallers,
    buildings,
    materials,
    isFetchingData,
    
    // Refresh functions
    fetchDashboardStats,
    fetchServiceInstallers,
    fetchBuildings,
    fetchMaterials,
    refreshBuildings: fetchBuildings
  };
  
  return (
    <CephasContext.Provider value={value}>
      {children}
    </CephasContext.Provider>
  );
};

export default CephasContext;