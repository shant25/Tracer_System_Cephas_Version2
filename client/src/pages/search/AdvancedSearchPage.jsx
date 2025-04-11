import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search as SearchIcon,
  FileText,
  Building,
  User,
  Package,
  Sliders,
  Calendar,
  Tag,
  MapPin,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  Save,
  Download
} from 'lucide-react';

import useCephas from '../../hooks/useCephas';
import { truncateText } from '../../utils/formatters';

/**
 * Advanced Search Page Component
 * Provides detailed search with multiple filters across different entities
 */
const AdvancedSearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useCephas();
  
  // Get search query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category') || 'all';
  
  // Search form state
  const [formState, setFormState] = useState({
    category: categoryFromUrl,
    query: '',
    dateRange: {
      startDate: '',
      endDate: ''
    },
    status: '',
    building: '',
    serviceInstaller: '',
    orderType: '',
    materialType: '',
    // Add more filters as needed
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(true);
  const [savedSearches, setSavedSearches] = useState([]);
  
  // Reference data for filter dropdowns
  const [buildings, setBuildings] = useState([]);
  const [serviceInstallers, setServiceInstallers] = useState([]);
  
  // Categories to search in
  const categories = [
    { id: 'all', label: 'All Categories', icon: <SearchIcon className="h-4 w-4" /> },
    { id: 'orders', label: 'Orders', icon: <FileText className="h-4 w-4" /> },
    { id: 'buildings', label: 'Buildings', icon: <Building className="h-4 w-4" /> },
    { id: 'installers', label: 'Service Installers', icon: <User className="h-4 w-4" /> },
    { id: 'materials', label: 'Materials', icon: <Package className="h-4 w-4" /> }
  ];
  
  // Status options
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];
  
  // Order type options
  const orderTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'activation', label: 'Activation' },
    { value: 'modification', label: 'Modification' },
    { value: 'assurance', label: 'Assurance' }
  ];
  
  // Material type options
  const materialTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'router', label: 'Router' },
    { value: 'modem', label: 'Modem' },
    { value: 'cable', label: 'Cable' },
    { value: 'splitter', label: 'Splitter' },
    { value: 'other', label: 'Other' }
  ];
  
  // Fetch reference data on component mount
  useEffect(() => {
    fetchReferenceData();
    loadSavedSearches();
  }, []);
  
  // Fetch buildings and service installers for dropdowns
  const fetchReferenceData = async () => {
    try {
      // In a real application, these would be API calls
      // For this example, we'll use mock data
      
      // Mock buildings data
      const mockBuildings = [
        { id: 1, name: 'KELANA IMPIAN APARTMENT' },
        { id: 2, name: 'THE WESTSIDE II' },
        { id: 3, name: 'THE WESTSIDE I' },
        { id: 4, name: 'TARA 33' },
        { id: 5, name: 'LUMI TROPICANA' }
      ];
      
      // Mock service installers data
      const mockInstallers = [
        { id: 1, name: 'K. MARIAPPAN A/L KUPPATHAN @ KM Siva' },
        { id: 2, name: 'SARAVANAN A/L I. CHINNIAH @ Solo' },
        { id: 3, name: 'MUNIANDY A/L SOORINARAYANAN @ Mani' },
        { id: 4, name: 'YELLESHUA JEEVAN A/L AROKKIASAMY @ Jeevan' },
        { id: 5, name: 'RAVEEN NAIR A/L K RAHMAN @ Raveen' }
      ];
      
      setBuildings(mockBuildings);
      setServiceInstallers(mockInstallers);
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };
  
  // Load saved searches from localStorage
  const loadSavedSearches = () => {
    const saved = localStorage.getItem('savedAdvancedSearches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  };
  
  // Save searches to localStorage
  const saveSearches = (searches) => {
    localStorage.setItem('savedAdvancedSearches', JSON.stringify(searches));
    setSavedSearches(searches);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('dateRange.')) {
      const dateField = name.split('.')[1];
      setFormState({
        ...formState,
        dateRange: {
          ...formState.dateRange,
          [dateField]: value
        }
      });
    } else {
      setFormState({
        ...formState,
        [name]: value
      });
    }
  };
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };
  
  // Reset the search form
  const handleReset = () => {
    setFormState({
      category: 'all',
      query: '',
      dateRange: {
        startDate: '',
        endDate: ''
      },
      status: '',
      building: '',
      serviceInstaller: '',
      orderType: '',
      materialType: ''
    });
    setSearchResults([]);
    setHasSearched(false);
  };
  
  // Save current search
  const saveCurrentSearch = () => {
    // Prompt for search name
    const searchName = window.prompt('Enter a name for this search:', '');
    
    if (searchName) {
      const newSavedSearch = {
        id: Date.now(),
        name: searchName,
        parameters: { ...formState }
      };
      
      const updatedSearches = [...savedSearches, newSavedSearch];
      saveSearches(updatedSearches);
    }
  };
  
  // Delete a saved search
  const deleteSavedSearch = (id) => {
    const updatedSearches = savedSearches.filter(search => search.id !== id);
    saveSearches(updatedSearches);
  };
  
  // Load a saved search
  const loadSavedSearch = (parameters) => {
    setFormState(parameters);
    // Perform search with loaded parameters
    performSearch(parameters);
  };
  
  // Perform the search
  const performSearch = async (searchParams = formState) => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      // In a real application, this would be an API call with filters
      // For this example, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock search results
      const mockResults = [
        // Orders results
        {
          id: 'order-1',
          type: 'order',
          title: 'TBBNB8358G - OW WAI SIONG',
          description: 'Activation - BLOCK C LEVEL 27 UNIT 02, UNITED POINT RESIDENCE',
          status: 'PENDING',
          date: '2024-11-15',
          building: 'UNITED POINT RESIDENCE',
          installer: '',
          url: '/order/45/detail'
        },
        {
          id: 'order-2',
          type: 'order',
          title: 'TBBNA870523G - TAN PUI YEE',
          description: 'Activation - SOLARIS PARQ RESIDENSI',
          status: 'COMPLETED',
          date: '2024-11-10',
          building: 'SOLARIS PARQ RESIDENSI',
          installer: 'K. MARIAPPAN A/L KUPPATHAN @ KM Siva',
          url: '/order/32/detail'
        },
        {
          id: 'order-3',
          type: 'order',
          title: 'TBBNA872851G - CHOY YUEN LENG',
          description: 'Activation - RESIDENSI M LUNA',
          status: 'ASSIGNED',
          date: '2024-11-03',
          building: 'RESIDENSI M LUNA',
          installer: 'SARAVANAN A/L I. CHINNIAH @ Solo',
          url: '/order/28/detail'
        },
        {
          id: 'order-4',
          type: 'order',
          title: 'TBBNA578554G - ZHENG ZILONG',
          description: 'Assurance - 9 SEPUTEH - VIVO RESIDENCE',
          status: 'IN_PROGRESS',
          date: '2024-11-02',
          building: '9 SEPUTEH - VIVO RESIDENCE',
          installer: 'MUNIANDY A/L SOORINARAYANAN @ Mani',
          url: '/order/27/detail'
        },
        // Buildings results
        {
          id: 'building-1',
          type: 'building',
          title: 'KELANA IMPIAN APARTMENT',
          description: 'Non Prelaid - Kuala Lumpur',
          date: '2023-05-10',
          url: '/building/1/detail'
        },
        {
          id: 'building-2',
          type: 'building',
          title: 'THE WESTSIDE II',
          description: 'Prelaid - Kuala Lumpur',
          date: '2023-06-15',
          url: '/building/2/detail'
        },
        // Service Installers results
        {
          id: 'installer-1',
          type: 'installer',
          title: 'K. MARIAPPAN A/L KUPPATHAN @ KM Siva',
          description: 'Service Installer - +60 17-676 7625',
          status: 'ACTIVE',
          date: '2023-01-15',
          url: '/service-installer/1/detail'
        },
        {
          id: 'installer-2',
          type: 'installer',
          title: 'SARAVANAN A/L I. CHINNIAH @ Solo',
          description: 'Service Installer - +60 16-392 3026',
          status: 'ACTIVE',
          date: '2023-02-20',
          url: '/service-installer/2/detail'
        },
        // Materials results
        {
          id: 'material-1',
          type: 'material',
          title: 'Huawei HG8145X6',
          description: 'SAP Code: CAE-000-0820 - Stock: -3788',
          materialType: 'router',
          date: '2023-08-10',
          url: '/material/1'
        },
        {
          id: 'material-2',
          type: 'material',
          title: 'Huawei HG8145V5',
          description: 'SAP Code: CAE-000-0780 - Stock: -97',
          materialType: 'router',
          date: '2023-07-05',
          url: '/material/2'
        }
      ];
      
      // Apply filters based on search parameters
      const filtered = mockResults.filter(result => {
        // Filter by category
        if (searchParams.category !== 'all' && !result.type.includes(searchParams.category.slice(0, -1))) {
          return false;
        }
        
        // Filter by search query
        if (searchParams.query && 
            !result.title.toLowerCase().includes(searchParams.query.toLowerCase()) && 
            !result.description.toLowerCase().includes(searchParams.query.toLowerCase())) {
          return false;
        }
        
        // Filter by date range
        if (searchParams.dateRange.startDate && result.date < searchParams.dateRange.startDate) {
          return false;
        }
        
        if (searchParams.dateRange.endDate && result.date > searchParams.dateRange.endDate) {
          return false;
        }
        
        // Filter by status (for orders and installers)
        if (searchParams.status && result.status && 
            !result.status.toLowerCase().includes(searchParams.status.toLowerCase())) {
          return false;
        }
        
        // Filter by building (for orders)
        if (searchParams.building && result.building && 
            !result.building.toLowerCase().includes(searchParams.building.toLowerCase())) {
          return false;
        }
        
        // Filter by service installer (for orders)
        if (searchParams.serviceInstaller && result.installer && 
            !result.installer.toLowerCase().includes(searchParams.serviceInstaller.toLowerCase())) {
          return false;
        }
        
        // Filter by order type (for orders)
        if (searchParams.orderType && result.description && 
            !result.description.toLowerCase().includes(searchParams.orderType.toLowerCase())) {
          return false;
        }
        
        // Filter by material type (for materials)
        if (searchParams.materialType && result.materialType && 
            result.materialType !== searchParams.materialType) {
          return false;
        }
        
        return true;
      });
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Export search results to CSV
  const exportResults = () => {
    // Create CSV header row
    let csv = 'Type,Title,Description,Status,Date,URL\n';
    
    // Add each result as a row
    searchResults.forEach(result => {
      const row = [
        result.type,
        `"${result.title.replace(/"/g, '""')}"`, // Escape quotes in CSV
        `"${result.description.replace(/"/g, '""')}"`,
        result.status || 'N/A',
        result.date || 'N/A',
        `"${window.location.origin}${result.url}"`
      ];
      
      csv += row.join(',') + '\n';
    });
    
    // Create a download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `search-results-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Get icon based on result type
  const getResultIcon = (type) => {
    switch (type) {
      case 'order':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'building':
        return <Building className="h-5 w-5 text-green-500" />;
      case 'installer':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'material':
        return <Package className="h-5 w-5 text-yellow-500" />;
      default:
        return <SearchIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get result type label
  const getResultTypeLabel = (type) => {
    switch (type) {
      case 'order':
        return 'Order';
      case 'building':
        return 'Building';
      case 'installer':
        return 'Installer';
      case 'material':
        return 'Material';
      default:
        return 'Result';
    }
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-indigo-100 text-indigo-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link
            to="/search"
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advanced Search</h1>
            <p className="text-sm text-gray-500">
              Search with detailed filters across different entities
            </p>
          </div>
        </div>
        <div>
          {hasSearched && searchResults.length > 0 && (
            <button
              onClick={exportResults}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-5 w-5 mr-2 text-gray-500" />
              Export Results
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search Filters Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div 
              className="px-4 py-5 sm:px-6 border-b flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedFilters(!expandedFilters)}
            >
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Sliders className="h-5 w-5 mr-2 text-gray-500" />
                Search Filters
              </h2>
              <button className="text-gray-500">
                {expandedFilters ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>
            
            {expandedFilters && (
              <div className="p-4">
                <form onSubmit={handleSearch} className="space-y-4">
                  {/* Search Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formState.category}
                      onChange={handleInputChange}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Search Query */}
                  <div>
                    <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
                      Search Terms
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="query"
                        name="query"
                        value={formState.query}
                        onChange={handleInputChange}
                        placeholder="Enter search terms..."
                        className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="dateRange.startDate"
                          name="dateRange.startDate"
                          value={formState.dateRange.startDate}
                          onChange={handleInputChange}
                          className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="dateRange.endDate"
                          name="dateRange.endDate"
                          value={formState.dateRange.endDate}
                          onChange={handleInputChange}
                          className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Conditional filters based on category */}
                  {(formState.category === 'all' || formState.category === 'orders') && (
                    <>
                      {/* Status Filter */}
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formState.status}
                          onChange={handleInputChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Building Filter */}
                      <div>
                        <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
                          Building
                        </label>
                        <select
                          id="building"
                          name="building"
                          value={formState.building}
                          onChange={handleInputChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">All Buildings</option>
                          {buildings.map((building) => (
                            <option key={building.id} value={building.name}>
                              {building.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Service Installer Filter */}
                      <div>
                        <label htmlFor="serviceInstaller" className="block text-sm font-medium text-gray-700 mb-1">
                          Service Installer
                        </label>
                        <select
                          id="serviceInstaller"
                          name="serviceInstaller"
                          value={formState.serviceInstaller}
                          onChange={handleInputChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">All Installers</option>
                          {serviceInstallers.map((installer) => (
                            <option key={installer.id} value={installer.name}>
                              {installer.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Order Type Filter */}
                      <div>
                        <label htmlFor="orderType" className="block text-sm font-medium text-gray-700 mb-1">
                          Order Type
                        </label>
                        <select
                          id="orderType"
                          name="orderType"
                          value={formState.orderType}
                          onChange={handleInputChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          {orderTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                  
                  {/* Material type filter for Materials */}
                  {(formState.category === 'all' || formState.category === 'materials') && (
                    <div>
                      <label htmlFor="materialType" className="block text-sm font-medium text-gray-700 mb-1">
                        Material Type
                      </label>
                      <select
                        id="materialType"
                        name="materialType"
                        value={formState.materialType}
                        onChange={handleInputChange}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {materialTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {/* Form Actions */}
                  <div className="pt-4 flex flex-col space-y-2">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <SearchIcon className="h-5 w-5 mr-2" />
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <RefreshCw className="h-5 w-5 mr-2 text-gray-500" />
                      Reset Filters
                    </button>
                    <button
                      type="button"
                      onClick={saveCurrentSearch}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Save className="h-5 w-5 mr-2 text-gray-500" />
                      Save Search
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          
          {/* Saved Searches */}
          {savedSearches.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Saved Searches
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {savedSearches.map((search) => (
                  <li key={search.id} className="px-4 py-3">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => loadSavedSearch(search.parameters)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 text-left"
                      >
                        {search.name}
                      </button>
                      <button
                        onClick={() => deleteSavedSearch(search.id)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Delete this saved search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {search.parameters.category !== 'all' && (
                        <span className="mr-2">
                          Category: {search.parameters.category}
                        </span>
                      )}
                      {search.parameters.query && (
                        <span className="mr-2">
                          Query: "{truncateText(search.parameters.query, 20)}"
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Search Results */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-500">Searching...</p>
            </div>
          ) : hasSearched ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Search Results
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                  </p>
                </div>
                {searchResults.length > 0 && (
                  <div className="text-sm text-gray-500">
                    Filters: {Object.entries(formState)
                      .filter(([key, value]) => 
                        value && key !== 'category' && key !== 'dateRange' && 
                        typeof value === 'string' && value.length > 0
                      )
                      .map(([key]) => key)
                      .join(', ')}
                    {formState.dateRange.startDate && ' Date range'}
                  </div>
                )}
              </div>
              
              {searchResults.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {searchResults.map((result) => (
                    <li key={result.id}>
                      <Link
                        to={result.url}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 mr-3">
                                {getResultIcon(result.type)}
                              </div>
                              <p className="text-sm font-medium text-gray-900">
                                {result.title}
                              </p>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex space-x-2">
                              {result.status && (
                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(result.status)}`}>
                                  {result.status}
                                </p>
                              )}
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                {getResultTypeLabel(result.type)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="text-sm text-gray-500">
                                {truncateText(result.description, 100)}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              {result.date && (
                                <>
                                  <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  {new Date(result.date).toLocaleDateString()}
                                </>
                              )}
                            </div>
                          </div>
                          {result.type === 'order' && (
                            <div className="mt-2 flex flex-wrap">
                              {result.building && (
                                <span className="mr-4 text-xs text-gray-500 flex items-center">
                                  <Building className="h-3 w-3 mr-1 text-gray-400" />
                                  {result.building}
                                </span>
                              )}
                              {result.installer && (
                                <span className="mr-4 text-xs text-gray-500 flex items-center">
                                  <User className="h-3 w-3 mr-1 text-gray-400" />
                                  {truncateText(result.installer, 25)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center">
                  <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search filters to find what you're looking for.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <RefreshCw className="mr-2 h-5 w-5" />
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Advanced Search</h3>
              <p className="mt-1 text-sm text-gray-500">
                Use the filters on the left to search across multiple criteria.
              </p>
              <p className="mt-4 text-xs text-gray-500">
                You can save your searches for future use.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchPage;