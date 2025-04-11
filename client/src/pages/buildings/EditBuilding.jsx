import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BuildingForm from '../../components/forms/BuildingForm';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import useNotification from '../../hooks/useNotification';
import api from '../../services/api';

/**
 * EditBuilding component for editing an existing building
 */
const EditBuilding = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notification = useNotification();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [building, setBuilding] = useState(null);
  
  // Load building data
  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        setFetchLoading(true);
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
        setFetchLoading(false);
      }
    };
    
    fetchBuilding();
  }, [id, navigate, notification]);
  
  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const toastId = notification.loading('Updating building...');
      
      const response = await api.put(`/buildings/${id}`, values);
      
      if (response.success) {
        notification.update(toastId, 'Building updated successfully', 'success');
        navigate(`/building/${id}/detail`);
      } else {
        notification.update(toastId, response.message || 'Failed to update building', 'error');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error updating building:', error);
      notification.error('An error occurred while updating the building');
      setLoading(false);
    }
  };
  
  // Show loading state
  if (fetchLoading) {
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
        <h2 className="text-2xl font-semibold text-gray-700">Building Not Found</h2>
        <p className="text-gray-500 mt-2">The building you're trying to edit doesn't exist or has been removed.</p>
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
      <div className="flex items-center">
        <Button
          as={Link}
          to={`/building/${id}/detail`}
          variant="outline"
          size="sm"
          className="mr-4"
          leftIcon={<ArrowLeft size={16} />}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Building</h1>
      </div>
      
      {/* Building Form */}
      <Card className="p-6">
        <BuildingForm
          initialData={building}
          onSubmit={handleSubmit}
          isLoading={loading}
          submitButtonText="Update Building"
        />
      </Card>
    </div>
  );
};

export default EditBuilding;