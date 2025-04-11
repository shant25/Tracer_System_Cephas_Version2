// client/src/components/common/FormInput.jsx
// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';
import { AlertCircle } from 'lucide-react';

/**
 * FormInput component for form inputs with different types and styling
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.label - Input label
 * @param {string} props.type - Input type (text, password, email, number, textarea, etc.)
 * @param {string} props.placeholder - Input placeholder
 * @param {any} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {string} props.error - Error message
 * @param {string} props.hint - Help text
 * @param {boolean} props.required - Whether the field is required
 * @param {boolean} props.disabled - Whether the field is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.leftIcon - Icon to display before input
 * @param {React.ReactNode} props.rightIcon - Icon to display after input
 * @param {Array} props.options - Options for select inputs
 */
const FormInput = ({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required = false,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  options = [],
  ...rest
}) => {
  // Generate ID if not provided
  const inputId = id || `form-field-${name}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Common input classes
  const inputBaseClasses = `
    block w-full rounded-md border-gray-300 shadow-sm
    focus:border-green-500 focus:ring-green-500 sm:text-sm
    ${error ? 'border-red-300' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
  `;
  
  // Render the appropriate input type
  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`${inputBaseClasses} resize-none ${className}`}
          rows={4}
          {...rest}
        />
      );
    }
    
    if (type === 'select') {
      return (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`${inputBaseClasses} ${className}`}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options && options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    
    if (type === 'checkbox') {
      return (
        <div className="flex items-center">
          <input
            id={inputId}
            name={name}
            type="checkbox"
            checked={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 ${className}`}
            {...rest}
          />
          <label htmlFor={inputId} className="ml-2 block text-sm text-gray-700">
            {label}
          </label>
        </div>
      );
    }
    
    if (type === 'radio') {
      return (
        <div className="flex items-center">
          <input
            id={inputId}
            name={name}
            type="radio"
            checked={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500 ${className}`}
            {...rest}
          />
          <label htmlFor={inputId} className="ml-2 block text-sm text-gray-700">
            {label}
          </label>
        </div>
      );
    }
    
    // Default text input
    return (
      <div className="relative rounded-md shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`${inputBaseClasses} ${className}`}
          {...rest}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    );
  };
  
  // For checkbox and radio, we already rendered the label
  if (type === 'checkbox' || type === 'radio') {
    return (
      <div className="mb-4">
        {renderInput()}
        {error && (
          <div 
            id={`${inputId}-error`} 
            className="mt-1 flex items-center text-sm text-red-600"
            role="alert"
          >
            <AlertCircle size={16} className="mr-1" />
            {error}
          </div>
        )}
        {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      </div>
    );
  }
  
  // For other types, render label separately
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <div 
          id={`${inputId}-error`}
          className="mt-1 flex items-center text-sm text-red-600"
          role="alert"
        >
          <AlertCircle size={16} className="mr-1" />
          {error}
        </div>
      )}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
};

// PropTypes validation
FormInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.oneOf([
    'text', 'password', 'email', 'number', 'textarea', 'select', 
    'checkbox', 'radio', 'date', 'time', 'datetime-local', 'tel', 'url'
  ]),
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    })
  )
};

export default FormInput;