import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Edit, 
  ArrowLeft,
  Trash2,
  BarChart2,
  Share2,
  Menu
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ConfirmModal } from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Dropdown from '../../components/common/Dropdown';
import useNotification from '../../hooks/useNotification';
import { hasActionPermission } from '../../utils/accessControl';
import AuthService from '../../services/auth.service';
import api from '../../services/api';

/**
 * BuildingDetail component to display building details
 */
const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notification = useNotification();
  const userRole = AuthService.getUserRole();
  
  // State variables
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // User permissions
  const canEdit = hasActionPermission(userRole, 'edit_building');
  const canDelete = hasActionPermission(userRole, 'delete_building');
  
  // Load building data
  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/buildings/${id}`);
        
        if (response.success) {
          setBuilding(response.data);
        } else {
          notification.error('Failed to load building details');
          navigate('/building');
        }
      } catch (error) {
        console.error('Error fetching building:', error);
        notification.error('An error occurred while loading building details');
        navigate('/building');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBuilding();
  }, [id, navigate, notification]);
  
  // Handle delete building
  const handleDeleteBuilding = async () => {
    try {
      const toastId = notification.loading('Deleting building...');
      
      const response = await api.delete(`/buildings/${id}`);
      
      if (response.success) {
        notification.update(toastId, 'Building deleted successfully', 'success');
        navigate('/building');
      } else {
        notification.update(toastId, response.message || 'Failed to delete building', 'error');
      }
    } catch (error) {
      console.error('Error deleting building:', error);
      notification.error('An error occurred while deleting the building');
    } finally {
      setConfirmDelete(false);
    }
  };
  
  // Handle actions dropdown
  const handleActionSelect = (action) => {
    switch (action) {
      case 'edit':
        navigate(`/building/${id}/edit`);
        break;
      case 'delete':
        setConfirmDelete(true);
        break;
      case 'report':
        // Navigate to building report
        navigate(`/reports/building/${id}`);
        break;
      case 'share':
        // Copy link to clipboard
        navigator.clipboard.writeText(window.location.href);
        notification.success('Link copied to clipboard!');
        break;
      default:
        break;
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen -mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <span className="ml-3 text-lg text-gray-700">Loading building details...</span>
      </div>
    );
  }
  
  // If building not found
  if (!building) {
    return (
      <div className="text-center py-12">
        <Building size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700">Building Not Found</h2>
        <p className="text-gray-500 mt-2">The building you're looking for doesn't exist or has been removed.</p>
        <Button
          as={Link}
          to="/building"
          variant="outline"
          className="mt-4"
          leftIcon={<ArrowLeft size={16} />}
        >
          Back to Buildings
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <Button
            as={Link}
            to="/building"
            variant="outline"
            size="sm"
            className="mr-4"
            leftIcon={<ArrowLeft size={16} />}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{building.name}</h1>
          <StatusBadge
            status={building.type || 'Unknown'}
            className="ml-3"
          />
        </div>
        
        <div className="flex mt-4 md:mt-0">
          {canEdit && (
            <Button
              as={Link}
              to={`/building/${id}/edit`}
              className="mr-2"
              leftIcon={<Edit size={18} />}
              variant="primary"
            >
              Edit Building
            </Button>
          )}
          
          <Dropdown
            options={[
              ...(canEdit ? [{ value: 'edit', label: 'Edit Building' }] : []),
              ...(canDelete ? [{ value: 'delete', label: 'Delete Building' }] : []),
              { value: 'report', label: 'Generate Report' },
              { value: 'share', label: 'Share Link' }
            ]}
            onChange={handleActionSelect}
            icon={<Menu size={18} />}
            placeholder="More Actions"
            variant="outline"
          />
        </div>
      </div>
      
      {/* Building Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2">
          <Card title="Building Information">
            <div className="space-y-4">
              <div className="flex items-start">
                <Building size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Building Name</div>
                  <div className="font-medium">{building.name}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Address</div>
                  <div>
                    {building.address}
                    {building.location && (
                      <div className="text-sm text-gray-500 mt-1">{building.location}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <FileText size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Notes</div>
                  <div>{building.notes || 'No notes available'}</div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Contact Information */}
          <Card title="Contact Information" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <User size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Contact Person</div>
                  <div className="font-medium">{building.contactPerson || 'Not specified'}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Contact Number</div>
                  <div>
                    {building.contactNumber ? (
                      <a href={`tel:${building.contactNumber}`} className="text-blue-600 hover:underline">
                        {building.contactNumber}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </div>
                </div>
              </div>
              
              {building.contactEmail && (
                <div className="flex items-start">
                  <Mail size={18} className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Email Address</div>
                    <div>
                      <a href={`mailto:${building.contactEmail}`} className="text-blue-600 hover:underline">
                        {building.contactEmail}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          {/* Building Statistics */}
          <Card title="Statistics">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Total Splitters</div>
                <div className="font-medium text-gray-900">18</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Total Orders</div>
                <div className="font-medium text-gray-900">32</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Active Orders</div>
                <div className="font-medium text-gray-900">5</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Last Activity</div>
                <div className="font-medium text-gray-900">2 days ago</div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button
                as={Link}
                to={`/reports/building/${id}`}
                variant="outline"
                fullWidth
                leftIcon={<BarChart2 size={16} />}
              >
                View Full Report
              </Button>
            </div>
          </Card>
          
          {/* Quick Links */}
          <Card title="Quick Links" className="mt-6">
            <div className="space-y-2">
              <Button
                as={Link}
                to={`/splitter?buildingId=${id}`}
                variant="outline"
                fullWidth
                className="justify-start"
              >
                View Splitters
              </Button>
              <Button
                as={Link}
                to={`/activation?buildingId=${id}`}
                variant="outline"
                fullWidth
                className="justify-start"
              >
                Activations
              </Button>
              <Button
                as={Link}
                to={`/order?buildingId=${id}`}
                variant="outline"
                fullWidth
                className="justify-start"
              >
                Orders
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteBuilding}
        title="Delete Building"
        message={`Are you sure you want to delete ${building.name}? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
};

export default BuildingDetail;