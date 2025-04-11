import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
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
  Download,
  Upload,
  FileText as FileIcon,
  AlertTriangle,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import useCephas from '../../hooks/useCephas';
import OrderService from '../../services/order.service';
import ServiceInstallerService from '../../services/serviceInstaller.service';
import { showSuccess, showError } from '../../utils/notification';
import { hasActionPermission } from '../../utils/accessControl';
import { truncateText, formatFileSize } from '../../utils/formatters';

/**
 * Order Detail Component
 * Displays detailed information for a specific order
 */
const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCephas();
  
  // State for order data
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for service installers (for assignment)
  const [serviceInstallers, setServiceInstallers] = useState([]);
  const [selectedInstaller, setSelectedInstaller] = useState('');
  const [assigningInstaller, setAssigningInstaller] = useState(false);
  
  // State for document upload
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentType, setDocumentType] = useState('CONTRACT');
  
  // State for status management
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  
  // State for UI accordions
  const [historyOpen, setHistoryOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  
  // Document types for the upload form
  const documentTypes = [
    { value: 'CONTRACT', label: 'Contract Document' },
    { value: 'INVOICE', label: 'Invoice' },
    { value: 'PICTURE', label: 'Installation Picture' },
    { value: 'TECHNICAL', label: 'Technical Document' },
    { value: 'OTHER', label: 'Other Document' }
  ];

  // Status options
  const statusOptions = [
    { value: 'PENDING', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
    { value: 'ASSIGNED', label: 'Assigned', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'ON_HOLD', label: 'On Hold', color: 'bg-purple-100 text-purple-800' }
  ];

  // Fetch order data on component mount
  useEffect(() => {
    fetchOrderData();
  }, [id]);
  
  // Fetch service installers when assigning
  useEffect(() => {
    if (assigningInstaller) {
      fetchServiceInstallers();
    }
  }, [assigningInstaller]);
  
  // Reset status form when order changes
  useEffect(() => {
    if (order) {
      setNewStatus(order.status || 'PENDING');
    }
  }, [order]);

  // Function to fetch order data
  const fetchOrderData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await OrderService.getOrderById(id);
      
      if (response.success) {
        setOrder(response.data);
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
  
  // Function to fetch service installers
  const fetchServiceInstallers = async () => {
    try {
      const response = await ServiceInstallerService.getAllServiceInstallers();
      
      if (response.success) {
        setServiceInstallers(response.data || []);
      } else {
        showError('Failed to load service installers');
      }
    } catch (err) {
      console.error('Error fetching service installers:', err);
      showError('An error occurred while loading service installers');
    }
  };
  
  // Function to assign installer to order
  const handleAssignInstaller = async () => {
    if (!selectedInstaller) {
      showError('Please select a service installer');
      return;
    }
    
    setAssigningInstaller(true);
    
    try {
      const response = await OrderService.assignInstaller(id, selectedInstaller);
      
      if (response.success) {
        showSuccess('Service installer assigned successfully');
        // Refresh order data
        fetchOrderData();
        // Reset assignment form
        setSelectedInstaller('');
        setAssigningInstaller(false);
      } else {
        showError(response.message || 'Failed to assign service installer');
      }
    } catch (err) {
      console.error('Error assigning installer:', err);
      showError('An error occurred while assigning the service installer');
    } finally {
      setAssigningInstaller(false);
    }
  };
  
  // Function to handle document upload
  const handleDocumentUpload = async (e) => {
    e.preventDefault();
    
    if (!documentFile) {
      showError('Please select a file to upload');
      return;
    }
    
    setUploadingDocument(true);
    
    try {
      const response = await OrderService.uploadOrderDocument(id, documentFile, documentType);
      
      if (response.success) {
        showSuccess('Document uploaded successfully');
        // Refresh order data to get updated documents list
        fetchOrderData();
        // Reset upload form
        setDocumentFile(null);
        setDocumentType('CONTRACT');
      } else {
        showError(response.message || 'Failed to upload document');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      showError('An error occurred while uploading the document');
    } finally {
      setUploadingDocument(false);
    }
  };
  
  // Function to update order status
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    
    if (newStatus === order.status) {
      showError('Please select a different status');
      return;
    }
    
    setUpdatingStatus(true);
    
    try {
      const response = await OrderService.updateOrderStatus(id, newStatus, { note: statusNote });
      
      if (response.success) {
        showSuccess('Order status updated successfully');
        // Refresh order data
        fetchOrderData();
        // Reset status form
        setStatusNote('');
      } else {
        showError(response.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showError('An error occurred while updating the order status');
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  // Get status color based on status value
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading order details...</p>
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

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Order Not Found</h3>
          <p className="text-gray-500">The requested order could not be found</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/order')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <button
            onClick={() => navigate('/order')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-sm text-gray-500">
              {order.orderType} | TBBN ID: {order.tbbnoId}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Edit button - shown only for authorized users and non-completed orders */}
          {hasActionPermission(currentUser?.role, 'edit_order') && 
            order.status !== 'COMPLETED' && (
            <Link 
              to={`/order/${id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              <Edit className="h-5 w-5 mr-2" />
              Edit Order
            </Link>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Order Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Order details and customer information
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Status */}
              <div className="col-span-1 md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </dd>
              </div>
              
              {/* Customer Name */}
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  Customer Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{order.name}</dd>
              </div>
              
              {/* Contact Number */}
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Phone className="h-4 w-4 mr-1 text-gray-400" />
                  Contact Number
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{order.contactNo || 'N/A'}</dd>
              </div>
              
              {/* Email */}
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-gray-400" />
                  Email Address
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{order.email || 'N/A'}</dd>
              </div>
              
              {/* TBBN ID */}
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Tag className="h-4 w-4 mr-1 text-gray-400" />
                  TBBN ID
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{order.tbbnoId}</dd>
              </div>
              
              {/* Order Type */}
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-gray-400" />
                  Order Type
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{order.orderType}</dd>
              </div>
              
              {/* Order Sub-Type */}
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Info className="h-4 w-4 mr-1 text-gray-400" />
                  Order Sub-Type
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{order.orderSubType || 'N/A'}</dd>
              </div>
              
              {/* Appointment Date */}
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  Appointment Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(order.appointmentDate)}</dd>
              </div>
              
              {/* Priority */}
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-gray-400" />
                  Priority
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{order.priority || 'NORMAL'}</dd>
              </div>
              
              {/* Building */}
              <div className="col-span-1 md:col-span-2">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Building className="h-4 w-4 mr-1 text-gray-400" />
                  Building
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{order.building?.name || 'N/A'}</dd>
              </div>
              
              {/* Address */}
              <div className="col-span-1 md:col-span-2">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  Address
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{order.address}</dd>
              </div>
              
              {/* Notes */}
              {order.notes && (
                <div className="col-span-1 md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{order.notes}</dd>
                </div>
              )}
              
              {/* Service Installer */}
              {order.serviceInstaller && (
                <div className="col-span-1 md:col-span-2 mt-4 p-4 bg-blue-50 rounded-md">
                  <dt className="text-sm font-medium text-gray-700 flex items-center">
                    <Users className="h-5 w-5 mr-1 text-blue-500" />
                    Assigned Service Installer
                  </dt>
                  <dd className="mt-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{order.serviceInstaller.name}</div>
                        <div className="text-sm text-gray-500">{order.serviceInstaller.contactNo}</div>
                        <div className="text-xs text-gray-400">Assigned on: {formatDate(order.serviceInstaller.assignedAt)}</div>
                      </div>
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        
        {/* Order Actions and Status */}
        <div className="space-y-6">
          {/* Status Update Form - shown only for authorized users */}
          {hasActionPermission(currentUser?.role, 'change_status') && 
            order.status !== 'COMPLETED' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Update Status</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleStatusUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700">
                        New Status
                      </label>
                      <select
                        id="newStatus"
                        name="newStatus"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="statusNote" className="block text-sm font-medium text-gray-700">
                        Status Note
                      </label>
                      <textarea
                        id="statusNote"
                        name="statusNote"
                        rows="3"
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Add a note about this status change..."
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={updatingStatus}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        updatingStatus ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {updatingStatus ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Assign Installer Form - shown only for authorized users */}
          {hasActionPermission(currentUser?.role, 'assign_job') && 
            (order.status === 'PENDING' || order.status === 'ASSIGNED') && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {order.serviceInstaller ? 'Reassign Installer' : 'Assign Installer'}
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="selectedInstaller" className="block text-sm font-medium text-gray-700">
                      Select Service Installer
                    </label>
                    <select
                      id="selectedInstaller"
                      name="selectedInstaller"
                      value={selectedInstaller}
                      onChange={(e) => setSelectedInstaller(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select an installer</option>
                      {serviceInstallers.map(installer => (
                        <option key={installer.id} value={installer.id}>
                          {installer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAssignInstaller}
                    disabled={assigningInstaller || !selectedInstaller}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                      assigningInstaller || !selectedInstaller ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <Users className="h-5 w-5 mr-2" />
                    {assigningInstaller ? 'Assigning...' : order.serviceInstaller ? 'Reassign' : 'Assign Installer'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Document Upload Form */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Document</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleDocumentUpload} className="space-y-4">
                <div>
                  <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
                    Document Type
                  </label>
                  <select
                    id="documentType"
                    name="documentType"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {documentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="documentFile" className="block text-sm font-medium text-gray-700">
                    Select File
                  </label>
                  <input
                    type="file"
                    id="documentFile"
                    name="documentFile"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {documentFile && (
                    <p className="mt-1 text-xs text-gray-500">
                      Selected: {documentFile.name} ({formatFileSize(documentFile.size)})
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={uploadingDocument || !documentFile}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    uploadingDocument || !documentFile ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  {uploadingDocument ? 'Uploading...' : 'Upload Document'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order History */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div 
          className="px-4 py-5 sm:px-6 border-b flex justify-between items-center cursor-pointer"
          onClick={() => setHistoryOpen(!historyOpen)}
        >
          <h3 className="text-lg leading-6 font-medium text-gray-900">Order History</h3>
          <button className="text-gray-500">
            {historyOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
        
        {historyOpen && (
          <div className="px-4 py-5 sm:p-6">
            {order.history && order.history.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {order.history.map((event, eventIdx) => (
                    <li key={event.id || eventIdx}>
                      <div className="relative pb-8">
                        {eventIdx !== order.history.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <Clock className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {event.action} 
                                <span className="font-medium text-gray-900"> {event.details}</span>
                              </p>
                              {event.note && (
                                <p className="mt-1 text-sm text-gray-500">{event.note}</p>
                              )}
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time dateTime={event.timestamp}>{formatDate(event.timestamp)}</time>
                              <div className="text-xs">{event.user || 'System'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No history records available</div>
            )}
          </div>
        )}
      </div>
      
      {/* Documents */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div 
          className="px-4 py-5 sm:px-6 border-b flex justify-between items-center cursor-pointer"
          onClick={() => setDocumentsOpen(!documentsOpen)}
        >
          <h3 className="text-lg leading-6 font-medium text-gray-900">Documents</h3>
          <button className="text-gray-500">
            {documentsOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
        
        {documentsOpen && (
          <div className="px-4 py-5 sm:p-6">
            {order.documents && order.documents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {order.documents.map((document) => (
                  <li key={document.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FileIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{document.name}</p>
                        <p className="text-sm text-gray-500">
                          {document.type} • {formatFileSize(document.size)} • 
                          Uploaded: {formatDate(document.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-gray-500">No documents available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;