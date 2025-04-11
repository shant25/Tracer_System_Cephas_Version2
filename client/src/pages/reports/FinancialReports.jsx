import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart as BarChartIcon, 
  Download, 
  Calendar, 
  Filter, 
  DollarSign, 
  ArrowUp, 
  ArrowDown, 
  FileText,
  Printer,
  ChevronDown,
  Layers
} from 'lucide-react';

import useCephas from '../../hooks/useCephas';
import { showSuccess, showError } from '../../utils/notification';
import { formatCurrency } from '../../utils/formatters';
import { hasActionPermission } from '../../utils/accessControl';

/**
 * Financial Reports Component
 * Displays financial data and reports for the company
 */
const FinancialReports = () => {
  const navigate = useNavigate();
  const { currentUser } = useCephas();
  
  // State for data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for report filters
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // First day of current month
    endDate: new Date().toISOString().split('T')[0] // Today
  });
  const [reportType, setReportType] = useState('revenue');
  const [groupBy, setGroupBy] = useState('month');
  
  // State for financial data
  const [financialData, setFinancialData] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    invoicesPaid: 0,
    invoicesPending: 0,
    topServices: []
  });
  
  // State for report data
  const [reportData, setReportData] = useState([]);
  
  // Check permissions on component mount
  useEffect(() => {
    const hasAccess = hasActionPermission(
      currentUser?.role, 
      'view_report'
    );
    
    if (!hasAccess) {
      showError('You do not have permission to view financial reports');
      navigate('/dashboard');
    } else {
      fetchFinancialSummary();
      fetchReportData();
    }
  }, [currentUser]);
  
  // Fetch new report data when filters change
  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType, groupBy]);
  
  // Fetch financial summary data
  const fetchFinancialSummary = async () => {
    setLoading(true);
    
    try {
      // In a real application, this would be an API call
      // For this example, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock financial summary data
      const mockData = {
        revenue: 567850.00,
        expenses: 321420.75,
        profit: 246429.25,
        invoicesPaid: 187,
        invoicesPending: 42,
        topServices: [
          { name: 'Activation', revenue: 278500.00, count: 85 },
          { name: 'Modification', revenue: 156200.00, count: 62 },
          { name: 'Assurance', revenue: 133150.00, count: 40 }
        ]
      };
      
      setFinancialData(mockData);
    } catch (err) {
      console.error('Error fetching financial summary:', err);
      setError('Failed to load financial summary');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch report data based on filters
  const fetchReportData = async () => {
    setLoading(true);
    
    try {
      // In a real application, this would be an API call with filters
      // For this example, we'll generate mock data based on the filters
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data based on report type and grouping
      let mockReportData = [];
      
      if (reportType === 'revenue') {
        if (groupBy === 'month') {
          mockReportData = [
            { period: 'Jan', value: 42500.00 },
            { period: 'Feb', value: 38700.00 },
            { period: 'Mar', value: 52300.00 },
            { period: 'Apr', value: 44650.00 },
            { period: 'May', value: 57200.00 },
            { period: 'Jun', value: 63800.00 },
            { period: 'Jul', value: 68400.00 },
            { period: 'Aug', value: 72300.00 },
            { period: 'Sep', value: 55700.00 },
            { period: 'Oct', value: 48300.00 },
            { period: 'Nov', value: 23000.00 },
            { period: 'Dec', value: 0 } // Future month
          ];
        } else if (groupBy === 'service') {
          mockReportData = [
            { period: 'Activation', value: 278500.00 },
            { period: 'Modification', value: 156200.00 },
            { period: 'Assurance', value: 133150.00 }
          ];
        } else if (groupBy === 'building') {
          mockReportData = [
            { period: 'KELANA IMPIAN', value: 85300.00 },
            { period: 'THE WESTSIDE II', value: 74600.00 },
            { period: 'THE WESTSIDE I', value: 67200.00 },
            { period: 'TARA 33', value: 65400.00 },
            { period: 'LUMI TROPICANA', value: 59800.00 },
            { period: 'SOLARIS PARQ', value: 58300.00 },
            { period: 'RESIDENSI M LUNA', value: 57500.00 },
            { period: 'KELANA PUTERI', value: 52700.00 },
            { period: 'Others', value: 47050.00 }
          ];
        }
      } else if (reportType === 'expenses') {
        if (groupBy === 'month') {
          mockReportData = [
            { period: 'Jan', value: 24300.00 },
            { period: 'Feb', value: 22500.00 },
            { period: 'Mar', value: 28700.00 },
            { period: 'Apr', value: 25400.00 },
            { period: 'May', value: 32100.00 },
            { period: 'Jun', value: 33600.00 },
            { period: 'Jul', value: 36800.00 },
            { period: 'Aug', value: 38500.00 },
            { period: 'Sep', value: 32700.00 },
            { period: 'Oct', value: 27600.00 },
            { period: 'Nov', value: 19200.00 },
            { period: 'Dec', value: 0 } // Future month
          ];
        } else if (groupBy === 'category') {
          mockReportData = [
            { period: 'Materials', value: 172400.00 },
            { period: 'Installer Payments', value: 98600.00 },
            { period: 'Transportation', value: 23500.00 },
            { period: 'Office Expenses', value: 14800.00 },
            { period: 'Utilities', value: 8900.00 },
            { period: 'Other', value: 3220.75 }
          ];
        }
      } else if (reportType === 'profit') {
        if (groupBy === 'month') {
          mockReportData = [
            { period: 'Jan', value: 18200.00 },
            { period: 'Feb', value: 16200.00 },
            { period: 'Mar', value: 23600.00 },
            { period: 'Apr', value: 19250.00 },
            { period: 'May', value: 25100.00 },
            { period: 'Jun', value: 30200.00 },
            { period: 'Jul', value: 31600.00 },
            { period: 'Aug', value: 33800.00 },
            { period: 'Sep', value: 23000.00 },
            { period: 'Oct', value: 20700.00 },
            { period: 'Nov', value: 3800.00 },
            { period: 'Dec', value: 0 } // Future month
          ];
        } else if (groupBy === 'quarter') {
          mockReportData = [
            { period: 'Q1', value: 58000.00 },
            { period: 'Q2', value: 74550.00 },
            { period: 'Q3', value: 88400.00 },
            { period: 'Q4', value: 24500.00 }
          ];
        }
      }
      
      setReportData(mockReportData);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate CSV data for export
  const generateCSV = () => {
    if (!reportData || reportData.length === 0) return;
    
    // Create CSV header
    let csv = `Period,${reportType.charAt(0).toUpperCase() + reportType.slice(1)}\n`;
    
    // Add data rows
    reportData.forEach(item => {
      csv += `${item.period},${item.value}\n`;
    });
    
    return csv;
  };
  
  // Handle export to CSV
  const handleExportCSV = () => {
    const csv = generateCSV();
    if (!csv) return;
    
    // Create a Blob and download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Handle print report
  const handlePrintReport = () => {
    window.print();
  };
  
  // Calculate the change percentage between current and previous period
  const calculateChange = (currentValue, previousValue) => {
    if (previousValue === 0) return 100; // If previous was 0, consider it 100% increase
    return ((currentValue - previousValue) / previousValue) * 100;
  };
  
  // Get summary data for the selected report type
  const getReportSummary = () => {
    const data = reportData.filter(item => item.value > 0); // Filter out future months with 0 value
    
    if (data.length === 0) return { current: 0, previous: 0, change: 0 };
    
    const current = data[data.length - 1]?.value || 0;
    const previous = data[data.length - 2]?.value || 0;
    const change = calculateChange(current, previous);
    
    return { current, previous, change };
  };
  
  const summary = getReportSummary();
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-sm text-gray-500">
            View financial metrics and generate reports
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrintReport}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Printer className="h-5 w-5 mr-2 text-gray-500" />
            Print
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Revenue Card */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(financialData.revenue)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <div className={`flex items-center ${financialData.revenue > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {financialData.revenue > 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span>12.6% from last period</span>
            </div>
          </div>
        </div>
        
        {/* Expenses Card */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold">{formatCurrency(financialData.expenses)}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <ArrowDown className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <div className="flex items-center text-red-600">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span>8.3% from last period</span>
            </div>
          </div>
        </div>
        
        {/* Profit Card */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Net Profit</p>
              <p className="text-2xl font-bold">{formatCurrency(financialData.profit)}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <BarChartIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <div className="flex items-center text-blue-600">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span>43.4% profit margin</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Range Selector */}
            <div className="col-span-1 md:col-span-2">
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
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            {/* Report Type Selector */}
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="revenue">Revenue</option>
                <option value="expenses">Expenses</option>
                <option value="profit">Profit</option>
              </select>
            </div>
            
            {/* Group By Selector */}
            <div>
              <label htmlFor="groupBy" className="block text-sm font-medium text-gray-700 mb-1">
                Group By
              </label>
              <select
                id="groupBy"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="month">Month</option>
                {reportType === 'revenue' && <option value="service">Service Type</option>}
                {reportType === 'revenue' && <option value="building">Building</option>}
                {reportType === 'expenses' && <option value="category">Category</option>}
                {reportType === 'profit' && <option value="quarter">Quarter</option>}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 border-b">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {`Grouped by ${groupBy} for selected period`}
            </p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-80">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Report</h3>
                <p className="mt-1 text-sm text-gray-500">{error}</p>
                <div className="mt-6">
                  <button
                    onClick={fetchReportData}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {/* Chart visualization placeholder */}
              <div className="h-80 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                {/* In a real app, you would use a charting library like Chart.js or Recharts */}
                <div className="text-center">
                  <BarChartIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Chart visualization would appear here
                  </p>
                </div>
              </div>
              
              {/* Report data table */}
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {reportType.charAt(0).toUpperCase() + reportType.slice(1)}
                      </th>
                      {groupBy === 'month' && (
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Change %
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.map((item, index) => (
                      <tr key={item.period}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                          {formatCurrency(item.value)}
                        </td>
                        {groupBy === 'month' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            {index > 0 ? (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.value > reportData[index - 1].value 
                                  ? 'bg-green-100 text-green-800' 
                                  : item.value < reportData[index - 1].value
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                {item.value > reportData[index - 1].value ? '+' : ''}
                                {reportData[index - 1].value === 0 
                                  ? 'N/A' 
                                  : `${((item.value - reportData[index - 1].value) / reportData[index - 1].value * 100).toFixed(1)}%`}
                              </span>
                            ) : 'N/A'}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* Summary Section */}
        <div className="space-y-6">
          {/* Current Period Stats */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {reportType === 'revenue' ? 'Revenue' : reportType === 'expenses' ? 'Expense' : 'Profit'} Summary
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Current Period</dt>
                  <dd className="mt-1 text-xl font-semibold text-gray-900">{formatCurrency(summary.current)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Previous Period</dt>
                  <dd className="mt-1 text-lg text-gray-900">{formatCurrency(summary.previous)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Change</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    <span className={`inline-flex items-center ${
                      summary.change > 0 
                        ? 'text-green-600' 
                        : summary.change < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }`}>
                      {summary.change > 0 ? (
                        <ArrowUp className="h-5 w-5 mr-1" />
                      ) : summary.change < 0 ? (
                        <ArrowDown className="h-5 w-5 mr-1" />
                      ) : null}
                      {summary.change.toFixed(1)}%
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Revenue Breakdown */}
          {reportType === 'revenue' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Revenue by Service Type
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="divide-y divide-gray-200">
                  {financialData.topServices.map((service) => (
                    <li key={service.name} className="py-3 flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500">{service.count} jobs</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(service.revenue)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Invoice Status */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Invoice Status
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Paid</p>
                  <p className="text-lg font-semibold text-green-600">{financialData.invoicesPaid}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-lg font-semibold text-yellow-600">{financialData.invoicesPending}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-lg font-semibold text-gray-900">{financialData.invoicesPaid + financialData.invoicesPending}</p>
                </div>
              </div>
              
              {/* Progress bar for invoice status */}
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${(financialData.invoicesPaid / (financialData.invoicesPaid + financialData.invoicesPending)) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-green-600">{`${Math.round((financialData.invoicesPaid / (financialData.invoicesPaid + financialData.invoicesPending)) * 100)}% Paid`}</span>
                  <span className="text-yellow-600">{`${Math.round((financialData.invoicesPending / (financialData.invoicesPaid + financialData.invoicesPending)) * 100)}% Pending`}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <a href="/invoices" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View all invoices →
                </a>
              </div>
            </div>
          </div>
          
          {/* Quick Shortcuts */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Report Shortcuts
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="/reports/operational" 
                  className="group p-3 border border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors duration-150"
                >
                  <div className="flex flex-col items-center text-center">
                    <Layers className="h-6 w-6 text-gray-400 group-hover:text-blue-600" />
                    <p className="mt-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">Operational Reports</p>
                  </div>
                </a>
                <a 
                  href="/reports/performance" 
                  className="group p-3 border border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors duration-150"
                >
                  <div className="flex flex-col items-center text-center">
                    <BarChartIcon className="h-6 w-6 text-gray-400 group-hover:text-blue-600" />
                    <p className="mt-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">Performance Reports</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;