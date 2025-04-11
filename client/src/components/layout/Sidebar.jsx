import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

/**
 * Sidebar component for navigation
 */
const Sidebar = ({ isOpen, onClose, links = [] }) => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState({});
  
  // Toggle section expansion
  const toggleSection = (path) => {
    setExpandedSections(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };
  
  // Check if a link is active
  const isLinkActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Render menu links
  const renderLinks = () => {
    return links.map((link, index) => {
      const hasChildren = link.children && link.children.length > 0;
      const isActive = isLinkActive(link.path);
      const isExpanded = expandedSections[link.path] || isActive;
      
      return (
        <div key={index} className="mb-1">
          {/* Parent Link */}
          {hasChildren ? (
            <button
              onClick={() => toggleSection(link.path)}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-md ${
                isActive
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              <span className="flex-1">{link.title}</span>
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          ) : (
            <Link
              to={link.path}
              className={`flex items-center px-4 py-2 text-sm rounded-md ${
                isActive
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              <span>{link.title}</span>
            </Link>
          )}
          
          {/* Child Links */}
          {hasChildren && isExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {link.children.map((child, childIndex) => (
                <Link
                  key={childIndex}
                  to={child.path}
                  className={`block px-4 py-2 text-sm rounded-md ${
                    location.pathname === child.path
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    });
  };
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b bg-white">
          <Link to="/dashboard" className="flex items-center">
            <img src="/api/placeholder/32/32" alt="Cephas Logo" className="h-8 w-8" />
            <span className="ml-2 text-lg font-semibold text-gray-800">Cephas</span>
          </Link>
          
          <button 
            onClick={onClose} 
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Sidebar Content */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-7rem)]">
          {renderLinks()}
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t absolute bottom-0 w-full bg-white">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium text-gray-700">{currentUser?.name || 'User'}</div>
              <div className="text-xs text-gray-500">{currentUser?.role || 'Role'}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-sm text-red-600 rounded-md border border-red-200 hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;