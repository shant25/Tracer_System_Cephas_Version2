import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar component for searching
 * @param {Object} props - Component props
 * @param {string} props.placeholder - Placeholder text
 * @param {Function} props.onSearch - Search handler
 * @param {boolean} props.loading - Loading state
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.autoFocus - Whether to auto-focus the input
 * @param {string} props.initialValue - Initial search value
 * @param {boolean} props.searchOnChange - Whether to search on input change
 * @param {number} props.debounceTimeout - Debounce timeout in milliseconds
 */
const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  loading = false,
  className = '',
  autoFocus = false,
  initialValue = '',
  searchOnChange = false,
  debounceTimeout = 300,
  ...rest
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [searchTimeout, setSearchTimeout] = useState(null);
  
  // Handle input change
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (searchOnChange) {
      // Clear previous timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      // Set new timeout for debouncing
      const timeout = setTimeout(() => {
        onSearch(value);
      }, debounceTimeout);
      
      setSearchTimeout(timeout);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchValue);
  };
  
  // Clear search
  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };
  
  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
          placeholder={placeholder}
          autoFocus={autoFocus}
          {...rest}
        />
        {searchValue && (
          <div className="absolute inset-y-0 right-10 flex items-center">
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="submit"
            className="p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="sr-only">Search</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;