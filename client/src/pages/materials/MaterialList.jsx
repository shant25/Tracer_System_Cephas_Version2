import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, Plus, Edit, Trash2, Eye, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import FilterBar from '../../components/common/FilterBar';
import { ConfirmModal } from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import MaterialCard from '../../components/widgets/MaterialCard';
import useNotification from '../../hooks/useNotification';
import { hasActionPermission } from '../../utils/accessControl';
import AuthService from '../../services/auth.service';
import MaterialService from '../../services/material.service';
import { formatCurrency } from '../../utils/formatters';

/**
 * MaterialList component for displaying the list of materials
 */
const MaterialList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notification = useNotification();
  const userRole = AuthService.getUserRole();
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const initialView = queryParams.get('view') || 'table';
  const initialStatus = queryParams.get('status') || '';
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [view, setView] = useState(initialView);
  const [filters, setFilters] = useState({
    type: '',
    status: initialStatus
  });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [stockModal, setStockModal] = useState(null);
  const [stockOperation, setStockOperation] = useState('add');
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockNotes, setStockNotes] = useState('');
  
  // User permissions
  const canCreate = hasActionPermission(userRole, 'create_material');
  const canEdit = hasActionPermission(userRole, 'edit_material');
  const canDelete = hasActionPermission(userRole, 'delete_material');
  const canUpdateStock = hasActionPermission(userRole, 'update_stock');
  
  // Load materials data
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        
        let response;
        
        // Check if we need to fetch filtered data
        if (filters.status === 'low') {
          response = await MaterialService.getLowStockMaterials();
        } else if (filters.status === 'out') {
          response = await MaterialService.getOutOfStockMaterials();
        } else {
          response = await MaterialService.getAllMaterials();
        }
        
        if (response.success) {
          setMaterials(response.data);
          setFilteredMaterials(response.data);
        } else {
          notification.error('Failed to load materials');
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
        notification.error('An error occurred while loading materials');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMaterials();
  }, [filters.status, notification]);
  
  // Apply search and filters
  useEffect(() => {
    let result = [...materials];
    
    // Apply search
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      result = result.filter(
        (material) =>
          material.description.toLowerCase().includes(searchLower) ||
          material.sapCode.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply filters
    if (filters.type) {
      result = result.filter((material) => material.materialType === filters.type);
    }
    
    setFilteredMaterials(result);
  }, [materials, searchValue, filters.type]);
  
  // Handle search
  const handleSearch = (value) => {
    setSearchValue(value);
  };
  
  // Handle filter change
  const handleFilter = (filterValues) => {
    setFilters(filterValues);
    
    // Update URL to reflect status filter
    if (filterValues.status !== filters.status) {
      const newParams = new URLSearchParams(location.search);
      if (filterValues.status) {
        newParams.set('status', filterValues.status);
      } else {
        newParams.delete('status');
      }
      navigate({ search: newParams.toString() });
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: '',
      status: ''
    });
    setSearchValue('');
    
    // Update URL
    const newParams = new URLSearchParams(location.search);
    newParams.delete('status');
    navigate({ search: newParams.toString() });
  };
  
  // Handle view change
  const handleViewChange = (newView) => {
    setView(newView);
    
    // Update URL
    const newParams = new URLSearchParams(location.search);
    newParams.set('view', newView);
    navigate({ search: newParams.toString() });
  };
  
  // Handle view material
  const handleViewMaterial = (material) => {
    navigate(`/material/${material.id}`);
  };
  
  // Handle edit material
  const handleEditMaterial = (e, material) => {
    e.stopPropagation();
    navigate(`/material/${material.id}/edit`);
  };
  
  // Handle delete material confirmation
  const handleDeleteConfirm = (e, material) => {
    e.stopPropagation();
    setConfirmDelete(material);
  };
  
  // Delete material
  const deleteMaterial = async () => {
    if (!confirmDelete) return;
    
    try {
      const toastId = notification.loading('Deleting material...');
      
      const response = await MaterialService.deleteMaterial(confirmDelete.id);
      
      if (response.success) {
        notification.update(toastId, 'Material deleted successfully', 'success');
        
        // Update material list
        setMaterials((prev) => 
          prev.filter((material) => material.id !== confirmDelete.id)
        );
      } else {
        notification.update(toastId, response.message || 'Failed to delete material', 'error');
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      notification.error('An error occurred while deleting the material');
    } finally {
      setConfirmDelete(null);
    }
  };
  
  // Show add/remove stock modal
  const handleStockModal = (material, operation) => {
    setStockModal(material);
    setStockOperation(operation);
    setStockQuantity(1);
    setStockNotes('');
  };
  
  // Update stock
  const updateStock = async () => {
    if (!stockModal || stockQuantity <= 0) return;
    
    try {
      const toastId = notification.loading(`${stockOperation === 'add' ? 'Adding' : 'Removing'} stock...`);
      
      let response;
      
      if (stockOperation === 'add') {
        response = await MaterialService.addStock(stockModal.id, stockQuantity, stockNotes);
      } else {
        response = await MaterialService.removeStock(stockModal.id, stockQuantity, stockNotes);
      }
      
      if (response.success) {
        notification.update(
          toastId, 
          `Stock ${stockOperation === 'add' ? 'added' : 'removed'} successfully`, 
          'success'
        );
        
        // Update material in list
        setMaterials((prev) =>
          prev.map((material) =>
            material.id === stockModal.id ? response.data : material
          )
        );
      } else {
        notification.update(
          toastId, 
          response.message || `Failed to ${stockOperation} stock`, 
          'error'
        );
      }
    } catch (error) {
      console.error(`Error ${stockOperation}ing stock:`, error);
      notification.error(`An error occurred while ${stockOperation}ing stock`);
    } finally {
      setStockModal(null);
    }
  };
  
  // Get material type options for filter
  const materialTypeOptions = [
    { value: 'EQUIPMENT', label: 'Equipment' },
    { value: 'CONSUMABLE', label: 'Consumable' },
    { value: 'ACCESSORY', label: 'Accessory' },
    { value: 'TOOL', label: 'Tool' },
    { value: 'OTHER', label: 'Other' }
  ];
  
  // Status filter options
  const statusOptions = [
    { value: '', label: 'All Materials' },
    { value: 'low', label: 'Low Stock' },
    { value: 'out', label: 'Out of Stock' }
  ];
  
  // Material status mapper
  const getMaterialStatus = (material) => {
    const stock = material.stockKeepingUnit || 0;
    const minStock = material.minimumStock || 10;
    
    if (stock <= 0) return 'OUT_OF_STOCK';
    if (stock < minStock) return 'LOW_STOCK';
    return 'IN_STOCK';
  };
  
  // Table columns
  const columns = [
    {
      header: 'Material',
      field: 'description',
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <div className="w-10 h-10 flex-shrink-0 mr-3 bg-gray-100 rounded-full flex items-center justify-center">
            <Package size={20} className="text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.description}</div>
            <div className="text-sm text-gray-500">{row.sapCode}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Stock',
      field: 'stockKeepingUnit',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium">{row.stockKeepingUnit || 0}</div>
          <div className="mt-1">
            <StatusBadge status={getMaterialStatus(row)} size="sm" />
          </div>
        </div>
      )
    },
    {
      header: 'Min. Stock',
      field: 'minimumStock',
      sortable: true,
      render: (row) => (
        <div className="text-center">{row.minimumStock || 10}</div>
      )
    },
    {
      header: 'Type',
      field: 'materialType',
      sortable: true,
      render: (row) => (
        <div>{row.materialType || 'N/A'}</div>
      )
    },
    {
      header: 'Unit Price',
      field: 'unitPrice',
      sortable: true,
      render: (row) => (
        <div>{row.unitPrice ? formatCurrency(row.unitPrice, 'MYR') : 'N/A'}</div>
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
              handleViewMaterial(row);
            }}
          >
            View
          </Button>
          
          {canUpdateStock && (
            <>
              <Button
                variant="outline-primary"
                size="sm"
                leftIcon={<ArrowUp size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStockModal(row, 'add');
                }}
              >
                Add
              </Button>
              
              <Button
                variant="outline-danger"
                size="sm"
                leftIcon={<ArrowDown size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStockModal(row, 'remove');
                }}
                disabled={row.stockKeepingUnit <= 0}
              >
                Remove
              </Button>
            </>
          )}
          
          {canEdit && (
            <Button
              variant="outline-primary"
              size="sm"
              leftIcon={<Edit size={16} />}
              onClick={(e) => handleEditMaterial(e, row)}
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
  
  // Filter definitions
  const filterDefinitions = [
    {
      id: 'type',
      label: 'Material Type',
      type: 'select',
      options: materialTypeOptions
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: statusOptions
    }
  ];
  
  // Empty state based on filters
  const getEmptyStateMessage = () => {
    if (filters.status === 'low') {
      return 'No materials with low stock found.';
    } else if (filters.status === 'out') {
      return 'No out of stock materials found.';
    } else if (searchValue) {
      return `No materials matching "${searchValue}" found.`;
    } else {
      return 'No materials found. Add materials to get started.';
    }
  };
  
  // Render card view
  const renderCardView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <MaterialCard
            key={material.id}
            material={material}
            onAddStock={() => handleStockModal(material, 'add')}
            onRemoveStock={() => handleStockModal(material, 'remove')}
            showActions={canUpdateStock}
          />
        ))}
        
        {filteredMaterials.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-1">No materials found</p>
            <p>{getEmptyStateMessage()}</p>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Materials</h1>
        
        <div className="flex items-center mt-3 sm:mt-0">
          {/* View Toggle */}
          <div className="flex border rounded-md mr-3">
            <button
              className={`px-3 py-1 text-sm ${
                view === 'table' ? 'bg-gray-100 text-gray-800' : 'text-gray-600'
              }`}
              onClick={() => handleViewChange('table')}
            >
              Table
            </button>
            <button
              className={`px-3 py-1 text-sm ${
                view === 'card' ? 'bg-gray-100 text-gray-800' : 'text-gray-600'
              }`}
              onClick={() => handleViewChange('card')}
            >
              Cards
            </button>
          </div>
          
          {canCreate && (
            <Link to="/material/create">
              <Button leftIcon={<Plus size={18} />}>
                Add Material
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <SearchBar
            placeholder="Search by description or SAP code..."
            onSearch={handleSearch}
            initialValue={searchValue}
          />
        </div>
        <div className="md:col-span-1">
          <Button
            variant="outline"
            fullWidth
            onClick={() => document.getElementById('filter-section').scrollIntoView({ behavior: 'smooth' })}
            leftIcon={<Package size={18} />}
          >
            Filter Materials
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
      
      {/* Low Stock Alert */}
      {filters.status === 'low' || filters.status === 'out' ? (
        <div className={`p-4 border rounded-lg ${
          filters.status === 'out' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start">
            <AlertTriangle size={20} className={
              filters.status === 'out' ? 'text-red-500 mr-3 mt-0.5' : 'text-yellow-500 mr-3 mt-0.5'
            } />
            <div>
              <h3 className="font-medium">{
                filters.status === 'out' 
                  ? 'Out of Stock Materials'
                  : 'Low Stock Materials'
              }</h3>
              <p className="text-sm mt-1">{
                filters.status === 'out'
                  ? 'These materials are currently out of stock and need to be replenished.'
                  : 'These materials are running low and may need to be restocked soon.'
              }</p>
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Materials List */}
      {view === 'table' ? (
        <Card>
          <DataTable
            columns={columns}
            data={filteredMaterials}
            loading={loading}
            onRowClick={handleViewMaterial}
            pagination
            emptyMessage={getEmptyStateMessage()}
          />
        </Card>
      ) : (
        renderCardView()
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={deleteMaterial}
        title="Delete Material"
        message={`Are you sure you want to delete the material "${confirmDelete?.description}"? This action cannot be undone and may affect existing orders.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
      
      {/* Stock Update Modal */}
      <ConfirmModal
        isOpen={!!stockModal}
        onClose={() => setStockModal(null)}
        onConfirm={updateStock}
        title={`${stockOperation === 'add' ? 'Add' : 'Remove'} Stock`}
        message={
          <div className="space-y-4">
            <p>
              {stockOperation === 'add'
                ? `Add stock to ${stockModal?.description}`
                : `Remove stock from ${stockModal?.description}`}
            </p>
            
            <div>
              <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                id="stockQuantity"
                type="number"
                min="1"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 1)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="stockNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="stockNotes"
                value={stockNotes}
                onChange={(e) => setStockNotes(e.target.value)}
                rows="2"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter reason for stock adjustment"
              ></textarea>
            </div>
          </div>
        }
        confirmText={stockOperation === 'add' ? 'Add Stock' : 'Remove Stock'}
        cancelText="Cancel"
        confirmVariant={stockOperation === 'add' ? 'primary' : 'danger'}
        size="md"
      />
    </div>
  );
};

export default MaterialList;