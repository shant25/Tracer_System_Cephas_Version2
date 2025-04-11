import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { X, AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

/**
 * Confirmation modal for user actions that need confirmation
 * Supports different types: danger, warning, info, success
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  confirmButtonVariant,
  size = 'md',
  isLoading = false,
  closeOnOverlayClick = true
}) => {
  const modalRef = useRef(null);

  // Determine button variant based on type if not explicitly provided
  const getButtonVariant = () => {
    if (confirmButtonVariant) return confirmButtonVariant;
    
    switch (type) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
      default:
        return 'primary';
    }
  };

  // Get icon based on modal type
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertCircle size={24} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={24} className="text-yellow-500" />;
      case 'success':
        return <CheckCircle size={24} className="text-green-500" />;
      case 'info':
      default:
        return <Info size={24} className="text-blue-500" />;
    }
  };

  // Get background color based on modal type
  const getIconBackground = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'success':
        return 'bg-green-100';
      case 'info':
      default:
        return 'bg-blue-100';
    }
  };

  // Get modal width based on size
  const getModalWidth = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case 'md':
      default:
        return 'max-w-md';
    }
  };

  // Handle clicks outside the modal
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Focus trap and body scroll lock
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    if (isOpen) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      // Restore original body style when component unmounts
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl overflow-hidden w-full transform transition-all ${getModalWidth()}`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${getIconBackground()}`}>
              {getIcon()}
            </div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="px-6 py-4">
          {typeof message === 'string' ? (
            <p className="text-sm text-gray-600">{message}</p>
          ) : (
            message
          )}
        </div>
        
        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          
          <Button
            type="button"
            variant={getButtonVariant()}
            onClick={onConfirm}
            loading={isLoading}
            disabled={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  /** Whether the modal is visible */
  isOpen: PropTypes.bool.isRequired,
  /** Function to call when modal is closed */
  onClose: PropTypes.func.isRequired,
  /** Function to call when confirm button is clicked */
  onConfirm: PropTypes.func.isRequired,
  /** Modal title */
  title: PropTypes.string.isRequired,
  /** Modal message (string or React node) */
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  /** Text for the confirm button */
  confirmText: PropTypes.string,
  /** Text for the cancel button */
  cancelText: PropTypes.string,
  /** Modal type (danger, warning, info, success) */
  type: PropTypes.oneOf(['danger', 'warning', 'info', 'success']),
  /** Variant for the confirm button */
  confirmButtonVariant: PropTypes.string,
  /** Modal size (sm, md, lg, xl) */
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  /** Whether confirm button is in loading state */
  isLoading: PropTypes.bool,
  /** Whether to close the modal when clicking outside */
  closeOnOverlayClick: PropTypes.bool
};

export default ConfirmModal;