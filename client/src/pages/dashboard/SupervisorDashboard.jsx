import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  FileSearch, 
  Calendar, 
  Clock,
  Plus
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import useNotification from '../../hooks/useNotification';
import useCephas from '../../hooks/useCephas';
import api from '../../services/api';

/**
 * Supervisor Dashboard component
 * Focuses on service installer management, job assignments, and status tracking
 */
const SupervisorDashboard = () => {
  const { dashboardStats, serviceInstallers, fetchServiceInstallers } = useCephas();
  const { showError } = useNotification();
  const [selectedTab, setSelectedTab] = useState('today');
  const [pendingTasks, setPendingTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  
  const { today, tomorrow, future } = dashboardStats || {
    today: { activations: 0, modifications: 0, assurances: 0, totalJobs: 0, assignedJobs: 0, unassignedJobs: 0 },
    tomorrow: { activations: 0, modifications: 0, assurances: 0, totalJobs: 0, assignedJobs: 0, unassignedJobs: 0 },
    future: { activations: 0, modifications: 0, assurances: 0, totalJobs: 0, assignedJobs: 0, unassignedJobs: 0 }
  };

  // Make sure we have service installer data
  useEffect(() => {
    if (!serviceInstallers || serviceInstallers.length === 0) {
      fetchServiceInstallers();
    }
  }, [serviceInstallers, fetchServiceInstallers]);

  // Fetch pending tasks
  useEffect(() => {
    const fetchPendingTasks = async () => {
      setIsLoadingTasks(true);
      try {
        const response = await api.get('/dashboard/pending-tasks');
        if (response.success) {
          setPendingTasks(response.data);
        } else {
          showError('Failed to load pending tasks');
        }
      } catch (error) {
        console.error('Error fetching pending tasks:', error);
        showError('An error occurred while loading pending tasks');
      } finally {
        setIsLoadingTasks(false);
      }
    };

    fetchPendingTasks();
  }, []);

  // Function to render the schedule data based on the selected tab
  const getScheduleData = () => {
    switch (selectedTab) {
      case 'today':
        return today;
      case 'tomorrow':
        return tomorrow;
      case 'future':
        return future;
      default:
        return today;
    }
  };

  const scheduleData = getScheduleData();

  // Active service installers with job details
  const activeInstallers = serviceInstallers || [
    { id: 1, name: 'K. MARIAPPAN A/L KUPPATHAN @ KM Siva', contactNo: '+60 17-676 7625', activeJobs: 5, completedToday: 2 },
    { id: 2, name: 'SARAVANAN A/L I. CHINNIAH @ Solo', contactNo: '+60 16-392 3026', activeJobs: 1, completedToday: 4 },
    { id: 3, name: 'MUNIANDY A/L SOORINARAYANAN @ Mani', contactNo: '+60 16-319 8867', activeJobs: 0, completedToday: 1 }
  ];

  return (
    <DashboardLayout 
      title="Supervisor Dashboard" 
      subtitle="Manage service installers and job assignments"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Jobs Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Jobs</p>
              <p className="text-2xl font-bold">{today.totalJobs}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-600">Today's Schedule</span>
          </div>
        </div>

        {/* Unassigned Jobs Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Unassigned</p>
              <p className="text-2xl font-bold">{today.unassignedJobs}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <Link to="/activation" className="text-red-600 hover:underline">Assign Now</Link>
          </div>
        </div>

        {/* Assigned Jobs Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Assigned</p>
              <p className="text-2xl font-bold">{today.assignedJobs}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-600">In Progress</span>
          </div>
        </div>

        {/* Active Installers Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Installers</p>
              <p className="text-2xl font-bold">{activeInstallers.length}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <Link to="/service-installer" className="text-purple-600 hover:underline">View All</Link>
          </div>
        </div>
      </div>

      {/* Schedule Tabs & Data */}
      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-4 py-3 text-sm font-medium ${
              selectedTab === 'today'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('today')}
          >
            Today
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              selectedTab === 'tomorrow'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('tomorrow')}
          >
            Tomorrow
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              selectedTab === 'future'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('future')}
          >
            Future
          </button>
        </div>

        {/* Schedule Data */}
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded border">
              <div className="text-sm text-gray-500">Activations</div>
              <div className="text-xl font-semibold">{scheduleData.activations}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded border">
              <div className="text-sm text-gray-500">Modifications</div>
              <div className="text-xl font-semibold">{scheduleData.modifications}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded border">
              <div className="text-sm text-gray-500">Assurances</div>
              <div className="text-xl font-semibold">{scheduleData.assurances}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded border">
              <div className="text-sm text-gray-500">Total Jobs</div>
              <div className="text-xl font-semibold">{scheduleData.totalJobs}</div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <span className="font-medium">{scheduleData.assignedJobs}</span> assigned, 
              <span className="font-medium text-red-600 ml-1">{scheduleData.unassignedJobs}</span> unassigned
            </div>
            <div>
              {selectedTab === 'today' && (
                <Link 
                  to="/activation" 
                  className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  <Settings size={14} className="mr-1" />
                  Manage Jobs
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tasks Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <h2 className="font-semibold">Pending Tasks</h2>
              <Link to="/activation" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="p-4">
              {isLoadingTasks ? (
                <div className="py-8 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500 mb-2"></div>
                  <p>Loading tasks...</p>
                </div>
              ) : pendingTasks.length > 0 ? (
                <div className="divide-y">
                  {pendingTasks.map(task => (
                    <div key={task.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${
                          task.type === 'Activation' ? 'bg-green-100' :
                          task.type === 'Assurance' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          <FileSearch size={16} className={`${
                            task.type === 'Activation' ? 'text-green-600' :
                            task.type === 'Assurance' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <div className="font-medium">{task.customer}</div>
                          <div className="text-sm text-gray-500">{task.building}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {task.type} • {task.trbnNo || task.id}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{task.appointmentTime}</div>
                        <Link 
                          to={`/${task.type.toLowerCase()}/${task.id}`} 
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Assign
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No pending tasks for today
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Service Installers Column */}
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <h2 className="font-semibold">Active Service Installers</h2>
              <Link to="/service-installer" className="text-sm text-blue-600 hover:underline">All Installers</Link>
            </div>
            <div className="p-4">
              {activeInstallers.length > 0 ? (
                <div className="divide-y">
                  {activeInstallers.map(installer => (
                    <div key={installer.id} className="py-3">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-purple-100 mr-3">
                          <Users size={16} className="text-purple-600" />
                        </div>
                        <div className="font-medium truncate">{installer.name}</div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-500">Active Jobs</div>
                          <div className="font-semibold">{installer.activeJobs}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-500">Completed Today</div>
                          <div className="font-semibold">{installer.completedToday}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No active installers
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white rounded-lg shadow">
            <div className="px-4 py-3 border-b">
              <h2 className="font-semibold">Quick Actions</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <Link
                to="/activation/create"
                className="block p-3 bg-green-50 border border-green-200 rounded-lg text-center hover:bg-green-100"
              >
                <Settings size={20} className="inline-block mb-1 text-green-600" />
                <div className="text-sm font-medium">New Activation</div>
              </Link>
              <Link
                to="/assurance/create"
                className="block p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center hover:bg-yellow-100"
              >
                <FileText size={20} className="inline-block mb-1 text-yellow-600" />
                <div className="text-sm font-medium">New Assurance</div>
              </Link>
              <Link
                to="/service-installer"
                className="block p-3 bg-purple-50 border border-purple-200 rounded-lg text-center hover:bg-purple-100"
              >
                <Users size={20} className="inline-block mb-1 text-purple-600" />
                <div className="text-sm font-medium">Installers</div>
              </Link>
              <Link
                to="/reports"
                className="block p-3 bg-blue-50 border border-blue-200 rounded-lg text-center hover:bg-blue-100"
              >
                <FileSearch size={20} className="inline-block mb-1 text-blue-600" />
                <div className="text-sm font-medium">Reports</div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h2 className="font-semibold">Upcoming Schedule</h2>
          <Link to="/calendar" className="text-sm text-blue-600 hover:underline">View Calendar</Link>
        </div>
        <div className="p-4">
          <div className="space-y-4 divide-y">
            <div className="pb-2">
              <div className="flex items-center mb-2">
                <Calendar size={16} className="text-blue-600 mr-2" />
                <span className="font-medium">Today</span>
                <span className="ml-auto text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="pl-6 space-y-2">
                <div className="flex items-center text-sm">
                  <Clock size={14} className="text-gray-400 mr-2" />
                  <span className="w-20 text-gray-500">10:00 AM</span>
                  <span className="flex-1">Activation at SOLARIS PARQ RESIDENSI</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock size={14} className="text-gray-400 mr-2" />
                  <span className="w-20 text-gray-500">1:00 PM</span>
                  <span className="flex-1">Assurance at 9 SEPUTEH - VIVO RESIDENCE</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock size={14} className="text-gray-400 mr-2" />
                  <span className="w-20 text-gray-500">3:30 PM</span>
                  <span className="flex-1">Modification at KELANA PUTERI</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 pb-2">
              <div className="flex items-center mb-2">
                <Calendar size={16} className="text-blue-600 mr-2" />
                <span className="font-medium">Tomorrow</span>
                <span className="ml-auto text-sm text-gray-500">
                  {new Date(Date.now() + 86400000).toLocaleDateString()}
                </span>
              </div>
              <div className="pl-6 space-y-2">
                <div className="flex items-center text-sm">
                  <Clock size={14} className="text-gray-400 mr-2" />
                  <span className="w-20 text-gray-500">11:30 AM</span>
                  <span className="flex-1">Activation at RESIDENSI M LUNA</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock size={14} className="text-gray-400 mr-2" />
                  <span className="w-20 text-gray-500">2:00 PM</span>
                  <span className="flex-1">Assurance at ARMANEE CONDOMINIUM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupervisorDashboard;