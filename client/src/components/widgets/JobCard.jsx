import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Package, User, Building } from 'lucide-react';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';

/**
 * JobCard component for displaying job information
 * @param {Object} props - Component props
 * @param {Object} props.job - Job data
 * @param {Function} props.onStatusChange - Status change handler
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showActions - Whether to show action buttons
 * @param {boolean} props.compact - Whether to use compact layout
 */
const JobCard = ({
  job,
  onStatusChange,
  className = '',
  showActions = true,
  compact = false
}) => {
  if (!job) return null;
  
  // Status change handlers
  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(job.id, newStatus);
    }
  };
  
  // Determine card color based on job type
  const getCardColor = () => {
    switch (job.type?.toUpperCase()) {
      case 'ACTIVATION':
        return 'border-blue-500';
      case 'ASSURANCE':
        return 'border-yellow-500';
      case 'MODIFICATION':
        return 'border-green-500';
      default:
        return 'border-gray-300';
    }
  };
  
  // Generate detail route
  const getDetailRoute = () => {
    switch (job.type?.toUpperCase()) {
      case 'ACTIVATION':
        return `/activation/${job.id}`;
      case 'ASSURANCE':
        return `/assurance/${job.id}`;
      case 'MODIFICATION':
        return `/activation/${job.id}`;
      default:
        return `/order/${job.id}`;
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden border-l-4 ${getCardColor()} ${className}`}>
      {/* Card Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-900 mr-2">{job.customer}</h3>
            <StatusBadge status={job.status || 'Pending'} size="sm" />
          </div>
          <div className="text-sm text-gray-500">
            {job.trbnNo || job.ticket || job.id}
          </div>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-4">
        {/* Compact view just shows basic info */}
        {compact ? (
          <div className="space-y-2">
            <div className="flex items-start">
              <Building size={16} className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
              <div className="text-sm">{job.building}</div>
            </div>
            
            <div className="flex items-start">
              <Calendar size={16} className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
              <div className="text-sm">{job.appointmentDate} {job.appointmentTime}</div>
            </div>
            
            <div className="text-right mt-2">
              <Link to={getDetailRoute()}>
                <Button variant="link" size="sm">View Details</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Building */}
            <div className="flex items-start">
              <Building size={18} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Building</div>
                <div>{job.building}</div>
              </div>
            </div>
            
            {/* Address if available */}
            {job.address && (
              <div className="flex items-start">
                <MapPin size={18} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Address</div>
                  <div className="text-sm">{job.address}</div>
                </div>
              </div>
            )}
            
            {/* Appointment */}
            <div className="flex items-start">
              <Calendar size={18} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Appointment</div>
                <div>{job.appointmentDate} {job.appointmentTime}</div>
              </div>
            </div>
            
            {/* Contact */}
            <div className="flex items-start">
              <User size={18} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Contact</div>
                <div>{job.contactNo || 'Not specified'}</div>
              </div>
            </div>
            
            {/* Materials Status */}
            <div className="flex items-start">
              <Package size={18} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">Materials</div>
                <div>
                  {job.materialsAssigned ? (
                    <span className="text-green-600">Materials Assigned</span>
                  ) : (
                    <span className="text-yellow-600">Pending Assignment</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Service Installer */}
            {job.serviceInstaller && (
              <div className="flex items-start">
                <Clock size={18} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Assigned To</div>
                  <div>{job.serviceInstaller}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Card Footer with Actions */}
      {showActions && !compact && (
        <div className="px-4 py-3 bg-gray-50 border-t flex flex-wrap gap-2">
          <Link to={getDetailRoute()}>
            <Button variant="outline" size="sm">View Details</Button>
          </Link>
          
          {job.status !== 'COMPLETED' && (
            <>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => handleStatusChange('IN_PROGRESS')}
              >
                Start Job
              </Button>
              
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => handleStatusChange('COMPLETED')}
              >
                Complete
              </Button>
            </>
          )}
          
          {job.status === 'COMPLETED' && (
            <Button 
              variant="outline" 
              size="sm" 
              disabled
            >
              Completed
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;