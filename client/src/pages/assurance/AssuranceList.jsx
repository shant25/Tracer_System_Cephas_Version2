import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Filter, Search, Download, RefreshCw, Eye, Edit, Trash2, Tool } from 'lucide-react';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/modals/ConfirmModal';
import JobAssignModal from '../../components/modals/JobAssignModal';
import useAuth from '../../hooks/useAuth';
import useCephas from '../../hooks/useCephas';
import useNotification from '../../hooks/useNotification';
import { hasActionPermission } from '../../utils/accessControl';
import api from '../../services/api';

/**
 * AssuranceList component for displaying and managing assurance tickets
 */
const AssuranceList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserRole } = useAuth();
  const { showSuccess, showError, showLoading, updateNotification } = useNotification();
  const { buildings, serviceInstallers } = useCephas();
  
  // State for assurance tickets
  const [assurances, setAssurances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    buildingId: '',
    serviceInstallerId: '',
    dateFrom: '',
    dateTo: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    sortBy: 'appointmentDate',
    sortDirection: 'desc'
  });
  
  // State for modals
  const [selectedAssurance, setSelectedAssurance] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check user permissions
  const userRole = getUserRole();
  const canCreateAssurance = hasActionPermission(userRole, 'create_assurance');
  const canEditAssurance = hasActionPermission(userRole, 'edit_assurance');
  const canDeleteAssurance = hasActionPermission(userRole, 'delete_assurance');
  const canAssignJob = hasActionPermission(userRole, 'assign_job');
  const canCompleteJob = hasActionPermission(userRole, 'complete_job');
  
  // Prepare filter options
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'NOT_COMPLETED', label: 'Not Completed' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];
  
  const buildingOptions = [
    { value: '', label: 'All Buildings' },
    ...(buildings || []).map(building => ({
      value: building.id.toString(),
      label: building.name
    }))
  ];
  
  const installerOptions = [
    { value: '', label: 'All Installers' },
    { value: '-', label: 'Unassigned' },
    ...(serviceInstallers || []).map(installer => ({
      value: installer.id.toString(),
      label: installer.name
    }))
  ];

  // Fetch assurances on mount and when dependencies change
  useEffect(() => {
    fetchAssurances();
  }, [filters, pagination]);

  // Parse query params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Set filters from query params
    const newFilters = { ...filters };
    if (params.has('status')) newFilters.status = params.get('status');
    if (params.has('buildingId')) newFilters.buildingId = params.get('buildingId');
    if (params.has('serviceInstallerId')) newFilters.serviceInstallerId = params.get('serviceInstallerId');
    if (params.has('dateFrom')) newFilters.dateFrom = params.get('dateFrom');
    if (params.has('dateTo')) newFilters.dateTo = params.get('dateTo');
    
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
    if (filters.buildingId) params.append('buildingId', filters.buildingId);
    if (filters.serviceInstallerId) params.append('serviceInstallerId', filters.serviceInstallerId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    
    // Add search term to query params
    if (searchTerm) params.append('search', searchTerm);
    
    // Add pagination to query params
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    params.append('sortBy', pagination.sortBy);
    params.append('sortDirection', pagination.sortDirection);
    
    // Update URL without reloading page
    navigate({ search: params.toString() }, { replace: true });
  }, [filters, pagination, searchTerm]);

  /**
   * Fetch assurances from API
   */
  const fetchAssurances = async () => {
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
      
      const response = await api.get('/assurances', { params: queryParams });
      
      if (response.success) {
        setAssurances(response.data);
        setTotalCount(response.meta?.total || response.data.length);
      } else {
        showError(response.message || 'Failed to load assurance tickets');
      }
    } catch (error) {
      console.error('Error fetching assurances:', error);
      showError('An error occurred while loading assurance tickets');
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
   * Handle assurance deletion
   */
  const handleDelete = async () => {
    if (!selectedAssurance) return;
    
    setIsDeleting(true);
    
    try {
      const response = await api.delete(`/assurances/${selectedAssurance.id}`);
      
      if (response.success) {
        showSuccess('Assurance ticket deleted successfully');
        fetchAssurances(); // Refresh the list
      } else {
        showError(response.message || 'Failed to delete assurance ticket');
      }
    } catch (error) {
      console.error('Error deleting assurance:', error);
      showError('An error occurred while deleting the assurance ticket');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedAssurance(null);
    }
  };

  /**
   * Handle assurance completion
   */
  const handleComplete = async () => {
    if (!selectedAssurance) return;
    
    setIsProcessing(true);
    
    try {
      const response = await api.put(`/assurances/${selectedAssurance.id}/complete`, {
        status: 'COMPLETED',
        completionDate: new Date().toISOString()
      });
      
      if (response.success) {
        showSuccess('Assurance ticket marked as completed');
        fetchAssurances(); // Refresh the list
      } else {
        showError(response.message || 'Failed to complete assurance ticket');
      }
    } catch (error) {
      console.error('Error completing assurance:', error);
      showError('An error occurred while completing the assurance ticket');
    } finally {
      setIsProcessing(false);
      setShowCompleteModal(false);
      setSelectedAssurance(null);
    }
  };

  /**
   * Export assurances to CSV
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
      
      const response = await api.get('/assurances/export', { params: queryParams });
      
      if (response.success && response.data) {
        // Create a download link
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'assurance_tickets.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        updateNotification(loadingId, 'Export completed successfully', 'success');
      } else {
        updateNotification(loadingId, response.message || 'Failed to export assurance tickets', 'error');
      }
    } catch (error) {
      console.error('Error exporting assurances:', error);
      updateNotification(loadingId, 'An error occurred while exporting assurance tickets', 'error');
    }
  };

  // Define table columns
  const columns = [
    {
      id: 'ticketNumber',
      header: 'Ticket Number',
      cell: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.ticketNumber}</div>
          <div className="text-xs text-gray-500">{row.trbnNo}</div>
        </div>
      ),
      sortable: true
    },
    {
      id: 'customer',
      header: 'Customer',
      cell: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.contactNo}</div>
        </div>
      ),
      sortable: true
    },
    {
      id: 'building',
      header: 'Building',
      cell: (row) => row.building,
      sortable: true
    },
    {
      id: 'serviceInstaller',
      header: 'Service Installer',
      cell: (row) => row.serviceInstaller || '-',
      sortable: true
    },
    {
      id: 'appointmentDate',
      header: 'Appointment',
      cell: (row) => (
        <div>
          <div>{new Date(row.appointmentDate).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500">{row.appointmentTime}</div>
        </div>
      ),
      sortable: true
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <StatusBadge status={row.status} />
      ),
      sortable: true
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => navigate(`/assurance/${row.id}`)}
            title="View Details"
          >
            <Eye size={16} />
          </button>
          
          {canEditAssurance && (
            <button
              className="text-green-600 hover:text-green-800"
              onClick={() => navigate(`/assurance/${row.id}/edit`)}
              title="Edit"
              disabled={row.status === 'COMPLETED'}
            >
              <Edit size={16} className={row.status === 'COMPLETED' ? 'opacity-50 cursor-not-allowed' : ''} />
            </button>
          )}
          
          {canCompleteJob && row.status !== 'COMPLETED' && (
            <button
              className="text-purple-600 hover:text-purple-800"
              onClick={() => {
                setSelectedAssurance(row);
                setShowCompleteModal(true);
              }}
              title="Mark as Completed"
            >
              <Tool size={16} />
            </button>
          )}
          
          {canDeleteAssurance && (
            <button
              className="text-red-600 hover:text-red-800"
              onClick={() => {
                setSelectedAssurance(row);
                setShowDeleteModal(true);
              }}
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
            <h1 className="text-2xl font-bold text-gray-900">Assurance Tickets</h1>
            <p className="mt-1 text-gray-500">
              Manage all customer assurance and troubleshooting tickets
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {canCreateAssurance && (
              <Button
                variant="primary"
                leftIcon={<Plus size={16} />}
                onClick={() => navigate('/assurance/create')}
              >
                New Assurance Ticket
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
              onClick={fetchAssurances}
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
              placeholder="Search by ticket number, TRBN, or customer name..."
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
                buildingId: {
                  label: 'Building',
                  type: 'select',
                  options: buildingOptions
                },
                serviceInstallerId: {
                  label: 'Service Installer',
                  type: 'select',
                  options: installerOptions
                },
                dateFrom: {
                  label: 'From Date',
                  type: 'date'
                },
                dateTo: {
                  label: 'To Date',
                  type: 'date'
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Data table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={assurances}
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
          emptyMessage="No assurance tickets found"
        />
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAssurance(null);
        }}
        onConfirm={handleDelete}
        title="Delete Assurance Ticket"
        message={`Are you sure you want to delete the assurance ticket for ${selectedAssurance?.name || 'this customer'}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Complete confirmation modal */}
      <ConfirmModal
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          setSelectedAssurance(null);
        }}
        onConfirm={handleComplete}
        title="Complete Assurance Ticket"
        message={`Are you sure you want to mark the assurance ticket for ${selectedAssurance?.name || 'this customer'} as completed? This will lock the ticket from further edits.`}
        confirmText="Complete"
        cancelText="Cancel"
        type="success"
        isLoading={isProcessing}
      />

      {/* Job assignment modal */}
      {showAssignModal && selectedAssurance && (
        <JobAssignModal
          isOpen={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedAssurance(null);
          }}
          onSuccess={fetchAssurances}
          jobId={selectedAssurance.id}
          jobType="assurance"
          currentAssignee={selectedAssurance.serviceInstallerId}
        />
      )}
    </div>
  );
};

export default AssuranceList;