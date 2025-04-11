import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AuthService from '../../services/auth.service';
import { getSidebarLinks } from '../../routes';
// ToastContainer is now managed in index.js

/**
 * Main layout component for authenticated pages
 * Includes sidebar, navbar, and main content area
 */
const MainLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [sidebarLinks, setSidebarLinks] = useState([]);
  
  // Get current user role
  const userRole = AuthService.getUserRole();
  
  // Close sidebar on location change (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);
  
  // Set page title and sidebar links based on current route
  useEffect(() => {
    // Get sidebar links for current user role
    const links = getSidebarLinks(userRole);
    setSidebarLinks(links);
    
    // Find current page title
    const currentPath = location.pathname;
    
    // First check for exact match
    let foundTitle = false;
    
    // Check main routes
    for (const link of links) {
      if (link.path === currentPath) {
        setPageTitle(link.title);
        foundTitle = true;
        break;
      }
      
      // Check child routes
      if (link.children && link.children.length > 0) {
        for (const child of link.children) {
          if (child.path === currentPath) {
            setPageTitle(child.title);
            foundTitle = true;
            break;
          }
        }
        
        if (foundTitle) break;
      }
    }
    
    // If no exact match, check for partial match
    if (!foundTitle) {
      for (const link of links) {
        if (currentPath.startsWith(link.path) && link.path !== '/') {
          setPageTitle(link.title);
          foundTitle = true;
          break;
        }
      }
    }
    
    // Default title if no match found
    if (!foundTitle) {
      setPageTitle('Dashboard');
    }
  }, [location, userRole]);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        links={sidebarLinks}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar 
          onMenuClick={toggleSidebar} 
          pageTitle={pageTitle}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          {children}
        </main>
      </div>
      
      {/* Toast Container for notifications is now in index.js */}
    </div>
  );
};

export default MainLayout;