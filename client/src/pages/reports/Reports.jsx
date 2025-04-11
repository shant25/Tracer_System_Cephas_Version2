import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  DollarSign, 
  Users, 
  FileText, 
  Download, 
  Calendar, 
  ChevronRight, 
  Layers,
  Award,
  TrendingUp,
  Settings
} from 'lucide-react';

import useCephas from '../../hooks/useCephas';
import { showError } from '../../utils/notification';
import { hasActionPermission } from '../../utils/accessControl';

/**
 * Reports Component
 * Main entry point for the reports module
 */
const Reports = () => {
  const navigate = useNavigate();
  const { currentUser } = useCephas();
  
  // Check permissions on component mount
  useEffect(() => {
    const hasAccess = hasActionPermission(
      currentUser?.role, 
      'view_report'
    );
    
    if (!hasAccess) {
      showError('You do not have permission to view reports');
      navigate('/dashboard');
    }
  }, [currentUser]);
  
  // Report categories
  const reportCategories = [
    {
      id: 'financial',
      title: 'Financial Reports',
      description: 'Revenue, expenses, and profit analysis',
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      color: 'bg-green-50 border-green-200',
      reports: [
        { name: 'Revenue Analysis', path: '/reports/financial?report=revenue' },
        { name: 'Expense Breakdown', path: '/reports/financial?report=expenses' },
        { name: 'Profit Margins', path: '/reports/financial?report=profit' },
        { name: 'Invoice Status', path: '/reports/financial?report=invoices' }
      ]
    },
    {
      id: 'operational',
      title: 'Operational Reports',
      description: 'Jobs, buildings, and resource utilization',
      icon: <Layers className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      reports: [
        { name: 'Job Status Analysis', path: '/reports/operational?report=jobs' },
        { name: 'Building Activity', path: '/reports/operational?report=buildings' },
        { name: 'Service Installer Status', path: '/reports/operational?report=installers' },
        { name: 'Job Type Distribution', path: '/reports/operational?report=types' }
      ]
    },
    {
      id: 'performance',
      title: 'Performance Reports',
      description: 'Service quality and efficiency metrics',
      icon: <Award className="h-8 w-8 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200',
      reports: [
        { name: 'Installer Performance', path: '/reports/performance?report=installer' },
        { name: 'Completion Time Analysis', path: '/reports/performance?report=completionTime' },
        { name: 'Customer Satisfaction', path: '/reports/performance?report=satisfaction' },
        { name: 'Efficiency Metrics', path: '/reports/performance?report=efficiency' }
      ]
    }
  ];
  
  // Recent reports (this would come from an API in a real implementation)
  const recentReports = [
    { 
      id: 1, 
      name: 'November 2024 Revenue Report', 
      type: 'Financial', 
      date: 'Dec 1, 2024',
      path: '/reports/financial?report=revenue&date=2024-11'
    },
    { 
      id: 2, 
      name: 'Service Installer Efficiency Report', 
      type: 'Performance', 
      date: 'Nov 28, 2024',
      path: '/reports/performance?report=efficiency'
    },
    { 
      id: 3, 
      name: 'Q3 2024 Operational Summary', 
      type: 'Operational', 
      date: 'Oct 15, 2024',
      path: '/reports/operational?period=q3'
    }
  ];
  
  // Report quick actions
  const quickActions = [
    { 
      title: 'Export Data', 
      description: 'Download raw data for offline analysis',
      icon: <Download className="h-6 w-6 text-gray-500" />,
      path: '/export'
    },
    { 
      title: 'Schedule Reports', 
      description: 'Set up automated report distribution',
      icon: <Calendar className="h-6 w-6 text-gray-500" />,
      path: '/settings/notifications'
    },
    { 
      title: 'Configure Settings', 
      description: 'Customize report preferences',
      icon: <Settings className="h-6 w-6 text-gray-500" />,
      path: '/settings'
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500">
          View and generate reports across different business areas
        </p>
      </div>
      
      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {reportCategories.map((category) => (
          <div 
            key={category.id} 
            className={`border ${category.color} rounded-lg shadow-sm overflow-hidden`}
          >
            <div className="p-5 flex items-start space-x-4">
              <div className="flex-shrink-0">
                {category.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900">{category.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                <div className="mt-4">
                  <Link
                    to={`/reports/${category.id}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View Reports
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-white px-5 py-3 border-t">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Popular Reports</h3>
              <ul className="mt-2 divide-y divide-gray-200">
                {category.reports.map((report, index) => (
                  <li key={index}>
                    <Link
                      to={report.path}
                      className="block py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 -mx-5 px-5"
                    >
                      {report.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b flex justify-between items-center">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Reports</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Last 30 days
            </span>
          </div>
          <div className="bg-white">
            <ul className="divide-y divide-gray-200">
              {recentReports.map((report) => (
                <li key={report.id}>
                  <Link 
                    to={report.path}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {report.type === 'Financial' ? (
                            <DollarSign className="h-5 w-5 text-green-500 mr-3" />
                          ) : report.type === 'Operational' ? (
                            <Layers className="h-5 w-5 text-blue-500 mr-3" />
                          ) : (
                            <Award className="h-5 w-5 text-purple-500 mr-3" />
                          )}
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {report.name}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {report.type}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            Generated on {report.date}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <TrendingUp className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          View report
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
              <Link 
                to="/reports/history" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all reports <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {quickActions.map((action, index) => (
              <div key={index} className="px-4 py-4 sm:px-6">
                <Link
                  to={action.path}
                  className="block hover:bg-gray-50 -mx-4 -my-4 px-4 py-4 sm:-mx-6 sm:px-6"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                        {action.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Help Section */}
          <div className="bg-blue-50 px-4 py-4 sm:px-6 border-t border-blue-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Need Help?</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Learn how to create and customize reports in the documentation.
                </p>
                <div className="mt-3">
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View Documentation <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Stats */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Report Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Reports Generated</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">127</dd>
              <dd className="mt-1 text-xs text-gray-500">Last 30 days</dd>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <dt className="text-sm font-medium text-gray-500 truncate">Most Generated Report</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">Financial Report</dd>
              <dd className="mt-1 text-xs text-gray-500">42 generations</dd>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <dt className="text-sm font-medium text-gray-500 truncate">Exports Completed</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">89</dd>
              <dd className="mt-1 text-xs text-gray-500">CSV and PDF formats</dd>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <dt className="text-sm font-medium text-gray-500 truncate">Scheduled Reports</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">8</dd>
              <dd className="mt-1 text-xs text-gray-500">Weekly and monthly</dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;