import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package } from 'lucide-react';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import useForm from '../../hooks/useForm';
import useNotification from '../../hooks/useNotification';
import api from '../../services/api';

/**
 * EditMaterial component for editing existing materials
 */
const EditMaterial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [initialFormData, setInitialFormData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);

  // Fetch material data and reference data
  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        // Fetch material details
        const materialResponse = await api.get(`/materials/${id}`);
        
        if (!materialResponse.success) {
          showError(materialResponse.message || 'Failed to load material details');
          navigate('/materials');
          return;
        }
        
        // Set initial form data
        setInitialFormData({
          sapCode: materialResponse.data.sapCode || '',
          description: materialResponse.data.description || '',
          category: materialResponse.data.category || '',
          type: materialResponse.data.type || '',
          stockKeepingUnit: materialResponse.data.stockKeepingUnit || 0,
          minStockLevel: materialResponse.data.minStockLevel || 0,
          unitPrice: materialResponse.data.unitPrice || 0,
          location: materialResponse.data.location || '',
          notes: materialResponse.data.notes || ''
        });
        
        // Fetch reference data
        const [categoriesResponse, typesResponse] = await Promise.all([
          api.get('/materials/categories'),
          api.get('/materials/types')
        ]);
        
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data || []);
        }
        
        if (typesResponse.success) {
          setMaterialTypes(typesResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching material data:', error);
        showError('An error occurred while loading material data');
        navigate('/materials');
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [id, navigate, showError]);

  // Define validation rules
  const validationRules = {
    sapCode: {
      required: true,
      minLength: 3,
      maxLength: 50
    },
    description: {
      required: true,
      minLength: 3,
      maxLength: 200
    },
    stockKeepingUnit: {
      required: true
    }
  };
  
  // Initialize form with default values (will be updated once data is fetched)
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid,
    setMultipleFields
  } = useForm(
    {
      sapCode: '',
      description: '',
      category: '',
      type: '',
      stockKeepingUnit: 0,
      minStockLevel: 0,
      unitPrice: 0,
      location: '',
      notes: ''
    },
    onSubmit,
    validationRules
  );

  // Update form values when initial data is loaded
  useEffect(() => {
    if (initialFormData) {
      setMultipleFields(initialFormData);
    }
  }, [initialFormData, setMultipleFields]);

  // Form submission handler
  async function onSubmit(formData) {
    setIsLoading(true);
    
    try {
      const response = await api.put(`/materials/${id}`, formData);
      
      if (response.success) {
        showSuccess('Material updated successfully');
        navigate(`/materials/${id}`);
      } else {
        showError(response.message || 'Failed to update material');
      }
    } catch (error) {
      console.error('Error updating material:', error);
      showError('An error occurred while updating the material');
    } finally {
      setIsLoading(false);
    }
  }

  // Convert reference lists to options format
  const categoryOptions = categories.map(category => ({
    value: category,
    label: category
  }));
  
  const typeOptions = materialTypes.map(type => ({
    value: type,
    label: type
  }));

  if (isFetching) {
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Material</h1>
            <p className="mt-1 text-gray-500">
              Update material details for {values.sapCode}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate(`/materials/${id}`)}
            >
              Back to Material
            </Button>
            
            <Button
              type="submit"
              form="material-form"
              variant="primary"
              leftIcon={<Save size={16} />}
              disabled={isLoading || !isFormValid}
              loading={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Material form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form id="material-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SAP Code */}
            <FormInput
              label="SAP Code"
              name="sapCode"
              value={values.sapCode || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.sapCode && errors.sapCode}
              icon={<Package size={18} />}
              required
            />
            
            {/* Description */}
            <FormInput
              label="Description"
              name="description"
              value={values.description || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.description && errors.description}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <FormInput
              label="Category"
              name="category"
              value={values.category || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.category && errors.category}
              select
              options={[{ value: '', label: 'Select Category' }, ...categoryOptions]}
            />
            
            {/* Type */}
            <FormInput
              label="Type"
              name="type"
              value={values.type || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.type && errors.type}
              select
              options={[{ value: '', label: 'Select Type' }, ...typeOptions]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stock Keeping Unit */}
            <FormInput
              label="Stock Keeping Unit"
              name="stockKeepingUnit"
              type="number"
              value={values.stockKeepingUnit || 0}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.stockKeepingUnit && errors.stockKeepingUnit}
              required
            />
            
            {/* Minimum Stock Level */}
            <FormInput
              label="Minimum Stock Level"
              name="minStockLevel"
              type="number"
              value={values.minStockLevel || 0}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.minStockLevel && errors.minStockLevel}
            />
            
            {/* Unit Price */}
            <FormInput
              label="Unit Price (RM)"
              name="unitPrice"
              type="number"
              step="0.01"
              min="0"
              value={values.unitPrice || 0}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.unitPrice && errors.unitPrice}
            />
          </div>

          {/* Location */}
          <FormInput
            label="Storage Location"
            name="location"
            value={values.location || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.location && errors.location}
            placeholder="e.g., Warehouse A, Shelf B3"
          />

          {/* Notes */}
          <FormInput
            label="Additional Notes"
            name="notes"
            value={values.notes || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.notes && errors.notes}
            textarea
            rows={4}
            placeholder="Any additional information about this material"
          />
        </form>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">Update Stock</h3>
            <p className="text-sm text-blue-600 mb-3">Add or remove stock from inventory</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/materials/movements/new?materialId=${id}`)}
            >
              Record Movement
            </Button>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-800 mb-2">Assign to Job</h3>
            <p className="text-sm text-green-600 mb-3">Assign this material to a service job</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/materials/assignments/new?materialId=${id}`)}
            >
              Assign Material
            </Button>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-medium text-purple-800 mb-2">View History</h3>
            <p className="text-sm text-purple-600 mb-3">View movement history for this material</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/materials/${id}/movements`)}
            >
              View History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMaterial;