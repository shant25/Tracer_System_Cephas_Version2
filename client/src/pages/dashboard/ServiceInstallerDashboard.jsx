import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Package, 
  FileText, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  AlertTriangle, 
  MapPin,
  Tool,
  Loader
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/modals/ConfirmModal';
import useCephas from '../../hooks/useCephas';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import api from '../../services/api';

/**
 * Service Installer Dashboard Component
 * Shows assigned jobs, material tracking, and personal income stats
 */
const ServiceInstallerDashboard = () => {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [selectedTab, setSelectedTab] = useState('today');
  const [isLoading, setIsLoading] = useState(true);
  const [assignedJobs, setAssignedJobs] = useState({
    today: [],
    tomorrow: [],
    future: []
  });
  const [assignedMaterials, setAssignedMaterials] = useState([]);
  const [incomeStats, setIncomeStats] = useState({
    daily: { jobs: 0, amount: 0 },
    weekly: { jobs: 0, amount: 0 },
    monthly: { jobs: 0, amount: 0 }
  });
  
  // Modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch installer data
  useEffect(() => {
    const fetchInstallerData = async () => {
      setIsLoading(true);
      try {
        // Fetch assigned jobs
        const jobsResponse = await api.get('/my-jobs');
        if (jobsResponse.success) {
          setAssignedJobs({
            today: jobsResponse.data.today || [],
            tomorrow: jobsResponse.data.tomorrow || [],
            future: jobsResponse.data.future || []
          });
        } else {
          showError('Failed to load assigned jobs');
        }
        
        // Fetch assigned materials
        const materialsResponse = await api.get('/my-materials');
        if (materialsResponse.success) {
          setAssignedMaterials(materialsResponse.data);
        } else {
          showError('Failed to load assigned materials');
        }
        
        // Fetch income statistics
        const incomeResponse = await api.get('/my-income/stats');
        if (incomeResponse.success) {
          setIncomeStats(incomeResponse.data);
        } else {
          showError('Failed to load income statistics');
        }
      } catch (error) {
        console.error('Error fetching installer data:', error);
        showError('An error occurred while loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInstallerData();
  }, []);

  // Get jobs based on the selected tab
  const getJobs = () => {
    switch (selectedTab) {
      case 'today':
        return assignedJobs.today;
      case 'tomorrow':
        return assignedJobs.tomorrow;
      case 'future':
        return assignedJobs.future;
      default:
        return assignedJobs.today;
    }
  };
  
  const jobs = getJobs();
  
  // Update job status function
  const handleStartJob = async (jobId) => {
    try {
      const response = await api.put(`/jobs/${jobId}/status`, { status: 'IN_PROGRESS' });
      if (response.success) {
        showSuccess('Job status updated successfully');
        // Refresh jobs
        const updatedJobs = { ...assignedJobs };
        updatedJobs.today = updatedJobs.today.map(job => 
          job.id === jobId ? { ...job, status: 'IN_PROGRESS' } : job
        );
        setAssignedJobs(updatedJobs);
      } else {
        showError(response.message || 'Failed to update job status');
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      showError('An error occurred while updating job status');
    }
  };

  // Complete job function
  const handleCompleteJob = async () => {
    if (!selectedJob) return;
    
    setIsProcessing(true);
    try {
      const response = await api.put(`/jobs/${selectedJob.id}/complete`, {
        status: 'COMPLETED',
        completionDate: new Date().toISOString()
      });
      
      if (response.success) {
        showSuccess('Job completed successfully');
        
        // Update local state
        const updatedJobs = { ...assignedJobs };
        updatedJobs.today = updatedJobs.today.map(job => 
          job.id === selectedJob.id ? { ...job, status: 'COMPLETED' } : job
        );
        setAssignedJobs(updatedJobs);
      } else {
        showError(response.message || 'Failed to complete job');
      }
    } catch (error) {
      console.error('Error completing job:', error);
      showError('An error occurred while completing the job');
    } finally {
      setIsProcessing(false);
      setShowCompleteModal(false);
      setSelectedJob(null);
    }
  };

  // Report issue function
  const handleReportIssue = async (data) => {
    if (!selectedJob) return;
    
    setIsProcessing(true);
    try {
      const response = await api.post(`/jobs/${selectedJob.id}/report-issue`, data);
      
      if (response.success) {
        showSuccess('Issue reported successfully');
      } else {
        showError(response.message || 'Failed to report issue');
      }
    } catch (error) {
      console.error('Error reporting issue:', error);
      showError('An error occurred while reporting the issue');
    } finally {
      setIsProcessing(false);
      setShowReportModal(false);
      setSelectedJob(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin h-12 w-12 text-green-500" />
      </div>
    );
  }

  return (
    <DashboardLayout 
      title="Service Installer Dashboard" 
      subtitle={`Welcome back, ${currentUser?.name || 'Installer'}`}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Jobs Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Today's Jobs</p>
              <p className="text-2xl font-bold">{assignedJobs.today.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Clock size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-600">
              {assignedJobs.today.filter(job => job.status === 'COMPLETED').length} completed
            </span>
          </div>
        </div>

        {/* Materials Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Assigned Materials</p>
              <p className="text-2xl font-bold">{assignedMaterials.length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <Package size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <Link to="/materials" className="text-green-600 hover:underline">View Materials</Link>
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Monthly Income</p>
              <p className="text-2xl font-bold">RM {incomeStats.monthly.amount.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <DollarSign size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <Link to="/my-income" className="text-purple-600 hover:underline">Income Details</Link>
          </div>
        </div>
      </div>

      {/* Jobs Tabs */}
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

        {/* Jobs List */}
        <div className="p-4">
          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="border rounded-lg overflow-hidden">
                  <div className={`p-3 text-white ${
                    job.type === 'Activation' ? 'bg-blue-600' :
                    job.type === 'Assurance' ? 'bg-yellow-600' : 
                    'bg-green-600'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {job.type} - {job.customer}
                      </div>
                      <div className="text-sm">
                        {selectedTab === 'future' ? job.date : ''} {job.time}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start mb-3">
                      <MapPin size={18} className="mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{job.address}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-4">
                      {job.materialsAssigned ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
                          <CheckCircle size={12} className="mr-1" />
                          Materials Assigned
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center">
                          <AlertTriangle size={12} className="mr-1" />
                          Waiting for Materials
                        </span>
                      )}
                      
                      <StatusBadge status={job.status} />
                    </div>
                    
                    {selectedTab === 'today' && job.status !== 'COMPLETED' && (
                      <div className="mt-4 flex items-center space-x-2">
                        {job.status !== 'IN_PROGRESS' && (
                          <Button 
                            size="sm"
                            variant="info"
                            leftIcon={<Clock size={14} />}
                            onClick={() => handleStartJob(job.id)}
                          >
                            Start Job
                          </Button>
                        )}
                        
                        <Button 
                          size="sm"
                          variant="success"
                          leftIcon={<CheckCircle size={14} />}
                          onClick={() => {
                            setSelectedJob(job);
                            setShowCompleteModal(true);
                          }}
                        >
                          Complete
                        </Button>
                        
                        <Button 
                          size="sm"
                          variant="danger"
                          leftIcon={<AlertTriangle size={14} />}
                          onClick={() => {
                            setSelectedJob(job);
                            setShowReportModal(true);
                          }}
                        >
                          Report Issue
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No jobs scheduled for {selectedTab}
            </div>
          )}
        </div>
      </div>

      {/* Material List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h2 className="font-semibold">Assigned Materials</h2>
          <button className="text-sm text-blue-600 hover:underline">Scan QR Code</button>
        </div>
        
        <div className="p-4">
          {assignedMaterials.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial No.
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      For Job
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignedMaterials.map(material => (
                    <tr key={material.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-1 bg-gray-100 rounded mr-2">
                            <Package size={16} className="text-gray-500" />
                          </div>
                          {material.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {material.serialNo}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {material.assignedDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        Job #{material.jobId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No materials assigned
            </div>
          )}
        </div>
      </div>

      {/* Income Statistics */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b">
          <h2 className="font-semibold">Income Statistics</h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Daily Income</div>
                <div className="text-2xl font-bold text-gray-800">RM {incomeStats.daily.amount.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-2">{incomeStats.daily.jobs} jobs today</div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Weekly Income</div>
                <div className="text-2xl font-bold text-gray-800">RM {incomeStats.weekly.amount.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-2">{incomeStats.weekly.jobs} jobs this week</div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Monthly Income</div>
                <div className="text-2xl font-bold text-gray-800">RM {incomeStats.monthly.amount.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-2">{incomeStats.monthly.jobs} jobs this month</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-center">
            <Link to="/my-income" className="text-blue-600 hover:underline">View Detailed Income Report</Link>
          </div>
        </div>
      </div>

      {/* Complete Job Confirmation Modal */}
      <ConfirmModal
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          setSelectedJob(null);
        }}
        onConfirm={handleCompleteJob}
        title="Complete Job"
        message={
          selectedJob ? 
          `Are you sure you want to mark the ${selectedJob.type.toLowerCase()} job for ${selectedJob.customer} as completed?` : 
          "Are you sure you want to mark this job as completed?"
        }
        confirmText="Complete Job"
        cancelText="Cancel"
        type="success"
        isLoading={isProcessing}
      />
      
      {/* Todo: Implement Report Issue Modal */}
    </DashboardLayout>
  );
};

export default ServiceInstallerDashboard;