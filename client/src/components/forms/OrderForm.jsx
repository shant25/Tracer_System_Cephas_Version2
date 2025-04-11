import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, FileText, Calendar, Clock, Building } from 'lucide-react';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import useForm from '../../hooks/useForm';
import useCephas from '../../hooks/useCephas';
import { isValidEmail, isValidMalaysianPhone } from '../../utils/validators';

/**
 * OrderForm component for creating and editing orders
 * @param {Object} props - Component props
 * @param {Object} props.initialData - Initial form data
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.submitButtonText - Submit button text
 */
const OrderForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  submitButtonText = 'Save Order'
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
    tbbnoId: {
      required: true,
      minLength: 3,
      maxLength: 50
    },
    name: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    email: {
      email: true
    },
    contactNo: {
      required: true,
      malaysianPhone: true
    },
    address: {
      required: true,
      minLength: 5,
      maxLength: 200
    },
    buildingId: {
      required: true
    },
    appointmentDate: {
      required: true
    },
    appointmentTime: {
      required: true
    },
    orderType: {
      required: true
    }
  };
  
  // Initialize form with default values
  const defaultValues = {
    tbbnoId: '',
    name: '',
    email: '',
    contactNo: '',
    address: '',
    buildingId: '',
    appointmentDate: '',
    appointmentTime: '',
    orderType: 'ACTIVATION',
    orderSubType: '',
    notes: '',
    ...initialData
  };
  
  // Initialize form hooks
  const {
    values,
    errors,
    touched,
    isSubmitting,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue
  } = useForm(defaultValues, onSubmit, validationRules);
  
  // Order type options
  const orderTypeOptions = [
    { value: 'ACTIVATION', label: 'Activation' },
    { value: 'MODIFICATION', label: 'Modification' },
    { value: 'ASSURANCE', label: 'Assurance' }
  ];
  
  // Order subtype options (based on order type)
  const getOrderSubTypeOptions = () => {
    switch (values.orderType) {
      case 'ACTIVATION':
        return [
          { value: 'NEW', label: 'New' },
          { value: 'RESCHEDULE', label: 'Reschedule' },
          { value: 'UPGRADE', label: 'Upgrade' }
        ];
      case 'MODIFICATION':
        return [
          { value: 'RELOCATION', label: 'Relocation' },
          { value: 'UPGRADE', label: 'Upgrade' },
          { value: 'DOWNGRADE', label: 'Downgrade' }
        ];
      case 'ASSURANCE':
        return [
          { value: 'NO_SERVICE', label: 'No Service' },
          { value: 'INTERMITTENT', label: 'Intermittent' },
          { value: 'SLOW', label: 'Slow' },
          { value: 'OTHER', label: 'Other' }
        ];
      default:
        return [];
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* TBBN/Order ID */}
      <FormInput
        label="TBBN/Order ID"
        name="tbbnoId"
        value={values.tbbnoId}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.tbbnoId && errors.tbbnoId}
        placeholder="Enter TBBN or Order ID"
        icon={<FileText size={18} />}
        required
      />
      
      {/* Customer Name */}
      <FormInput
        label="Customer Name"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && errors.name}
        placeholder="Enter customer name"
        icon={<User size={18} />}
        required
      />
      
      {/* Contact Number */}
      <FormInput
        label="Contact Number"
        name="contactNo"
        value={values.contactNo}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.contactNo && errors.contactNo}
        placeholder="Enter contact number"
        icon={<Phone size={18} />}
        required
      />
      
      {/* Email */}
      <FormInput
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && errors.email}
        placeholder="Enter email address"
        icon={<Mail size={18} />}
      />
      
      {/* Address */}
      <FormInput
        label="Address"
        name="address"
        value={values.address}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.address && errors.address}
        placeholder="Enter full address"
        icon={<MapPin size={18} />}
        textarea
        rows={3}
        required
      />
      
      {/* Building */}
      <FormInput
        label="Building"
        name="buildingId"
        value={values.buildingId}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.buildingId && errors.buildingId}
        placeholder="Select building"
        icon={<Building size={18} />}
        select
        options={buildingOptions}
        required
      />
      
      {/* Order Type and Sub-Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Order Type"
          name="orderType"
          value={values.orderType}
          onChange={(e) => {
            handleChange(e);
            // Reset sub-type when type changes
            setFieldValue('orderSubType', '');
          }}
          onBlur={handleBlur}
          error={touched.orderType && errors.orderType}
          select
          options={orderTypeOptions}
          required
        />
        
        <FormInput
          label="Order Sub-Type"
          name="orderSubType"
          value={values.orderSubType}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.orderSubType && errors.orderSubType}
          select
          options={getOrderSubTypeOptions()}
        />
      </div>
      
      {/* Appointment Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Appointment Date"
          name="appointmentDate"
          type="date"
          value={values.appointmentDate}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.appointmentDate && errors.appointmentDate}
          icon={<Calendar size={18} />}
          required
        />
        
        <FormInput
          label="Appointment Time"
          name="appointmentTime"
          type="time"
          value={values.appointmentTime}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.appointmentTime && errors.appointmentTime}
          icon={<Clock size={18} />}
          required
        />
      </div>
      
      {/* Notes */}
      <FormInput
        label="Notes"
        name="notes"
        value={values.notes}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.notes && errors.notes}
        placeholder="Enter additional notes or special instructions"
        textarea
        rows={4}
      />
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !isFormValid}
          loading={isLoading || isSubmitting}
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default OrderForm;