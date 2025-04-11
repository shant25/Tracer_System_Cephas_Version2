// client/src/components/common/DataTable.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../config';

/**
 * DataTable component for displaying tabular data with sorting and pagination
 * @param {Object} props - Component props
 * @param {Array} props.columns - Column definitions
 * @param {Array} props.data - Table data
 * @param {Function} props.onRowClick - Row click handler
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.pagination - Enable pagination
 * @param {number} props.totalItems - Total number of items (for server-side pagination)
 * @param {number} props.pageSize - Items per page
 * @param {number} props.currentPage - Current page number
 * @param {Function} props.onPageChange - Page change handler
 * @param {Function} props.onPageSizeChange - Page size change handler
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.emptyMessage - Message to display when there's no data
 */
const DataTable = ({
  columns = [],
  data = [],
  onRowClick,
  loading = false,
  pagination = false,
  totalItems = 0,
  pageSize: initialPageSize = DEFAULT_PAGE_SIZE,
  currentPage: initialCurrentPage = 1,
  onPageChange,
  onPageSizeChange,
  className = '',
  emptyMessage = 'No data available',
}) => {
  // State for client-side sorting and pagination
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // Update state when props change
  useEffect(() => {
    setCurrentPage(initialCurrentPage);
  }, [initialCurrentPage]);
  
  useEffect(() => {
    setPageSize(initialPageSize);
  }, [initialPageSize]);
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to asc
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Sort data (client-side)
  const sortedData = React.useMemo(() => {
    if (!sortField || onPageChange) return data; // Skip if using server-side
    
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortField, sortDirection, onPageChange]);
  
  // Paginate data (client-side)
  const paginatedData = React.useMemo(() => {
    if (!pagination || onPageChange) return sortedData; // Skip if using server-side
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination, currentPage, pageSize, onPageChange]);
  
  // Calculate total pages
  const totalPages = React.useMemo(() => {
    const total = onPageChange ? totalItems : data.length;
    return Math.ceil(total / pageSize);
  }, [totalItems, data.length, pageSize, onPageChange]);
  
  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };
  
  // Handle page size change
  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
    
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };
  
  // Display data based on client/server pagination
  const displayData = onPageChange ? data : paginatedData;
  
  // Empty state
  if (!loading && displayData.length === 0) {
    return (
      <div className={`bg-white border rounded-lg ${className}`}>
        <div className="text-center py-12 px-4">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white border rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`
                    px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer select-none' : ''}
                    ${column.width ? `w-${column.width}` : ''}
                  `}
                  onClick={() => column.sortable && handleSort(column.field)}
                >
                  <div className="flex items-center">
                    <span>{column.header}</span>
                    {column.sortable && sortField === column.field && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={`loading-${index}`}>
                  {columns.map((_, colIndex) => (
                    <td key={`loading-cell-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Data rows
              displayData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.field] !== undefined
                        ? row[column.field]
                        : ''}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && totalPages > 0 && (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {data.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, onPageChange ? totalItems : data.length)}
                </span>{' '}
                of <span className="font-medium">{onPageChange ? totalItems : data.length}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option} per page
                    </option>
                  ))}
                </select>
              </div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">First</span>
                  <ChevronsLeft size={16} />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft size={16} />
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = index + 1;
                  } else if (currentPage <= 3) {
                    pageNum = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + index;
                  } else {
                    pageNum = currentPage - 2 + index;
                  }
                  
                  // Ensure page is in range
                  if (pageNum < 1 || pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-green-50 border-green-500 text-green-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Last</span>
                  <ChevronsRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes validation
DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      field: PropTypes.string,
      sortable: PropTypes.bool,
      width: PropTypes.string,
      className: PropTypes.string,
      render: PropTypes.func
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
  loading: PropTypes.bool,
  pagination: PropTypes.bool,
  totalItems: PropTypes.number,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  className: PropTypes.string,
  emptyMessage: PropTypes.string
};

export default DataTable;