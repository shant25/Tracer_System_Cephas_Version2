import { toast } from 'react-toastify';
import { NOTIFICATION_AUTO_DISMISS_DURATION } from '../config';

/**
 * Show a success notification
 * 
 * @param {string} message - The message to display
 * @param {object} options - Additional toast options
 * @returns {string|number} - Toast ID for reference
 */
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    icon: '✅',
    className: 'notification-success',
    autoClose: NOTIFICATION_AUTO_DISMISS_DURATION,
    ...options
  });
};

/**
 * Show an error notification
 * 
 * @param {string} message - The message to display
 * @param {object} options - Additional toast options
 * @returns {string|number} - Toast ID for reference
 */
export const showError = (message, options = {}) => {
  return toast.error(message, {
    icon: '❌',
    className: 'notification-error',
    // Error messages stay longer by default
    autoClose: options.autoClose || NOTIFICATION_AUTO_DISMISS_DURATION * 1.5,
    ...options
  });
};

/**
 * Show a warning notification
 * 
 * @param {string} message - The message to display
 * @param {object} options - Additional toast options
 * @returns {string|number} - Toast ID for reference
 */
export const showWarning = (message, options = {}) => {
  return toast.warning(message, {
    icon: '⚠️',
    className: 'notification-warning',
    autoClose: NOTIFICATION_AUTO_DISMISS_DURATION,
    ...options
  });
};

/**
 * Show an information notification
 * 
 * @param {string} message - The message to display
 * @param {object} options - Additional toast options
 * @returns {string|number} - Toast ID for reference
 */
export const showInfo = (message, options = {}) => {
  return toast.info(message, {
    icon: 'ℹ️',
    className: 'notification-info',
    autoClose: NOTIFICATION_AUTO_DISMISS_DURATION,
    ...options
  });
};

/**
 * Show a loading notification
 * 
 * @param {string} message - The message to display
 * @param {object} options - Additional toast options
 * @returns {string|number} - Toast ID for reference
 */
export const showLoading = (message = 'Loading...', options = {}) => {
  return toast.loading(message, {
    className: 'notification-loading',
    // Loading notifications don't auto-close by default
    autoClose: false,
    closeOnClick: false,
    ...options
  });
};

/**
 * Update an existing notification
 * 
 * @param {string|number} toastId - The ID of the toast to update
 * @param {string} message - New message
 * @param {string} type - New toast type (success, error, warning, info)
 * @param {object} options - Options for the updated toast
 * @returns {void}
 */
export const updateNotification = (toastId, message, type = 'success', options = {}) => {
  toast.update(toastId, {
    render: message,
    type: type,
    ...options
  });
};

/**
 * Dismiss a specific notification
 * 
 * @param {string|number} toastId - The ID of the toast to dismiss
 * @returns {void}
 */
export const dismissNotification = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all notifications
 * 
 * @returns {void}
 */
export const dismissAllNotifications = () => {
  toast.dismiss();
};

/**
 * Show a confirmation dialog with actions
 * 
 * @param {string} message - The confirmation message
 * @param {function} onConfirm - Function to call on confirm
 * @param {function} onCancel - Function to call on cancel
 * @param {object} options - Additional dialog options
 * @returns {string|number} - Toast ID for reference
 */
export const showConfirmation = (
  message,
  onConfirm,
  onCancel = () => {},
  options = {}
) => {
  const toastId = toast.info(
    ({ closeToast }) => (
      <div>
        <p className="text-sm text-gray-700">{message}</p>
        <div className="mt-4 flex space-x-2 justify-end">
          <button
            className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
            onClick={() => {
              closeToast();
              onCancel();
            }}
          >
            {options.cancelText || 'Cancel'}
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            onClick={() => {
              closeToast();
              onConfirm();
            }}
          >
            {options.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    ),
    {
      icon: '❓',
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
      draggable: false,
      className: 'notification-confirmation',
      position: toast.POSITION.TOP_CENTER,
      ...options
    }
  );
  
  return toastId;
};

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showLoading,
  updateNotification,
  dismissNotification,
  dismissAllNotifications,
  showConfirmation
};