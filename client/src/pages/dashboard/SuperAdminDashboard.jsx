import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  List, 
  Settings, 
  FileText, 
  Users, 
  Package, 
  PieChart, 
  BarChart2, 
  AlertTriangle, 
  CheckCircle,
  Calendar
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useCephas from '../../hooks/useCephas';
import useNotification from '../../hooks/useNotification';
import api from '../../services/api';

/**
 * Super Admin Dashboard component with comprehensive system overview
 */
const SuperAdminDashboard = () => {
  const { dashboardStats } = useCephas();
  const { showError } = useNotification();
  const [performanceData, setPerformanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { today, tomorrow, future } = dashboardStats || {
    today: { activations: 0, modifications: 0, assurances: 0, totalJobs: 0, assignedJobs: 0, unassignedJobs: 0 },
    tomorrow: { activations: 0, modifications: 0, assurances: 0, totalJobs: 0, assignedJobs: 0, unassignedJobs: 0 },
    future: { activations: 0, modifications: 0, assurances: 0, totalJobs: 0, assignedJobs: 0, unassignedJobs: 0 }
  };

  // Fetch performance metrics
  useEffect(() => {
    const fetchPerformanceData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/dashboard/performance');
        if (response.success) {
          setPerformanceData(response.data);
        } else {
          showError('Failed to load performance data');
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
        showError('An error occurred while loading performance data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPerformanceData();
  }, []);

  // Quick access cards for Super Admin
  const quickAccessCards = [
    {
      title: 'Buildings',
      icon: <List size={24} className="text-blue-600" />,
      description: 'Manage building details and lists',
      link: '/building',
      color: 'bg-blue-100 border-blue-300'
    },
    {
      title: 'Activations',
      icon: <Settings size={24} className="text-green-600" />,
      description: 'View and manage activation orders',
      link: '/activation',
      color: 'bg-green-100 border-green-300'
    },
    {
      title: 'Assurance',
      icon: <FileText size={24} className="text-yellow-600" />,
      description: 'Check assurance tickets and status',
      link: '/assurance',
      color: 'bg-yellow-100 border-yellow-300'
    },
    {
      title: 'Service Installers',
      icon: <Users size={24} className="text-purple-600" />,
      description: 'Manage service installer details',
      link: '/service-installer',
      color: 'bg-purple-100 border-purple-300'
    },
    {
      title: 'Materials',
      icon: <Package size={24} className="text-red-600" />,
      description: 'View and manage material inventory',
      link: '/material',
      color: 'bg-red-100 border-red-300'
    },
    {
      title: 'Reports',
      icon: <PieChart size={24} className="text-indigo-600" />,
      description: 'Financial and operational reports',
      link: '/reports',
      color: 'bg-indigo-100 border-indigo-300'
    }
  ];

  return (
    <DashboardLayout 
      title="Super Admin Dashboard" 
      subtitle="Overall system health and performance metrics"
    >
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's stats */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="font-medium text-lg text-blue-700 mb-4">Today's Schedule</div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Activations</span>
              <span className="font-semibold">{today.activations}</span>
            </div>
            <div className="flex justify-between">
              <span>Modifications</span>
              <span className="font-semibold">{today.modifications}</span>
            </div>
            <div className="flex justify-between">
              <span>Assurances</span>
              <span className="font-semibold">{today.assurances}</span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-semibold">{today.totalJobs}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>Assigned</span>
              <span className="font-semibold">{today.assignedJobs}</span>
            </div>
            <div className="flex justify-between">
              <span>Unassigned</span>
              <span className="font-semibold text-red-600">{today.unassignedJobs}</span>
            </div>
          </div>
        </div>

        {/* Tomorrow's stats */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="font-medium text-lg text-green-700 mb-4">Tomorrow's Schedule</div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Activations</span>
              <span className="font-semibold">{tomorrow.activations}</span>
            </div>
            <div className="flex justify-between">
              <span>Modifications</span>
              <span className="font-semibold">{tomorrow.modifications}</span>
            </div>
            <div className="flex justify-between">
              <span>Assurances</span>
              <span className="font-semibold">{tomorrow.assurances}</span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-semibold">{tomorrow.totalJobs}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>Assigned</span>
              <span className="font-semibold">{tomorrow.assignedJobs}</span>
            </div>
            <div className="flex justify-between">
              <span>Unassigned</span>
              <span className="font-semibold text-red-600">{tomorrow.unassignedJobs}</span>
            </div>
          </div>
        </div>

        {/* Future stats */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="font-medium text-lg text-purple-700 mb-4">Future Schedule</div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Activations</span>
              <span className="font-semibold">{future.activations}</span>
            </div>
            <div className="flex justify-between">
              <span>Modifications</span>
              <span className="font-semibold">{future.modifications}</span>
            </div>
            <div className="flex justify-between">
              <span>Assurances</span>
              <span className="font-semibold">{future.assurances}</span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-semibold">{future.totalJobs}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>Assigned</span>
              <span className="font-semibold">{future.assignedJobs}</span>
            </div>
            <div className="flex justify-between">
              <span>Unassigned</span>
              <span className="font-semibold text-red-600">{future.unassignedJobs}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickAccessCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className={`block p-6 rounded-lg border shadow-sm transition-transform hover:shadow-md hover:-translate-y-1 ${card.color}`}
            >
              <div className="flex items-start">
                <div className="mr-4 p-3 rounded-full bg-white">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{card.title}</h3>
                  <p className="text-gray-600 mt-1">{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Unassigned Jobs Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Unassigned Jobs</h2>
          <Link to="/activation" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {today.unassignedJobs > 0 ? (
          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-red-100 mr-3">
                <Calendar size={20} className="text-red-600" />
              </div>
              <div>
                <div className="font-medium">Today's Unassigned Jobs</div>
                <div className="text-sm text-gray-600">Require immediate attention</div>
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-red-600">{today.unassignedJobs}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 mr-3">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <div className="font-medium">Today's Jobs</div>
                <div className="text-sm text-gray-600">All jobs assigned</div>
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-green-600">✓</span>
            </div>
          </div>
        )}

        {tomorrow.unassignedJobs > 0 && (
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-yellow-100 mr-3">
                <AlertTriangle size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="font-medium">Tomorrow's Unassigned Jobs</div>
                <div className="text-sm text-gray-600">Need assignment</div>
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-yellow-600">{tomorrow.unassignedJobs}</span>
            </div>
          </div>
        )}
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Monthly Performance</h2>
          <Link to="/reports/performance" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Details
          </Link>
        </div>
        <div className="flex justify-center items-center h-64 border border-gray-200 rounded-lg bg-gray-50">
          <div className="text-center">
            <BarChart2 size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Performance charts would appear here</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;