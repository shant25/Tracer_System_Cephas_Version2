import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, Clock, Phone, User, Building, FileText } from 'lucide-react';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import useForm from '../../hooks/useForm';
import useCephas from '../../hooks/useCephas';
import { isValidMalaysianPhone } from '../../utils/validators';

/**
 * ActivationForm component for creating and editing activations
 * @param {Object} props - Component props
 * @param {Object} props.initialData - Initial form data
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.submitButtonText - Submit button text
 */
const ActivationForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  submitButtonText = 'Save Activation'
}) => {
  const { buildings } = useCephas();
  const [buildingOptions, setBuildingOptions] = useState([]);
  
  // Load building options
  useEffect(() => {
    if (buildings && buildings.length > 0) {
      const options = buildings.map(building => ({
        value: building.id.toString(),
        label: building.name
      }));
      setBuildingOptions(options);
    }
  }, [buildings]);
  
  // Define validation rules
  const validationRules = {
    trbnNo: { required: true, minLength: 5 },
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
    building: { required: true },
    appointmentDate: { required: true },
    appointmentTime: { required: true },
    orderType: { required: true },
    orderSubType: { required: false },
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
      trbnNo: initialData.trbnNo || '',
      name: initialData.name || '',
      contactNo: initialData.contactNo || '',
      building: initialData.building || '',
      appointmentDate: initialData.appointmentDate ? new Date(initialData.appointmentDate).toISOString().split('T')[0] : '',
      appointmentTime: initialData.appointmentTime || '',
      orderType: initialData.orderType || 'ACTIVATION',
      orderSubType: initialData.orderSubType || '',
      notes: initialData.notes || ''
    },
    validationRules,
    onSubmit
  );
  
  // Order type options
  const orderTypeOptions = [
    { value: 'ACTIVATION', label: 'Activation' },
    { value: 'MODIFICATION', label: 'Modification' },
    { value: 'RESCHEDULE', label: 'Reschedule' }
  ];
  
  // Order sub-type options
  const orderSubTypeOptions = [
    { value: 'RESCHEDULE', label: 'Reschedule' },
    { value: 'CUSTOMER_REQUEST', label: 'Customer Request' },
    { value: 'TECHNICAL_ISSUE', label: 'Technical Issue' },
    { value: 'OTHER', label: 'Other' }
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label="TRBN Number"
            id="trbnNo"
            name="trbnNo"
            type="text"
            required
            placeholder="Enter TRBN Number"
            value={values.trbnNo}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.trbnNo && errors.trbnNo}
          />
          
          <FormInput
            label="Customer Name"
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter customer name"
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
            label="Building"
            id="building"
            name="building"
            type="select"
            required
            options={buildingOptions}
            value={values.building}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.building && errors.building}
            leftIcon={<Building size={18} className="text-gray-400" />}
          />
        </div>
      </div>
      
      {/* Appointment Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Information</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label="Appointment Date"
            id="appointmentDate"
            name="appointmentDate"
            type="date"
            required
            value={values.appointmentDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.appointmentDate && errors.appointmentDate}
            leftIcon={<Calendar size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Appointment Time"
            id="appointmentTime"
            name="appointmentTime"
            type="time"
            required
            value={values.appointmentTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.appointmentTime && errors.appointmentTime}
            leftIcon={<Clock size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Order Type"
            id="orderType"
            name="orderType"
            type="select"
            required
            options={orderTypeOptions}
            value={values.orderType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.orderType && errors.orderType}
            leftIcon={<AlertTriangle size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Order Sub-Type"
            id="orderSubType"
            name="orderSubType"
            type="select"
            options={orderSubTypeOptions}
            value={values.orderSubType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.orderSubType && errors.orderSubType}
          />
          
          <div className="md:col-span-2">
            <FormInput
              label="Notes"
              id="notes"
              name="notes"
              type="textarea"
              placeholder="Additional information about the activation (optional)"
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

export default ActivationForm;