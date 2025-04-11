import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, CreditCard, MapPin, Calendar, ArrowLeft, Edit, Trash2, FileText } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ConfirmModal } from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import JobCard from '../../components/widgets/JobCard';
import useNotification from '../../hooks/useNotification';
import { hasActionPermission } from '../../utils/accessControl';
import AuthService from '../../services/auth.service';
import { formatDate } from '../../utils/dateUtils';

/**
 * ServiceInstallerDetail component to display service installer details
 */
const ServiceInstallerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notification = useNotification();
  const userRole = AuthService.getUserRole();
  
  // State variables
  const [installer, setInstaller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeJobs, setActiveJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  
  // User permissions
  const canEdit = hasActionPermission(userRole, 'edit_service_installer');
  const canDelete = hasActionPermission(userRole, 'delete_service_installer');
  
  // Load installer data
  useEffect(() => {
    const fetchInstaller = async () => {
      try {
        setLoading(true);
        
        // This would be an API call in a real app
        // const response = await ServiceInstallerService.getServiceInstallerById(id);
        
        // Mock data for demo
        const mockInstaller = {
          id,
          name: 'K. MARIAPPAN A/L KUPPATHAN',
          contactNo: '+60 17-676 7625',
          email: 'mariappan@example.com',
          address: '123 Jalan Sample, Kuala Lumpur',
          bankName: 'MAYBANK',
          bankAccountNo: '1234567890',
          isActive: true,
          notes: 'Experienced installer with 5+ years of experience.',
          joinDate: '2020-01-15',
          completedJobs: 328,
          averageRating: 4.8
        };
        
        setInstaller(mockInstaller);
      } catch (error) {
        console.error('Error fetching installer:', error);
        notification.error('An error occurred while loading installer details');
        navigate('/service-installers');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInstaller();
  }, [id, navigate, notification]);
  
  // Load jobs data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        
        // This would be an API call in a real app
        // const response = await OrderService.getOrdersByInstaller(id);
        
        // Mock data for demo
        const mockActiveJobs = [
          {
            id: 1,
            type: 'ACTIVATION',
            customer: 'TAN PUI YEE',
            building: 'SOLARIS PARQ RESIDENSI',
            address: 'Block A, Level 5, Unit 12',
            appointmentDate: formatDate(new Date(), 'yyyy-MM-dd'),
            appointmentTime: '10:00 AM',
            status: 'PENDING',
            materialsAssigned: true,
            contactNo: '017-3781691'
          },
          {
            id: 2,
            type: 'ASSURANCE',
            customer: 'ZHENG ZILONG',
            building: '9 SEPUTEH - VIVO RESIDENCE',
            address: 'Block B, Level 8, Unit 15',
            appointmentDate: formatDate(new Date(), 'yyyy-MM-dd'),
            appointmentTime: '1:00 PM',
            status: 'IN_PROGRESS',
            materialsAssigned: true,
            contactNo: '017-5216863'
          }
        ];
        
        const mockCompletedJobs = [
          {
            id: 3,
            type: 'ACTIVATION',
            customer: 'CHOY YUEN LENG',
            building: 'RESIDENSI M LUNA',
            address: 'Block C, Level 12, Unit 7',
            appointmentDate: formatDate(new Date(Date.now() - 86400000), 'yyyy-MM-dd'), // yesterday
            appointmentTime: '11:30 AM',
            status: 'COMPLETED',
            materialsAssigned: true,
            contactNo: '012-2239707'
          },
          {
            id: 4,
            type: 'MODIFICATION',
            customer: 'CHEAH MENG YEE',
            building: 'KELANA PUTERI',
            address: 'Block A, Level 9, Unit 3',
            appointmentDate: formatDate(new Date(Date.now() - 172800000), 'yyyy-MM-dd'), // 2 days ago
            appointmentTime: '2:30 PM',
            status: 'COMPLETED',
            materialsAssigned: true,
            contactNo: '016-7765432'
          }
        ];
        
        setActiveJobs(mockActiveJobs);
        setCompletedJobs(mockCompletedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        notification.error('An error occurred while loading job details');
      } finally {
        setJobsLoading(false);
      }
    };
    
    if (installer) {
      fetchJobs();
    }
  }, [installer, id, notification]);
  
  // Handle delete installer
  const handleDeleteInstaller = async () => {
    try {
      const toastId = notification.loading('Deleting service installer...');
      
      // This would be an API call in a real app
      // const response = await ServiceInstallerService.deleteServiceInstaller(id);
      
      // Mock success response
      const mockSuccess = true;
      
      if (mockSuccess) {
        notification.update(toastId, 'Service installer deleted successfully', 'success');
        navigate('/service-installers');
      } else {
        notification.update(toastId, 'Failed to delete service installer', 'error');
      }
    } catch (error) {
      console.error('Error deleting service installer:', error);
      notification.error('An error occurred while deleting the service installer');
    } finally {
      setConfirmDelete(false);
    }
  };
  
  // Handle job status change
  const handleJobStatusChange = (jobId, newStatus) => {
    // Update job status in the active jobs list
    setActiveJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId 
          ? { ...job, status: newStatus }
          : job
      )
    );
    
    // If job is completed, move it to completed jobs list
    if (newStatus === 'COMPLETED') {
      const completedJob = activeJobs.find(job => job.id === jobId);
      if (completedJob) {
        setActiveJobs(prev => prev.filter(job => job.id !== jobId));
        setCompletedJobs(prev => [{ ...completedJob, status: 'COMPLETED' }, ...prev]);
      }
    }
    
    // Show success notification
    notification.success(`Job status updated to ${newStatus}`);
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen -mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <span className="ml-3 text-lg text-gray-700">Loading installer details...</span>
      </div>
    );
  }
  
  // If installer not found
  if (!installer) {
    return (
      <div className="text-center py-12">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700">Service Installer Not Found</h2>
        <p className="text-gray-500 mt-2">The service installer you're looking for doesn't exist or has been removed.</p>
        <Button
          as={Link}
          to="/service-installers"
          variant="outline"
          className="mt-4"
          leftIcon={<ArrowLeft size={16} />}
        >
          Back to Service Installers
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <Button
            as={Link}
            to="/service-installers"
            variant="outline"
            size="sm"
            className="mr-4"
            leftIcon={<ArrowLeft size={16} />}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{installer.name}</h1>
          <StatusBadge
            status={installer.isActive ? 'active' : 'inactive'}
            className="ml-3"
          />
        </div>
        
        <div className="flex mt-4 md:mt-0">
          {canEdit && (
            <Button
              as={Link}
              to={`/service-installer/${id}/edit`}
              className="mr-2"
              leftIcon={<Edit size={18} />}
              variant="primary"
            >
              Edit Details
            </Button>
          )}
          
          {canDelete && (
            <Button
              variant="outline-danger"
              leftIcon={<Trash2 size={18} />}
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      
      {/* Service Installer Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2">
          <Card title="Contact Information">
            <div className="space-y-4">
              <div className="flex items-start">
                <User size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Full Name</div>
                  <div className="font-medium">{installer.name}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Contact Number</div>
                  <div>
                    <a href={`tel:${installer.contactNo}`} className="text-blue-600 hover:underline">
                      {installer.contactNo}
                    </a>
                  </div>
                </div>
              </div>
              
              {installer.email && (
                <div className="flex items-start">
                  <Mail size={18} className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Email Address</div>
                    <div>
                      <a href={`mailto:${installer.email}`} className="text-blue-600 hover:underline">
                        {installer.email}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {installer.address && (
                <div className="flex items-start">
                  <MapPin size={18} className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Address</div>
                    <div>{installer.address}</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          {/* Bank Information */}
          <Card title="Bank Information" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <CreditCard size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Bank Name</div>
                  <div className="font-medium">{installer.bankName || 'Not specified'}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <FileText size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Account Number</div>
                  <div className="font-medium">{installer.bankAccountNo || 'Not specified'}</div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Additional Information */}
          {installer.notes && (
            <Card title="Additional Information" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <FileText size={18} className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Notes</div>
                    <div>{installer.notes}</div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          {/* Statistics */}
          <Card title="Statistics">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Join Date</div>
                <div className="font-medium text-gray-900">{formatDate(installer.joinDate, 'MMM d, yyyy')}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Completed Jobs</div>
                <div className="font-medium text-gray-900">{installer.completedJobs}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Active Jobs</div>
                <div className="font-medium text-gray-900">{activeJobs.length}</div>
              </div>
              {installer.averageRating && (
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-gray-500">Average Rating</div>
                  <div className="font-medium text-gray-900">
                    {installer.averageRating} / 5
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Jobs Section */}
      <div className="space-y-6">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'active'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('active')}
            >
              Active Jobs ({activeJobs.length})
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'completed'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              Completed Jobs ({completedJobs.length})
            </button>
          </div>
        </div>
        
        {jobsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading jobs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === 'active' ? (
              activeJobs.length > 0 ? (
                activeJobs.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onStatusChange={handleJobStatusChange}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 bg-white rounded-lg shadow border">
                  <Calendar size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No active jobs assigned to this installer</p>
                </div>
              )
            ) : (
              completedJobs.length > 0 ? (
                completedJobs.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onStatusChange={handleJobStatusChange}
                    showActions={false}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 bg-white rounded-lg shadow border">
                  <Calendar size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No completed jobs found for this installer</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteInstaller}
        title="Delete Service Installer"
        message={`Are you sure you want to delete ${installer.name}? This action cannot be undone. Any active jobs assigned to this installer will need to be reassigned.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
};

export default ServiceInstallerDetail;