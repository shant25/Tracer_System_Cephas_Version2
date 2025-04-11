import React from 'react';
import { Building, MapPin, User, Phone, FileText } from 'lucide-react';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import useForm from '../../hooks/useForm';
import { isValidEmail, isValidMalaysianPhone } from '../../utils/validators';

/**
 * BuildingForm component for creating and editing buildings
 * @param {Object} props - Component props
 * @param {Object} props.initialData - Initial form data
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.submitButtonText - Submit button text
 */
const BuildingForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  submitButtonText = 'Save Building'
}) => {
  // Define validation rules
  const validationRules = {
    name: { required: true, minLength: 3 },
    type: { required: true },
    location: { required: true },
    address: { required: true, minLength: 10 },
    contactPerson: { required: true },
    contactNumber: { 
      required: true, 
      custom: (value) => {
        if (!isValidMalaysianPhone(value)) {
          return 'Please enter a valid Malaysian phone number';
        }
        return null;
      } 
    },
    contactEmail: { 
      required: false, 
      custom: (value) => {
        if (value && !isValidEmail(value)) {
          return 'Please enter a valid email address';
        }
        return null;
      } 
    },
    notes: { required: false, maxLength: 500 }
  };
  
  // Initialize form
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
      name: initialData.name || '',
      type: initialData.type || '',
      location: initialData.location || '',
      address: initialData.address || '',
      contactPerson: initialData.contactPerson || '',
      contactNumber: initialData.contactNumber || '',
      contactEmail: initialData.contactEmail || '',
      notes: initialData.notes || ''
    },
    validationRules,
    onSubmit
  );
  
  // Building types options
  const buildingTypes = [
    { value: 'Prelaid', label: 'Prelaid' },
    { value: 'Non Prelaid', label: 'Non Prelaid' },
    { value: 'Both', label: 'Both (Prelaid & Non Prelaid)' }
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Building Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Building Information</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label="Building Name"
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter building name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && errors.name}
            leftIcon={<Building size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Building Type"
            id="type"
            name="type"
            type="select"
            required
            options={buildingTypes}
            value={values.type}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.type && errors.type}
          />
          
          <FormInput
            label="Location"
            id="location"
            name="location"
            type="text"
            required
            placeholder="City or Area"
            value={values.location}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.location && errors.location}
            leftIcon={<MapPin size={18} className="text-gray-400" />}
          />
          
          <div className="md:col-span-2">
            <FormInput
              label="Full Address"
              id="address"
              name="address"
              type="textarea"
              required
              placeholder="Enter complete building address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.address && errors.address}
            />
          </div>
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label="Contact Person"
            id="contactPerson"
            name="contactPerson"
            type="text"
            required
            placeholder="Enter contact person's name"
            value={values.contactPerson}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.contactPerson && errors.contactPerson}
            leftIcon={<User size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Contact Number"
            id="contactNumber"
            name="contactNumber"
            type="text"
            required
            placeholder="e.g. 012-345 6789"
            value={values.contactNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.contactNumber && errors.contactNumber}
            leftIcon={<Phone size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Email Address"
            id="contactEmail"
            name="contactEmail"
            type="email"
            placeholder="Enter email address (optional)"
            value={values.contactEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.contactEmail && errors.contactEmail}
          />
          
          <div className="md:col-span-2">
            <FormInput
              label="Notes"
              id="notes"
              name="notes"
              type="textarea"
              placeholder="Additional information about the building (optional)"
              value={values.notes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.notes && errors.notes}
              leftIcon={<FileText size={18} className="text-gray-400" />}
            />
          </div>
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

export default BuildingForm;