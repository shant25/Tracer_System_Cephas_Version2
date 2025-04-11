import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  UserPlus, 
  Package, 
  Calendar, 
  Building, 
  Search,
  Filter,
  Download
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import FilterBar from '../../components/common/FilterBar';
import StatusBadge from '../../components/common/StatusBadge';
import { ConfirmModal } from '../../components/common/Modal';
import JobAssignModal from '../../components/modals/JobAssignModal';
import MaterialAssignModal from '../../components/modals/MaterialAssignModal';
import useNotification from '../../hooks/useNotification';
import useCephas from '../../hooks/useCephas';
import { hasActionPermission } from '../../utils/accessControl';
import AuthService from '../../services/auth.service';
import { formatDate } from '../../utils/dateUtils';

/**
 * ActivationList component to display a list of activations/modifications
 */
const ActivationList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notification = useNotification();
  const userRole = AuthService.getUserRole();
  
  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get('status') || '';
  const initialBuildingId = queryParams.get('buildingId') || '';
  const initialType = queryParams.get('type') || '';
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [activations, setActivations] = useState([]);
  const [filteredActivations, setFilteredActivations] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({
    status: initialStatus,
    buildingId: initialBuildingId,
    type: initialType,
    dateRange: {
      from: '',
      to: ''
    }
  });
  
  // Modal states
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [materialModal, setMaterialModal] = useState(null);
  
  // Action permissions
  const canCreate = hasActionPermission(userRole, 'create_activation');
  const canEdit = hasActionPermission(userRole, 'edit_activation');
  const canDelete = hasActionPermission(userRole, 'delete_activation');
  const canAssign = hasActionPermission(userRole, 'assign_job');
  const canAssignMaterials = hasActionPermission(userRole, 'assign_material');
  
  // Cephas context for buildings data
  const { buildings } = useCephas();
  
  // Load activations data
  useEffect(() => {
    const fetchActivations = async () => {
      try {
        setLoading(true);
        
        // This would be an API call in a real app
        // const response = await ActivationService.getAllActivations();
        
        // Mock data for now
        const mockActivations = [
          { 
            id: 1, 
            trbnNo: 'TBBNA870523G', 
            name: 'TAN PUI YEE',
            contactNo: '017-3781691 / 60173781691',
            serviceInstallerId: null,
            serviceInstaller: '-',
            building: 'SOLARIS PARQ RESIDENSI',
            buildingId: 1,
            status: 'NOT_COMPLETED',
            materialsAssigned: false,
            appointmentDate: '2025-05-10',
            appointmentTime: '10:00',
            orderType: 'ACTIVATION',
            orderSubType: 'RESCHEDULE'
          },
          { 
            id: 2, 
            trbnNo: 'TBBNA872851G', 
            name: 'CHOY YUEN LENG',
            contactNo: '012-2239707 / 0122539707',
            serviceInstallerId: null,
            serviceInstaller: '-',
            building: 'RESIDENSI M LUNA',
            buildingId: 2,
            status: 'NOT_COMPLETED',
            materialsAssigned: false,
            appointmentDate: '2025-05-03',
            appointmentTime: '10:00',
            orderType: 'ACTIVATION',
            orderSubType: ''
          },
          { 
            id: 3, 
            trbnNo: 'TBBNA872853G', 
            name: 'LEE CHONG WEI',
            contactNo: '013-3456789',
            serviceInstallerId: 1,
            serviceInstaller: 'K. MARIAPPAN A/L KUPPATHAN',
            building: 'THE WESTSIDE II',
            buildingId: 3,
            status: 'IN_PROGRESS',
            materialsAssigned: true,
            appointmentDate: '2025-05-01',
            appointmentTime: '14:30',
            orderType: 'ACTIVATION',
            orderSubType: ''
          },
          { 
            id: 4, 
            trbnNo: 'TBBNA872854G', 
            name: 'NORFAHANA BINTI AZHAR',
            contactNo: '011-23456789',
            serviceInstallerId: 1,
            serviceInstaller: 'K. MARIAPPAN A/L KUPPATHAN',
            building: 'TARA 33',
            buildingId: 4,
            status: 'COMPLETED',
            materialsAssigned: true,
            appointmentDate: '2025-04-28',
            appointmentTime: '09:00',
            orderType: 'ACTIVATION',
            orderSubType: ''
          },
          { 
            id: 5, 
            trbnNo: 'TBBNA872855G', 
            name: 'CHEAH MENG YEE',
            contactNo: '014-5678901',
            serviceInstallerId: 2,
            serviceInstaller: 'SARAVANAN A/L I. CHINNIAH',
            building: 'LUMI TROPICANA',
            buildingId: 5,
            status: 'COMPLETED',
            materialsAssigned: true,
            appointmentDate: '2025-04-27',
            appointmentTime: '11:15',
            orderType: 'MODIFICATION',
            orderSubType: 'CUSTOMER_REQUEST'
          }
        ];
        
        setActivations(mockActivations);
        setFilteredActivations(mockActivations);
      } catch (error) {
        console.error('Error fetching activations:', error);
        notification.error('An error occurred while loading activations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivations();
  }, [notification]);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...activations];
    
    // Apply search
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      result = result.filter(
        (activation) =>
          activation.name.toLowerCase().includes(searchLower) ||
          activation.trbnNo.toLowerCase().includes(searchLower) ||
          activation.building.toLowerCase().includes(searchLower) ||
          activation.contactNo.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter((activation) => activation.status === filters.status);
    }
    
    // Apply building filter
    if (filters.buildingId) {
      result = result.filter((activation) => activation.buildingId.toString() === filters.buildingId);
    }
    
    // Apply type filter
    if (filters.type) {
      result = result.filter((activation) => activation.orderType === filters.type);
    }
    
    // Apply date range filter
    if (filters.dateRange.from) {
      result = result.filter((activation) => activation.appointmentDate >= filters.dateRange.from);
    }
    if (filters.dateRange.to) {
      result = result.filter((activation) => activation.appointmentDate <= filters.dateRange.to);
    }
    
    setFilteredActivations(result);
  }, [activations, searchValue, filters]);
  
  // Handle search
  const handleSearch = (value) => {
    setSearchValue(value);
  };
  
  // Handle filter change
  const handleFilter = (filterValues) => {
    setFilters(filterValues);
    
    // Update URL to reflect filters
    const newParams = new URLSearchParams(location.search);
    
    if (filterValues.status) {
      newParams.set('status', filterValues.status);
    } else {
      newParams.delete('status');
    }
    
    if (filterValues.buildingId) {
      newParams.set('buildingId', filterValues.buildingId);
    } else {
      newParams.delete('buildingId');
    }
    
    if (filterValues.type) {
      newParams.set('type', filterValues.type);
    } else {
      newParams.delete('type');
    }
    
    navigate({ search: newParams.toString() });
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      buildingId: '',
      type: '',
      dateRange: {
        from: '',
        to: ''
      }
    });
    setSearchValue('');
    
    // Update URL
    navigate({ search: '' });
  };
  
  // Handle view activation
  const handleViewActivation = (activation) => {
    navigate(`/activation/${activation.id}`);
  };
  
  // Handle edit activation
  const handleEditActivation = (e, activation) => {
    e.stopPropagation();
    navigate(`/activation/${activation.id}/edit`);
  };
  
  // Handle delete activation confirmation
  const handleDeleteConfirm = (e, activation) => {
    e.stopPropagation();
    setConfirmDelete(activation);
  };
  
  // Delete activation
  const deleteActivation = async () => {
    if (!confirmDelete) return;
    
    try {
      const toastId = notification.loading('Deleting activation...');
      
      // This would be an API call in a real app
      // const response = await ActivationService.deleteActivation(confirmDelete.id);
      
      // Mock success for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = true;
      
      if (success) {
        notification.update(toastId, 'Activation deleted successfully', 'success');
        
        // Update activations list
        setActivations((prev) => 
          prev.filter((activation) => activation.id !== confirmDelete.id)
        );
      } else {
        notification.update(toastId, 'Failed to delete activation', 'error');
      }
    } catch (error) {
      console.error('Error deleting activation:', error);
      notification.error('An error occurred while deleting the activation');
    } finally {
      setConfirmDelete(null);
    }
  };
  
  // Show assign service installer modal
  const handleShowAssignModal = (e, activation) => {
    e.stopPropagation();
    setAssignModal(activation);
  };
  
  // Assign service installer
  const handleAssignServiceInstaller = async (activationId, assignmentData) => {
    try {
      const toastId = notification.loading('Assigning service installer...');
      
      // This would be an API call in a real app
      // const response = await ActivationService.assignServiceInstaller(activationId, assignmentData.serviceInstallerId, assignmentData);
      
      // Mock success for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockInstaller = {
        id: assignmentData.serviceInstallerId,
        name: 'K. MARIAPPAN A/L KUPPATHAN'
      };
      
      notification.update(toastId, 'Service installer assigned successfully', 'success');
      
      // Update activations list
      setActivations((prev) => 
        prev.map((activation) => 
          activation.id === activationId 
            ? { 
                ...activation, 
                serviceInstallerId: mockInstaller.id,
                serviceInstaller: mockInstaller.name,
                status: 'ASSIGNED'
              }
            : activation
        )
      );
    } catch (error) {
      console.error('Error assigning service installer:', error);
      notification.error('An error occurred while assigning the service installer');
    } finally {
      setAssignModal(null);
    }
  };
  
  // Show assign materials modal
  const handleShowMaterialsModal = (e, activation) => {
    e.stopPropagation();
    setMaterialModal(activation);
  };
  
  // Assign materials
  const handleAssignMaterials = async (activationId, materialsData) => {
    try {
      const toastId = notification.loading('Assigning materials...');
      
      // This would be an API call in a real app
      // const response = await MaterialService.assignMaterialsToJob(activationId, materialsData.materials, materialsData.notes);
      
      // Mock success for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notification.update(toastId, 'Materials assigned successfully', 'success');
      
      // Update activations list
      setActivations((prev) => 
        prev.map((activation) => 
          activation.id === activationId 
            ? { ...activation, materialsAssigned: true }
            : activation
        )
      );
    } catch (error) {
      console.error('Error assigning materials:', error);
      notification.error('An error occurred while assigning materials');
    } finally {
      setMaterialModal(null);
    }
  };
  
  // Get building options for filter
  const buildingOptions = buildings?.map(building => ({
    value: building.id.toString(),
    label: building.name
  })) || [];
  
  // Status filter options
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'NOT_COMPLETED', label: 'Not Completed' },
    { value: 'ASSIGNED', label: 'Assigned' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELED', label: 'Canceled' }
  ];
  
  // Type filter options
  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'ACTIVATION', label: 'Activation' },
    { value: 'MODIFICATION', label: 'Modification' }
  ];
  
  // Filter definitions
  const filterDefinitions = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: statusOptions
    },
    {
      id: 'buildingId',
      label: 'Building',
      type: 'select',
      options: [{ value: '', label: 'All Buildings' }, ...buildingOptions]
    },
    {
      id: 'type',
      label: 'Order Type',
      type: 'select',
      options: typeOptions
    },
    {
      id: 'dateRange',
      label: 'Appointment Date',
      type: 'daterange'
    }
  ];
  
  // Table columns
  const columns = [
    {
      header: 'TRBN No.',
      field: 'trbnNo',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium">{row.trbnNo}</div>
          <div className="text-xs text-gray-500">{row.orderType}</div>
        </div>
      )
    },
    {
      header: 'Customer',
      field: 'name',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">{row.contactNo}</div>
        </div>
      )
    },
    {
      header: 'Building',
      field: 'building',
      sortable: true
    },
    {
      header: 'Appointment',
      field: 'appointmentDate',
      sortable: true,
      render: (row) => (
        <div>
          <div>{formatDate(row.appointmentDate, 'MMM d, yyyy')}</div>
          <div className="text-xs text-gray-500">{row.appointmentTime}</div>
        </div>
      )
    },
    {
      header: 'Service Installer',
      field: 'serviceInstaller',
      sortable: true,
      render: (row) => (
        <div>
          {row.serviceInstaller === '-' ? (
            <span className="text-yellow-600">Not Assigned</span>
          ) : (
            row.serviceInstaller
          )}
        </div>
      )
    },
    {
      header: 'Status',
      field: 'status',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col items-center">
          <StatusBadge status={row.status} />
          {row.materialsAssigned ? (
            <span className="text-xs text-green-600 mt-1">Materials Assigned</span>
          ) : (
            <span className="text-xs text-yellow-600 mt-1">No Materials</span>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Eye size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewActivation(row);
            }}
          >
            View
          </Button>
          
          {canAssign && row.serviceInstaller === '-' && (
            <Button
              variant="outline-primary"
              size="sm"
              leftIcon={<UserPlus size={16} />}
              onClick={(e) => handleShowAssignModal(e, row)}
            >
              Assign
            </Button>
          )}
          
          {canAssignMaterials && !row.materialsAssigned && (
            <Button
              variant="outline-primary"
              size="sm"
              leftIcon={<Package size={16} />}
              onClick={(e) => handleShowMaterialsModal(e, row)}
            >
              Materials
            </Button>
          )}
          
          {canEdit && (
            <Button
              variant="outline-primary"
              size="sm"
              leftIcon={<Edit size={16} />}
              onClick={(e) => handleEditActivation(e, row)}
            >
              Edit
            </Button>
          )}
          
          {canDelete && (
            <Button
              variant="outline-danger"
              size="sm"
              leftIcon={<Trash2 size={16} />}
              onClick={(e) => handleDeleteConfirm(e, row)}
            >
              Delete
            </Button>
          )}
        </div>
      )
    }
  ];
  
  // Empty state based on filters
  const getEmptyStateMessage = () => {
    if (filters.status && filters.buildingId && filters.type) {
      return `No ${filters.type.toLowerCase()}s found with status "${filters.status}" for the selected building.`;
    } else if (filters.status && filters.buildingId) {
      return `No activations or modifications found with status "${filters.status}" for the selected building.`;
    } else if (filters.status && filters.type) {
      return `No ${filters.type.toLowerCase()}s found with status "${filters.status}".`;
    } else if (filters.buildingId && filters.type) {
      return `No ${filters.type.toLowerCase()}s found for the selected building.`;
    } else if (filters.status) {
      return `No activations or modifications found with status "${filters.status}".`;
    } else if (filters.buildingId) {
      return `No activations or modifications found for the selected building.`;
    } else if (filters.type) {
      return `No ${filters.type.toLowerCase()}s found.`;
    } else if (searchValue) {
      return `No activations or modifications matching "${searchValue}" found.`;
    } else {
      return 'No activations or modifications found.';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Activations & Modifications</h1>
        
        <div className="flex items-center mt-3 sm:mt-0 space-x-2">
          <Button
            variant="outline"
            leftIcon={<Download size={18} />}
          >
            Export
          </Button>
          
          {canCreate && (
            <Link to="/activation/create">
              <Button leftIcon={<Plus size={18} />}>
                New Activation
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <SearchBar
            placeholder="Search by customer name, TRBN number, or contact..."
            onSearch={handleSearch}
            initialValue={searchValue}
          />
        </div>
        <div className="md:col-span-1">
          <Button
            variant="outline"
            fullWidth
            onClick={() => document.getElementById('filter-section').scrollIntoView({ behavior: 'smooth' })}
            leftIcon={<Filter size={18} />}
          >
            Filter Activations
          </Button>
        </div>
      </div>
      
      {/* Filter Section */}
      <div id="filter-section">
        <FilterBar
          filters={filterDefinitions}
          activeFilters={filters}
          onFilter={handleFilter}
          onReset={resetFilters}
        />
      </div>
      
      {/* Status Counts */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-400">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-bold">{activations.length}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="text-sm text-gray-500">Not Completed</div>
          <div className="text-2xl font-bold">
            {activations.filter(a => a.status === 'NOT_COMPLETED').length}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">In Progress</div>
          <div className="text-2xl font-bold">
            {activations.filter(a => a.status === 'IN_PROGRESS').length}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-2xl font-bold">
            {activations.filter(a => a.status === 'COMPLETED').length}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="text-sm text-gray-500">Canceled</div>
          <div className="text-2xl font-bold">
            {activations.filter(a => a.status === 'CANCELED').length}
          </div>
        </div>
      </div>
      
      {/* Activations List */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredActivations}
          loading={loading}
          onRowClick={handleViewActivation}
          pagination
          emptyMessage={getEmptyStateMessage()}
        />
      </Card>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={deleteActivation}
        title="Delete Activation"
        message={`Are you sure you want to delete the activation for "${confirmDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
      
      {/* Service Installer Assignment Modal */}
      <JobAssignModal
        isOpen={!!assignModal}
        onClose={() => setAssignModal(null)}
        job={assignModal}
        onAssign={handleAssignServiceInstaller}
      />
      
      {/* Material Assignment Modal */}
      <MaterialAssignModal
        isOpen={!!materialModal}
        onClose={() => setMaterialModal(null)}
        job={materialModal}
        onAssign={handleAssignMaterials}
      />
    </div>
  );
};

export default ActivationList;