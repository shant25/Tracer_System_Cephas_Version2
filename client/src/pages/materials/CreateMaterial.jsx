import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MaterialForm from '../../components/forms/MaterialForm';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import useNotification from '../../hooks/useNotification';
import MaterialService from '../../services/material.service';

/**
 * CreateMaterial component for adding a new material
 */
const CreateMaterial = () => {
  const navigate = useNavigate();
  const notification = useNotification();
  const [loading, setLoading] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const toastId = notification.loading('Creating material...');
      
      // Ensure numeric values are properly formatted
      const formattedValues = {
        ...values,
        stockKeepingUnit: Number(values.stockKeepingUnit),
        minimumStock: values.minimumStock ? Number(values.minimumStock) : 10,
        unitPrice: values.unitPrice ? Number(values.unitPrice) : 0
      };
      
      const response = await MaterialService.createMaterial(formattedValues);
      
      if (response.success) {
        notification.update(toastId, 'Material created successfully', 'success');
        navigate(`/material/${response.data.id}`);
      } else {
        notification.update(toastId, response.message || 'Failed to create material', 'error');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating material:', error);
      notification.error('An error occurred while creating the material');
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Button
          as={Link}
          to="/material"
          variant="outline"
          size="sm"
          className="mr-4"
          leftIcon={<ArrowLeft size={16} />}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Material</h1>
      </div>
      
      {/* Material Form */}
      <Card className="p-6">
        <MaterialForm
          onSubmit={handleSubmit}
          isLoading={loading}
          submitButtonText="Create Material"
        />
      </Card>
    </div>
  );
};

export default CreateMaterial;