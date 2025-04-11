import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  Download,
  History
} from 'lucide-react';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/modals/ConfirmModal';
import MaterialAssignModal from '../../components/modals/MaterialAssignModal';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { hasActionPermission } from '../../utils/accessControl';
import api from '../../services/api';

/**
 * MaterialDetail component for viewing material details
 */
const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserRole } = useAuth();
  const { showSuccess, showError, showLoading, updateNotification } = useNotification();
  
  const [material, setMaterial] = useState(null);
  const [movementHistory, setMovementHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Check user permissions
  const userRole = getUserRole();
  const canEditMaterial = hasActionPermission(userRole, 'edit_material');
  const canDeleteMaterial = hasActionPermission(userRole, 'delete_material');
  const canAssignMaterial = hasActionPermission(userRole, 'assign_material');
  const canUpdateStock = hasActionPermission(userRole, 'update_stock');

  // Fetch material data
  useEffect(() => {
    const fetchMaterial = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/materials/${id}`);
        
        if (response.success) {
          setMaterial(response.data);
        } else {
          showError(response.message || 'Failed to load material details');
          navigate('/materials');
        }
      } catch (error) {
        console.error('Error fetching material:', error);
        showError('An error occurred while loading the material');
        navigate('/materials');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterial();
  }, [id, navigate, showError]);

  // Handle material deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await api.delete(`/materials/${id}`);
      
      if (response.success) {
        showSuccess('Material deleted successfully');
        navigate('/materials');
      } else {
        showError(response.message || 'Failed to delete material');
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      showError('An error occurred while deleting the material');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetch movement history for the material
  const fetchMovementHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await api.get(`/materials/${id}/movements`);
      
      if (response.success) {
        setMovementHistory(response.data);
      } else {
        showError(response.message || 'Failed to load movement history');
      }
    } catch (error) {
      console.error('Error fetching movement history:', error);
      showError('An error occurred while loading movement history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Export movement history to CSV
  const handleExportHistory = async () => {
    const loadingId = showLoading('Preparing export...');
    
    try {
      const response = await api.get(`/materials/${id}/movements/export`, { responseType: 'blob' });
      
      if (response) {
        // Create a download link
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Material-${material?.sapCode || id}-History.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        updateNotification(loadingId, 'Export completed successfully', 'success');
      } else {
        updateNotification(loadingId, 'Failed to export history', 'error');
      }
    } catch (error) {
      console.error('Error exporting history:', error);
      updateNotification(loadingId, 'An error occurred while exporting history', 'error');
    }
  };

  // Determine stock status
  const getStockStatus = () => {
    if (!material) return { type: 'unknown', label: 'Unknown' };
    
    if (material.stockKeepingUnit <= 0) {
      return { type: 'out', label: 'Out of Stock', icon: <AlertCircle size={20} className="text-red-500 mr-2" /> };
    } else if (material.stockKeepingUnit < material.minStockLevel) {
      return { type: 'low', label: 'Low Stock', icon: <AlertTriangle size={20} className="text-yellow-500 mr-2" /> };
    } else {
      return { type: 'ok', label: 'In Stock', icon: <CheckCircle size={20} className="text-green-500 mr-2" /> };
    }
  };

  const stockStatus = getStockStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Material Detail
            </h1>
            <p className="mt-1 text-gray-500">
              {material?.sapCode} - {material?.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/materials')}
            >
              Back to List
            </Button>
            
            {canAssignMaterial && (
              <Button
                variant="primary"
                leftIcon={<Package size={16} />}
                onClick={() => setShowAssignModal(true)}
              >
                Assign Material
              </Button>
            )}
            
            {canEditMaterial && (
              <Button
                variant="primary"
                leftIcon={<Edit size={16} />}
                onClick={() => navigate(`/materials/${id}/edit`)}
              >
                Edit
              </Button>
            )}
            
            {canDeleteMaterial && (
              <Button
                variant="danger"
                leftIcon={<Trash2 size={16} />}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stock status banner */}
      <div className={`p-4 rounded-lg ${
        stockStatus.type === 'ok' ? 'bg-green-50 border border-green-200' :
        stockStatus.type === 'low' ? 'bg-yellow-50 border border-yellow-200' :
        stockStatus.type === 'out' ? 'bg-red-50 border border-red-200' :
        'bg-gray-50 border border-gray-200'
      }`}>
        <div className="flex items-center">
          {stockStatus.icon}
          
          <div>
            <p className={`font-medium ${
              stockStatus.type === 'ok' ? 'text-green-800' :
              stockStatus.type === 'low' ? 'text-yellow-800' :
              stockStatus.type === 'out' ? 'text-red-800' :
              'text-gray-800'
            }`}>
              {stockStatus.label}
            </p>
            
            <p className="text-sm">
              Current stock: <span className="font-semibold">{material?.stockKeepingUnit}</span> units
              {material?.minStockLevel && ` (Minimum level: ${material.minStockLevel} units)`}
            </p>
          </div>
        </div>
      </div>

      {/* Material details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Material Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">SAP Code</dt>
                <dd className="mt-1 text-sm text-gray-900">{material?.sapCode}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{material?.description}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">{material?.category || 'N/A'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{material?.type || 'N/A'}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Stock Keeping Unit</dt>
                <dd className="mt-1 text-sm text-gray-900">{material?.stockKeepingUnit}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Minimum Stock Level</dt>
                <dd className="mt-1 text-sm text-gray-900">{material?.minStockLevel || 'Not set'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Unit Price</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {material?.unitPrice ? `RM ${material.unitPrice.toFixed(2)}` : 'N/A'}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">{material?.location || 'N/A'}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        {material?.description && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Information</h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700">
                {material.notes || 'No additional information available.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Movement history */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Movement History</h2>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<History size={16} />}
              onClick={fetchMovementHistory}
              loading={isLoadingHistory}
            >
              Refresh History
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download size={16} />}
              onClick={handleExportHistory}
              disabled={isLoadingHistory}
            >
              Export History
            </Button>
          </div>
        </div>
        
        {isLoadingHistory ? (
          <div className="py-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500 mb-2"></div>
            <p>Loading movement history...</p>
          </div>
        ) : movementHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movementHistory.map((movement) => (
                  <tr key={movement.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        movement.type === 'IN' ? 'bg-green-100 text-green-800' :
                        movement.type === 'OUT' ? 'bg-red-100 text-red-800' :
                        movement.type === 'ADJUSTMENT' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {movement.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {movement.type === 'IN' ? '+' : movement.type === 'OUT' ? '-' : ''}
                      {movement.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.reference || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.user || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 text-center text-gray-500 rounded-lg border border-gray-200">
            <Package size={36} className="mx-auto mb-2 text-gray-400" />
            <p className="mb-1">No movement history found</p>
            <p className="text-sm">Click "Refresh History" to view movement records for this material.</p>
          </div>
        )}
        
        {movementHistory.length > 0 && (
          <div className="mt-4 text-right">
            <Link to={`/materials/${id}/movements`} className="text-sm text-blue-600 hover:text-blue-800">
              View Full History
            </Link>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Material"
        message={`Are you sure you want to delete material ${material?.sapCode} - ${material?.description}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Material assignment modal */}
      {showAssignModal && (
        <MaterialAssignModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          materialId={id}
          materialData={material}
        />
      )}
    </div>
  );
};

export default MaterialDetail;