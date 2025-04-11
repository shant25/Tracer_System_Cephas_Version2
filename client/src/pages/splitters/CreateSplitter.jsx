import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Save,
  ChevronLeft,
  Building,
  Hash,
  Layers,
  Terminal
} from 'lucide-react';
import { showSuccess, showError } from '../../utils/notification';
import { isNotEmpty } from '../../utils/validators';

/**
 * CreateSplitter Component
 * Form for creating a new splitter in the system
 */
const CreateSplitter = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    serviceId: '',
    buildingId: '',
    alias: '',
    splitterLevel: '',
    splitterNumber: '',
    splitterPort: '',
    notes: ''
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Available buildings
  const [buildings, setBuildings] = useState([]);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(true);
  
  // Fetch buildings data
  useEffect(() => {
    const fetchBuildings = async () => {
      setIsLoadingBuildings(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
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
    
    fetchBuildings();
  }, []);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
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
      
      showSuccess('Splitter created successfully');
      navigate('/splitter');
    } catch (error) {
      console.error('Error creating splitter:', error);
      showError('Failed to create splitter');
    } finally {
      setIsSubmitting(false);
    }
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
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h1 className="text-lg font-medium text-gray-900">Create New Splitter</h1>
            <p className="mt-1 text-sm text-gray-600">
              Add a new splitter to the system with its location and connection details
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
                  to="/splitter"
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="-ml-1 mr-2 h-5 w-5" />
                      Create Splitter
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

export default CreateSplitter;