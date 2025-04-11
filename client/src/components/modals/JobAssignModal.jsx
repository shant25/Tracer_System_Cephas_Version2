import React, { useState, useEffect } from 'react';
import { User, Calendar, Building, Search } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import useCephas from '../../hooks/useCephas';

/**
 * JobAssignModal component for assigning jobs to service installers
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Close handler
 * @param {Object} props.job - Job to assign
 * @param {Function} props.onAssign - Assignment handler
 * @param {boolean} props.loading - Loading state
 */
const JobAssignModal = ({
  isOpen,
  onClose,
  job,
  onAssign,
  loading = false
}) => {
  const { serviceInstallers } = useCephas();
  const [selectedInstaller, setSelectedInstaller] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInstallers, setFilteredInstallers] = useState([]);
  
  // Reset form when modal opens/job changes
  useEffect(() => {
    if (isOpen && job) {
      // Set default date/time from job if available
      setScheduledDate(job.appointmentDate || '');
      setScheduledTime(job.appointmentTime || '');
      setSelectedInstaller(job.serviceInstallerId || '');
      setNotes('');
      setSearchQuery('');
    }
  }, [isOpen, job]);
  
  // Filter installers based on search query
  useEffect(() => {
    if (!serviceInstallers) return;
    
    if (!searchQuery) {
      setFilteredInstallers(serviceInstallers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = serviceInstallers.filter(installer => 
        installer.name.toLowerCase().includes(query) || 
        installer.id.toString().includes(query)
      );
      setFilteredInstallers(filtered);
    }
  }, [searchQuery, serviceInstallers]);
  
  // Handle assignment
  const handleAssign = () => {
    if (!selectedInstaller) {
      return; // Validate required fields
    }
    
    const assignmentData = {
      serviceInstallerId: selectedInstaller,
      appointmentDate: scheduledDate,
      appointmentTime: scheduledTime,
      notes
    };
    
    onAssign(job.id, assignmentData);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Job"
      size="lg"
      footer={
        <>
          <Button
            variant="primary"
            onClick={handleAssign}
            loading={loading}
            disabled={!selectedInstaller || loading}
          >
            Assign Job
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </>
      }
    >
      {!job ? (
        <div className="py-8 text-center text-gray-500">
          No job selected
        </div>
      ) : (
        <div className="space-y-6">
          {/* Job Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Job Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start">
                <User size={16} className="mt-1 mr-2 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Customer</div>
                  <div className="font-medium">{job.customer}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Building size={16} className="mt-1 mr-2 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Building</div>
                  <div className="font-medium">{job.building}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar size={16} className="mt-1 mr-2 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Appointment</div>
                  <div className="font-medium">{job.appointmentDate} {job.appointmentTime}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Assignment Form */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Assignment Details</h3>
            
            <div className="mb-4">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Search service installers..."
                />
              </div>
            </div>
            
            <div className="bg-white border rounded-md max-h-60 overflow-y-auto mb-4">
              {filteredInstallers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No service installers available
                </div>
              ) : (
                <div className="divide-y">
                  {filteredInstallers.map((installer) => (
                    <div
                      key={installer.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center ${
                        selectedInstaller === installer.id.toString() ? 'bg-green-50' : ''
                      }`}
                      onClick={() => setSelectedInstaller(installer.id.toString())}
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User size={16} className="text-gray-600" />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{installer.name}</div>
                        <div className="text-sm text-gray-500">{installer.contactNo}</div>
                      </div>
                      
                      {/* Radio or Checkbox indicator */}
                      <div className="ml-auto">
                        <div className="h-5 w-5 border-2 rounded-full flex items-center justify-center">
                          {selectedInstaller === installer.id.toString() && (
                            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormInput
                label="Appointment Date"
                id="scheduledDate"
                name="scheduledDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                leftIcon={<Calendar size={18} className="text-gray-400" />}
              />
              
              <FormInput
                label="Appointment Time"
                id="scheduledTime"
                name="scheduledTime"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
            
            {/* Notes */}
            <FormInput
              label="Assignment Notes"
              id="notes"
              name="notes"
              type="textarea"
              placeholder="Additional instructions for the service installer (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default JobAssignModal;