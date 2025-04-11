import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Info,
  Clock,
  Building,
  AlertTriangle
} from 'lucide-react';

import useCephas from '../../hooks/useCephas';
import useForm from '../../hooks/useForm';
import OrderService from '../../services/order.service';
import BuildingService from '../../services/building.service';
import { showSuccess, showError } from '../../utils/notification';
import { validateForm } from '../../utils/validators';
import { hasActionPermission } from '../../utils/accessControl';

/**
 * Edit Order Component
 * Form for editing existing orders in the system
 */
const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCephas();
  
  // State for data loading
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // State for buildings list
  const [buildings, setBuildings] = useState([]);
  const [buildingsLoading, setBuildingsLoading] = useState(true);
  
  // Order types
  const orderTypes = [
    { value: 'ACTIVATION', label: 'Activation' },
    { value: 'MODIFICATION', label: 'Modification' },
    { value: 'ASSURANCE', label: 'Assurance' }
  ];
  
  // Order sub-types - dynamic based on selected type
  const [orderSubTypes, setOrderSubTypes] = useState([]);
  
  // Form initial values
  const initialValues = {
    tbbnoId: '',
    name: '',
    email: '',
    contactNo: '',
    address: '',
    buildingId: '',
    orderType: 'ACTIVATION',
    orderSubType: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
    priority: 'NORMAL'
  };
  
  // Form validation rules
  const validationRules = {
    tbbnoId: { required: true },
    name: { required: true },
    contactNo: { required: true },
    address: { required: true },
    buildingId: { required: true },
    orderType: { required: true },
    appointmentDate: { required: true }
  };
  
  // Initialize form with useForm hook
  const { values, errors, handleChange, handleSubmit, setFieldValue, setValues } = useForm(
    initialValues,
    handleUpdateOrder,
    validationRules
  );
  
  // Check authorization on component mount
  useEffect(() => {
    if (!hasActionPermission(currentUser?.role, 'edit_order')) {
      showError('You do not have permission to edit orders');
      navigate('/order');
    } else {
      fetchOrderData();
      fetchBuildings();
    }
  }, [id, currentUser]);
  
  // Update sub-types when order type changes
  useEffect(() => {
    updateOrderSubTypes(values.orderType);
  }, [values.orderType]);
  
  // Fetch order data from API
  const fetchOrderData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await OrderService.getOrderById(id);
      
      if (response.success) {
        const orderData = response.data;
        
        // Format appointment date and time for form
        let appointmentDate = '';
        let appointmentTime = '';
        
        if (orderData.appointmentDate) {
          const appointmentDateTime = new Date(orderData.appointmentDate);
          appointmentDate = appointmentDateTime.toISOString().split('T')[0];
          
          // Format time as HH:MM
          const hours = String(appointmentDateTime.getHours()).padStart(2, '0');
          const minutes = String(appointmentDateTime.getMinutes()).padStart(2, '0');
          appointmentTime = `${hours}:${minutes}`;
        }
        
        // Set form values
        setValues({
          tbbnoId: orderData.tbbnoId || '',
          name: orderData.name || '',
          email: orderData.email || '',
          contactNo: orderData.contactNo || '',
          address: orderData.address || '',
          buildingId: orderData.buildingId || '',
          orderType: orderData.orderType || 'ACTIVATION',
          orderSubType: orderData.orderSubType || '',
          appointmentDate,
          appointmentTime,
          notes: orderData.notes || '',
          priority: orderData.priority || 'NORMAL'
        });
        
        // Update order sub-types based on the loaded order type
        updateOrderSubTypes(orderData.orderType);
      } else {
        setError(response.message || 'Failed to fetch order details');
      }
    } catch (err) {
      setError('An error occurred while fetching order details');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch buildings list from API
  const fetchBuildings = async () => {
    setBuildingsLoading(true);
    try {
      const response = await BuildingService.getAllBuildings();
      if (response.success) {
        setBuildings(response.data || []);
      } else {
        showError('Failed to load buildings');
      }
    } catch (error) {
      console.error('Error fetching buildings:', error);
      showError('An error occurred while loading buildings');
    } finally {
      setBuildingsLoading(false);
    }
  };
  
  // Update order sub-types based on selected order type
  const updateOrderSubTypes = (orderType) => {
    switch (orderType) {
      case 'ACTIVATION':
        setOrderSubTypes([
          { value: 'NEW', label: 'New Activation' },
          { value: 'RESCHEDULE', label: 'Reschedule' },
          { value: 'PRELAID', label: 'Prelaid' }
        ]);
        break;
      case 'MODIFICATION':
        setOrderSubTypes([
          { value: 'RELOCATION', label: 'Relocation' },
          { value: 'UPGRADE', label: 'Upgrade' },
          { value: 'DOWNGRADE', label: 'Downgrade' }
        ]);
        break;
      case 'ASSURANCE':
        setOrderSubTypes([
          { value: 'REPAIR', label: 'Repair' },
          { value: 'MAINTENANCE', label: 'Maintenance' },
          { value: 'COMPLAINT', label: 'Complaint' }
        ]);
        break;
      default:
        setOrderSubTypes([]);
    }
  };
  
  // Handle form submission
  async function handleUpdateOrder() {
    setSubmitting(true);
    
    try {
      // Combine date and time for appointment
      const appointmentDateTime = values.appointmentDate && values.appointmentTime
        ? `${values.appointmentDate}T${values.appointmentTime}`
        : values.appointmentDate;
      
      // Prepare order data
      const orderData = {
        ...values,
        appointmentDate: appointmentDateTime,
        updatedBy: currentUser.id
      };
      
      // Remove appointmentTime as it's combined into appointmentDate
      delete orderData.appointmentTime;
      
      // Update order through service
      const response = await OrderService.updateOrder(id, orderData);
      
      if (response.success) {
        showSuccess('Order updated successfully');
        navigate(`/order/${id}/detail`);
      } else {
        showError(response.message || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      showError('An error occurred while updating the order');
    } finally {
      setSubmitting(false);
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading order data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Order</h3>
          <p className="text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/order')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 mr-2"
            >
              Back to Orders
            </button>
            <button
              onClick={fetchOrderData}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Order</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => navigate(`/order/${id}/detail`)}
        >
          <ArrowLeft className="h-5 w-5 mr-2 text-gray-500" />
          Back to Order Details
        </button>
      </div>
      
      {/* Order Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Order Information</h3>
          <p className="mt-1 text-sm text-gray-500">
            Update the order details
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* TBBN ID Field */}
              <div>
                <label htmlFor="tbbnoId" className="block text-sm font-medium text-gray-700">
                  TBBN ID <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="tbbnoId"
                    name="tbbnoId"
                    value={values.tbbnoId}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.tbbnoId ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="e.g., TBBNB8358G"
                  />
                </div>
                {errors.tbbnoId && (
                  <p className="mt-1 text-sm text-red-600">{errors.tbbnoId}</p>
                )}
              </div>
              
              {/* Customer Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Customer Name <span className="text-red-500">*</span>
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
                    placeholder="Full customer name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
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
                    placeholder="customer@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              {/* Building Field */}
              <div>
                <label htmlFor="buildingId" className="block text-sm font-medium text-gray-700">
                  Building <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="buildingId"
                    name="buildingId"
                    value={values.buildingId}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.buildingId ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    disabled={buildingsLoading}
                  >
                    <option value="">Select Building</option>
                    {buildings.map(building => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.buildingId && (
                  <p className="mt-1 text-sm text-red-600">{errors.buildingId}</p>
                )}
              </div>
              
              {/* Address Field */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Full Address <span className="text-red-500">*</span>
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
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Full installation address"
                  ></textarea>
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Order Type Field */}
              <div>
                <label htmlFor="orderType" className="block text-sm font-medium text-gray-700">
                  Order Type <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="orderType"
                    name="orderType"
                    value={values.orderType}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.orderType ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  >
                    {orderTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.orderType && (
                  <p className="mt-1 text-sm text-red-600">{errors.orderType}</p>
                )}
              </div>
              
              {/* Order Sub-Type Field */}
              <div>
                <label htmlFor="orderSubType" className="block text-sm font-medium text-gray-700">
                  Order Sub-Type
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="orderSubType"
                    name="orderSubType"
                    value={values.orderSubType}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.orderSubType ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Select Sub-Type</option>
                    {orderSubTypes.map(subType => (
                      <option key={subType.value} value={subType.value}>
                        {subType.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.orderSubType && (
                  <p className="mt-1 text-sm text-red-600">{errors.orderSubType}</p>
                )}
              </div>
              
              {/* Appointment Date & Time Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                    Appointment Date <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="appointmentDate"
                      name="appointmentDate"
                      value={values.appointmentDate}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.appointmentDate ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  {errors.appointmentDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">
                    Appointment Time
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      id="appointmentTime"
                      name="appointmentTime"
                      value={values.appointmentTime}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.appointmentTime ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  {errors.appointmentTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.appointmentTime}</p>
                  )}
                </div>
              </div>
              
              {/* Priority Field */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="priority"
                    name="priority"
                    value={values.priority}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
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
                    placeholder="Any special instructions or details about the order..."
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
              onClick={() => navigate(`/order/${id}/detail`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Save className="h-5 w-5 mr-2" />
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrder;