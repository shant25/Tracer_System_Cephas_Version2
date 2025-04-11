// client/src/components/common/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button component for consistent button styling and behavior throughout the application
 * @param {Object} props - Component props
 * @param {string} props.variant - Button style variant (primary, secondary, danger, etc.)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {boolean} props.loading - Whether the button is in loading state
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {'button'|'submit'|'reset'} props.type - Button type (button, submit, reset)
 * @param {React.ReactNode} props.leftIcon - Icon to display before button text
 * @param {React.ReactNode} props.rightIcon - Icon to display after button text
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  leftIcon,
  rightIcon,
  onClick,
  children,
  className = '',
  ...rest
}) => {
  // Base button classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base'
  };
  
  // Variant classes
  const variantClasses = {
    // Solid variants
    primary: 'bg-green-600 hover:bg-green-700 text-white border border-transparent focus:ring-green-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white border border-transparent focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-transparent focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white border border-transparent focus:ring-yellow-500',
    success: 'bg-green-500 hover:bg-green-600 text-white border border-transparent focus:ring-green-500',
    info: 'bg-blue-500 hover:bg-blue-600 text-white border border-transparent focus:ring-blue-500',
    
    // Outline variants
    outline: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-green-500',
    'outline-primary': 'bg-white hover:bg-green-50 text-green-600 border border-green-500 focus:ring-green-500',
    'outline-danger': 'bg-white hover:bg-red-50 text-red-600 border border-red-500 focus:ring-red-500',
    'outline-warning': 'bg-white hover:bg-yellow-50 text-yellow-600 border border-yellow-500 focus:ring-yellow-500',
    'outline-success': 'bg-white hover:bg-green-50 text-green-600 border border-green-500 focus:ring-green-500',
    'outline-info': 'bg-white hover:bg-blue-50 text-blue-600 border border-blue-500 focus:ring-blue-500',
    
    // Ghost variants
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent focus:ring-gray-500',
    
    // Link variant
    link: 'bg-transparent hover:bg-transparent text-green-600 hover:text-green-700 hover:underline border-0 shadow-none focus:ring-0'
  };
  
  // Width classes
  const widthClass = fullWidth ? 'w-full' : '';
  
  // State classes
  const stateClass = (disabled || loading) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  
  // Link variant doesn't need padding for size if no icons
  const actualSizeClass = variant === 'link' && !leftIcon && !rightIcon 
    ? 'm-0 p-0' // No padding for link without icons
    : sizeClasses[size] || sizeClasses.md;
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${actualSizeClass}
    ${widthClass}
    ${stateClass}
    ${className}
  `.trim();
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {/* Loading spinner */}
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {/* Left icon */}
      {!loading && leftIcon && (
        <span className={`${children ? 'mr-2' : ''}`}>
          {leftIcon}
        </span>
      )}
      
      {/* Button text */}
      {children}
      
      {/* Right icon */}
      {rightIcon && (
        <span className={`${children ? 'ml-2' : ''}`}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};

// PropTypes validation
Button.propTypes = {
  variant: PropTypes.oneOf([
    'primary', 
    'secondary', 
    'danger', 
    'warning', 
    'success', 
    'info', 
    'outline', 
    'outline-primary', 
    'outline-danger', 
    'outline-warning', 
    'outline-success', 
    'outline-info',
    'ghost',
    'link'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string
};

export default Button;