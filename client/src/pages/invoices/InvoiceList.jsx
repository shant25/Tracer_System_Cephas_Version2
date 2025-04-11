import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Filter, 
  Search, 
  Download, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash2, 
  DollarSign, 
  FileText 
} from 'lucide-react';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import SearchBar from '../../components/common/SearchBar';
import ConfirmModal from '../../components/modals/ConfirmModal';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { hasActionPermission } from '../../utils/accessControl';
import { formatCurrency } from '../../utils/formatters';
import api from '../../services/api';

/**
 * InvoiceList component for displaying and managing invoices
 */
const InvoiceList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserRole } = useAuth();
  const { showSuccess, showError, showLoading, updateNotification } = useNotification();
  
  // State for invoices
  const [invoices, setInvoices] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortDirection: 'desc'
  });
  
  // State for modals
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check user permissions
  const userRole = getUserRole();
  const canCreateInvoice = hasActionPermission(userRole, 'create_invoice');
  const canEditInvoice = hasActionPermission(userRole, 'edit_invoice');
  const canDeleteInvoice = hasActionPermission(userRole, 'delete_invoice');
  
  // Prepare filter options
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PAID', label: 'Paid' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'OVERDUE', label: 'Overdue' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  // Fetch invoices on mount and when dependencies change
  useEffect(() => {
    fetchInvoices();
  }, [filters, pagination]);

  // Parse query params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Set filters from query params
    const newFilters = { ...filters };
    if (params.has('status')) newFilters.status = params.get('status');
    if (params.has('dateFrom')) newFilters.dateFrom = params.get('dateFrom');
    if (params.has('dateTo')) newFilters.dateTo = params.get('dateTo');
    if (params.has('minAmount')) newFilters.minAmount = params.get('minAmount');
    if (params.has('maxAmount')) newFilters.maxAmount = params.get('maxAmount');
    
    // Set search term from query params
    if (params.has('search')) setSearchTerm(params.get('search'));
    
    // Set pagination from query params
    const newPagination = { ...pagination };
    if (params.has('page')) newPagination.page = parseInt(params.get('page'), 10) || 1;
    if (params.has('limit')) newPagination.limit = parseInt(params.get('limit'), 10) || 10;
    if (params.has('sortBy')) newPagination.sortBy = params.get('sortBy');
    if (params.has('sortDirection')) newPagination.sortDirection = params.get('sortDirection');
    
    // Update state if changed
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      setFilters(newFilters);
    }
    
    if (JSON.stringify(newPagination) !== JSON.stringify(pagination)) {
      setPagination(newPagination);
    }
  }, [location.search]);

  // Update query params when filters or pagination change
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Add filters to query params
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.minAmount) params.append('minAmount', filters.minAmount);
    if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);
    
    // Add search term to query params
    if (searchTerm) params.append('search', searchTerm);
    
    // Add pagination to query params
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    params.append('sortBy', pagination.sortBy);
    params.append('sortDirection', pagination.sortDirection);
    
    // Update URL without reloading page
    navigate({ search: params.toString() }, { replace: true });
  }, [filters, pagination, searchTerm, navigate]);

  /**
   * Fetch invoices from API
   */
  const fetchInvoices = async () => {
    setIsLoading(true);
    
    try {
      // Prepare query params
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortDirection: pagination.sortDirection,
        search: searchTerm,
        ...filters
      };
      
      const response = await api.get('/invoices', { params: queryParams });
      
      if (response.success) {
        setInvoices(response.data);
        setTotalCount(response.meta?.total || response.data.length);
      } else {
        showError(response.message || 'Failed to load invoices');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      showError('An error occurred while loading invoices');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle search submission
   * @param {string} value - Search term
   */
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination({ ...pagination, page: 1 }); // Reset to first page
  };

  /**
   * Handle filter change
   * @param {Object} newFilters - New filter values
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset to first page
  };

  /**
   * Handle invoice deletion
   */
  const handleDelete = async () => {
    if (!selectedInvoice) return;
    
    setIsDeleting(true);
    
    try {
      const response = await api.delete(`/invoices/${selectedInvoice.id}`);
      
      if (response.success) {
        showSuccess('Invoice deleted successfully');
        fetchInvoices(); // Refresh the list
      } else {
        showError(response.message || 'Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      showError('An error occurred while deleting the invoice');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedInvoice(null);
    }
  };

  /**
   * Mark invoice as paid
   */
  const handleMarkPaid = async () => {
    if (!selectedInvoice) return;
    
    setIsProcessing(true);
    
    try {
      const response = await api.put(`/invoices/${selectedInvoice.id}/status`, {
        status: 'PAID',
        paymentDate: new Date().toISOString()
      });
      
      if (response.success) {
        showSuccess('Invoice marked as paid successfully');
        fetchInvoices(); // Refresh the list
      } else {
        showError(response.message || 'Failed to update invoice status');
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
      showError('An error occurred while updating the invoice status');
    } finally {
      setIsProcessing(false);
      setShowMarkPaidModal(false);
      setSelectedInvoice(null);
    }
  };

  /**
   * Export invoices to CSV
   */
  const handleExport = async () => {
    const loadingId = showLoading('Preparing export...');
    
    try {
      // Prepare query params for export (all items, not just current page)
      const queryParams = {
        sortBy: pagination.sortBy,
        sortDirection: pagination.sortDirection,
        search: searchTerm,
        ...filters,
        export: true
      };
      
      const response = await api.get('/invoices/export', { params: queryParams });
      
      if (response.success && response.data) {
        // Create a download link
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoices.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        updateNotification(loadingId, 'Export completed successfully', 'success');
      } else {
        updateNotification(loadingId, response.message || 'Failed to export invoices', 'error');
      }
    } catch (error) {
      console.error('Error exporting invoices:', error);
      updateNotification(loadingId, 'An error occurred while exporting invoices', 'error');
    }
  };

  // Define table columns
  const columns = [
    {
      id: 'invoiceNumber',
      header: 'Invoice No.',
      cell: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.invoiceNumber}</div>
          <div className="text-xs text-gray-500">{row.submissionNumber || '-'}</div>
        </div>
      ),
      sortable: true
    },
    {
      id: 'customer',
      header: 'Customer',
      cell: (row) => row.customer,
      sortable: true
    },
    {
      id: 'date',
      header: 'Date',
      cell: (row) => row.date,
      sortable: true
    },
    {
      id: 'totalAmount',
      header: 'Amount',
      cell: (row) => row.totalAmount,
      sortable: true
    },
    {
      id: 'description',
      header: 'Description',
      cell: (row) => (
        <div className="max-w-xs truncate">{row.description}</div>
      ),
      sortable: true
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          row.paid === 'Yes' || row.status === 'PAID' ? 'bg-green-100 text-green-800' :
          row.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.paid === 'Yes' ? 'Paid' : row.status || 'Pending'}
        </span>
      ),
      sortable: true
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <Link
            to={`/invoices/${row.id}`}
            className="text-blue-600 hover:text-blue-800"
            title="View"
          >
            <Eye size={16} />
          </Link>
          
          {canEditInvoice && (
            <Link
              to={`/invoices/${row.id}/edit`}
              className="text-green-600 hover:text-green-800"
              title="Edit"
            >
              <Edit size={16} />
            </Link>
          )}
          
          {(row.paid === 'No' && row.status !== 'PAID') && (
            <button
              onClick={() => {
                setSelectedInvoice(row);
                setShowMarkPaidModal(true);
              }}
              className="text-blue-600 hover:text-blue-800"
              title="Mark as Paid"
            >
              <DollarSign size={16} />
            </button>
          )}
          
          {canDeleteInvoice && (
            <button
              onClick={() => {
                setSelectedInvoice(row);
                setShowDeleteModal(true);
              }}
              className="text-red-600 hover:text-red-800"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="mt-1 text-gray-500">
              Manage customer invoices and payment tracking
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {canCreateInvoice && (
              <Button
                variant="primary"
                leftIcon={<Plus size={16} />}
                onClick={() => navigate('/invoices/create')}
              >
                New Invoice
              </Button>
            )}
            
            <Button
              variant="outline"
              leftIcon={<Download size={16} />}
              onClick={handleExport}
            >
              Export
            </Button>
            
            <Button
              variant="outline"
              leftIcon={<RefreshCw size={16} />}
              onClick={fetchInvoices}
              loading={isLoading}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by invoice number, customer name, or description..."
              value={searchTerm}
              onChange={handleSearch}
              onClear={() => handleSearch('')}
            />
          </div>
          
          <div>
            <FilterBar
              filters={filters}
              onChange={handleFilterChange}
              options={{
                status: {
                  label: 'Status',
                  type: 'select',
                  options: statusOptions
                },
                dateFrom: {
                  label: 'From Date',
                  type: 'date'
                },
                dateTo: {
                  label: 'To Date',
                  type: 'date'
                },
                minAmount: {
                  label: 'Min Amount',
                  type: 'number'
                },
                maxAmount: {
                  label: 'Max Amount',
                  type: 'number'
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Invoices table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={invoices}
          isLoading={isLoading}
          pagination={{
            page: pagination.page,
            limit: pagination.limit,
            total: totalCount,
            onPageChange: (page) => setPagination({ ...pagination, page }),
            onLimitChange: (limit) => setPagination({ ...pagination, limit, page: 1 })
          }}
          sorting={{
            sortBy: pagination.sortBy,
            sortDirection: pagination.sortDirection,
            onSort: (sortBy, sortDirection) => setPagination({ ...pagination, sortBy, sortDirection })
          }}
          emptyMessage="No invoices found"
        />
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedInvoice(null);
        }}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${selectedInvoice?.invoiceNumber || ''}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Mark as paid confirmation modal */}
      <ConfirmModal
        isOpen={showMarkPaidModal}
        onClose={() => {
          setShowMarkPaidModal(false);
          setSelectedInvoice(null);
        }}
        onConfirm={handleMarkPaid}
        title="Mark Invoice as Paid"
        message={`Are you sure you want to mark invoice ${selectedInvoice?.invoiceNumber || ''} as paid? This will update the invoice status.`}
        confirmText="Mark as Paid"
        cancelText="Cancel"
        type="success"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default InvoiceList;