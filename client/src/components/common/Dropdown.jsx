// client/src/components/common/Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

/**
 * Dropdown component for selection from a list of options
 * @param {Object} props - Component props
 * @param {Array} props.options - Dropdown options
 * @param {any} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether the dropdown is disabled
 * @param {string} props.size - Dropdown size (sm, md, lg)
 * @param {string} props.variant - Dropdown variant (default, outline, ghost)
 */
const Dropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  icon,
  className = '',
  disabled = false,
  size = 'md',
  variant = 'default',
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base'
  };
  
  // Variant classes
  const variantClasses = {
    default: 'bg-white border border-gray-300 shadow-sm',
    outline: 'bg-transparent border border-gray-300',
    ghost: 'bg-transparent border-none'
  };
  
  // Find selected option
  const selectedOption = options.find(option => option.value === value);
  
  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  // Handle option selection
  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef} {...rest}>
      {/* Dropdown Button */}
      <button
        type="button"
        className={`
          inline-flex justify-between items-center w-full rounded-md 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
        `}
        onClick={toggleDropdown}
        disabled={disabled}
      >
        <span className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className={!selectedOption ? 'text-gray-400' : ''}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown size={16} className="ml-2 -mr-1" />
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <button
                key={option.value}
                className={`
                  block w-full text-left px-4 py-2 text-sm
                  ${option.value === value ? 'bg-green-50 text-green-900' : 'text-gray-700 hover:bg-gray-50'}
                `}
                role="menuitem"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            ))}
            
            {options.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500">No options available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes validation
Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default', 'outline', 'ghost'])
};

export default Dropdown;