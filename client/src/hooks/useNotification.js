import { useCallback } from 'react';
import { 
  showSuccess, 
  showError, 
  showInfo, 
  showWarning, 
  showLoading, 
  updateNotification, 
  dismissNotification,
  dismissAllNotifications,
  showConfirmation
} from '../utils/notification';
import { NOTIFICATION_AUTO_DISMISS_DURATION } from '../config';

/**
 * Custom hook for displaying notifications
 * @returns {Object} Notification functions
 */
const useNotification = () => {
  // Show success notification
  const success = useCallback((message, options = {}) => {
    return showSuccess(message, options);
  }, []);
  
  // Show error notification
  const error = useCallback((message, options = {}) => {
    return showError(message, options);
  }, []);
  
  // Show info notification
  const info = useCallback((message, options = {}) => {
    return showInfo(message, options);
  }, []);
  
  // Show warning notification
  const warning = useCallback((message, options = {}) => {
    return showWarning(message, options);
  }, []);
  
  // Show loading notification
  const loading = useCallback((message = 'Loading...', options = {}) => {
    return showLoading(message, options);
  }, []);
  
  // Update an existing notification
  const update = useCallback((toastId, message, type = 'success', options = {}) => {
    return updateNotification(toastId, message, type, options);
  }, []);
  
  // Dismiss a notification
  const dismiss = useCallback((toastId) => {
    return dismissNotification(toastId);
  }, []);
  
  // Dismiss all notifications
  const dismissAll = useCallback(() => {
    return dismissAllNotifications();
  }, []);
  
  // Show a confirmation notification with action buttons
  const confirm = useCallback((message, onConfirm, onCancel, options = {}) => {
    return showConfirmation(message, onConfirm, onCancel, options);
  }, []);
  
  // Update a loading notification to success
  const updateLoadingToSuccess = useCallback((toastId, message, options = {}) => {
    return updateNotification(toastId, message, 'success', {
      isLoading: false,
      autoClose: options.autoClose || NOTIFICATION_AUTO_DISMISS_DURATION,
      ...options
    });
  }, []);
  
  // Update a loading notification to error
  const updateLoadingToError = useCallback((toastId, message, options = {}) => {
    return updateNotification(toastId, message, 'error', {
      isLoading: false,
      autoClose: options.autoClose || NOTIFICATION_AUTO_DISMISS_DURATION * 1.5,
      ...options
    });
  }, []);
  
  return {
    success,
    error,
    info,
    warning,
    loading,
    update,
    dismiss,
    dismissAll,
    confirm,
    updateLoadingToSuccess,
    updateLoadingToError
  };
};

export default useNotification;