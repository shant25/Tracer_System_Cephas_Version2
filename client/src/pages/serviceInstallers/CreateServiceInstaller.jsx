import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  Tag, 
  Tool,
  Truck,
  CreditCard,
  Home
} from 'lucide-react';

import useCephas from '../../hooks/useCephas';
import useForm from '../../hooks/useForm';
import ServiceInstallerService from '../../services/serviceInstaller.service';
import { showSuccess, showError } from '../../utils/notification';
import { validateForm, isValidEmail, isValidMalaysianPhone } from '../../utils/validators';
import { hasActionPermission } from '../../utils/accessControl';

/**
 * Create Service Installer Component
 * Form for creating new service installers in the system
 */
const CreateServiceInstaller = () => {
  const navigate = useNavigate();
  const { currentUser } = useCephas();
  
  // State for data
  const [loading, setLoading] = useState(false);
  
  // Form initial values
  const initialValues = {
    name: '',
    alias: '',
    email: '',
    contactNo: '',
    alternateContactNo: '',
    address: '',
    identificationNo: '',
    specialization: 'GENERAL',
    transportMode: 'OWN_TRANSPORT',
    area: '',
    taxId: '',
    bankName: '',
    bankAccountNo: '',
    emergencyContactName: '',
    emergencyContactNo: '',
    notes: '',
    status: 'ACTIVE'
  };
  
  // Form validation rules
  const validationRules = {
    name: { required: true },
    contactNo: { 
      required: true,
      custom: (value) => !value || !isValidMalaysianPhone(value) ? 'Invalid Malaysian phone number' : null
    },
    email: { 
      required: false,
      custom: (value) => value && !isValidEmail(value) ? 'Invalid email format' : null
    },
    identificationNo: { required: true },
    bankName: { required: true },
    bankAccountNo: { required: true }
  };
  
  // Initialize form with useForm hook
  const { values, errors, handleChange, handleSubmit, setFieldValue } = useForm(
    initialValues,
    handleCreateServiceInstaller,
    validationRules
  );
  
  // Specialization options
  const specializationOptions = [
    { value: 'GENERAL', label: 'General Installation' },
    { value: 'FIBER', label: 'Fiber Optics' },
    { value: 'HARDWARE', label: 'Hardware Installation' },
    { value: 'NETWORK', label: 'Network Configuration' },
    { value: 'TROUBLESHOOTING', label: 'Troubleshooting' }
  ];
  
  // Transport mode options
  const transportModeOptions = [
    { value: 'OWN_TRANSPORT', label: 'Own Transport' },
    { value: 'COMPANY_VEHICLE', label: 'Company Vehicle' },
    { value: 'PUBLIC_TRANSPORT', label: 'Public Transport' },
    { value: 'OTHER', label: 'Other' }
  ];
  
  // Status options
  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' }
  ];
  
  // Check authorization on component mount
  useEffect(() => {
    if (!hasActionPermission(currentUser?.role, 'create_service_installer')) {
      showError('You do not have permission to create service installers');
      navigate('/service-installer');
    }
  }, [currentUser, navigate]);
  
  // Handle form submission
  async function handleCreateServiceInstaller() {
    setLoading(true);
    
    try {
      // Prepare service installer data
      const installerData = {
        ...values,
        createdBy: currentUser.id
      };
      
      // Create service installer through service
      const response = await ServiceInstallerService.createServiceInstaller(installerData);
      
      if (response.success) {
        showSuccess('Service installer created successfully');
        navigate('/service-installer');
      } else {
        showError(response.message || 'Failed to create service installer');
      }
    } catch (error) {
      console.error('Error creating service installer:', error);
      showError('An error occurred while creating the service installer');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Service Installer</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => navigate('/service-installer')}
        >
          <ArrowLeft className="h-5 w-5 mr-2 text-gray-500" />
          Back to Service Installers
        </button>
      </div>
      
      {/* Service Installer Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Service Installer Information</h3>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the details to create a new service installer
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Full name of service installer"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              {/* Alias Field */}
              <div>
                <label htmlFor="alias" className="block text-sm font-medium text-gray-700">
                  Alias / Nickname
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="alias"
                    name="alias"
                    value={values.alias}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nickname or alias (if any)"
                  />
                </div>
              </div>
              
              {/* Contact Number Field */}
              <div>
                <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="contactNo"
                    name="contactNo"
                    value={values.contactNo}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.contactNo ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="e.g., 0123456789"
                  />
                </div>
                {errors.contactNo && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactNo}</p>
                )}
              </div>
              
              {/* Alternate Contact Number Field */}
              <div>
                <label htmlFor="alternateContactNo" className="block text-sm font-medium text-gray-700">
                  Alternate Contact Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="alternateContactNo"
                    name="alternateContactNo"
                    value={values.alternateContactNo}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Alternative phone number (if any)"
                  />
                </div>
              </div>
              
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Email address (if available)"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              {/* Identification Number Field */}
              <div>
                <label htmlFor="identificationNo" className="block text-sm font-medium text-gray-700">
                  Identification Number <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="identificationNo"
                    name="identificationNo"
                    value={values.identificationNo}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.identificationNo ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="IC or other identification number"
                  />
                </div>
                {errors.identificationNo && (
                  <p className="mt-1 text-sm text-red-600">{errors.identificationNo}</p>
                )}
              </div>
              
              {/* Address Field */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    value={values.address}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Residential address"
                  ></textarea>
                </div>
              </div>
              
              {/* Area Field */}
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                  Service Area
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={values.area}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Area of service (e.g., Kuala Lumpur, Klang Valley)"
                  />
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Specialization Field */}
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                  Specialization
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tool className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="specialization"
                    name="specialization"
                    value={values.specialization}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {specializationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Transport Mode Field */}
              <div>
                <label htmlFor="transportMode" className="block text-sm font-medium text-gray-700">
                  Transport Mode
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Truck className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="transportMode"
                    name="transportMode"
                    value={values.transportMode}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {transportModeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Bank Name Field */}
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={values.bankName}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.bankName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Bank name"
                  />
                </div>
                {errors.bankName && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
                )}
              </div>
              
              {/* Bank Account Number Field */}
              <div>
                <label htmlFor="bankAccountNo" className="block text-sm font-medium text-gray-700">
                  Bank Account Number <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="bankAccountNo"
                    name="bankAccountNo"
                    value={values.bankAccountNo}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.bankAccountNo ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Bank account number"
                  />
                </div>
                {errors.bankAccountNo && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankAccountNo}</p>
                )}
              </div>
              
              {/* Tax ID Field */}
              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">
                  Tax ID
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="taxId"
                    name="taxId"
                    value={values.taxId}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tax identification number (if applicable)"
                  />
                </div>
              </div>
              
              {/* Emergency Contact Name Field */}
              <div>
                <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700">
                  Emergency Contact Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={values.emergencyContactName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Emergency contact person"
                  />
                </div>
              </div>
              
              {/* Emergency Contact Number Field */}
              <div>
                <label htmlFor="emergencyContactNo" className="block text-sm font-medium text-gray-700">
                  Emergency Contact Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="emergencyContactNo"
                    name="emergencyContactNo"
                    value={values.emergencyContactNo}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Emergency contact number"
                  />
                </div>
              </div>
              
              {/* Status Field */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <select
                    id="status"
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Notes Field */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    name="notes"
                    rows="4"
                    value={values.notes}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information about the service installer..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => navigate('/service-installer')}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Save className="h-5 w-5 mr-2" />
              {loading ? 'Creating...' : 'Create Service Installer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServiceInstaller;