import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Edit, 
  Trash2, 
  Clock, 
  MapPin, 
  Hash, 
  Info, 
  AlertTriangle,
  Terminal
} from 'lucide-react';
import { showConfirmation, showSuccess, showError } from '../../utils/notification';

/**
 * SplitterDetail Component
 * Displays detailed information about a specific splitter
 */
const SplitterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [splitter, setSplitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch splitter data
  useEffect(() => {
    const fetchSplitter = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock splitter data based on ID
        // In a real app, you would fetch this from your API
        const mockSplitter = {
          id: parseInt(id),
          serviceId: 'TBBNA422113G',
          buildingName: 'THE WESTSIDE I',
          buildingType: 'Prelaid',
          alias: 'Westside Tower A',
          splitterLevel: 'MDF ROOM - PARKING',
          splitterNumber: '02',
          splitterPort: '25',
          status: 'active',
          createdAt: '2025-01-15T08:30:00Z',
          updatedAt: '2025-04-01T14:25:00Z',
          lastUpdatedBy: 'Admin User',
          notes: 'This splitter is located near the parking entrance in the MDF room. Access requires key card level 2.',
          assignedCustomers: [
            {
              id: 101,
              name: 'John Smith',
              address: 'Unit 12A, Level 12',
              phoneNumber: '+60123456789',
              serviceActive: true
            },
            {
              id: 102,
              name: 'Sarah Johnson',
              address: 'Unit 15B, Level 15',
              phoneNumber: '+60187654321',
              serviceActive: true
            }
          ]
        };
        
        setSplitter(mockSplitter);
      } catch (err) {
        console.error('Error fetching splitter:', err);
        setError('Failed to load splitter details. Please try again.');
        showError('Failed to load splitter details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSplitter();
  }, [id]);
  
  // Handle delete splitter
  const handleDelete = () => {
    showConfirmation(
      'Are you sure you want to delete this splitter? This action cannot be undone.',
      () => {
        // Simulate API call
        setTimeout(() => {
          showSuccess('Splitter deleted successfully');
          navigate('/splitter');
        }, 1000);
      }
    );
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/splitter" 
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Splitter List
          </Link>
        </div>
        
        {loading ? (
          <div className="bg-white shadow rounded-lg p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : splitter ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h1 className="text-lg font-medium text-gray-900">
                  Splitter Details
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Service ID: {splitter.serviceId}
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/splitter/${id}/edit`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Edit className="-ml-0.5 mr-2 h-4 w-4" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="-ml-0.5 mr-2 h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Status:</span>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  splitter.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {splitter.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            {/* Content */}
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                {/* Building Information */}
                <div className="sm:col-span-2">
                  <h3 className="text-base font-medium text-gray-900 mb-3">Building Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          Building Name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{splitter.buildingName}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Building Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">{splitter.buildingType}</dd>
                      </div>
                      
                      {splitter.alias && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Building Alias</dt>
                          <dd className="mt-1 text-sm text-gray-900">{splitter.alias}</dd>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Splitter Location */}
                <div className="sm:col-span-2">
                  <h3 className="text-base font-medium text-gray-900 mb-3">Splitter Location</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          Level
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{splitter.splitterLevel}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Hash className="h-4 w-4 mr-1 text-gray-400" />
                          Splitter Number
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{splitter.splitterNumber}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Terminal className="h-4 w-4 mr-1 text-gray-400" />
                          Port
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{splitter.splitterPort}</dd>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Notes */}
                {splitter.notes && (
                  <div className="sm:col-span-2">
                    <h3 className="text-base font-medium text-gray-900 mb-3">Notes</h3>
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Info className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-700">{splitter.notes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Assigned Customers */}
                <div className="sm:col-span-2">
                  <h3 className="text-base font-medium text-gray-900 mb-3">Assigned Customers</h3>
                  {splitter.assignedCustomers && splitter.assignedCustomers.length > 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Address
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contact
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {splitter.assignedCustomers.map((customer) => (
                            <tr key={customer.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{customer.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{customer.address}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{customer.phoneNumber}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  customer.serviceActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {customer.serviceActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm text-gray-500">
                      No customers are currently assigned to this splitter.
                    </div>
                  )}
                </div>
                
                {/* Audit Information */}
                <div className="sm:col-span-2">
                  <h3 className="text-base font-medium text-gray-900 mb-3">Audit Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          Created At
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(splitter.createdAt)}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          Last Updated
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(splitter.updatedAt)}</dd>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Last Updated By</dt>
                        <dd className="mt-1 text-sm text-gray-900">{splitter.lastUpdatedBy}</dd>
                      </div>
                    </div>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Splitter not found</h3>
              <p className="mt-1 text-sm text-gray-500">
                The splitter you are looking for does not exist or has been removed.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplitterDetail;