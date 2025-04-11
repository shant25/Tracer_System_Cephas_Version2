import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Trash2, 
  Download, 
  Filter, 
  ArrowUp, 
  ArrowDown,
  List as ListIcon 
} from 'lucide-react';
import { showSuccess, showError, showConfirmation } from '../../utils/notification';

/**
 * SplitterList Component
 * Displays a list of splitters with search, filter, and sorting options
 */
const SplitterList = () => {
  // State variables
  const [splitters, setSplitters] = useState([]);
  const [filteredSplitters, setFilteredSplitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [sortField, setSortField] = useState('serviceId');
  const [sortDirection, setSortDirection] = useState('asc');
  const [buildings, setBuildings] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for splitters
  const mockSplitters = [
    { 
      id: 1, 
      serviceId: 'TBBNA422113G', 
      buildingName: 'THE WESTSIDE I', 
      alias: 'Westside Tower A', 
      splitterLevel: 'MDF ROOM - PARKING', 
      splitterNumber: '02', 
      splitterPort: '25',
      status: 'active',
      lastUpdated: '2025-04-01'
    },
    { 
      id: 2, 
      serviceId: 'TBBNA287810G', 
      buildingName: 'KELANA PUTERI', 
      alias: '', 
      splitterLevel: '10', 
      splitterNumber: '10', 
      splitterPort: '22',
      status: 'active',
      lastUpdated: '2025-03-28'
    },
    { 
      id: 3, 
      serviceId: 'TBBNA318244G', 
      buildingName: 'THE WESTSIDE I', 
      alias: 'Westside Tower B', 
      splitterLevel: 'MDF ROOM - PARKING', 
      splitterNumber: '03', 
      splitterPort: '12',
      status: 'active',
      lastUpdated: '2025-03-25'
    },
    { 
      id: 4, 
      serviceId: 'TBBNA574291G', 
      buildingName: 'LUMI TROPICANA', 
      alias: '', 
      splitterLevel: '15', 
      splitterNumber: '04', 
      splitterPort: '08',
      status: 'inactive',
      lastUpdated: '2025-03-20'
    },
    { 
      id: 5, 
      serviceId: 'TBBNA193765G', 
      buildingName: 'KELANA IMPIAN APARTMENT', 
      alias: 'Block A', 
      splitterLevel: '05', 
      splitterNumber: '07', 
      splitterPort: '16',
      status: 'active',
      lastUpdated: '2025-03-15'
    },
    { 
      id: 6, 
      serviceId: 'TBBNA387621G', 
      buildingName: 'TARA 33', 
      alias: '', 
      splitterLevel: '11', 
      splitterNumber: '02', 
      splitterPort: '04',
      status: 'active',
      lastUpdated: '2025-03-10'
    }
  ];

  // Extract unique building names
  useEffect(() => {
    if (splitters.length > 0) {
      const uniqueBuildings = [...new Set(splitters.map(item => item.buildingName))];
      setBuildings(uniqueBuildings);
    }
  }, [splitters]);

  // Fetch splitters data
  useEffect(() => {
    const fetchSplitters = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSplitters(mockSplitters);
        setFilteredSplitters(mockSplitters);
      } catch (error) {
        console.error('Error fetching splitters:', error);
        showError('Failed to load splitters data');
      } finally {
        setLoading(false);
      }
    };

    fetchSplitters();
  }, []);

  // Handle search and filter
  useEffect(() => {
    let result = [...splitters];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(
        splitter => 
          splitter.serviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          splitter.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (splitter.alias && splitter.alias.toLowerCase().includes(searchTerm.toLowerCase())) ||
          `${splitter.splitterLevel} ${splitter.splitterNumber} ${splitter.splitterPort}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply building filter
    if (buildingFilter) {
      result = result.filter(splitter => splitter.buildingName === buildingFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle string comparisons
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredSplitters(result);
  }, [splitters, searchTerm, buildingFilter, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle delete splitter
  const handleDelete = (id) => {
    showConfirmation(
      'Are you sure you want to delete this splitter? This action cannot be undone.',
      () => {
        setSplitters(splitters.filter(splitter => splitter.id !== id));
        setFilteredSplitters(filteredSplitters.filter(splitter => splitter.id !== id));
        showSuccess('Splitter deleted successfully');
      }
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Splitter Management</h1>
          
          <Link
            to="/splitter/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add New Splitter
          </Link>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center">
              <div className="relative w-full md:w-80 mr-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Search by ID, building, or location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="-ml-0.5 mr-2 h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            
            <div className="mt-3 sm:mt-0 flex items-center">
              <button
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-2"
                onClick={() => {
                  // Export functionality would go here
                  showSuccess('Splitter list exported successfully');
                }}
              >
                <Download className="-ml-0.5 mr-2 h-4 w-4" />
                Export
              </button>
            </div>
          </div>
          
          {/* Additional filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="buildingFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Building
                  </label>
                  <select
                    id="buildingFilter"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    value={buildingFilter}
                    onChange={(e) => setBuildingFilter(e.target.value)}
                  >
                    <option value="">All Buildings</option>
                    {buildings.map((building, index) => (
                      <option key={index} value={building}>{building}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => {
                      setSearchTerm('');
                      setBuildingFilter('');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Splitters Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Splitters
                </h2>
                <p className="text-sm text-gray-500">
                  Total: {filteredSplitters.length} {filteredSplitters.length === 1 ? 'splitter' : 'splitters'}
                </p>
              </div>
              
              {filteredSplitters.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('serviceId')}
                        >
                          <div className="flex items-center">
                            Service ID
                            {sortField === 'serviceId' && (
                              sortDirection === 'asc' ? 
                                <ArrowUp className="ml-1 h-4 w-4" /> : 
                                <ArrowDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('buildingName')}
                        >
                          <div className="flex items-center">
                            Building
                            {sortField === 'buildingName' && (
                              sortDirection === 'asc' ? 
                                <ArrowUp className="ml-1 h-4 w-4" /> : 
                                <ArrowDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Alias
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Splitter Details
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSplitters.map((splitter) => (
                        <tr key={splitter.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            <Link to={`/splitter/${splitter.id}`} className="hover:underline">
                              {splitter.serviceId}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {splitter.buildingName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {splitter.alias || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Level: <span className="font-medium">{splitter.splitterLevel}</span> &bull; 
                            Splitter: <span className="font-medium">{splitter.splitterNumber}</span> &bull; 
                            Port: <span className="font-medium">{splitter.splitterPort}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              splitter.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {splitter.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-3">
                              <Link 
                                to={`/splitter/${splitter.id}`} 
                                className="text-indigo-600 hover:text-indigo-900"
                                title="View Details"
                              >
                                <Eye className="h-5 w-5" />
                              </Link>
                              <Link 
                                to={`/splitter/${splitter.id}/edit`} 
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <Edit className="h-5 w-5" />
                              </Link>
                              <button 
                                onClick={() => handleDelete(splitter.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <ListIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No splitters found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || buildingFilter 
                      ? 'Try adjusting your search or filter criteria' 
                      : 'Get started by adding a new splitter'}
                  </p>
                  {(searchTerm || buildingFilter) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setBuildingFilter('');
                      }}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplitterList;