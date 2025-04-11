import React from 'react';
import { Package, Code, FileText, AlertTriangle, DollarSign } from 'lucide-react';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import useForm from '../../hooks/useForm';
import { isNumberInRange } from '../../utils/validators';

/**
 * MaterialForm component for creating and editing materials
 * @param {Object} props - Component props
 * @param {Object} props.initialData - Initial form data
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.submitButtonText - Submit button text
 */
const MaterialForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  submitButtonText = 'Save Material'
}) => {
  // Define validation rules
  const validationRules = {
    sapCode: { required: true, minLength: 3 },
    description: { required: true, minLength: 3 },
    stockKeepingUnit: { 
      required: true,
      custom: (value) => {
        if (!isNumberInRange(value, null, null)) {
          return 'Please enter a valid number';
        }
        return null;
      }
    },
    minimumStock: { 
      required: false,
      custom: (value) => {
        if (value && !isNumberInRange(value, 0, null)) {
          return 'Minimum stock cannot be negative';
        }
        return null;
      }
    },
    unitPrice: { 
      required: false,
      custom: (value) => {
        if (value && !isNumberInRange(value, 0, null)) {
          return 'Unit price cannot be negative';
        }
        return null;
      }
    },
    materialType: { required: false },
    notes: { required: false, maxLength: 500 },
    isActive: { required: false }
  };
  
  // Initialize form
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(
    {
      sapCode: initialData.sapCode || '',
      description: initialData.description || '',
      stockKeepingUnit: initialData.stockKeepingUnit !== undefined ? initialData.stockKeepingUnit : 0,
      minimumStock: initialData.minimumStock !== undefined ? initialData.minimumStock : 10,
      unitPrice: initialData.unitPrice !== undefined ? initialData.unitPrice : 0,
      materialType: initialData.materialType || 'EQUIPMENT',
      notes: initialData.notes || '',
      isActive: initialData.isActive !== undefined ? initialData.isActive : true
    },
    validationRules,
    onSubmit
  );
  
  // Material type options
  const materialTypeOptions = [
    { value: 'EQUIPMENT', label: 'Equipment' },
    { value: 'CONSUMABLE', label: 'Consumable' },
    { value: 'ACCESSORY', label: 'Accessory' },
    { value: 'TOOL', label: 'Tool' },
    { value: 'OTHER', label: 'Other' }
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Material Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Material Information</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label="SAP Code"
            id="sapCode"
            name="sapCode"
            type="text"
            required
            placeholder="Enter SAP code"
            value={values.sapCode}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.sapCode && errors.sapCode}
            leftIcon={<Code size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Material Type"
            id="materialType"
            name="materialType"
            type="select"
            options={materialTypeOptions}
            value={values.materialType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.materialType && errors.materialType}
            leftIcon={<Package size={18} className="text-gray-400" />}
          />
          
          <div className="md:col-span-2">
            <FormInput
              label="Description"
              id="description"
              name="description"
              type="text"
              required
              placeholder="Enter material description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.description && errors.description}
              leftIcon={<FileText size={18} className="text-gray-400" />}
            />
          </div>
        </div>
      </div>
      
      {/* Inventory Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Information</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormInput
            label="Current Stock"
            id="stockKeepingUnit"
            name="stockKeepingUnit"
            type="number"
            required
            value={values.stockKeepingUnit}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.stockKeepingUnit && errors.stockKeepingUnit}
          />
          
          <FormInput
            label="Minimum Stock"
            id="minimumStock"
            name="minimumStock"
            type="number"
            hint="Threshold for low stock alerts"
            value={values.minimumStock}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.minimumStock && errors.minimumStock}
            leftIcon={<AlertTriangle size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Unit Price (RM)"
            id="unitPrice"
            name="unitPrice"
            type="number"
            step="0.01"
            value={values.unitPrice}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.unitPrice && errors.unitPrice}
            leftIcon={<DollarSign size={18} className="text-gray-400" />}
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
            placeholder="Additional information about the material (optional)"
            value={values.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.notes && errors.notes}
            leftIcon={<FileText size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Active Status"
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={values.isActive}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.isActive && errors.isActive}
          />
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
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

export default MaterialForm;