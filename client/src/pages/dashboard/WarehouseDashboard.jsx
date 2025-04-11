import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Package, 
  AlertCircle, 
  Search, 
  ArrowDown, 
  ArrowUp, 
  BarChart2, 
  AlertTriangle,
  Truck,
  Plus,
  Tool
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import useNotification from '../../hooks/useNotification';
import api from '../../services/api';

/**
 * Warehouse Dashboard Component
 * Focused on materials management, inventory tracking, and stock levels
 */
const WarehouseDashboard = () => {
  const { showError } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [inventoryStats, setInventoryStats] = useState({
    totalMaterials: 0,
    lowStock: 0,
    outOfStock: 0,
    incomingShipments: 0
  });
  const [stockMovements, setStockMovements] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [outOfStockItems, setOutOfStockItems] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch inventory statistics
        const statsResponse = await api.get('/materials/stats');
        if (statsResponse.success) {
          setInventoryStats(statsResponse.data);
        } else {
          showError('Failed to load inventory statistics');
        }
        
        // Fetch recent stock movements
        const movementsResponse = await api.get('/materials/movements/recent');
        if (movementsResponse.success) {
          setStockMovements(movementsResponse.data);
        } else {
          showError('Failed to load stock movements');
        }
        
        // Fetch low stock items
        const lowStockResponse = await api.get('/materials/low-stock');
        if (lowStockResponse.success) {
          setLowStockItems(lowStockResponse.data);
        } else {
          showError('Failed to load low stock items');
        }
        
        // Fetch out of stock items
        const outOfStockResponse = await api.get('/materials/out-of-stock');
        if (outOfStockResponse.success) {
          setOutOfStockItems(outOfStockResponse.data);
        } else {
          showError('Failed to load out of stock items');
        }
      } catch (error) {
        console.error('Error fetching warehouse dashboard data:', error);
        showError('An error occurred while loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout 
      title="Warehouse Dashboard" 
      subtitle="Inventory management and stock tracking"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Materials Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Materials</p>
              <p className="text-2xl font-bold">{inventoryStats.totalMaterials}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <Link to="/materials" className="text-blue-600 hover:underline">View All Materials</Link>
          </div>
        </div>

        {/* Low Stock Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Low Stock Items</p>
              <p className="text-2xl font-bold">{inventoryStats.lowStock}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle size={24} className="text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <Link to="/materials?status=low" className="text-yellow-600 hover:underline">View Low Stock</Link>
          </div>
        </div>

        {/* Out of Stock Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Out of Stock</p>
              <p className="text-2xl font-bold">{inventoryStats.outOfStock}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle size={24} className="text-red-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <Link to="/materials?status=out" className="text-red-600 hover:underline">View Out of Stock</Link>
          </div>
        </div>

        {/* Incoming Shipments Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Incoming Shipments</p>
              <p className="text-2xl font-bold">{inventoryStats.incomingShipments}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <Truck size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <Link to="/materials/incoming" className="text-green-600 hover:underline">View Shipments</Link>
          </div>
        </div>
      </div>

      {/* Recent Stock Movements and Inventory Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Stock Movements */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b flex justify-between items-center">
            <h2 className="font-semibold">Recent Stock Movements</h2>
            <Link to="/materials/movements" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockMovements.length > 0 ? (
                  stockMovements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          movement.type === 'IN' ? 'bg-green-100 text-green-800' :
                          movement.type === 'OUT' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {movement.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{movement.description}</div>
                        <div className="text-xs text-gray-500">{movement.sapCode}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        {movement.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {movement.assignedTo || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {movement.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-3 text-center text-sm text-gray-500">
                      {isLoading ? 'Loading movements...' : 'No recent stock movements'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Issues */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b">
            <h2 className="font-semibold">Inventory Issues</h2>
          </div>
          <div className="p-4 space-y-4">
            {/* Out of Stock Section */}
            <div>
              <h3 className="text-sm font-medium text-red-600 mb-2 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                Out of Stock Items
              </h3>
              {outOfStockItems.length > 0 ? (
                <div className="space-y-2">
                  {outOfStockItems.map((item) => (
                    <div key={item.id} className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="font-medium text-gray-900">{item.description}</div>
                      <div className="text-xs text-gray-500">{item.sapCode}</div>
                      <div className="mt-1 flex justify-between items-center">
                        <span className="text-xs text-red-600">Stock: {item.stockKeepingUnit}</span>
                        <span className="text-xs text-gray-500">Min Required: {item.minRequired}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-center text-green-700 text-sm">
                  No out of stock items
                </div>
              )}
            </div>

            {/* Low Stock Section */}
            <div>
              <h3 className="text-sm font-medium text-yellow-600 mb-2 flex items-center">
                <AlertTriangle size={16} className="mr-1" />
                Low Stock Items
              </h3>
              {lowStockItems.length > 0 ? (
                <div className="space-y-2">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="font-medium text-gray-900">{item.description}</div>
                      <div className="text-xs text-gray-500">{item.sapCode}</div>
                      <div className="mt-1 flex justify-between items-center">
                        <span className="text-xs text-yellow-600">Stock: {item.stockKeepingUnit}</span>
                        <span className="text-xs text-gray-500">Min Required: {item.minRequired}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-center text-green-700 text-sm">
                  No low stock items
                </div>
              )}
            </div>
          </div>
          <div className="px-4 py-3 border-t">
            <Link 
              to="/materials?status=issue" 
              className="block w-full py-2 bg-gray-50 text-center text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Manage All Inventory Issues
            </Link>
          </div>
        </div>
      </div>

      {/* Material Search and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Material Search */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b">
            <h2 className="font-semibold">Quick Material Search</h2>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by SAP code or description..."
                  className="w-full border rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-2.5">
                  <Search size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-500 mb-2">SEARCH BY:</div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-sm">SAP Code</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm">Serial No</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm">Type</button>
              </div>
            </div>
            <button className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Search
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b">
            <h2 className="font-semibold">Quick Actions</h2>
          </div>
          <div className="p-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/materials/create"
              className="block p-4 bg-blue-50 border border-blue-200 rounded-lg text-center hover:bg-blue-100"
            >
              <Package size={24} className="inline-block mb-2 text-blue-600" />
              <div className="font-medium">Add Material</div>
            </Link>
            
            <Link
              to="/materials/movements/new?type=in"
              className="block p-4 bg-green-50 border border-green-200 rounded-lg text-center hover:bg-green-100"
            >
              <ArrowDown size={24} className="inline-block mb-2 text-green-600" />
              <div className="font-medium">Record Inbound</div>
            </Link>
            
            <Link
              to="/materials/movements/new?type=out"
              className="block p-4 bg-red-50 border border-red-200 rounded-lg text-center hover:bg-red-100"
            >
              <ArrowUp size={24} className="inline-block mb-2 text-red-600" />
              <div className="font-medium">Record Outbound</div>
            </Link>
            
            <Link
              to="/materials/scan"
              className="block p-4 bg-purple-50 border border-purple-200 rounded-lg text-center hover:bg-purple-100"
            >
              <Search size={24} className="inline-block mb-2 text-purple-600" />
              <div className="font-medium">Scan Material</div>
            </Link>
            
            <Link
              to="/materials/reports"
              className="block p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center hover:bg-yellow-100"
            >
              <BarChart2 size={24} className="inline-block mb-2 text-yellow-600" />
              <div className="font-medium">Inventory Report</div>
            </Link>
            
            <Link
              to="/materials/adjustment"
              className="block p-4 bg-gray-50 border border-gray-200 rounded-lg text-center hover:bg-gray-100"
            >
              <Tool size={24} className="inline-block mb-2 text-gray-600" />
              <div className="font-medium">Stock Adjustment</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Pending Material Assignments */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h2 className="font-semibold">Pending Material Assignments</h2>
          <Link to="/materials/assignments" className="text-sm text-blue-600 hover:underline">View All</Link>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Installer
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Required Materials
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-3 text-center text-sm text-gray-500">
                      Loading pending assignments...
                    </td>
                  </tr>
                ) : (
                  <>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Activation</div>
                        <div className="text-xs text-gray-500">TBBNA870523G</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        K. MARIAPPAN A/L KUPPATHAN
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-xs text-gray-500">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs mr-1">Router</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs">ONT</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        Today, 10:00 AM
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <Link to="/materials/assignments/1" className="text-blue-600 hover:text-blue-900">
                          Assign
                        </Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Assurance</div>
                        <div className="text-xs text-gray-500">TBBNA578554G</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        SARAVANAN A/L I. CHINNIAH
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-xs text-gray-500">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs">Router</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        Today, 1:00 PM
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <Link to="/materials/assignments/2" className="text-blue-600 hover:text-blue-900">
                          Assign
                        </Link>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upcoming Deliveries */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h2 className="font-semibold">Upcoming Deliveries</h2>
          <Link to="/materials/deliveries" className="text-sm text-blue-600 hover:underline">Schedule Delivery</Link>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500 mb-2"></div>
              <p>Loading deliveries...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <Truck className="text-green-600 mr-3" size={20} />
                  <div>
                    <div className="font-medium">Router Shipment</div>
                    <div className="text-sm text-gray-600">Expected: Apr 5, 2025</div>
                  </div>
                  <div className="ml-auto text-sm font-semibold bg-green-200 px-2 py-0.5 rounded text-green-800">
                    In Transit
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <div className="font-medium">Items:</div>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Huawei HG8145X6 (20 units)</li>
                    <li>TP-Link EC440 (15 units)</li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center text-gray-500 text-sm p-2">
                No more upcoming deliveries scheduled
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WarehouseDashboard;