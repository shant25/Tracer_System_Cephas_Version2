import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart as BarChartIcon, 
  Download, 
  Calendar, 
  Filter, 
  Layers, 
  Building,
  User,
  FileText,
  Printer,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  PieChart,
  MapPin,
  Settings
} from 'lucide-react';

import useCephas from '../../hooks/useCephas';
import { showSuccess, showError } from '../../utils/notification';
import { hasActionPermission } from '../../utils/accessControl';

/**
 * Operational Reports Component
 * Displays operational metrics and reports for the company
 */
const OperationalReports = () => {
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
  const [reportType, setReportType] = useState('jobs');
  const [groupBy, setGroupBy] = useState('status');
  
  // State for operational data
  const [operationalData, setOperationalData] = useState({
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    cancelledJobs: 0,
    totalInstallers: 0,
    activeInstallers: 0,
    totalBuildings: 0,
    statsBreakdown: []
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
      showError('You do not have permission to view operational reports');
      navigate('/dashboard');
    } else {
      fetchOperationalSummary();
      fetchReportData();
    }
  }, [currentUser]);
  
  // Fetch new report data when filters change
  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType, groupBy]);
  
  // Fetch operational summary data
  const fetchOperationalSummary = async () => {
    setLoading(true);
    
    try {
      // In a real application, this would be an API call
      // For this example, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock operational summary data
      const mockData = {
        totalJobs: 842,
        completedJobs: 724,
        pendingJobs: 98,
        cancelledJobs: 20,
        totalInstallers: 24,
        activeInstallers: 18,
        totalBuildings: 37,
        statsBreakdown: [
          { name: 'Activation', count: 386, percentage: 45.8 },
          { name: 'Modification', count: 278, percentage: 33.0 },
          { name: 'Assurance', count: 178, percentage: 21.2 }
        ]
      };
      
      setOperationalData(mockData);
    } catch (err) {
      console.error('Error fetching operational summary:', err);
      setError('Failed to load operational summary');
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
      
      if (reportType === 'jobs') {
        if (groupBy === 'status') {
          mockReportData = [
            { name: 'Completed', value: 724, color: 'bg-green-500' },
            { name: 'Pending', value: 65, color: 'bg-yellow-500' },
            { name: 'Assigned', value: 33, color: 'bg-blue-500' },
            { name: 'Cancelled', value: 20, color: 'bg-red-500' }
          ];
        } else if (groupBy === 'type') {
          mockReportData = [
            { name: 'Activation', value: 386, color: 'bg-purple-500' },
            { name: 'Modification', value: 278, color: 'bg-indigo-500' },
            { name: 'Assurance', value: 178, color: 'bg-blue-500' }
          ];
        } else if (groupBy === 'building') {
          mockReportData = [
            { name: 'KELANA IMPIAN', value: 85, color: 'bg-blue-500' },
            { name: 'THE WESTSIDE II', value: 72, color: 'bg-blue-500' },
            { name: 'THE WESTSIDE I', value: 67, color: 'bg-blue-500' },
            { name: 'TARA 33', value: 63, color: 'bg-blue-500' },
            { name: 'LUMI TROPICANA', value: 58, color: 'bg-blue-500' },
            { name: 'SOLARIS PARQ', value: 54, color: 'bg-blue-500' },
            { name: 'RESIDENSI M LUNA', value: 52, color: 'bg-blue-500' },
            { name: 'KELANA PUTERI', value: 48, color: 'bg-blue-500' },
            { name: 'Others', value: 343, color: 'bg-gray-500' }
          ];
        } else if (groupBy === 'month') {
          mockReportData = [
            { name: 'Jan', value: 65, color: 'bg-blue-500' },
            { name: 'Feb', value: 58, color: 'bg-blue-500' },
            { name: 'Mar', value: 72, color: 'bg-blue-500' },
            { name: 'Apr', value: 67, color: 'bg-blue-500' },
            { name: 'May', value: 85, color: 'bg-blue-500' },
            { name: 'Jun', value: 92, color: 'bg-blue-500' },
            { name: 'Jul', value: 98, color: 'bg-blue-500' },
            { name: 'Aug', value: 103, color: 'bg-blue-500' },
            { name: 'Sep', value: 84, color: 'bg-blue-500' },
            { name: 'Oct', value: 75, color: 'bg-blue-500' },
            { name: 'Nov', value: 43, color: 'bg-blue-500' }
          ];
        }
      } else if (reportType === 'installers') {
        if (groupBy === 'activity') {
          mockReportData = [
            { name: 'Active', value: 18, color: 'bg-green-500' },
            { name: 'Inactive', value: 6, color: 'bg-red-500' }
          ];
        } else if (groupBy === 'performance') {
          mockReportData = [
            { name: 'High Performers', value: 8, color: 'bg-green-500' },
            { name: 'Average Performers', value: 12, color: 'bg-yellow-500' },
            { name: 'Low Performers', value: 4, color: 'bg-red-500' }
          ];
        } else if (groupBy === 'jobs_count') {
          mockReportData = [
            { name: '0-10 jobs', value: 5, color: 'bg-red-500' },
            { name: '11-30 jobs', value: 8, color: 'bg-yellow-500' },
            { name: '31-50 jobs', value: 6, color: 'bg-blue-500' },
            { name: '51+ jobs', value: 5, color: 'bg-green-500' }
          ];
        }
      } else if (reportType === 'buildings') {
        if (groupBy === 'activity') {
          mockReportData = [
            { name: 'Active (>10 jobs)', value: 22, color: 'bg-green-500' },
            { name: 'Moderate (5-10 jobs)', value: 8, color: 'bg-yellow-500' },
            { name: 'Low (<5 jobs)', value: 7, color: 'bg-red-500' }
          ];
        } else if (groupBy === 'type') {
          mockReportData = [
            { name: 'Prelaid', value: 17, color: 'bg-blue-500' },
            { name: 'Non-Prelaid', value: 20, color: 'bg-purple-500' }
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
    let csv = `Category,Count\n`;
    
    // Add data rows
    reportData.forEach(item => {
      csv += `${item.name},${item.value}\n`;
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
  
  // Get report title based on current filters
  const getReportTitle = () => {
    let typeLabel = '';
    let groupLabel = '';
    
    // Get report type label
    if (reportType === 'jobs') typeLabel = 'Jobs';
    else if (reportType === 'installers') typeLabel = 'Service Installers';
    else if (reportType === 'buildings') typeLabel = 'Buildings';
    
    // Get grouping label
    if (groupBy === 'status') groupLabel = 'Status';
    else if (groupBy === 'type') groupLabel = 'Type';
    else if (groupBy === 'building') groupLabel = 'Building';
    else if (groupBy === 'month') groupLabel = 'Month';
    else if (groupBy === 'activity') groupLabel = 'Activity Level';
    else if (groupBy === 'performance') groupLabel = 'Performance Level';
    else if (groupBy === 'jobs_count') groupLabel = 'Jobs Count';
    
    return `${typeLabel} by ${groupLabel}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operational Reports</h1>
          <p className="text-sm text-gray-500">
            View operational metrics and generate reports
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
      
      {/* Operational Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Jobs Card */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Jobs</p>
              <p className="text-2xl font-bold">{operationalData.totalJobs}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="inline-flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              {operationalData.completedJobs} completed
            </span>
            <span className="inline-flex items-center text-yellow-600">
              <Clock className="h-4 w-4 mr-1" />
              {operationalData.pendingJobs} pending
            </span>
          </div>
        </div>
        
        {/* Service Installers Card */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Service Installers</p>
              <p className="text-2xl font-bold">{operationalData.totalInstallers}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <User className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <div className="inline-flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>{operationalData.activeInstallers} active installers</span>
            </div>
          </div>
        </div>
        
        {/* Buildings Card */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Buildings</p>
              <p className="text-2xl font-bold">{operationalData.totalBuildings}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <Building className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <div className="inline-flex items-center text-blue-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Locations across Malaysia</span>
            </div>
          </div>
        </div>
        
        {/* Job Types Card */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Job Breakdown</p>
              <p className="text-2xl font-bold">{operationalData.statsBreakdown[0]?.name || "N/A"}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Settings className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <div className="inline-flex items-center text-gray-600">
              <PieChart className="h-4 w-4 mr-1" />
              <span>{operationalData.statsBreakdown[0]?.percentage || 0}% of all jobs</span>
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
                <option value="jobs">Jobs</option>
                <option value="installers">Service Installers</option>
                <option value="buildings">Buildings</option>
              </select>
            </div>
            
            {/* Group By Selector - Dynamic based on reportType */}
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
                {reportType === 'jobs' && (
                  <>
                    <option value="status">Status</option>
                    <option value="type">Type</option>
                    <option value="building">Building</option>
                    <option value="month">Month</option>
                  </>
                )}
                {reportType === 'installers' && (
                  <>
                    <option value="activity">Activity Status</option>
                    <option value="performance">Performance</option>
                    <option value="jobs_count">Jobs Count</option>
                  </>
                )}
                {reportType === 'buildings' && (
                  <>
                    <option value="activity">Activity Level</option>
                    <option value="type">Building Type</option>
                  </>
                )}
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
              {getReportTitle()}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {`For period ${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`}
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
              <div className="h-72 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                {/* In a real app, you would use a charting library like Chart.js or Recharts */}
                {reportData.length <= 4 ? (
                  <div className="text-center">
                    <PieChart className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Pie chart visualization would appear here
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <BarChartIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Bar chart visualization would appear here
                    </p>
                  </div>
                )}
              </div>
              
              {/* Report data table */}
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {groupBy === 'month' ? 'Month' : 
                        groupBy === 'building' ? 'Building' :
                        groupBy === 'type' ? 'Type' :
                        groupBy === 'status' ? 'Status' :
                        groupBy === 'activity' ? 'Activity' :
                        groupBy === 'performance' ? 'Performance' :
                        groupBy === 'jobs_count' ? 'Jobs Range' : 'Category'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Count
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.map((item) => {
                      // Calculate percentage
                      const total = reportData.reduce((sum, current) => sum + current.value, 0);
                      const percentage = ((item.value / total) * 100).toFixed(1);
                      
                      return (
                        <tr key={item.name}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-3 w-3 rounded-full ${item.color}`}></div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                            {item.value}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Total
                      </td>
                      <td className="px-6 py-3 text-right text-xs font-medium text-gray-700">
                        {reportData.reduce((sum, current) => sum + current.value, 0)}
                      </td>
                      <td className="px-6 py-3 text-right text-xs font-medium text-gray-700">
                        100%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* Summary Section */}
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Stats Overview
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                {reportType === 'jobs' && (
                  <>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Job Completion Rate</dt>
                      <dd className="mt-1 text-xl font-semibold text-gray-900">
                        {((operationalData.completedJobs / operationalData.totalJobs) * 100).toFixed(1)}%
                      </dd>
                      {/* Progress bar */}
                      <div className="mt-2 relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div
                            style={{ width: `${(operationalData.completedJobs / operationalData.totalJobs) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Cancellation Rate</dt>
                      <dd className="mt-1 text-xl font-semibold text-gray-900">
                        {((operationalData.cancelledJobs / operationalData.totalJobs) * 100).toFixed(1)}%
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Average Jobs per Building</dt>
                      <dd className="mt-1 text-xl font-semibold text-gray-900">
                        {(operationalData.totalJobs / operationalData.totalBuildings).toFixed(1)}
                      </dd>
                    </div>
                  </>
                )}
                
                {reportType === 'installers' && (
                  <>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Active Installer Rate</dt>
                      <dd className="mt-1 text-xl font-semibold text-gray-900">
                        {((operationalData.activeInstallers / operationalData.totalInstallers) * 100).toFixed(1)}%
                      </dd>
                      {/* Progress bar */}
                      <div className="mt-2 relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div
                            style={{ width: `${(operationalData.activeInstallers / operationalData.totalInstallers) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Average Jobs per Installer</dt>
                      <dd className="mt-1 text-xl font-semibold text-gray-900">
                        {(operationalData.totalJobs / operationalData.totalInstallers).toFixed(1)}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Installer Capacity</dt>
                      <dd className="mt-1 text-xl font-semibold text-gray-900">
                        {(operationalData.totalJobs / operationalData.activeInstallers / 30 * 100).toFixed(1)}%
                      </dd>
                      <dd className="mt-1 text-xs text-gray-500">
                        Estimated monthly capacity
                      </dd>
                    </div>
                  </>
                )}
                
                {reportType === 'buildings' && (
                  <>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Buildings with Activity</dt>
                      <dd className="mt-1 text-xl font-semibold text-gray-900">
                        {((30 / operationalData.totalBuildings) * 100).toFixed(1)}%
                      </dd>
                      {/* Progress bar */}
                      <div className="mt-2 relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div
                            style={{ width: `${(30 / operationalData.totalBuildings) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Average Jobs per Building</dt>
                      <dd className="mt-1 text-xl font-semibold text-gray-900">
                        {(operationalData.totalJobs / operationalData.totalBuildings).toFixed(1)}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Building Type Distribution</dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">
                        46% Prelaid
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>
          
          {/* Job Type Breakdown */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Job Type Breakdown
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="divide-y divide-gray-200">
                {operationalData.statsBreakdown.map((item) => (
                  <li key={item.name} className="py-3 flex justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-3 w-3 rounded-full ${
                        item.name === 'Activation' ? 'bg-purple-500' :
                        item.name === 'Modification' ? 'bg-indigo-500' :
                        'bg-blue-500'
                      }`}></div>
                      <p className="ml-3 text-sm font-medium text-gray-900">{item.name}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900 mr-2">{item.count}</p>
                      <p className="text-sm text-gray-500">({item.percentage}%)</p>
                    </div>
                  </li>
                ))}
              </ul>
              
              {/* Job type distribution visualization */}
              <div className="mt-4 relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                      Distribution
                    </span>
                  </div>
                </div>
                <div className="flex h-2 overflow-hidden rounded bg-gray-200">
                  {operationalData.statsBreakdown.map((item, index) => (
                    <div
                      key={index}
                      style={{ width: `${item.percentage}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        item.name === 'Activation' ? 'bg-purple-500' :
                        item.name === 'Modification' ? 'bg-indigo-500' :
                        'bg-blue-500'
                      }`}
                    ></div>
                  ))}
                </div>
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
                  href="/reports/financial" 
                  className="group p-3 border border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors duration-150"
                >
                  <div className="flex flex-col items-center text-center">
                    <DollarSign className="h-6 w-6 text-gray-400 group-hover:text-blue-600" />
                    <p className="mt-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">Financial Reports</p>
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

export default OperationalReports;