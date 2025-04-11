import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Eye, 
  User,
  Phone,
  Mail,
  Calendar,
  RefreshCw,
  Check,
  X
} from 'lucide-react';

import useCephas from '../../hooks/useCephas';
import ServiceInstallerService from '../../services/serviceInstaller.service';
import { showSuccess, showError } from '../../utils/notification';
import { hasActionPermission } from '../../utils/accessControl';
import { truncateText } from '../../utils/formatters';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../config';

/**
 * Service Installer List Component
 * Displays a list of service installers with filtering, sorting, and pagination
 */
const ServiceInstallerList = () => {
  const { currentUser } = useCephas();
  const navigate = useNavigate();
  
  // State for service installers data
  const [serviceInstallers, setServiceInstallers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalInstallers, setTotalInstallers] = useState(0);
  
  // State for filters and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Additional filter states
  const [activeFilter, setActiveFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];
  
  // Function to fetch service installers
  const fetchServiceInstallers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build filter parameters
      let params = {
        page,
        pageSize,
        sortField,
        sortDirection
      };
      
      // Add search query if provided
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      // Add status filter if not 'all'
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      // Add active filter if not 'all'
      if (activeFilter !== 'all') {
        params.active = activeFilter === 'active';
      }
      
      // Add date range if provided
      if (dateRange.start) {
        params.startDate = dateRange.start;
      }
      
      if (dateRange.end) {
        params.endDate = dateRange.end;
      }
      
      const response = await ServiceInstallerService.getAllServiceInstallers(params);
      
      if (response.success) {
        setServiceInstallers(response.data || []);
        setTotalInstallers(response.total || response.data.length);
      } else {
        setError(response.message || 'Failed to fetch service installers');
      }
    } catch (err) {
      setError('An error occurred while fetching service installers');
      console.error('Error fetching service installers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load service installers on component mount and when filters change
  useEffect(() => {
    fetchServiceInstallers();
  }, [page, pageSize, sortField, sortDirection, statusFilter, activeFilter]);
  
  // Apply search filter
  const handleSearch = () => {
    setPage(1); // Reset to first page on new search
    fetchServiceInstallers();
  };

  // Handle sort changes
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending for new sort field
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setActiveFilter('all');
    setDateRange({ start: '', end: '' });
    setPage(1);
    setFilterOpen(false);
  };

  // Apply filters
  const handleApplyFilters = () => {
    setPage(1); // Reset to first page on filter change
    fetchServiceInstallers();
    setFilterOpen(false);
  };

  // Render sort direction indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="inline-block ml-1 h-4 w-4" /> 
      : <ChevronDown className="inline-block ml-1 h-4 w-4" />;
  };
  
  // Toggle installer status
  const toggleInstallerStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await ServiceInstallerService.updateServiceInstallerStatus(id, newStatus);
      
      if (response.success) {
        showSuccess(`Service installer ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        // Refresh the list
        fetchServiceInstallers();
      } else {
        showError(response.message || 'Failed to update service installer status');
      }
    } catch (err) {
      console.error('Error updating service installer status:', err);
      showError('An error occurred while updating service installer status');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
          Service Installers
        </h1>
        
        {/* Create Service Installer Button (show only for authorized users) */}
        {hasActionPermission(currentUser?.role, 'create_service_installer') && (
          <Link 
            to="/service-installer/create" 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="h-5 w-5 mr-1" />
            Create Service Installer
          </Link>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name, phone, or email..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="absolute left-3 top-2.5">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="h-5 w-5 mr-1 text-gray-500" />
              Filters
            </button>
            
            <button
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {filterOpen && (
          <div className="p-4 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Active Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                  <input
                    type="date"
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                onClick={handleResetFilters}
              >
                Reset
              </button>
              <button
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Service Installers List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading service installers...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <button 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={fetchServiceInstallers}
            >
              Retry
            </button>
          </div>
        ) : serviceInstallers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p>No service installers found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Service Installers Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Name {renderSortIndicator('name')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('contactNo')}
                    >
                      <div className="flex items-center">
                        Contact Number {renderSortIndicator('contactNo')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">
                        Email {renderSortIndicator('email')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status {renderSortIndicator('status')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('registrationDate')}
                    >
                      <div className="flex items-center">
                        Registration Date {renderSortIndicator('registrationDate')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {serviceInstallers.map((installer) => (
                    <tr key={installer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{installer.name}</div>
                            <div className="text-xs text-gray-500">{installer.alias || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{installer.contactNo || 'N/A'}</div>
                        {installer.alternateContactNo && (
                          <div className="text-xs text-gray-500">{installer.alternateContactNo}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{installer.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          installer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          installer.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                          installer.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {installer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {installer.registrationDate ? new Date(installer.registrationDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            to={`/service-installer/${installer.id}/detail`}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          
                          {/* Show Edit button for authorized users */}
                          {hasActionPermission(currentUser?.role, 'edit_service_installer') && (
                            <Link 
                              to={`/service-installer/${installer.id}/edit`}
                              className="text-green-600 hover:text-green-900"
                              title="Edit Service Installer"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                          )}
                          
                          {/* Toggle active status for authorized users */}
                          {hasActionPermission(currentUser?.role, 'edit_service_installer') && (
                            <button
                              onClick={() => toggleInstallerStatus(installer.id, installer.status.toLowerCase())}
                              className={`${
                                installer.status === 'ACTIVE' 
                                  ? 'text-red-600 hover:text-red-900' 
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                              title={installer.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            >
                              {installer.status === 'ACTIVE' ? (
                                <X className="h-5 w-5" />
                              ) : (
                                <Check className="h-5 w-5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-2 sm:mb-0">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{Math.min((page - 1) * pageSize + 1, totalInstallers)}</span> to <span className="font-medium">{Math.min(page * pageSize, totalInstallers)}</span> of <span className="font-medium">{totalInstallers}</span> results
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1); // Reset to first page on page size change
                    }}
                  >
                    {PAGE_SIZE_OPTIONS.map(size => (
                      <option key={size} value={size}>
                        {size} per page
                      </option>
                    ))}
                  </select>
                  
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronDown className="h-5 w-5 transform rotate-90" />
                    </button>
                    
                    {/* Page numbers - show up to 5 pages */}
                    {Array.from({ length: Math.min(5, Math.ceil(totalInstallers / pageSize)) }, (_, i) => {
                      // Determine which pages to show
                      let pageNum;
                      const totalPages = Math.ceil(totalInstallers / pageSize);
                      
                      if (totalPages <= 5) {
                        // If we have 5 or fewer pages, just show them all
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        // If we're near the start, show pages 1-5
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        // If we're near the end, show the last 5 pages
                        pageNum = totalPages - 4 + i;
                      } else {
                        // Otherwise, show 2 before and 2 after current page
                        pageNum = page - 2 + i;
                      }
                      
                      // Only render if the page number is valid
                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === pageNum
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => setPage(Math.min(Math.ceil(totalInstallers / pageSize), page + 1))}
                      disabled={page >= Math.ceil(totalInstallers / pageSize)}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        page >= Math.ceil(totalInstallers / pageSize) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDown className="h-5 w-5 transform -rotate-90" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceInstallerList;