/**
 * Utility functions for formatting data in the Cephas Tracker application
 */

/**
 * Format a number as currency
 * 
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code (ISO 4217)
 * @param {string} locale - The locale to use for formatting
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'MYR', locale = 'en-MY') => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a number with thousand separators
 * 
 * @param {number} number - The number to format
 * @param {number} decimals - Number of decimal places
 * @param {string} locale - The locale to use for formatting
 * @returns {string} - Formatted number string
 */
export const formatNumber = (number, decimals = 0, locale = 'en-US') => {
  if (number === null || number === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

/**
 * Format a percentage
 * 
 * @param {number} value - The value to format as percentage (0-100)
 * @param {number} decimals - Number of decimal places
 * @param {string} locale - The locale to use for formatting
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1, locale = 'en-US') => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

/**
 * Format a date using the configured date format
 * 
 * @param {Date|string} date - The date to format
 * @param {string} dateFormat - The date format to use
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, dateFormat) => {
  if (!date) return '';
  
  try {
    // Using date-fns would be better here, but for simplicity
    // we'll use the built-in Date formatting
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a time string
 * 
 * @param {Date|string} time - The time to format
 * @returns {string} - Formatted time string
 */
export const formatTime = (time) => {
  if (!time) return '';
  
  try {
    const timeObj = typeof time === 'string' ? new Date(`1970-01-01T${time}`) : time;
    
    if (isNaN(timeObj.getTime())) return time; // Return original if not valid date
    
    return timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error('Error formatting time:', error);
    return time; // Return original on error
  }
};

/**
 * Format a phone number to a standardized format
 * 
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a Malaysian phone number format
  if (cleaned.length === 10 || cleaned.length === 11) {
    // Check if it has the country code
    if (cleaned.startsWith('60')) {
      // Format with country code: +60 12-345 6789
      const withCountryCode = '+' + cleaned.substring(0, 2) + ' ' + 
        cleaned.substring(2, 4) + '-' + 
        cleaned.substring(4, 7) + ' ' + 
        cleaned.substring(7);
      return withCountryCode;
    } else {
      // Format without country code: 012-345 6789
      const withoutCountryCode = cleaned.substring(0, 3) + '-' + 
        cleaned.substring(3, 6) + ' ' + 
        cleaned.substring(6);
      return withoutCountryCode;
    }
  }
  
  // Return the cleaned number with basic formatting if it doesn't match Malaysian format
  if (cleaned.length <= 4) {
    return cleaned;
  } else if (cleaned.length <= 7) {
    return cleaned.substring(0, 3) + '-' + cleaned.substring(3);
  } else {
    return cleaned.substring(0, 3) + '-' + cleaned.substring(3, 6) + '-' + cleaned.substring(6);
  }
};

/**
 * Format text to title case
 * 
 * @param {string} text - The text to format
 * @returns {string} - Formatted text in title case
 */
export const toTitleCase = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format a status string to a more readable format
 * 
 * @param {string} status - The status to format
 * @returns {string} - Formatted status
 */
export const formatStatus = (status) => {
  if (!status) return '';
  
  // Replace underscores with spaces and convert to title case
  return toTitleCase(status.replace(/_/g, ' '));
};

export default {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatTime,
  formatPhoneNumber,
  toTitleCase,
  formatStatus
};