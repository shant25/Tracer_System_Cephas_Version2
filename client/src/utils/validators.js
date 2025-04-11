/**
 * Validation utility functions for the Cephas Tracker application
 * Provides consistent validation for form fields and data
 */

/**
 * Check if a value is not empty
 * 
 * @param {any} value - The value to check
 * @returns {boolean} - True if value is not empty
 */
export const isNotEmpty = (value) => {
  if (value === null || value === undefined) return false;
  
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }
  
  return true;
};

/**
 * Validate an email address
 * 
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  // RFC 5322 Official Standard Email Regex
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

/**
 * Validate a Malaysian phone number
 * 
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if phone number is valid
 */
export const isValidMalaysianPhone = (phone) => {
  if (!phone) return false;
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid Malaysian phone number format
  if (cleaned.startsWith('60')) {
    // With country code (60): should be 11-12 digits
    return cleaned.length >= 11 && cleaned.length <= 12;
  } else {
    // Without country code: should be 9-10 digits
    return cleaned.length >= 9 && cleaned.length <= 10;
  }
};

/**
 * Validate a password strength
 * 
 * @param {string} password - The password to validate
 * @param {object} options - Validation options
 * @returns {object} - Validation result with isValid, strength, and message
 */
export const validatePassword = (password, options = {}) => {
  const defaultOptions = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    minStrength: 3
  };
  
  const opts = { ...defaultOptions, ...options };
  
  if (!password) {
    return { 
      isValid: false, 
      strength: 0, 
      message: 'Password is required' 
    };
  }
  
  const messages = [];
  let strength = 0;
  
  // Check length
  if (password.length < opts.minLength) {
    messages.push(`Password should be at least ${opts.minLength} characters`);
  } else {
    strength += 1;
  }
  
  // Check for uppercase letters
  if (opts.requireUppercase && !/[A-Z]/.test(password)) {
    messages.push('Password should include at least one uppercase letter');
  } else if (opts.requireUppercase) {
    strength += 1;
  }
  
  // Check for lowercase letters
  if (opts.requireLowercase && !/[a-z]/.test(password)) {
    messages.push('Password should include at least one lowercase letter');
  } else if (opts.requireLowercase) {
    strength += 1;
  }
  
  // Check for numbers
  if (opts.requireNumbers && !/[0-9]/.test(password)) {
    messages.push('Password should include at least one number');
  } else if (opts.requireNumbers) {
    strength += 1;
  }
  
  // Check for special characters
  if (opts.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    messages.push('Password should include at least one special character');
  } else if (opts.requireSpecialChars) {
    strength += 1;
  }
  
  return {
    isValid: strength >= opts.minStrength,
    strength: strength,
    strengthLabel: getPasswordStrengthLabel(strength),
    message: messages.join('. ')
  };
};

/**
 * Get a text label for password strength
 * 
 * @param {number} strength - Password strength score (0-5)
 * @returns {string} - Strength label
 */
export const getPasswordStrengthLabel = (strength) => {
  switch (strength) {
    case 0:
      return 'Very Weak';
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    case 5:
      return 'Very Strong';
    default:
      return 'Unknown';
  }
};

/**
 * Validate a number is within range
 * 
 * @param {number|string} value - The number to validate (can be a string representation of a number)
 * @param {number|null} min - Minimum value (inclusive), null means no minimum
 * @param {number|null} max - Maximum value (inclusive), null means no maximum
 * @returns {boolean} - True if number is within range
 */
export const isNumberInRange = (value, min = null, max = null) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return false;
  }
  
  const num = Number(value);
  
  if (min !== null && num < min) {
    return false;
  }
  
  if (max !== null && num > max) {
    return false;
  }
  
  return true;
};

/**
 * Validate form fields against validation rules
 * 
 * @param {object} values - Form values object
 * @param {object} rules - Validation rules for each field
 * @returns {object} - Object with error messages for each invalid field
 */
export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(fieldName => {
    const value = values[fieldName];
    const fieldRules = rules[fieldName];
    
    // Skip validation if field doesn't exist in values and is not required
    if (value === undefined && (!fieldRules || !fieldRules.required)) {
      return;
    }
    
    // Required validation
    if (fieldRules.required && !isNotEmpty(value)) {
      errors[fieldName] = fieldRules.requiredMessage || 'This field is required';
      return;
    }
    
    // If value is empty and not required, skip other validations
    if (!isNotEmpty(value) && !fieldRules.required) {
      return;
    }
    
    // Min length validation
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[fieldName] = fieldRules.minLengthMessage || 
        `Minimum length is ${fieldRules.minLength} characters`;
      return;
    }
    
    // Max length validation
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[fieldName] = fieldRules.maxLengthMessage || 
        `Maximum length is ${fieldRules.maxLength} characters`;
      return;
    }
    
    // Email validation
    if (fieldRules.email && !isValidEmail(value)) {
      errors[fieldName] = fieldRules.emailMessage || 'Invalid email address';
      return;
    }
    
    // Malaysian phone validation
    if (fieldRules.malaysianPhone && !isValidMalaysianPhone(value)) {
      errors[fieldName] = fieldRules.phoneMessage || 'Invalid Malaysian phone number';
      return;
    }
    
    // Custom validation
    if (fieldRules.custom && typeof fieldRules.custom === 'function') {
      const customError = fieldRules.custom(value, values);
      if (customError) {
        errors[fieldName] = customError;
        return;
      }
    }
  });
  
  return errors;
};

export default {
  isNotEmpty,
  isValidEmail,
  isValidMalaysianPhone,
  validatePassword,
  getPasswordStrengthLabel,
  isNumberInRange,
  validateForm
};