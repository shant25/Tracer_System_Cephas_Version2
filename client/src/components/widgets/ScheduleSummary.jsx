import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, MapPin, Building, CheckCircle, XCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';

/**
 * ScheduleSummary component for displaying upcoming appointments
 * @param {Object} props - Component props
 * @param {Array} props.appointments - Array of appointment data
 * @param {string} props.title - Component title
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.dateFilter - Date filter (today, tomorrow, week, all)
 * @param {Function} props.onDateFilterChange - Date filter change handler
 */
const ScheduleSummary = ({
  appointments = [],
  title = 'Upcoming Appointments',
  className = '',
  dateFilter = 'today',
  onDateFilterChange
}) => {
  // Appointment filtering
  const [filter, setFilter] = useState(dateFilter);
  
  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (onDateFilterChange) {
      onDateFilterChange(newFilter);
    }
  };
  
  // Filter buttons
  const filterButtons = [
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'week', label: 'This Week' },
    { id: 'all', label: 'All' }
  ];
  
  // Empty state message
  const getEmptyMessage = () => {
    switch (filter) {
      case 'today':
        return 'No appointments scheduled for today';
      case 'tomorrow':
        return 'No appointments scheduled for tomorrow';
      case 'week':
        return 'No appointments scheduled for this week';
      default:
        return 'No upcoming appointments';
    }
  };
  
  return (
    <Card 
      title={title}
      className={className}
      titleAction={
        <div className="flex space-x-1 text-sm">
          {filterButtons.map((btn) => (
            <button
              key={btn.id}
              className={`px-3 py-1 rounded ${
                filter === btn.id
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => handleFilterChange(btn.id)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {appointments.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            {getEmptyMessage()}
          </div>
        ) : (
          appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="border rounded-lg overflow-hidden"
            >
              {/* Appointment Header */}
              <div className={`p-3 text-white ${
                appointment.type === 'ACTIVATION' ? 'bg-blue-600' :
                appointment.type === 'ASSURANCE' ? 'bg-yellow-600' : 
                'bg-green-600'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="font-medium">
                    {appointment.type || 'Appointment'} - {appointment.customer}
                  </div>
                  <StatusBadge 
                    status={appointment.status || 'PENDING'} 
                    size="sm"
                  />
                </div>
              </div>
              
              {/* Appointment Details */}
              <div className="p-3">
                <div className="space-y-2">
                  {/* Date & Time */}
                  <div className="flex items-start">
                    <Calendar size={16} className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                    <div className="text-sm">
                      {appointment.date} {appointment.time && (
                        <span className="ml-2">
                          <Clock size={14} className="inline-block mr-1" />
                          {appointment.time}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Building */}
                  <div className="flex items-start">
                    <Building size={16} className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                    <div className="text-sm">{appointment.building}</div>
                  </div>
                  
                  {/* Location if available */}
                  {appointment.address && (
                    <div className="flex items-start">
                      <MapPin size={16} className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                      <div className="text-sm">{appointment.address}</div>
                    </div>
                  )}
                  
                  {/* Service Installer */}
                  <div className="flex items-start">
                    <User size={16} className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                    <div className="text-sm">
                      {appointment.serviceInstaller || (
                        <span className="text-yellow-600">Not Assigned</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Materials Status */}
                  <div className="flex items-start">
                    {appointment.materialsAssigned ? (
                      <>
                        <CheckCircle size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <div className="text-sm text-green-600">Materials Assigned</div>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                        <div className="text-sm text-red-600">Materials Not Assigned</div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-3 flex justify-end">
                  <Link to={`/activation/${appointment.id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {appointments.length > 0 && (
        <div className="pt-4 mt-4 border-t text-center">
          <Link to="/activation">
            <Button variant="link">View All Appointments</Button>
          </Link>
        </div>
      )}
    </Card>
  );
};

export default ScheduleSummary;