import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Eye, 
  MoreHorizontal,
  FileText,
  User,
  Calendar 
} from 'lucide-react';

import useCephas from '../../hooks/useCephas';
import OrderService from '../../services/order.service';
import { showSuccess, showError } from '../../utils/notification';
import { hasActionPermission } from '../../utils/accessControl';
import { truncateText } from '../../utils/formatters';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../config';

/**
 * Order List Component
 * Displays a list of orders with filtering, sorting, and pagination
 */
const OrderList = () => {
  const { currentUser } = useCephas();
  const navigate = useNavigate();
  const location = useLocation();
  const isInstallerView = location.pathname === '/my-jobs';

  // State for orders data
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalOrders, setTotalOrders] = useState(0);
  
  // State for filters and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(isInstallerView ? 'assigned' : 'all');
  const [sortField, setSortField] = useState('appointmentDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Additional filter states
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];
  
  // Order type options
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'activation', label: 'Activation' },
    { value: 'modification', label: 'Modification' },
    { value: 'assurance', label: 'Assurance' }
  ];

  // Function to fetch orders
  const fetchOrders = async () => {
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
      
      // Add type filter if not 'all'
      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }
      
      // Add date range if provided
      if (dateRange.start) {
        params.startDate = dateRange.start;
      }
      
      if (dateRange.end) {
        params.endDate = dateRange.end;
      }
      
      // Fetch orders based on user type
      let response;
      if (isInstallerView) {
        // For installer view, fetch only assigned jobs
        response = await OrderService.getInstallerJobs(currentUser.id, params);
      } else {
        // For regular view, fetch all orders based on filters
        response = await OrderService.getAllOrders(params);
      }
      
      if (response.success) {
        setOrders(response.data || []);
        setTotalOrders(response.total || response.data.length);
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('An error occurred while fetching orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load orders on component mount and when filters change
  useEffect(() => {
    fetchOrders();
  }, [page, pageSize, sortField, sortDirection, statusFilter, typeFilter, isInstallerView]);

  // Apply search filter
  const handleSearch = () => {
    setPage(1); // Reset to first page on new search
    fetchOrders();
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
    setStatusFilter(isInstallerView ? 'assigned' : 'all');
    setTypeFilter('all');
    setDateRange({ start: '', end: '' });
    setPage(1);
    setFilterOpen(false);
  };

  // Apply filters
  const handleApplyFilters = () => {
    setPage(1); // Reset to first page on filter change
    fetchOrders();
    setFilterOpen(false);
  };

  // Render sort direction indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="inline-block ml-1 h-4 w-4" /> 
      : <ChevronDown className="inline-block ml-1 h-4 w-4" />;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
          {isInstallerView ? 'My Jobs' : 'Orders'}
        </h1>
        
        {/* Create Order Button (show only for authorized users) */}
        {!isInstallerView && hasActionPermission(currentUser?.role, 'create_order') && (
          <Link 
            to="/order/create" 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="h-5 w-5 mr-1" />
            Create Order
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
                placeholder="Search by TBBN ID, customer name, or address..."
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
              
              {/* Order Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Type
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Date Range
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

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <button 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={fetchOrders}
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p>No orders found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('tbbnoId')}
                    >
                      <div className="flex items-center">
                        TBBN ID {renderSortIndicator('tbbnoId')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Customer {renderSortIndicator('name')}
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
                      onClick={() => handleSort('appointmentDate')}
                    >
                      <div className="flex items-center">
                        Appointment {renderSortIndicator('appointmentDate')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('orderType')}
                    >
                      <div className="flex items-center">
                        Type {renderSortIndicator('orderType')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
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
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.tbbnoId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.name}</div>
                        <div className="text-sm text-gray-500">
                          {truncateText(order.address, 30)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          order.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.appointmentDate ? new Date(order.appointmentDate).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.appointmentDate ? new Date(order.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.orderType || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.orderSubType || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.contactNo || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.email || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            to={`/order/${order.id}/detail`}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          
                          {/* Show Edit button for authorized users and non-completed orders */}
                          {hasActionPermission(currentUser?.role, 'edit_order') && 
                            order.status !== 'COMPLETED' && (
                            <Link 
                              to={`/order/${order.id}/edit`}
                              className="text-green-600 hover:text-green-900"
                              title="Edit Order"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                          )}
                          
                          {/* For service installers, show job-specific actions */}
                          {isInstallerView && order.status !== 'COMPLETED' && (
                            <button
                              onClick={() => {
                                // Navigate to a job status update route or show a modal
                                navigate(`/order/${order.id}/update-status`);
                              }}
                              className="text-purple-600 hover:text-purple-900"
                              title="Update Status"
                            >
                              <FileText className="h-5 w-5" />
                            </button>
                          )}
                          
                          {/* For supervisors, show installer assignment option */}
                          {!isInstallerView && 
                            hasActionPermission(currentUser?.role, 'assign_job') && 
                            (order.status === 'PENDING' || order.status === 'ASSIGNED') && (
                            <button
                              onClick={() => {
                                // Navigate to assignment page or show assignment modal
                                navigate(`/order/${order.id}/assign`);
                              }}
                              className="text-orange-600 hover:text-orange-900"
                              title="Assign Installer"
                            >
                              <User className="h-5 w-5" />
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
                    Showing <span className="font-medium">{Math.min((page - 1) * pageSize + 1, totalOrders)}</span> to <span className="font-medium">{Math.min(page * pageSize, totalOrders)}</span> of <span className="font-medium">{totalOrders}</span> results
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
                    {Array.from({ length: Math.min(5, Math.ceil(totalOrders / pageSize)) }, (_, i) => {
                      // Determine which pages to show
                      let pageNum;
                      const totalPages = Math.ceil(totalOrders / pageSize);
                      
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
                      onClick={() => setPage(Math.min(Math.ceil(totalOrders / pageSize), page + 1))}
                      disabled={page >= Math.ceil(totalOrders / pageSize)}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        page >= Math.ceil(totalOrders / pageSize) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
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

export default OrderList;