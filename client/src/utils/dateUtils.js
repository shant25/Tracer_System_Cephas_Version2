/**
 * Date utility functions for the Cephas Tracker application
 * Provides consistent date operations and formatting
 */
import { 
  format, 
  parseISO, 
  isValid, 
  differenceInDays, 
  differenceInHours, 
  differenceInMinutes,
  addDays,
  addMonths,
  addYears,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear
} from 'date-fns';
import { 
  DATE_FORMAT, 
  TIME_FORMAT, 
  DATE_TIME_FORMAT,
  ISO_DATE_FORMAT,
  ISO_TIME_FORMAT,
  ISO_DATE_TIME_FORMAT
} from '../config';

/**
 * Convert a date string to a Date object
 * 
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {Date} - Date object
 */
export const toDate = (dateInput) => {
  if (!dateInput) return null;
  
  if (dateInput instanceof Date) {
    return dateInput;
  }
  
  if (typeof dateInput === 'string') {
    const date = parseISO(dateInput);
    return isValid(date) ? date : null;
  }
  
  return null;
};

/**
 * Format a date using the configured date format
 * 
 * @param {string|Date} date - Date to format
 * @param {string} dateFormat - Date format (defaults to app config)
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, dateFormat = DATE_FORMAT) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, dateFormat);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a time using the configured time format
 * 
 * @param {string|Date} date - Date containing the time to format
 * @param {string} timeFormat - Time format (defaults to app config)
 * @returns {string} - Formatted time string
 */
export const formatTime = (date, timeFormat = TIME_FORMAT) => {
  const dateObj = toDate(date);
  if (!dateObj) return '';
  
  return format(dateObj, timeFormat);
};

/**
 * Format a date and time using the configured datetime format
 * 
 * @param {string|Date} date - Date and time to format
 * @param {string} dateTimeFormat - Datetime format (defaults to app config)
 * @returns {string} - Formatted datetime string
 */
export const formatDateTime = (date, dateTimeFormat = DATE_TIME_FORMAT) => {
  const dateObj = toDate(date);
  if (!dateObj) return '';
  
  return format(dateObj, dateTimeFormat);
};

/**
 * Format a date in ISO format (YYYY-MM-DD)
 * 
 * @param {string|Date} date - Date to format
 * @returns {string} - ISO formatted date string
 */
export const formatISODate = (date) => {
  return formatDate(date, ISO_DATE_FORMAT);
};

/**
 * Format a time in ISO format (HH:mm:ss)
 * 
 * @param {string|Date} date - Date containing the time to format
 * @returns {string} - ISO formatted time string
 */
export const formatISOTime = (date) => {
  return formatTime(date, ISO_TIME_FORMAT);
};

/**
 * Format a date and time in ISO format (YYYY-MM-DDThh:mm:ss)
 * 
 * @param {string|Date} date - Date and time to format
 * @returns {string} - ISO formatted datetime string
 */
export const formatISODateTime = (date) => {
  return formatDateTime(date, ISO_DATE_TIME_FORMAT);
};

/**
 * Calculate the difference in days between two dates
 * 
 * @param {string|Date} dateFrom - Start date
 * @param {string|Date} dateTo - End date
 * @returns {number} - Number of days difference
 */
export const getDaysDifference = (dateFrom, dateTo) => {
  const from = toDate(dateFrom);
  const to = toDate(dateTo);
  
  if (!from || !to) return null;
  
  return differenceInDays(to, from);
};

/**
 * Calculate the difference in hours between two dates
 * 
 * @param {string|Date} dateFrom - Start date
 * @param {string|Date} dateTo - End date
 * @returns {number} - Number of hours difference
 */
export const getHoursDifference = (dateFrom, dateTo) => {
  const from = toDate(dateFrom);
  const to = toDate(dateTo);
  
  if (!from || !to) return null;
  
  return differenceInHours(to, from);
};

/**
 * Calculate the difference in minutes between two dates
 * 
 * @param {string|Date} dateFrom - Start date
 * @param {string|Date} dateTo - End date
 * @returns {number} - Number of minutes difference
 */
export const getMinutesDifference = (dateFrom, dateTo) => {
  const from = toDate(dateFrom);
  const to = toDate(dateTo);
  
  if (!from || !to) return null;
  
  return differenceInMinutes(to, from);
};

/**
 * Add days to a date
 * 
 * @param {string|Date} date - The base date
 * @param {number} days - Number of days to add
 * @returns {Date} - New date
 */
export const addDaysToDate = (date, days) => {
  const dateObj = toDate(date);
  if (!dateObj) return null;
  
  return addDays(dateObj, days);
};

/**
 * Add months to a date
 * 
 * @param {string|Date} date - The base date
 * @param {number} months - Number of months to add
 * @returns {Date} - New date
 */
export const addMonthsToDate = (date, months) => {
  const dateObj = toDate(date);
  if (!dateObj) return null;
  
  return addMonths(dateObj, months);
};

/**
 * Add years to a date
 * 
 * @param {string|Date} date - The base date
 * @param {number} years - Number of years to add
 * @returns {Date} - New date
 */
export const addYearsToDate = (date, years) => {
  const dateObj = toDate(date);
  if (!dateObj) return null;
  
  return addYears(dateObj, years);
};

/**
 * Check if a date is after another date
 * 
 * @param {string|Date} date - The date to check
 * @param {string|Date} dateToCompare - The date to compare against
 * @returns {boolean} - True if date is after dateToCompare
 */
export const isDateAfter = (date, dateToCompare) => {
  const dateObj = toDate(date);
  const compareObj = toDate(dateToCompare);
  
  if (!dateObj || !compareObj) return false;
  
  return isAfter(dateObj, compareObj);
};

/**
 * Check if a date is before another date
 * 
 * @param {string|Date} date - The date to check
 * @param {string|Date} dateToCompare - The date to compare against
 * @returns {boolean} - True if date is before dateToCompare
 */
export const isDateBefore = (date, dateToCompare) => {
  const dateObj = toDate(date);
  const compareObj = toDate(dateToCompare);
  
  if (!dateObj || !compareObj) return false;
  
  return isBefore(dateObj, compareObj);
};

/**
 * Check if two dates are the same day
 * 
 * @param {string|Date} date - First date
 * @param {string|Date} dateToCompare - Second date
 * @returns {boolean} - True if dates are the same day
 */
export const isSameDate = (date, dateToCompare) => {
  const dateObj = toDate(date);
  const compareObj = toDate(dateToCompare);
  
  if (!dateObj || !compareObj) return false;
  
  return isSameDay(dateObj, compareObj);
};

/**
 * Get the start of day for a date
 * 
 * @param {string|Date} date - The date
 * @returns {Date} - Date at start of day (00:00:00)
 */
export const getStartOfDay = (date) => {
  const dateObj = toDate(date);
  if (!dateObj) return null;
  
  return startOfDay(dateObj);
};

/**
 * Get the end of day for a date
 * 
 * @param {string|Date} date - The date
 * @returns {Date} - Date at end of day (23:59:59.999)
 */
export const getEndOfDay = (date) => {
  const dateObj = toDate(date);
  if (!dateObj) return null;
  
  return endOfDay(dateObj);
};

/**
 * Get the start of month for a date
 * 
 * @param {string|Date} date - The date
 * @returns {Date} - Date at start of month
 */
export const getStartOfMonth = (date) => {
  const dateObj = toDate(date);
  if (!dateObj) return null;
  
  return startOfMonth(dateObj);
};

/**
 * Get the end of month for a date
 * 
 * @param {string|Date} date - The date
 * @returns {Date} - Date at end of month
 */
export const getEndOfMonth = (date) => {
  const dateObj = toDate(date);
  if (!dateObj) return null;
  
  return endOfMonth(dateObj);
};

/**
 * Get the start of year for a date
 * 
 * @param {string|Date} date - The date
 * @returns {Date} - Date at start of year
 */
export const getStartOfYear = (date) => {
  const dateObj = toDate(date);
  if (!dateObj) return null;
  
  return startOfYear(dateObj);
};

/**
 * Get the end of year for a date
 * 
 * @param {string|Date} date - The date
 * @returns {Date} - Date at end of year
 */
export const getEndOfYear = (date) => {
  const dateObj = toDate(date);
  if (!dateObj) return null;
  
  return endOfYear(dateObj);
};

/**
 * Get a human-readable relative time (e.g., "2 days ago", "in 3 hours")
 * 
 * @param {string|Date} date - The date to get relative time for
 * @param {string|Date} baseDate - The base date to compare against (defaults to now)
 * @returns {string} - Human-readable relative time
 */
export const getRelativeTime = (date, baseDate = new Date()) => {
  const dateObj = toDate(date);
  const baseDateObj = toDate(baseDate);
  
  if (!dateObj || !baseDateObj) return '';
  
  const minutesDiff = differenceInMinutes(dateObj, baseDateObj);
  const hoursDiff = differenceInHours(dateObj, baseDateObj);
  const daysDiff = differenceInDays(dateObj, baseDateObj);
  
  if (daysDiff === 0) {
    if (hoursDiff === 0) {
      if (minutesDiff === 0) {
        return 'just now';
      }
      
      return minutesDiff > 0 
        ? `in ${minutesDiff} ${minutesDiff === 1 ? 'minute' : 'minutes'}`
        : `${Math.abs(minutesDiff)} ${Math.abs(minutesDiff) === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    return hoursDiff > 0
      ? `in ${hoursDiff} ${hoursDiff === 1 ? 'hour' : 'hours'}`
      : `${Math.abs(hoursDiff)} ${Math.abs(hoursDiff) === 1 ? 'hour' : 'hours'} ago`;
  }
  
  if (Math.abs(daysDiff) < 30) {
    return daysDiff > 0
      ? `in ${daysDiff} ${daysDiff === 1 ? 'day' : 'days'}`
      : `${Math.abs(daysDiff)} ${Math.abs(daysDiff) === 1 ? 'day' : 'days'} ago`;
  }
  
  // For longer time differences, return a formatted date
  return formatDate(dateObj);
};

/**
 * Get the week number for a date
 * 
 * @param {string|Date} date - The date
 * @returns {number} - Week number (1-53)
 */
export const getWeekNumber = (date) => {
  const dateObj = toDate(date);
  if (!dateObj) return null;
  
  // Algorithm to calculate week number
  const d = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

/**
 * Check if a date is a weekend (Saturday or Sunday)
 * 
 * @param {string|Date} date - The date to check
 * @returns {boolean} - True if date is a weekend
 */
export const isWeekend = (date) => {
  const dateObj = toDate(date);
  if (!dateObj) return false;
  
  const day = dateObj.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

/**
 * Get today's date at midnight (start of day)
 * 
 * @returns {Date} - Today at start of day
 */
export const getToday = () => {
  return startOfDay(new Date());
};

/**
 * Get tomorrow's date at midnight (start of day)
 * 
 * @returns {Date} - Tomorrow at start of day
 */
export const getTomorrow = () => {
  return startOfDay(addDays(new Date(), 1));
};

/**
 * Get yesterday's date at midnight (start of day)
 * 
 * @returns {Date} - Yesterday at start of day
 */
export const getYesterday = () => {
  return startOfDay(addDays(new Date(), -1));
};

/**
 * Get the day of the week as a string
 * 
 * @param {string|Date} date - The date
 * @param {boolean} shortName - Whether to return the short name (e.g., Mon vs Monday)
 * @returns {string} - Day of the week
 */
export const getDayOfWeek = (date, shortName = false) => {
  const dateObj = toDate(date);
  if (!dateObj) return '';
  
  const format = shortName ? 'EEE' : 'EEEE';
  return format(dateObj, format);
};

/**
 * Get the month name as a string
 * 
 * @param {string|Date} date - The date
 * @param {boolean} shortName - Whether to return the short name (e.g., Jan vs January)
 * @returns {string} - Month name
 */
export const getMonthName = (date, shortName = false) => {
  const dateObj = toDate(date);
  if (!dateObj) return '';
  
  const format = shortName ? 'MMM' : 'MMMM';
  return format(dateObj, format);
};

/**
 * Get quarter from date (1-4)
 * 
 * @param {string|Date} date - The date
 * @returns {number} - Quarter (1-4)
 */
export const getQuarter = (date) => {
  const dateObj = toDate(date);
  if (!dateObj) return null;
  
  const month = dateObj.getMonth();
  return Math.floor(month / 3) + 1;
};

/**
 * Get the number of days in a month
 * 
 * @param {string|Date} date - A date in the month
 * @returns {number} - Number of days in the month
 */
export const getDaysInMonth = (date) => {
  const dateObj = toDate(date);
  if (!dateObj) return null;
  
  // Last day of the month
  const lastDay = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
  return lastDay.getDate();
};

/**
 * Get array of date objects for each day in a date range
 * 
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {Date[]} - Array of dates
 */
export const getDateRange = (startDate, endDate) => {
  const start = toDate(startDate);
  const end = toDate(endDate);
  
  if (!start || !end || isDateAfter(start, end)) return [];
  
  const dateArray = [];
  let currentDate = start;
  
  while (currentDate <= end) {
    dateArray.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return dateArray;
};

/**
 * Get date from a specific week and year
 * 
 * @param {number} year - Year
 * @param {number} week - Week number (1-53)
 * @param {number} dayOfWeek - Day of week (0-6, 0 is Sunday)
 * @returns {Date} - Date object
 */
export const getDateFromWeek = (year, week, dayOfWeek = 1) => {
  // January 4th is always in the first week
  const januaryFourth = new Date(year, 0, 4);
  // Get the day of the week of January 4th
  const januaryFourthDayOfWeek = januaryFourth.getDay() || 7;
  // Get the first Monday of the year
  const firstMonday = addDays(januaryFourth, 1 - januaryFourthDayOfWeek);
  
  // Add weeks and days to get the requested date
  return addDays(firstMonday, (week - 1) * 7 + dayOfWeek);
};

/**
 * Get the current financial year start and end dates
 * Assuming financial year starts on April 1
 * 
 * @param {Date} date - Date within the financial year (defaults to today)
 * @returns {object} - { start, end } dates of financial year
 */
export const getFinancialYearDates = (date = new Date()) => {
  const dateObj = toDate(date);
  if (!dateObj) return null;
  
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  
  // Financial year in Malaysia typically runs April 1 to March 31
  let financialYearStart, financialYearEnd;
  
  if (month < 3) {
    // Jan-Mar are part of the previous financial year
    financialYearStart = new Date(year - 1, 3, 1); // April 1 of the previous year
    financialYearEnd = new Date(year, 2, 31); // March 31 of the current year
  } else {
    // Apr-Dec are part of the current financial year
    financialYearStart = new Date(year, 3, 1); // April 1 of the current year
    financialYearEnd = new Date(year + 1, 2, 31); // March 31 of the next year
  }
  
  return {
    start: financialYearStart,
    end: financialYearEnd
  };
};

/**
 * Get the age in years from a birth date
 * 
 * @param {string|Date} birthDate - Birth date
 * @returns {number} - Age in years
 */
export const calculateAge = (birthDate) => {
  const dateObj = toDate(birthDate);
  if (!dateObj) return null;
  
  const today = new Date();
  let age = today.getFullYear() - dateObj.getFullYear();
  const m = today.getMonth() - dateObj.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < dateObj.getDate())) {
    age--;
  }
  
  return age;
};

export default {
  toDate,
  formatDate,
  formatTime,
  formatDateTime,
  formatISODate,
  formatISOTime,
  formatISODateTime,
  getDaysDifference,
  getHoursDifference,
  getMinutesDifference,
  addDaysToDate,
  addMonthsToDate,
  addYearsToDate,
  isDateAfter,
  isDateBefore,
  isSameDate,
  getStartOfDay,
  getEndOfDay,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfYear,
  getEndOfYear,
  getRelativeTime,
  getWeekNumber,
  isWeekend,
  getToday,
  getTomorrow,
  getYesterday,
  getDayOfWeek,
  getMonthName,
  getQuarter,
  getDaysInMonth,
  getDateRange,
  getDateFromWeek,
  getFinancialYearDates,
  calculateAge
};