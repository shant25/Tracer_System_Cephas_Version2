import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Bell, 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle, 
  BarChart2,
  DollarSign,
  Plus,
  Download,
  File
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import useNotification from '../../hooks/useNotification';
import api from '../../services/api';

/**
 * Accountant Dashboard component
 * Focused on financial metrics, invoices, and payment tracking
 */
const AccountantDashboard = () => {
  const { showError } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [invoiceStats, setInvoiceStats] = useState({
    pending: 0,
    paid: 0,
    overdue: 0,
    thisMonth: 0
  });
  const [financialSummary, setFinancialSummary] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    receivedPayments: 0,
    monthlyTarget: 0
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch invoice statistics
        const statsResponse = await api.get('/invoices/stats');
        if (statsResponse.success) {
          setInvoiceStats(statsResponse.data);
        } else {
          showError('Failed to load invoice statistics');
        }
        
        // Fetch financial summary
        const summaryResponse = await api.get('/financial/summary');
        if (summaryResponse.success) {
          setFinancialSummary(summaryResponse.data);
        } else {
          showError('Failed to load financial summary');
        }
        
        // Fetch recent invoices
        const invoicesResponse = await api.get('/invoices/recent');
        if (invoicesResponse.success) {
          setRecentInvoices(invoicesResponse.data);
        } else {
          showError('Failed to load recent invoices');
        }
      } catch (error) {
        console.error('Error fetching accountant dashboard data:', error);
        showError('An error occurred while loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Calculate target achievement percentage
  const targetAchievement = financialSummary.monthlyTarget > 0 
    ? (financialSummary.totalRevenue / financialSummary.monthlyTarget) * 100 
    : 0;

  return (
    <DashboardLayout 
      title="Accountant Dashboard" 
      subtitle="Financial overview and invoice management"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">RM {financialSummary.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <div className="text-gray-600">This Month</div>
          </div>
        </div>

        {/* Pending Payments Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Payments</p>
              <p className="text-2xl font-bold">RM {financialSummary.pendingPayments.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <Link to="/invoices?status=pending" className="text-yellow-600 hover:underline">View Pending</Link>
          </div>
        </div>

        {/* Received Payments Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Received Payments</p>
              <p className="text-2xl font-bold">RM {financialSummary.receivedPayments.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <CheckCircle size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <Link to="/invoices?status=paid" className="text-blue-600 hover:underline">View Paid</Link>
          </div>
        </div>

        {/* Monthly Target Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Monthly Target</p>
              <p className="text-2xl font-bold">RM {financialSummary.monthlyTarget.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <div className="text-gray-600">{targetAchievement.toFixed(1)}% Achieved</div>
          </div>
        </div>
      </div>

      {/* Invoice Statistics and Revenue Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Statistics */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b">
            <h2 className="font-semibold">Invoice Statistics</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 mr-3">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <span>Paid Invoices</span>
                </div>
                <div className="font-semibold">{invoiceStats.paid}</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-yellow-100 mr-3">
                    <Clock size={16} className="text-yellow-600" />
                  </div>
                  <span>Pending Invoices</span>
                </div>
                <div className="font-semibold">{invoiceStats.pending}</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-red-100 mr-3">
                    <AlertTriangle size={16} className="text-red-600" />
                  </div>
                  <span>Overdue Invoices</span>
                </div>
                <div className="font-semibold text-red-600">{invoiceStats.overdue}</div>
              </div>
              
              <div className="pt-2 mt-2 border-t">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 mr-3">
                      <FileText size={16} className="text-blue-600" />
                    </div>
                    <span>This Month's Invoices</span>
                  </div>
                  <div className="font-semibold">{invoiceStats.thisMonth}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Link 
                to="/invoices" 
                className="block w-full py-2 px-4 bg-blue-50 text-blue-600 text-center rounded-md hover:bg-blue-100"
              >
                Manage All Invoices
              </Link>
            </div>
          </div>
        </div>
        
        {/* Revenue Graph Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b flex justify-between items-center">
            <h2 className="font-semibold">Monthly Revenue</h2>
            <div className="text-sm">
              <select className="bg-gray-50 border border-gray-200 rounded-md px-2 py-1">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
          <div className="p-4 flex items-center justify-center h-64">
            <div className="text-center">
              <BarChart2 size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Revenue chart would appear here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h2 className="font-semibold">Recent Invoices</h2>
          <Link to="/invoices" className="text-sm text-blue-600 hover:underline">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice No.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentInvoices.length > 0 ? (
                recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      <div className="text-xs text-gray-500">{invoice.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link to={`/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        View
                      </Link>
                      <Link to={`/invoices/${invoice.id}/edit`} className="text-green-600 hover:text-green-900">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    {isLoading ? 'Loading invoices...' : 'No recent invoices found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b">
          <h2 className="font-semibold">Quick Actions</h2>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/invoices/create"
            className="block p-4 bg-blue-50 border border-blue-200 rounded-lg text-center hover:bg-blue-100"
          >
            <FileText size={24} className="inline-block mb-2 text-blue-600" />
            <div className="font-medium">Create Invoice</div>
          </Link>
          
          <Link
            to="/reports/financial"
            className="block p-4 bg-green-50 border border-green-200 rounded-lg text-center hover:bg-green-100"
          >
            <BarChart2 size={24} className="inline-block mb-2 text-green-600" />
            <div className="font-medium">Generate Report</div>
          </Link>
          
          <Link
            to="/invoices?status=overdue"
            className="block p-4 bg-red-50 border border-red-200 rounded-lg text-center hover:bg-red-100"
          >
            <AlertTriangle size={24} className="inline-block mb-2 text-red-600" />
            <div className="font-medium">View Overdue</div>
          </Link>
          
          <Link
            to="/export"
            className="block p-4 bg-purple-50 border border-purple-200 rounded-lg text-center hover:bg-purple-100"
          >
            <Download size={24} className="inline-block mb-2 text-purple-600" />
            <div className="font-medium">Export Financials</div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountantDashboard;