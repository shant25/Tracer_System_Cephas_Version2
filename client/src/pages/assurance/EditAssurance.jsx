import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Copy, Tool } from 'lucide-react';
import Button from '../../components/common/Button';
import AssuranceForm from '../../components/forms/AssuranceForm';
import ConfirmModal from '../../components/modals/ConfirmModal';
import JobAssignModal from '../../components/modals/JobAssignModal';
import useNotification from '../../hooks/useNotification';
import api from '../../services/api';

/**
 * EditAssurance component for editing existing assurance tickets
 */
const EditAssurance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError, showLoading, updateNotification } = useNotification();
  
  const [assuranceData, setAssuranceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Fetch assurance data
  useEffect(() => {
    const fetchAssurance = async () => {
      const loadingId = showLoading('Loading assurance ticket details...');
      
      try {
        const response = await api.get(`/assurances/${id}`);
        
        if (response.success) {
          setAssuranceData(response.data);
          updateNotification(loadingId, 'Assurance ticket loaded successfully', 'success');
        } else {
          updateNotification(loadingId, response.message || 'Failed to load assurance ticket', 'error');
          navigate('/assurance');
        }
      } catch (error) {
        console.error('Error fetching assurance:', error);
        updateNotification(loadingId, 'An error occurred while loading the assurance ticket', 'error');
        navigate('/assurance');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssurance();
  }, [id, navigate]);

  /**
   * Handle form submission
   * @param {Object} formData - Form data from AssuranceForm
   */
  const handleSubmit = async (formData) => {
    setIsSaving(true);
    try {
      const response = await api.put(`/assurances/${id}`, formData);
      
      if (response.success) {
        showSuccess('Assurance ticket updated successfully');
        // Update local state with new data
        setAssuranceData(response.data);
      } else {
        showError(response.message || 'Failed to update assurance ticket');
      }
    } catch (error) {
      console.error('Error updating assurance:', error);
      showError('An error occurred while updating the assurance ticket');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle assurance deletion
   */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await api.delete(`/assurances/${id}`);
      
      if (response.success) {
        showSuccess('Assurance ticket deleted successfully');
        navigate('/assurance');
      } else {
        showError(response.message || 'Failed to delete assurance ticket');
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting assurance:', error);
      showError('An error occurred while deleting the assurance ticket');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handle assurance duplication
   */
  const handleDuplicate = () => {
    // Remove id and status from the duplicated data
    const { id: assuranceId, status, ...duplicateData } = assuranceData;
    
    // Navigate to create page with state
    navigate('/assurance/create', { state: { initialData: duplicateData } });
  };

  /**
   * Handle assurance completion
   */
  const handleComplete = async () => {
    setIsSaving(true);
    try {
      const response = await api.put(`/assurances/${id}/complete`, {
        status: 'COMPLETED',
        completionDate: new Date().toISOString()
      });
      
      if (response.success) {
        showSuccess('Assurance ticket marked as completed');
        setAssuranceData({ ...assuranceData, status: 'COMPLETED' });
        setShowCompleteModal(false);
      } else {
        showError(response.message || 'Failed to complete assurance ticket');
      }
    } catch (error) {
      console.error('Error completing assurance:', error);
      showError('An error occurred while completing the assurance ticket');
    } finally {
      setIsSaving(false);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Assurance Ticket</h1>
            <p className="mt-1 text-gray-500">
              {`${assuranceData?.ticketNumber || `Ticket #${id}`} - ${assuranceData?.name || 'Customer'}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/assurance')}
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
            
            {assuranceData?.status !== 'COMPLETED' && (
              <>
                <Button
                  variant="primary"
                  leftIcon={<Tool size={16} />}
                  onClick={() => setShowCompleteModal(true)}
                >
                  Mark Completed
                </Button>
                
                <Button
                  variant="primary"
                  leftIcon={<Save size={16} />}
                  onClick={() => setShowAssignModal(true)}
                >
                  Assign Installer
                </Button>
              </>
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
              form="assurance-form" // Connect to form by id
              variant="primary"
              leftIcon={<Save size={16} />}
              disabled={isSaving || assuranceData?.status === 'COMPLETED'}
              loading={isSaving}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Status banner */}
      {assuranceData?.status === 'COMPLETED' ? (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md">
          <p className="text-green-800 font-medium">
            This assurance ticket has been completed and cannot be modified further.
          </p>
        </div>
      ) : assuranceData?.status === 'IN_PROGRESS' ? (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
          <p className="text-blue-800 font-medium">
            This assurance ticket is currently in progress.
          </p>
        </div>
      ) : null}

      {/* Form card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <AssuranceForm
          id="assurance-form"
          initialData={assuranceData}
          onSubmit={handleSubmit}
          isLoading={isSaving}
          submitButtonText="Update Assurance Ticket"
          disabled={assuranceData?.status === 'COMPLETED'}
        />
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Assurance Ticket"
        message="Are you sure you want to delete this assurance ticket? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Complete confirmation modal */}
      <ConfirmModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onConfirm={handleComplete}
        title="Complete Assurance Ticket"
        message="Are you sure you want to mark this assurance ticket as completed? This will lock the ticket from further edits."
        confirmText="Complete"
        cancelText="Cancel"
        type="success"
        isLoading={isSaving}
      />

      {/* Job assignment modal */}
      {showAssignModal && (
        <JobAssignModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          jobId={id}
          jobType="assurance"
          currentAssignee={assuranceData?.serviceInstallerId}
        />
      )}
    </div>
  );
};

export default EditAssurance;