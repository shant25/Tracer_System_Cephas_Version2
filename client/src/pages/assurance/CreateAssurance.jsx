import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '../../components/common/Button';
import AssuranceForm from '../../components/forms/AssuranceForm';
import useNotification from '../../hooks/useNotification';
import api from '../../services/api';

/**
 * CreateAssurance component for creating new assurance tickets
 */
const CreateAssurance = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  // Pre-populate form with current date
  const initialData = {
    recDate: new Date().toISOString().split('T')[0],
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '10:00',
    status: 'NOT_COMPLETED'
  };

  /**
   * Handle form submission
   * @param {Object} formData - Form data from AssuranceForm
   */
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/assurances', formData);
      
      if (response.success) {
        showSuccess('Assurance ticket created successfully');
        navigate('/assurance');
      } else {
        showError(response.message || 'Failed to create assurance ticket');
      }
    } catch (error) {
      console.error('Error creating assurance ticket:', error);
      showError('An error occurred while creating the assurance ticket');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Assurance Ticket</h1>
            <p className="mt-1 text-gray-500">
              Create a new assurance ticket for a customer
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/assurance')}
            >
              Back to List
            </Button>
            
            <Button
              type="submit"
              form="assurance-form" // Connect to form by id
              variant="primary"
              leftIcon={<Save size={16} />}
              disabled={isLoading}
              loading={isLoading}
            >
              Create Ticket
            </Button>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <AssuranceForm
          id="assurance-form"
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText="Create Assurance Ticket"
        />
      </div>
    </div>
  );
};

export default CreateAssurance;