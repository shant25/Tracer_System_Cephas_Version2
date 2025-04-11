import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '../../components/common/Button';
import OrderForm from '../../components/forms/OrderForm';
import useNotification from '../../hooks/useNotification';

/**
 * CreateActivation component for creating new activation orders
 */
const CreateActivation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notification = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  // Check if we have initial data from location state (e.g. from duplication)
  const stateInitialData = location.state?.initialData;

  // Pre-populate form with activation order type or use data from state
  const initialData = stateInitialData || {
    orderType: 'ACTIVATION',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '10:00'
  };

  /**
   * Handle form submission
   * @param {Object} formData - Form data from OrderForm
   */
  const handleSubmit = async (formData) => {
    // Validate required fields
    const requiredFields = ['orderType', 'appointmentDate', 'appointmentTime', 'name', 'contactNo', 'buildingId'];
    const missingFields = requiredFields.filter(field => !formData?.[field]);
    
    if (missingFields.length > 0) {
      notification.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await api.post('/activations', formData);
      
      // For demo purposes, simulate api response with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResponse = {
        success: true,
        data: {
          id: Math.floor(Math.random() * 1000) + 1,
          ...formData,
          status: 'NOT_COMPLETED',
          createdAt: new Date().toISOString()
        }
      };
      
      notification.success('Activation order created successfully');
      navigate(`/activation/${mockResponse.data.id}`);
    } catch (error) {
      console.error('Error creating activation:', error);
      notification.error('An error occurred while creating the activation');
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
            <h1 className="text-2xl font-bold text-gray-900">Create Activation</h1>
            <p className="mt-1 text-gray-500">
              Create a new activation order for a customer
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/activation')}
            >
              Back to List
            </Button>
            
            <Button
              type="submit"
              form="activation-form" // Connect to form by id
              variant="primary"
              leftIcon={<Save size={16} />}
              disabled={isLoading}
              loading={isLoading}
            >
              Save Activation
            </Button>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <OrderForm
          id="activation-form"
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText="Create Activation"
        />
      </div>
    </div>
  );
};

export default CreateActivation;