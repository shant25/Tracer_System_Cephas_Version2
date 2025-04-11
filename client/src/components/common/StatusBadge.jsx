// client/src/components/common/StatusBadge.jsx
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Info, 
  HelpCircle 
} from 'lucide-react';

/**
 * Status badge component for displaying status indicators
 */
const StatusBadge = ({
  status = 'unknown',
  statusMap = {},
  pill = true,
  showIcon = true,
  size = 'md',
  className = '',
  ...rest
}) => {
  // Default status mappings
  const defaultStatusMap = {
    success: {
      label: 'Success',
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: <CheckCircle size={size === 'sm' ? 12 : 16} />
    },
    error: {
      label: 'Error',
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: <XCircle size={size === 'sm' ? 12 : 16} />
    },
    pending: {
      label: 'Pending',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: <Clock size={size === 'sm' ? 12 : 16} />
    },
    warning: {
      label: 'Warning',
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      icon: <AlertTriangle size={size === 'sm' ? 12 : 16} />
    },
    info: {
      label: 'Info',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      icon: <Info size={size === 'sm' ? 12 : 16} />
    },
    
    // Common system statuses
    active: {
      label: 'Active',
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: <CheckCircle size={size === 'sm' ? 12 : 16} />
    },
    inactive: {
      label: 'Inactive',
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: <XCircle size={size === 'sm' ? 12 : 16} />
    },
    
    // Order/Job statuses
    completed: {
      label: 'Completed',
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: <CheckCircle size={size === 'sm' ? 12 : 16} />
    },
    not_completed: {
      label: 'Not Completed',
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: <XCircle size={size === 'sm' ? 12 : 16} />
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      icon: <Clock size={size === 'sm' ? 12 : 16} />
    },
    canceled: {
      label: 'Canceled',
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: <XCircle size={size === 'sm' ? 12 : 16} />
    },
    
    // Payment statuses
    paid: {
      label: 'Paid',
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: <CheckCircle size={size === 'sm' ? 12 : 16} />
    },
    unpaid: {
      label: 'Unpaid',
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: <XCircle size={size === 'sm' ? 12 : 16} />
    },
    partial: {
      label: 'Partial',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: <AlertTriangle size={size === 'sm' ? 12 : 16} />
    },
    
    // Material statuses
    in_stock: {
      label: 'In Stock',
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: <CheckCircle size={size === 'sm' ? 12 : 16} />
    },
    low_stock: {
      label: 'Low Stock',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: <AlertTriangle size={size === 'sm' ? 12 : 16} />
    },
    out_of_stock: {
      label: 'Out of Stock',
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: <XCircle size={size === 'sm' ? 12 : 16} />
    }
  };
  
  // Memoize status configuration
  const statusConfig = useMemo(() => {
    // Safely handle null/undefined status
    if (!status) {
      return {
        label: 'Unknown',
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: <HelpCircle size={size === 'sm' ? 12 : 16} />
      };
    }

    // Merge default and custom status maps
    const mergedStatusMap = { ...defaultStatusMap, ...(statusMap || {}) };
    
    // Normalize status key (lowercase, replace spaces with underscores)
    const normalizedStatus = status.toString().toLowerCase().replace(/\s+/g, '_');
    
    // Get status config or use default
    return mergedStatusMap[normalizedStatus] || {
      label: status,
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: <HelpCircle size={size === 'sm' ? 12 : 16} />
    };
  }, [status, statusMap, size, defaultStatusMap]);
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  };
  
  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${statusConfig.bg} ${statusConfig.text}
        ${sizeClasses[size]}
        ${pill ? 'rounded-full' : 'rounded'}
        ${className}
      `}
      {...rest}
    >
      {showIcon && <span className="mr-1">{statusConfig.icon}</span>}
      {statusConfig.label}
    </span>
  );
};

// PropTypes for type checking
StatusBadge.propTypes = {
  status: PropTypes.string,
  statusMap: PropTypes.object,
  pill: PropTypes.bool,
  showIcon: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md']),
  className: PropTypes.string
};

export default StatusBadge;