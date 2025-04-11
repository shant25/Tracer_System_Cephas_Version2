import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, User, Settings, LogOut, Search } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import PropTypes from 'prop-types';

// PropTypes for notification object
const notificationPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  read: PropTypes.bool.isRequired
});

// Initial state for notifications
const initialNotificationsState = [];

// Maximum number of retries for fetching notifications
const MAX_RETRIES = 3;

// Interval for refreshing notifications (in milliseconds)
const REFRESH_INTERVAL = 30000;

/**
 * Navbar component for the application
 */
const Navbar = ({ onMenuClick, pageTitle }) => {
  // Hooks
  const { currentUser, logout } = useAuth();
  const { error: showError, info } = useNotification();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialNotificationsState);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  
  // Close menus when clicking outside
  const handleClickOutside = useCallback((event) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
      setShowProfileMenu(false);
    }
    
    if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
  
  // Fetch notifications data
  const fetchNotifications = useCallback(async () => {
    if (isLoading) return;
    let timeoutId;
    
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      const mockNotifications = [
        {
          id: 1,
          title: 'New Activation',
          message: 'A new activation has been assigned to you',
          time: '5 min ago',
          read: false
        },
        {
          id: 2,
          title: 'Material Request',
          message: 'Your material request has been approved',
          time: '1 hour ago',
          read: false
        },
        {
          id: 3,
          title: 'System Update',
          message: 'The system will be down for maintenance tonight',
          time: '3 hours ago',
          read: true
        }
      ];
      
      setNotifications(mockNotifications);
      if (retryCount > 0) {
        info('Notifications loaded successfully');
        setRetryCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        timeoutId = setTimeout(fetchNotifications, 1000 * (retryCount + 1));
        showError(`Failed to load notifications. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
      } else {
        showError('Failed to load notifications after multiple attempts');
        setNotifications(initialNotificationsState);
        setRetryCount(0);
      }
    } finally {
      setIsLoading(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, retryCount, info, showError]);

  // Cleanup function for notifications refresh interval
  useEffect(() => {
    const intervalId = setInterval(fetchNotifications, REFRESH_INTERVAL);
    return () => {
      clearInterval(intervalId);
      setNotifications(initialNotificationsState);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);
  
  // Toggle profile menu with error handling
  const toggleProfileMenu = useCallback(() => {
    try {
      setShowProfileMenu(prev => !prev);
      setShowNotifications(false);
    } catch (error) {
      console.error('Error toggling profile menu:', error);
      showError('Failed to toggle profile menu. Please try again.');
    }
  }, [showError]);
  
  // Toggle notifications panel with error handling
  const toggleNotifications = useCallback(() => {
    try {
      setShowNotifications(prev => !prev);
      setShowProfileMenu(false);
    } catch (error) {
      console.error('Error toggling notifications:', error);
      showError('Failed to toggle notifications. Please try again.');
    }
  }, [showError]);
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <header className="bg-white shadow-sm px-4 py-2 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick} 
          className="p-2 mr-3 rounded-md lg:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
        
        {/* Page Title */}
        <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Search Button */}
        <Link 
          to="/search" 
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <Search size={20} />
        </Link>
        
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
              <div className="p-2 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Notifications</h3>
                <Link to="/notifications" className="text-xs text-green-600 hover:underline">
                  View All
                </Link>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-3 hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}`}
                      >
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-xs mt-1 text-gray-600">{notification.message}</div>
                        <div className="text-xs mt-1 text-gray-400">{notification.time}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Profile Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={toggleProfileMenu}
            className="flex items-center"
          >
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
          </button>
          
          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50">
              <div className="py-2 border-b">
                <div className="px-4 py-2">
                  <div className="font-medium text-gray-700">{currentUser?.name || 'User'}</div>
                  <div className="text-xs text-gray-500">{currentUser?.email || 'user@example.com'}</div>
                </div>
              </div>
              <div className="py-1">
                <Link
                  to="/profile"
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Link>
              </div>
              <div className="py-1 border-t">
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center w-full text-left"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
  pageTitle: PropTypes.string.isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string
  }),
  notifications: PropTypes.arrayOf(notificationPropType)
};

export default memo(Navbar);