import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import FilterBar from '../../components/common/FilterBar';
import { ConfirmModal } from '../../components/common/Modal';
import useCephas from '../../hooks/useCephas';
import useNotification from '../../hooks/useNotification';
import { hasActionPermission } from '../../utils/accessControl';
import AuthService from '../../services/auth.service';
import api from '../../services/api';

/**
 * BuildingList component to display all buildings
 */
const BuildingList = () => {
  const navigate = useNavigate();
  const { buildings, refreshBuildings } = useCephas();
  const notification = useNotification();
  const userRole = AuthService.getUserRole();
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [buildingList, setBuildingList] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    location: ''
  });
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // User permissions
  const canCreate = hasActionPermission(userRole, 'create_building');
  const canEdit = hasActionPermission(userRole, 'edit_building');
  const canDelete = hasActionPermission(userRole, 'delete_building');
  
  // Load buildings data
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/buildings');
        
        if (response.success) {
          setBuildingList(response.data);
          setFilteredBuildings(response.data);
        } else {
          notification.error('Failed to load buildings');
        }
      } catch (error) {
        console.error('Error fetching buildings:', error);
        notification.error('An error occurred while loading buildings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBuildings();
  }, [notification]);
  
  // Apply search and filters
  useEffect(() => {
    let result = [...buildingList];
    
    // Apply search
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      result = result.filter(
        (building) =>
          building.name.toLowerCase().includes(searchLower) ||
          building.location.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply filters
    if (filters.type) {
      result = result.filter((building) => building.type === filters.type);
    }
    
    if (filters.location) {
      result = result.filter((building) => building.location === filters.location);
    }
    
    setFilteredBuildings(result);
  }, [buildingList, searchValue, filters]);
  
  // Handle search
  const handleSearch = (value) => {
    setSearchValue(value);
  };
  
  // Handle filter change
  const handleFilter = (filterValues) => {
    setFilters(filterValues);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: '',
      location: ''
    });
    setSearchValue('');
  };
  
  // Handle view building
  const handleViewBuilding = (building) => {
    navigate(`/building/${building.id}/detail`);
  };
  
  // Handle edit building
  const handleEditBuilding = (e, building) => {
    e.stopPropagation();
    navigate(`/building/${building.id}/edit`);
  };
  
  // Handle delete building confirmation
  const handleDeleteConfirm = (e, building) => {
    e.stopPropagation();
    setConfirmDelete(building);
  };
  
  // Delete building
  const deleteBuilding = async () => {
    if (!confirmDelete) return;
    
    try {
      const toastId = notification.loading('Deleting building...');
      
      const response = await api.delete(`/buildings/${confirmDelete.id}`);
      
      if (response.success) {
        notification.update(toastId, 'Building deleted successfully', 'success');
        
        // Update building list
        setBuildingList((prev) => 
          prev.filter((building) => building.id !== confirmDelete.id)
        );
      } else {
        notification.update(toastId, response.message || 'Failed to delete building', 'error');
      }
    } catch (error) {
      console.error('Error deleting building:', error);
      notification.error('An error occurred while deleting the building');
    } finally {
      setConfirmDelete(null);
    }
  };
  
  // Get unique locations for filter
  const locations = [...new Set(buildingList.map((building) => building.location))].map(
    (location) => ({ value: location, label: location })
  );
  
  // Table columns
  const columns = [
    {
      header: 'Building',
      field: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <div className="w-10 h-10 flex-shrink-0 mr-3 bg-gray-100 rounded-full flex items-center justify-center">
            <Building size={20} className="text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">{row.type}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Location',
      field: 'location',
      sortable: true
    },
    {
      header: 'Contact Person',
      field: 'contactPerson',
      sortable: true,
      render: (row) => (
        row.contactPerson ? (
          <div>
            <div>{row.contactPerson}</div>
            <div className="text-sm text-gray-500">{row.contactNumber}</div>
          </div>
        ) : 'N/A'
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
              handleViewBuilding(row);
            }}
          >
            View
          </Button>
          
          {canEdit && (
            <Button
              variant="outline-primary"
              size="sm"
              leftIcon={<Edit size={16} />}
              onClick={(e) => handleEditBuilding(e, row)}
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
      label: 'Building Type',
      type: 'select',
      options: [
        { value: 'Prelaid', label: 'Prelaid' },
        { value: 'Non Prelaid', label: 'Non Prelaid' },
        { value: 'Both', label: 'Both' }
      ]
    },
    {
      id: 'location',
      label: 'Location',
      type: 'select',
      options: locations
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Buildings</h1>
        
        {canCreate && (
          <Link to="/building/create">
            <Button leftIcon={<Plus size={18} />} className="mt-3 sm:mt-0">
              Add Building
            </Button>
          </Link>
        )}
      </div>
      
      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <SearchBar
            placeholder="Search by building name or location..."
            onSearch={handleSearch}
            initialValue={searchValue}
          />
        </div>
        <div className="md:col-span-1">
          <Button
            variant="outline"
            fullWidth
            onClick={() => document.getElementById('filter-section').scrollIntoView({ behavior: 'smooth' })}
            leftIcon={<Building size={18} />}
          >
            Filter Buildings
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
      
      {/* Buildings Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredBuildings}
          loading={loading}
          onRowClick={handleViewBuilding}
          pagination
          emptyMessage="No buildings found. Try adjusting your search or filters."
        />
      </Card>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={deleteBuilding}
        title="Delete Building"
        message={`Are you sure you want to delete the building "${confirmDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
};

export default BuildingList;