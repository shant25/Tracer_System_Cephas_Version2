import React, { useState, useEffect, useCallback } from 'react';
import { Hash, Building, Layers, Code, FileText } from 'lucide-react';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import useForm from '../../hooks/useForm';
import useCephas from '../../hooks/useCephas';
import { isNumberInRange, isNotEmpty } from '../../utils/validators';

/**
 * SplitterForm component for creating and editing splitters
 * @param {Object} props - Component props
 * @param {Object} props.initialData - Initial form data
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.submitButtonText - Submit button text
 */
const SplitterForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  submitButtonText = 'Save Splitter'
}) => {
  // Safely access buildings from context with improved error handling
  const cephasContext = useCephas();
  // Ensure buildings is always an array, even if context is incomplete
  const buildings = Array.isArray(cephasContext?.buildings) ? cephasContext.buildings : [];
  
  // For debugging - remove in production
  useEffect(() => {
    if (!cephasContext) {
      console.warn('CephasContext is undefined in SplitterForm');
    } else if (!Array.isArray(cephasContext.buildings)) {
      console.warn('Buildings is not an array in CephasContext:', cephasContext.buildings);
    } else if (cephasContext.buildings.length === 0) {
      console.warn('Buildings array is empty in CephasContext');
    }
  }, [cephasContext]);
  const [buildingOptions, setBuildingOptions] = useState([]);
  
  // Memoize the building options transformation with improved error handling
  const generateBuildingOptions = useCallback((buildingsData) => {
    if (!Array.isArray(buildingsData)) {
      console.warn('buildingsData is not an array:', buildingsData);
      return [];
    }
    
    if (buildingsData.length === 0) {
      console.warn('buildingsData is an empty array');
      return [];
    }
    
    return buildingsData.map(building => {
      // Handle case where building might be null or undefined
      if (!building) {
        console.warn('Found null or undefined building in buildingsData');
        return { value: '', label: 'Unknown Building' };
      }
      
      // Handle case where building.id might be null or undefined
      const value = building.id ? building.id.toString() : '';
      
      // Handle case where building.name might be null or undefined
      const label = building.name || 'Unknown Building';
      
      return { value, label };
    });
  }, []);
  
  // Load building options with improved error handling and fallback options
  useEffect(() => {
    try {
      // Always generate options even if buildings array is empty
      const options = generateBuildingOptions(buildings);
      setBuildingOptions(options);
      
      // If no buildings data is available, provide a fallback option
      if (options.length === 0) {
        setBuildingOptions([{ value: '', label: 'No buildings available' }]);
      }
    } catch (error) {
      console.error('Error generating building options:', error);
      // Provide fallback options in case of error
      setBuildingOptions([{ value: '', label: 'Error loading buildings' }]);
    }
    
    return () => {
      // Cleanup function
    };
  }, [buildings, generateBuildingOptions]);
  
  // Add a useEffect to fetch buildings if they're not available in context
  useEffect(() => {
    // If buildings array is empty and context has a fetchBuildings function, call it
    if (buildings.length === 0 && typeof cephasContext?.fetchBuildings === 'function') {
      try {
        cephasContext.fetchBuildings();
      } catch (error) {
        console.error('Error fetching buildings:', error);
      }
    }
  }, [buildings, cephasContext]);
  
  // Define validation rules with improved error handling
  const validationRules = {
    serviceId: { 
      required: true,
      custom: (value) => {
        if (!isNotEmpty(value)) {
          return 'Service ID is required';
        }
        return null;
      }
    },
    buildingId: { 
      required: true,
      custom: (value) => {
        if (!isNotEmpty(value)) {
          return 'Building is required';
        }
        return null;
      }
    },
    splitterLevel: { required: true },
    splitterNumber: { required: true },
    splitterPort: { 
      required: true,
      custom: (value) => {
        // Convert to number and validate range
        const numValue = Number(value);
        if (isNaN(numValue) || !isNumberInRange(numValue, 1, 32)) {
          return 'Port number must be between 1 and 32';
        }
        return null;
      }
    },
    notes: { required: false, maxLength: 500 }
  };
  
  // Safe form submission handler with error handling
  const handleFormSubmit = useCallback(async (formData) => {
    try {
      if (typeof onSubmit === 'function') {
        await onSubmit(formData);
      } else {
        console.error('onSubmit is not a function');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // You could add toast notification here if needed
    }
  }, [onSubmit]);
  
  // Initialize form with safe defaults
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormValues
  } = useForm(
    {
      serviceId: initialData?.serviceId || '',
      buildingId: initialData?.buildingId || '',
      buildingName: initialData?.buildingName || '',
      alias: initialData?.alias || '',
      splitterLevel: initialData?.splitterLevel || '',
      splitterNumber: initialData?.splitterNumber || '',
      splitterPort: initialData?.splitterPort || '',
      notes: initialData?.notes || ''
    },
    validationRules,
    handleFormSubmit
  );
  
  // Handle cancel button click
  const handleCancel = useCallback(() => {
    try {
      window.history.back();
    } catch (error) {
      console.error('Error navigating back:', error);
    }
  }, []);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Splitter Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Splitter Information</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label="Service ID"
            id="serviceId"
            name="serviceId"
            type="text"
            required
            placeholder="Enter service ID (TRBN No.)"
            value={values.serviceId}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.serviceId && errors.serviceId}
            leftIcon={<Code size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Building"
            id="buildingId"
            name="buildingId"
            type="select"
            required
            options={buildingOptions}
            value={values.buildingId}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.buildingId && errors.buildingId}
            leftIcon={<Building size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Alias"
            id="alias"
            name="alias"
            type="text"
            placeholder="Enter alias (optional)"
            value={values.alias}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.alias && errors.alias}
          />
        </div>
      </div>
      
      {/* Splitter Details */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Splitter Details</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormInput
            label="Splitter Level"
            id="splitterLevel"
            name="splitterLevel"
            type="text"
            required
            placeholder="e.g. MDF ROOM - PARKING"
            value={values.splitterLevel}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.splitterLevel && errors.splitterLevel}
            leftIcon={<Layers size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Splitter Number"
            id="splitterNumber"
            name="splitterNumber"
            type="text"
            required
            placeholder="e.g. 02"
            value={values.splitterNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.splitterNumber && errors.splitterNumber}
            leftIcon={<Hash size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Splitter Port"
            id="splitterPort"
            name="splitterPort"
            type="number"
            required
            placeholder="e.g. 25"
            value={values.splitterPort}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.splitterPort && errors.splitterPort}
            min={1}
            max={32}
            leftIcon={<Hash size={18} className="text-gray-400" />}
          />
        </div>
      </div>
      
      {/* Additional Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
        
        <div className="grid grid-cols-1 gap-6">
          <FormInput
            label="Notes"
            id="notes"
            name="notes"
            type="textarea"
            placeholder="Additional information about the splitter (optional)"
            value={values.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.notes && errors.notes}
            leftIcon={<FileText size={18} className="text-gray-400" />}
          />
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading || isSubmitting}
          disabled={isLoading || isSubmitting}
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default SplitterForm;