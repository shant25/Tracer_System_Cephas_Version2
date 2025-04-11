import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  UserCheck, 
  Award, 
  Clock, 
  Calendar, 
  Filter, 
  Download,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FilterBar from '../../components/common/FilterBar';
import useCephas from '../../hooks/useCephas';
import useNotification from '../../hooks/useNotification';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

/**
 * PerformanceReports component for displaying installer and operational performance reports
 */
const PerformanceReports = () => {
  const { serviceInstallers } = useCephas();
  const notification = useNotification();
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('installer');
  const [installerFilters, setInstallerFilters] = useState({
    installerId: '',
    dateFrom: '',
    dateTo: ''
  });
  
  // Mock data
  const [installerPerformance, setInstallerPerformance] = useState([]);
  const [completionRates, setCompletionRates] = useState([]);
  const [installationTimes, setInstallationTimes] = useState([]);
  
  // Load report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        // Mock data - in a real app, this would come from an API
        const mockInstallerPerformance = [
          { 
            id: 1, 
            name: 'K. MARIAPPAN A/L KUPPATHAN', 
            completed: 42, 
            outstanding: 3, 
            onTime: 39, 
            delayed: 3,
            avgCompletionTime: 2.3,
            totalEarnings: 8400
          },
          { 
            id: 2, 
            name: 'SARAVANAN A/L I. CHINNIAH', 
            completed: 37, 
            outstanding: 5, 
            onTime: 35, 
            delayed: 2,
            avgCompletionTime: 2.1,
            totalEarnings: 7400
          },
          { 
            id: 3, 
            name: 'MOHAMAD RIZAL BIN AWANG', 
            completed: 28, 
            outstanding: 7, 
            onTime: 26, 
            delayed: 2,
            avgCompletionTime: 2.7,
            totalEarnings: 5600
          }
        ];
        
        const mockCompletionRates = [
          { date: '2023-06', completionRate: 92, totalJobs: 50 },
          { date: '2023-07', completionRate: 88, totalJobs: 58 },
          { date: '2023-08', completionRate: 90, totalJobs: 62 },
          { date: '2023-09', completionRate: 93, totalJobs: 71 },
          { date: '2023-10', completionRate: 89, totalJobs: 67 },
          { date: '2023-11', completionRate: 91, totalJobs: 65 }
        ];
        
        const mockInstallationTimes = [
          { installer: 'K. MARIAPPAN A/L KUPPATHAN', Activation: 2.3, Modification: 1.9, Assurance: 1.1 },
          { installer: 'SARAVANAN A/L I. CHINNIAH', Activation: 2.1, Modification: 1.8, Assurance: 1.3 },
          { installer: 'MOHAMAD RIZAL BIN AWANG', Activation: 2.7, Modification: 2.2, Assurance: 1.4 }
        ];
        
        setInstallerPerformance(mockInstallerPerformance);
        setCompletionRates(mockCompletionRates);
        setInstallationTimes(mockInstallationTimes);
      } catch (error) {
        console.error('Error fetching report data:', error);
        notification.error('An error occurred while loading report data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [timeRange, installerFilters, notification]);
  
  // Download report as PDF
  const handleDownloadPDF = () => {
    notification.info('Generating PDF report...');
    // This would be implemented with a PDF generation library
    setTimeout(() => {
      notification.success('PDF report downloaded successfully');
    }, 1500);
  };
  
  // Download report as Excel
  const handleDownloadExcel = () => {
    notification.info('Generating Excel report...');
    // This would be implemented with an Excel generation library
    setTimeout(() => {
      notification.success('Excel report downloaded successfully');
    }, 1500);
  };
  
  // Refresh data
  const handleRefresh = () => {
    notification.info('Refreshing report data...');
    // This would trigger a re-fetch from the API
    setTimeout(() => {
      notification.success('Report data refreshed');
    }, 1000);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setInstallerFilters(newFilters);
  };
  
  // Get installer options for filter
  const installerOptions = serviceInstallers 
    ? serviceInstallers.map(installer => ({
        value: installer.id.toString(),
        label: installer.name
      })) 
    : [];
    
  // Filter definitions
  const filterDefinitions = [
    {
      id: 'installerId',
      label: 'Service Installer',
      type: 'select',
      options: [
        { value: '', label: 'All Installers' },
        ...installerOptions
      ]
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'daterange'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and analyze service installer and operation performance metrics
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            leftIcon={<RefreshCw size={16} />}
            disabled={loading}
          >
            Refresh
          </Button>
          
          <div className="relative inline-block text-left">
            <div>
              <Button
                variant="outline"
                rightIcon={<ChevronDown size={16} />}
                leftIcon={<Download size={16} />}
              >
                Export
              </Button>
            </div>
            
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 hidden">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  onClick={handleDownloadPDF}
                >
                  Download as PDF
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  onClick={handleDownloadExcel}
                >
                  Download as Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Type Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Tabs">
            <button
              onClick={() => setReportType('installer')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                reportType === 'installer'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserCheck size={16} className="inline-block mr-2" />
              Installer Performance
            </button>
            <button
              onClick={() => setReportType('completion')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                reportType === 'completion'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Award size={16} className="inline-block mr-2" />
              Completion Rates
            </button>
            <button
              onClick={() => setReportType('time')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                reportType === 'time'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Clock size={16} className="inline-block mr-2" />
              Installation Times
            </button>
          </nav>
        </div>
      </div>
      
      {/* Time Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Time Range</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <button
                onClick={() => setTimeRange('week')}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                  timeRange === 'week'
                    ? 'bg-green-50 border-green-500 text-green-600 z-10'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } rounded-l-md focus:outline-none`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium border ${
                  timeRange === 'month'
                    ? 'bg-green-50 border-green-500 text-green-600 z-10'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } focus:outline-none`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange('quarter')}
                className={`relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium border ${
                  timeRange === 'quarter'
                    ? 'bg-green-50 border-green-500 text-green-600 z-10'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } focus:outline-none`}
              >
                Quarter
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium border ${
                  timeRange === 'year'
                    ? 'bg-green-50 border-green-500 text-green-600 z-10'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } rounded-r-md focus:outline-none`}
              >
                Year
              </button>
            </div>
          </div>
          
          <div>
            <Button
              leftIcon={<Filter size={16} />}
              variant="outline"
            >
              Additional Filters
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filter Bar */}
      <FilterBar
        filters={filterDefinitions}
        activeFilters={installerFilters}
        onFilter={handleFilterChange}
        onReset={() => setInstallerFilters({
          installerId: '',
          dateFrom: '',
          dateTo: ''
        })}
      />
      
      {/* Performance Report Content based on selected type */}
      {reportType === 'installer' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Installations</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {installerPerformance.reduce((sum, installer) => sum + installer.completed, 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <UserCheck size={24} className="text-blue-600" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  In the selected time period
                </p>
              </div>
            </Card>
            
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {Math.round(
                        (installerPerformance.reduce((sum, installer) => sum + installer.onTime, 0) /
                          installerPerformance.reduce((sum, installer) => sum + installer.completed, 0)) *
                          100
                      )}%
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Clock size={24} className="text-green-600" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Installations completed on schedule
                </p>
              </div>
            </Card>
            
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Time</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(
                        installerPerformance.reduce((sum, installer) => sum + installer.avgCompletionTime, 0) /
                        installerPerformance.length
                      ).toFixed(1)} hrs
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar size={24} className="text-purple-600" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Average installation time
                </p>
              </div>
            </Card>
          </div>
          
          {/* Installer Performance Table */}
          <Card title="Installer Performance">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Installer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Outstanding
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      On-Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delayed
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earnings
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {installerPerformance.map((installer) => (
                    <tr key={installer.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{installer.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {installer.completed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {installer.outstanding}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {installer.onTime} ({Math.round((installer.onTime / installer.completed) * 100)}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {installer.delayed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {installer.avgCompletionTime.toFixed(1)} hrs
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {formatCurrency(installer.totalEarnings, 'MYR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          {/* Performance Chart */}
          <Card title="Installation Performance">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={installerPerformance}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" name="Completed" fill="#3b82f6" />
                  <Bar dataKey="outstanding" name="Outstanding" fill="#ef4444" />
                  <Bar dataKey="onTime" name="On Time" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
      
      {reportType === 'completion' && (
        <div className="space-y-6">
          {/* Completion Rate Chart */}
          <Card title="Monthly Completion Rates">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={completionRates}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completionRate" name="Completion Rate (%)" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="totalJobs" name="Total Jobs" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Completion Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Completion by Type">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Activation', completed: 78, total: 85 },
                      { name: 'Modification', completed: 45, total: 50 },
                      { name: 'Assurance', completed: 62, total: 65 }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" name="Completed" fill="#10b981" />
                    <Bar dataKey="total" name="Total" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card title="Completion by Building">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Sunway Velocity', rate: 92 },
                      { name: 'Solaris Parq', rate: 88 },
                      { name: 'The Westside II', rate: 95 },
                      { name: 'TARA 33', rate: 86 },
                      { name: 'M Luna', rate: 91 }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rate" name="Completion Rate (%)" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {reportType === 'time' && (
        <div className="space-y-6">
          {/* Installation Time Chart */}
          <Card title="Average Installation Time by Type">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={installationTimes}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="installer" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Activation" name="Activation" fill="#3b82f6" />
                  <Bar dataKey="Modification" name="Modification" fill="#10b981" />
                  <Bar dataKey="Assurance" name="Assurance" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Time Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Installation Time Trends">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Jun', time: 2.8 },
                      { month: 'Jul', time: 2.6 },
                      { month: 'Aug', time: 2.5 },
                      { month: 'Sep', time: 2.3 },
                      { month: 'Oct', time: 2.4 },
                      { month: 'Nov', time: 2.2 }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="time" name="Avg. Time (hours)" stroke="#3b82f6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card title="Time by Building Type">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Prelaid', time: 1.8 },
                      { name: 'Non Prelaid', time: 3.2 },
                      { name: 'Both', time: 2.5 }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="time" name="Avg. Time (hours)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceReports;