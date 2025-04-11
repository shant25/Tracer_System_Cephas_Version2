import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search as SearchIcon,
  FileText,
  Building,
  User,
  Package,
  ArrowRight,
  X,
  Filter,
  ExternalLink 
} from 'lucide-react';

import useCephas from '../../hooks/useCephas';
import { truncateText } from '../../utils/formatters';

/**
 * SearchPage Component
 * Provides simple search functionality across different entities
 */
const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useCephas();
  
  // Get search query from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const queryFromUrl = queryParams.get('q') || '';
  
  // State for search
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  
  // Categories to search in
  const categories = [
    { id: 'all', label: 'All', icon: <SearchIcon className="h-4 w-4" /> },
    { id: 'orders', label: 'Orders', icon: <FileText className="h-4 w-4" /> },
    { id: 'buildings', label: 'Buildings', icon: <Building className="h-4 w-4" /> },
    { id: 'installers', label: 'Service Installers', icon: <User className="h-4 w-4" /> },
    { id: 'materials', label: 'Materials', icon: <Package className="h-4 w-4" /> }
  ];
  
  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }
    
    // If there's a query in the URL, perform search
    if (queryFromUrl) {
      performSearch(queryFromUrl);
    }
  }, []);
  
  // Save recent searches to localStorage when updated
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim() === '') return;
    
    // Update URL with search query
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`);
    
    performSearch(searchQuery);
    
    // Add to recent searches
    if (!recentSearches.includes(searchQuery)) {
      const updatedSearches = [searchQuery, ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedSearches);
    }
  };
  
  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    navigate('/search');
  };
  
  // Perform the search
  const performSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      // In a real application, this would be an API call
      // For this example, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock search results
      const mockResults = [
        // Orders results
        {
          id: 'order-1',
          type: 'order',
          title: 'TBBNB8358G - OW WAI SIONG',
          description: 'Activation - BLOCK C LEVEL 27 UNIT 02, UNITED POINT RESIDENCE',
          url: '/order/45/detail'
        },
        {
          id: 'order-2',
          type: 'order',
          title: 'TBBNA870523G - TAN PUI YEE',
          description: 'Activation - Pending - SOLARIS PARQ RESIDENSI',
          url: '/order/32/detail'
        },
        // Buildings results
        {
          id: 'building-1',
          type: 'building',
          title: 'KELANA IMPIAN APARTMENT',
          description: 'Non Prelaid - Kuala Lumpur',
          url: '/building/1/detail'
        },
        {
          id: 'building-2',
          type: 'building',
          title: 'THE WESTSIDE II',
          description: 'Prelaid - Kuala Lumpur',
          url: '/building/2/detail'
        },
        // Service Installers results
        {
          id: 'installer-1',
          type: 'installer',
          title: 'K. MARIAPPAN A/L KUPPATHAN @ KM Siva',
          description: 'Service Installer - +60 17-676 7625',
          url: '/service-installer/1/detail'
        },
        {
          id: 'installer-2',
          type: 'installer',
          title: 'SARAVANAN A/L I. CHINNIAH @ Solo',
          description: 'Service Installer - +60 16-392 3026',
          url: '/service-installer/2/detail'
        },
        // Materials results
        {
          id: 'material-1',
          type: 'material',
          title: 'Huawei HG8145X6',
          description: 'SAP Code: CAE-000-0820 - Stock: -3788',
          url: '/material/1'
        },
        {
          id: 'material-2',
          type: 'material',
          title: 'Huawei HG8145V5',
          description: 'SAP Code: CAE-000-0780 - Stock: -97',
          url: '/material/2'
        }
      ];
      
      // Filter results based on search query and selected category
      const filtered = mockResults.filter(result => {
        const matchesQuery = 
          result.title.toLowerCase().includes(query.toLowerCase()) || 
          result.description.toLowerCase().includes(query.toLowerCase());
        
        const matchesCategory = 
          selectedCategory === 'all' || 
          (selectedCategory === 'orders' && result.type === 'order') ||
          (selectedCategory === 'buildings' && result.type === 'building') ||
          (selectedCategory === 'installers' && result.type === 'installer') ||
          (selectedCategory === 'materials' && result.type === 'material');
        
        return matchesQuery && matchesCategory;
      });
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
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
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Search</h1>
        <p className="text-sm text-gray-500">
          Search for orders, buildings, service installers, and materials
        </p>
      </div>
      
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID, description..."
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <div className="w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="inline-flex items-center justify-center w-full md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <SearchIcon className="h-5 w-5 mr-2" />
              Search
            </button>
            
            <Link
              to="/search/advanced"
              className="inline-flex items-center justify-center w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-5 w-5 mr-2 text-gray-500" />
              Advanced
            </Link>
          </form>
        </div>
      </div>
      
      {/* Search Results */}
      <div className="space-y-6">
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
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                </p>
              </div>
              {searchResults.length > 0 && (
                <Link
                  to="/search/advanced"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Refine Search
                </Link>
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
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              {getResultTypeLabel(result.type)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            {truncateText(result.description, 100)}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
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
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <div className="mt-6">
                  <Link
                    to="/search/advanced"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Try Advanced Search
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <div className="px-4 py-5 sm:px-6 border-b">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Searches
                  </h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  {recentSearches.map((query, index) => (
                    <li key={index}>
                      <button
                        onClick={() => {
                          setSearchQuery(query);
                          performSearch(query);
                          navigate(`/search?q=${encodeURIComponent(query)}`);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <SearchIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-700">{query}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Quick Search Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.slice(1).map((category) => (
                <Link
                  key={category.id}
                  to={`/search/advanced?category=${category.id}`}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-5 flex flex-col items-center text-center">
                    <div className="p-3 bg-gray-100 rounded-full mb-4">
                      {React.cloneElement(category.icon, { className: 'h-6 w-6 text-gray-600' })}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">{category.label}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Search in {category.label.toLowerCase()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;