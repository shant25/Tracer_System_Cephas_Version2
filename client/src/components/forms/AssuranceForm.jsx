import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, FileText, Calendar, Clock, Building, Hash, AlertTriangle, FileCheck } from 'lucide-react';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import useForm from '../../hooks/useForm';
import useCephas from '../../hooks/useCephas';
import { isValidEmail, isValidMalaysianPhone } from '../../utils/validators';

/**
 * AssuranceForm component for creating and editing assurance tickets
 * @param {Object} props - Component props
 * @param {Object} props.initialData - Initial form data
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.submitButtonText - Submit button text
 */
const AssuranceForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  submitButtonText = 'Save Assurance'
}) => {
  const { buildings, serviceInstallers } = useCephas();
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [installerOptions, setInstallerOptions] = useState([]);
  
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
  
  // Load service installer options
  useEffect(() => {
    if (serviceInstallers && serviceInstallers.length > 0) {
      const options = serviceInstallers.map(installer => ({
        value: installer.id.toString(),
        label: installer.name
      }));
      setInstallerOptions(options);
    }
  }, [serviceInstallers]);
  
  // Define validation rules
  const validationRules = {
    trbnNo: {
      required: true,
      minLength: 3,
      maxLength: 50
    },
    ticketNumber: {
      required: true,
      minLength: 5,
      maxLength: 50
    },
    awoNo: {
      minLength: 3,
      maxLength: 25
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
    recDate: {
      required: true
    }
  };
  
  // Initialize form with default values
  const defaultValues = {
    trbnNo: '',
    ticketNumber: '',
    awoNo: '',
    name: '',
    email: '',
    contactNo: '',
    address: '',
    buildingId: '',
    serviceInstallerId: '',
    appointmentDate: '',
    appointmentTime: '',
    recDate: new Date().toISOString().split('T')[0], // Today's date
    status: 'NOT_COMPLETED',
    reason: '',
    troubleshooting: '',
    remarks: '',
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
  
  // Status options
  const statusOptions = [
    { value: 'NOT_COMPLETED', label: 'Not Completed' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'RESCHEDULED', label: 'Rescheduled' }
  ];

  // Reason options for assurance tickets
  const reasonOptions = [
    { value: 'NO_INTERNET', label: 'No Internet' },
    { value: 'INTERMITTENT', label: 'Intermittent Connection' },
    { value: 'SLOW_SPEED', label: 'Slow Speed' },
    { value: 'EQUIPMENT_ISSUE', label: 'Equipment Issue' },
    { value: 'ROUTER_ISSUE', label: 'Router Issue' },
    { value: 'WIFI_ISSUE', label: 'WiFi Coverage Issue' },
    { value: 'OTHER', label: 'Other' }
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Assurance Ticket Information</h3>
        <p className="text-sm text-blue-700">
          Complete the form below to create or update an assurance ticket. Fill in all required fields marked with an asterisk (*).
        </p>
      </div>
      
      {/* Ticket Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Ticket Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TRBN Number */}
          <FormInput
            label="TRBN Number"
            name="trbnNo"
            value={values.trbnNo}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.trbnNo && errors.trbnNo}
            placeholder="Enter TRBN number"
            icon={<FileText size={18} />}
            required
          />
          
          {/* Ticket Number */}
          <FormInput
            label="Ticket Number"
            name="ticketNumber"
            value={values.ticketNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.ticketNumber && errors.ticketNumber}
            placeholder="Enter ticket number"
            icon={<Hash size={18} />}
            required
          />
          
          {/* AWO Number */}
          <FormInput
            label="AWO Number"
            name="awoNo"
            value={values.awoNo}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.awoNo && errors.awoNo}
            placeholder="Enter AWO number"
            icon={<FileCheck size={18} />}
          />
        </div>
      </div>
      
      {/* Customer Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Customer Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          {/* Address */}
          <div className="md:col-span-2">
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
          </div>
        </div>
      </div>
      
      {/* Appointment Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Appointment Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* REC Date */}
          <FormInput
            label="REC Date"
            name="recDate"
            type="date"
            value={values.recDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.recDate && errors.recDate}
            icon={<Calendar size={18} />}
            required
          />
          
          {/* Appointment Date */}
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
          
          {/* Appointment Time */}
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Service Installer */}
          <FormInput
            label="Service Installer"
            name="serviceInstallerId"
            value={values.serviceInstallerId}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.serviceInstallerId && errors.serviceInstallerId}
            placeholder="Select service installer"
            icon={<User size={18} />}
            select
            options={installerOptions}
          />
          
          {/* Status */}
          <FormInput
            label="Status"
            name="status"
            value={values.status}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.status && errors.status}
            select
            options={statusOptions}
            icon={<AlertTriangle size={18} />}
          />
        </div>
      </div>
      
      {/* Issue Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Issue Details</h3>
        
        <div className="space-y-6">
          {/* Reason */}
          <FormInput
            label="Reason for Assurance"
            name="reason"
            value={values.reason}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.reason && errors.reason}
            placeholder="Select the reason for assurance"
            select
            options={reasonOptions}
          />
          
          {/* Troubleshooting */}
          <FormInput
            label="Troubleshooting Steps"
            name="troubleshooting"
            value={values.troubleshooting}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.troubleshooting && errors.troubleshooting}
            placeholder="Enter troubleshooting steps or actions taken"
            textarea
            rows={4}
          />
          
          {/* Remarks */}
          <FormInput
            label="Remarks"
            name="remarks"
            value={values.remarks}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.remarks && errors.remarks}
            placeholder="Enter additional remarks or special instructions"
            textarea
            rows={4}
          />
        </div>
      </div>
      
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

export default AssuranceForm;