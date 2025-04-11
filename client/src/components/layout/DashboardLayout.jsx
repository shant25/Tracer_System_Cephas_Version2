import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Calendar, RefreshCw } from 'lucide-react';
import { DASHBOARD_REFRESH_INTERVAL } from '../../config';
import useAuth from '../../hooks/useAuth';
import useCephas from '../../hooks/useCephas';
import Button from '../common/Button';

/**
 * Dashboard layout component for dashboard pages
 * Provides common dashboard UI elements and refresh functionality
 */
const DashboardLayout = ({ 
  title,
  subtitle,
  children,
  actions,
  showRefreshButton = true,
  showDateDisplay = true,
  lastUpdated,
  onRefresh
}) => {
  const { currentUser } = useAuth();
  const { isLoading, fetchDashboardStats } = useCephas();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(
    lastUpdated || new Date()
  );

  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Format time for display
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    }).format(date);
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    if (isRefreshing || isLoading) return;

    setIsRefreshing(true);
    
    if (onRefresh && typeof onRefresh === 'function') {
      try {
        await onRefresh();
      } catch (error) {
        console.error('Error refreshing dashboard:', error);
      }
    } else {
      try {
        await fetchDashboardStats();
      } catch (error) {
        console.error('Error refreshing dashboard stats:', error);
      }
    }
    
    setLastRefreshed(new Date());
    setIsRefreshing(false);
  };

  // Set up auto-refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, DASHBOARD_REFRESH_INTERVAL || 300000); // Default to 5 minutes

    return () => clearInterval(interval);
  }, [handleRefresh]);

  return (
    <div className="space-y-6">
      {/* Dashboard header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
          </div>

          <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
            {/* Last updated info */}
            {showDateDisplay && (
              <div className="text-right text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>{formatDate(new Date())}</span>
                </div>
                <div className="mt-1">
                  Last updated: {formatTime(lastRefreshed)}
                </div>
              </div>
            )}

            {/* Refresh button */}
            {showRefreshButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
                leftIcon={<RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />}
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            )}

            {/* Custom action buttons */}
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  /** Dashboard title */
  title: PropTypes.string.isRequired,
  /** Dashboard subtitle or description */
  subtitle: PropTypes.string,
  /** Dashboard content */
  children: PropTypes.node.isRequired,
  /** Custom action buttons to display in the header */
  actions: PropTypes.node,
  /** Whether to show the refresh button */
  showRefreshButton: PropTypes.bool,
  /** Whether to show the date display */
  showDateDisplay: PropTypes.bool,
  /** Last updated timestamp */
  lastUpdated: PropTypes.instanceOf(Date),
  /** Function to call when refresh button is clicked */
  onRefresh: PropTypes.func
};

export default DashboardLayout;