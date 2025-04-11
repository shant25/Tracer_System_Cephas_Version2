// client/src/components/common/FilterBar.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Filter, ChevronDown, X } from 'lucide-react';
// Use a relative import without the file extension
import Button from './Button.jsx';

/**
 * FilterBar component for filtering data
 */
const FilterBar = ({
  filters = [],
  activeFilters = {},
  onFilter,
  onReset,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState(activeFilters);
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // Handle filter change
  const handleFilterChange = (filterId, value) => {
    const newFilterValues = {
      ...filterValues,
      [filterId]: value
    };
    
    setFilterValues(newFilterValues);
  };
  
  // Apply filters
  const applyFilters = () => {
    onFilter(filterValues);
  };
  
  // Reset filters
  const resetFilters = () => {
    const emptyFilters = {};
    filters.forEach(filter => {
      if (filter.type === 'daterange') {
        emptyFilters[filter.id] = { from: '', to: '' };
      } else {
        emptyFilters[filter.id] = '';
      }
    });
    
    setFilterValues(emptyFilters);
    onReset && onReset();
  };
  
  // Count active filters
  const activeFilterCount = Object.entries(filterValues).filter(([key, value]) => {
    if (value === null || value === undefined) return false;
    if (value === '') return false;
    if (typeof value === 'object' && Object.values(value).every(v => !v)) return false;
    return true;
  }).length;
  
  // Render filter inputs based on type
  const renderFilterInput = (filter) => {
    const value = filterValues[filter.id] !== undefined ? filterValues[filter.id] : '';
    
    switch (filter.type) {
      case 'select':
        return (
          <select
            id={`filter-${filter.id}`}
            value={value}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
          >
            <option value="">All {filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <input
            id={`filter-${filter.id}`}
            type="checkbox"
            checked={value === true}
            onChange={(e) => handleFilterChange(filter.id, e.target.checked)}
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
        );
      
      case 'radio':
        return (
          <div className="mt-1 space-y-2">
            {filter.options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`filter-${filter.id}-${option.value}`}
                  name={`filter-${filter.id}`}
                  type="radio"
                  checked={value === option.value}
                  onChange={() => handleFilterChange(filter.id, option.value)}
                  className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <label htmlFor={`filter-${filter.id}-${option.value}`} className="ml-2 text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'date':
        return (
          <input
            id={`filter-${filter.id}`}
            type="date"
            value={value}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
          />
        );
      
      case 'daterange':
        return (
          <div className="flex space-x-2">
            <div className="flex-1">
              <label htmlFor={`filter-${filter.id}-from`} className="block text-xs text-gray-500">
                From
              </label>
              <input
                id={`filter-${filter.id}-from`}
                type="date"
                value={(value && value.from) || ''}
                onChange={(e) => handleFilterChange(filter.id, { ...value, from: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              />
            </div>
            <div className="flex-1">
              <label htmlFor={`filter-${filter.id}-to`} className="block text-xs text-gray-500">
                To
              </label>
              <input
                id={`filter-${filter.id}-to`}
                type="date"
                value={(value && value.to) || ''}
                onChange={(e) => handleFilterChange(filter.id, { ...value, to: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
        );
      
      // Default to text input
      default:
        return (
          <input
            id={`filter-${filter.id}`}
            type="text"
            value={value}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            placeholder={filter.placeholder || `Filter by ${filter.label}`}
          />
        );
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow border ${className}`}>
      {/* Filter Bar Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Filter size={18} className="text-gray-400 mr-2" />
          <h3 className="font-medium text-gray-700">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700"
          onClick={toggleExpanded}
        >
          <ChevronDown size={20} className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {/* Filter Content */}
      {expanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-1">
                <label htmlFor={`filter-${filter.id}`} className="block text-sm font-medium text-gray-700">
                  {filter.label}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              leftIcon={<X size={16} />}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={applyFilters}
              leftIcon={<Filter size={16} />}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes validation
FilterBar.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'select', 'checkbox', 'radio', 'date', 'daterange']),
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.any.isRequired,
          label: PropTypes.string.isRequired
        })
      ),
      placeholder: PropTypes.string
    })
  ).isRequired,
  activeFilters: PropTypes.object,
  onFilter: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  className: PropTypes.string
};

export default FilterBar;