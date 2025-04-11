import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BuildingForm from '../../components/forms/BuildingForm';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import useNotification from '../../hooks/useNotification';
import api from '../../services/api';

/**
 * CreateBuilding component for adding a new building
 */
const CreateBuilding = () => {
  const navigate = useNavigate();
  const notification = useNotification();
  const [loading, setLoading] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const toastId = notification.loading('Creating building...');
      
      const response = await api.post('/buildings', values);
      
      if (response.success) {
        notification.update(toastId, 'Building created successfully', 'success');
        navigate(`/building/${response.data.id}/detail`);
      } else {
        notification.update(toastId, response.message || 'Failed to create building', 'error');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating building:', error);
      notification.error('An error occurred while creating the building');
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
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
        <h1 className="text-2xl font-bold text-gray-900">Create New Building</h1>
      </div>
      
      {/* Building Form */}
      <Card className="p-6">
        <BuildingForm
          onSubmit={handleSubmit}
          isLoading={loading}
          submitButtonText="Create Building"
        />
      </Card>
    </div>
  );
};

export default CreateBuilding;