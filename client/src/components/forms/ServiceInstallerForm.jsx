import React from 'react';
import { User, Phone, Mail, MapPin, FileText, CreditCard } from 'lucide-react';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import useForm from '../../hooks/useForm';
import { isValidEmail, isValidMalaysianPhone } from '../../utils/validators';

/**
 * ServiceInstallerForm component for creating and editing service installers
 * @param {Object} props - Component props
 * @param {Object} props.initialData - Initial form data
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.submitButtonText - Submit button text
 */
const ServiceInstallerForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  submitButtonText = 'Save Service Installer'
}) => {
  // Define validation rules
  const validationRules = {
    name: { required: true, minLength: 3 },
    contactNo: { 
      required: true, 
      custom: (value) => {
        if (!isValidMalaysianPhone(value)) {
          return 'Please enter a valid Malaysian phone number';
        }
        return null;
      } 
    },
    email: { 
      required: false, 
      custom: (value) => {
        if (value && !isValidEmail(value)) {
          return 'Please enter a valid email address';
        }
        return null;
      } 
    },
    address: { required: false },
    bankName: { required: false },
    bankAccountNo: { required: false },
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
      name: initialData.name || '',
      contactNo: initialData.contactNo || '',
      email: initialData.email || '',
      address: initialData.address || '',
      bankName: initialData.bankName || '',
      bankAccountNo: initialData.bankAccountNo || '',
      notes: initialData.notes || '',
      isActive: initialData.isActive !== undefined ? initialData.isActive : true
    },
    validationRules,
    onSubmit
  );
  
  // Bank options
  const bankOptions = [
    { value: 'MAYBANK', label: 'Maybank' },
    { value: 'CIMB', label: 'CIMB Bank' },
    { value: 'PUBLIC_BANK', label: 'Public Bank' },
    { value: 'RHB', label: 'RHB Bank' },
    { value: 'HONG_LEONG', label: 'Hong Leong Bank' },
    { value: 'BANK_ISLAM', label: 'Bank Islam' },
    { value: 'AMBANK', label: 'AmBank' },
    { value: 'OTHER', label: 'Other' }
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label="Full Name"
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter full name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && errors.name}
            leftIcon={<User size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Contact Number"
            id="contactNo"
            name="contactNo"
            type="text"
            required
            placeholder="e.g. 012-345 6789"
            value={values.contactNo}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.contactNo && errors.contactNo}
            leftIcon={<Phone size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Email Address"
            id="email"
            name="email"
            type="email"
            placeholder="Enter email address (optional)"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email}
            leftIcon={<Mail size={18} className="text-gray-400" />}
          />
          
          <div className="md:col-span-2">
            <FormInput
              label="Address"
              id="address"
              name="address"
              type="textarea"
              placeholder="Enter address (optional)"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.address && errors.address}
              leftIcon={<MapPin size={18} className="text-gray-400" />}
            />
          </div>
        </div>
      </div>
      
      {/* Bank Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Information</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label="Bank Name"
            id="bankName"
            name="bankName"
            type="select"
            options={bankOptions}
            value={values.bankName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.bankName && errors.bankName}
            leftIcon={<CreditCard size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Bank Account Number"
            id="bankAccountNo"
            name="bankAccountNo"
            type="text"
            placeholder="Enter bank account number"
            value={values.bankAccountNo}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.bankAccountNo && errors.bankAccountNo}
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
            placeholder="Additional information about the service installer (optional)"
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

export default ServiceInstallerForm;