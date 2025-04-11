import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Copy } from 'lucide-react';
import Button from '../../components/common/Button';
import OrderForm from '../../components/forms/OrderForm';
import { ConfirmModal } from '../../components/common/Modal';
import JobAssignModal from '../../components/modals/JobAssignModal';
import useNotification from '../../hooks/useNotification';
import api from '../../services/api';

/**
 * EditActivation component for editing existing activation orders
 */
const EditActivation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notification = useNotification();
  
  const [activationData, setActivationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Fetch activation data
  useEffect(() => {
    const fetchActivation = async () => {
      const loadingId = notification.loading('Loading activation details...');
      
      try {
        // Mock data for now - in a real app this would be an API call
        // For demo purposes, simulate api response with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData = {
          id: id,
          trbnNo: `TBBNA8725${id}G`,
          name: 'John Doe',
          contactNo: '017-3781691',
          email: 'john.doe@example.com',
          address: '123 Main Street, Kuala Lumpur',
          buildingId: '1',
          appointmentDate: '2025-05-10',
          appointmentTime: '10:00',
          orderType: 'ACTIVATION',
          orderSubType: '',
          status: 'NOT_COMPLETED',
          notes: 'Customer requested installation in the morning'
        };
        
        setActivationData(mockData);
        notification.update(loadingId, 'Activation loaded successfully', 'success');
      } catch (error) {
        console.error('Error fetching activation:', error);
        notification.update(loadingId, 'An error occurred while loading the activation', 'error');
        navigate('/activation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivation();
  }, [id, navigate, notification]);

  /**
   * Handle form submission
   * @param {Object} formData - Form data from OrderForm
   */
  const handleSubmit = async (formData) => {
    setIsSaving(true);
    try {
      // In a real app, this would be an API call
      // await api.put(`/activations/${id}`, formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notification.success('Activation updated successfully');
      // Update local state with new data
      setActivationData({...activationData, ...formData});
    } catch (error) {
      console.error('Error updating activation:', error);
      notification.error('An error occurred while updating the activation');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle activation deletion
   */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // In a real app, this would be an API call
      // await api.delete(`/activations/${id}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notification.success('Activation deleted successfully');
      navigate('/activation');
    } catch (error) {
      console.error('Error deleting activation:', error);
      notification.error('An error occurred while deleting the activation');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handle activation duplication
   */
  const handleDuplicate = () => {
    // Remove id and status from the duplicated data
    const { id: activationId, status, ...duplicateData } = activationData;
    
    // Navigate to create page with state
    navigate('/activation/create', { state: { initialData: duplicateData } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Activation</h1>
            <p className="mt-1 text-gray-500">
              {activationData?.trbnNo || `Activation #${id}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/activation')}
            >
              Back to List
            </Button>
            
            <Button
              variant="outline"
              leftIcon={<Copy size={16} />}
              onClick={handleDuplicate}
            >
              Duplicate
            </Button>
            
            {activationData?.status !== 'COMPLETED' && (
              <Button
                variant="primary"
                leftIcon={<Save size={16} />}
                onClick={() => setShowAssignModal(true)}
              >
                Assign Installer
              </Button>
            )}
            
            <Button
              variant="danger"
              leftIcon={<Trash2 size={16} />}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
            
            <Button
              type="submit"
              form="activation-form" // Connect to form by id
              variant="primary"
              leftIcon={<Save size={16} />}
              disabled={isSaving}
              loading={isSaving}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Info banner */}
      {activationData?.status === 'COMPLETED' && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md">
          <p className="text-green-800 font-medium">
            This activation has been completed and cannot be modified further.
          </p>
        </div>
      )}

      {/* Form card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <OrderForm
          id="activation-form"
          initialData={activationData}
          onSubmit={handleSubmit}
          isLoading={isSaving}
          submitButtonText="Update Activation"
          disabled={activationData?.status === 'COMPLETED'}
        />
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Activation"
        message="Are you sure you want to delete this activation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Job assignment modal */}
      {showAssignModal && (
        <JobAssignModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          job={activationData}
          onAssign={(jobId, assignmentData) => {
            // Mock implementation for assignment
            notification.success('Service installer assigned successfully');
            setActivationData({
              ...activationData,
              serviceInstallerId: assignmentData.serviceInstallerId,
              serviceInstaller: 'Newly Assigned Installer'
            });
            setShowAssignModal(false);
          }}
        />
      )}
    </div>
  );
};

export default EditActivation;