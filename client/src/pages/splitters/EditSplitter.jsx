import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Save,
  ChevronLeft,
  Building,
  Hash,
  Layers,
  Terminal,
  AlertTriangle
} from 'lucide-react';
import { showSuccess, showError } from '../../utils/notification';
import { isNotEmpty } from '../../utils/validators';

/**
 * EditSplitter Component
 * Form for editing an existing splitter in the system
 */
const EditSplitter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    serviceId: '',
    buildingId: '',
    buildingName: '',
    alias: '',
    splitterLevel: '',
    splitterNumber: '',
    splitterPort: '',
    notes: '',
    status: 'active'
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);
  
  // Available buildings
  const [buildings, setBuildings] = useState([]);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(true);
  
  // Fetch splitter data
  useEffect(() => {
    const fetchSplitter = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        // Simulate API call to get splitter data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock splitter data
        const mockSplitter = {
          id: parseInt(id),
          serviceId: 'TBBNA422113G',
          buildingId: 1,
          buildingName: 'THE WESTSIDE I',
          alias: 'Westside Tower A',
          splitterLevel: 'MDF ROOM - PARKING',
          splitterNumber: '02',
          splitterPort: '25',
          status: 'active',
          notes: 'This splitter is located near the parking entrance in the MDF room. Access requires key card level 2.'
        };
        
        setFormData(mockSplitter);
      } catch (error) {
        console.error('Error fetching splitter:', error);
        setLoadError('Failed to load splitter data. Please try again.');
        showError('Failed to load splitter data');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Fetch buildings data
    const fetchBuildings = async () => {
      setIsLoadingBuildings(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock buildings data
        const mockBuildings = [
          { id: 1, name: 'THE WESTSIDE I', type: 'Prelaid' },
          { id: 2, name: 'THE WESTSIDE II', type: 'Prelaid' },
          { id: 3, name: 'KELANA PUTERI', type: 'Non Prelaid' },
          { id: 4, name: 'KELANA IMPIAN APARTMENT', type: 'Non Prelaid' },
          { id: 5, name: 'LUMI TROPICANA', type: 'Prelaid' },
          { id: 6, name: 'TARA 33', type: 'Non Prelaid' }
        ];
        
        setBuildings(mockBuildings);
      } catch (error) {
        console.error('Error fetching buildings:', error);
        showError('Failed to load buildings data');
      } finally {
        setIsLoadingBuildings(false);
      }
    };
    
    fetchSplitter();
    fetchBuildings();
  }, [id]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If building selection changes, update the building name as well
    if (name === 'buildingId') {
      const selectedBuilding = buildings.find(b => b.id.toString() === value);
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
        buildingName: selectedBuilding ? selectedBuilding.name : ''
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!isNotEmpty(formData.serviceId)) {
      newErrors.serviceId = 'Service ID is required';
    } else if (!/^TBBNA\d{6}G$/.test(formData.serviceId)) {
      newErrors.serviceId = 'Service ID must be in format TBBNA######G';
    }
    
    if (!isNotEmpty(formData.buildingId)) {
      newErrors.buildingId = 'Building is required';
    }
    
    if (!isNotEmpty(formData.splitterLevel)) {
      newErrors.splitterLevel = 'Splitter level is required';
    }
    
    if (!isNotEmpty(formData.splitterNumber)) {
      newErrors.splitterNumber = 'Splitter number is required';
    }
    
    if (!isNotEmpty(formData.splitterPort)) {
      newErrors.splitterPort = 'Splitter port is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('Splitter updated successfully');
      navigate(`/splitter/${id}`);
    } catch (error) {
      console.error('Error updating splitter:', error);
      showError('Failed to update splitter');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
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
          
          <div className="bg-white shadow rounded-lg p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (loadError) {
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
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{loadError}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
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
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h1 className="text-lg font-medium text-gray-900">Edit Splitter</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update splitter information and connection details
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              {/* Service ID */}
              <div className="sm:col-span-2">
                <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700">
                  Service ID <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Terminal className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="serviceId"
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    className={`block w-full pl-10 sm:text-sm rounded-md py-2 px-3 shadow-sm ${
                      errors.serviceId
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                    }`}
                    placeholder="TBBNA######G"
                  />
                </div>
                {errors.serviceId && (
                  <p className="mt-2 text-sm text-red-600">{errors.serviceId}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Format: TBBNA followed by 6 digits and G (e.g., TBBNA123456G)
                </p>
              </div>
              
              {/* Building */}
              <div className="sm:col-span-2">
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
                    value={formData.buildingId}
                    onChange={handleChange}
                    className={`block w-full pl-10 sm:text-sm rounded-md py-2 px-3 shadow-sm ${
                      errors.buildingId
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                    }`}
                    disabled={isLoadingBuildings}
                  >
                    <option value="">Select Building</option>
                    {buildings.map(building => (
                      <option key={building.id} value={building.id}>
                        {building.name} ({building.type})
                      </option>
                    ))}
                  </select>
                </div>
                {errors.buildingId && (
                  <p className="mt-2 text-sm text-red-600">{errors.buildingId}</p>
                )}
              </div>
              
              {/* Building Alias */}
              <div className="sm:col-span-2">
                <label htmlFor="alias" className="block text-sm font-medium text-gray-700">
                  Building Alias
                </label>
                <input
                  type="text"
                  id="alias"
                  name="alias"
                  value={formData.alias}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm rounded-md py-2 px-3 border-gray-300 focus:ring-green-500 focus:border-green-500"
                  placeholder="Optional identifier (e.g., Block A, Tower 1)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  An optional name or identifier for this specific building or section
                </p>
              </div>
              
              {/* Splitter Information */}
              <div className="sm:col-span-2">
                <h3 className="text-base font-medium text-gray-700 mb-3">Splitter Information</h3>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                  {/* Splitter Level */}
                  <div>
                    <label htmlFor="splitterLevel" className="block text-sm font-medium text-gray-700">
                      Splitter Level <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Layers className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="splitterLevel"
                        name="splitterLevel"
                        value={formData.splitterLevel}
                        onChange={handleChange}
                        className={`block w-full pl-10 sm:text-sm rounded-md py-2 px-3 shadow-sm ${
                          errors.splitterLevel
                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                        }`}
                        placeholder="e.g., 5 or 'MDF ROOM'"
                      />
                    </div>
                    {errors.splitterLevel && (
                      <p className="mt-2 text-sm text-red-600">{errors.splitterLevel}</p>
                    )}
                  </div>
                  
                  {/* Splitter Number */}
                  <div>
                    <label htmlFor="splitterNumber" className="block text-sm font-medium text-gray-700">
                      Splitter Number <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Hash className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="splitterNumber"
                        name="splitterNumber"
                        value={formData.splitterNumber}
                        onChange={handleChange}
                        className={`block w-full pl-10 sm:text-sm rounded-md py-2 px-3 shadow-sm ${
                          errors.splitterNumber
                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                        }`}
                        placeholder="e.g., 01"
                      />
                    </div>
                    {errors.splitterNumber && (
                      <p className="mt-2 text-sm text-red-600">{errors.splitterNumber}</p>
                    )}
                  </div>
                  
                  {/* Splitter Port */}
                  <div>
                    <label htmlFor="splitterPort" className="block text-sm font-medium text-gray-700">
                      Splitter Port <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Hash className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="splitterPort"
                        name="splitterPort"
                        value={formData.splitterPort}
                        onChange={handleChange}
                        className={`block w-full pl-10 sm:text-sm rounded-md py-2 px-3 shadow-sm ${
                          errors.splitterPort
                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                        }`}
                        placeholder="e.g., 25"
                      />
                    </div>
                    {errors.splitterPort && (
                      <p className="mt-2 text-sm text-red-600">{errors.splitterPort}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Status */}
              <div className="sm:col-span-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              {/* Notes */}
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm rounded-md py-2 px-3 border border-gray-300 focus:ring-green-500 focus:border-green-500"
                  placeholder="Any additional information about this splitter"
                ></textarea>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-5">
              <div className="flex justify-end">
                <Link
                  to={`/splitter/${id}`}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="-ml-1 mr-2 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSplitter;