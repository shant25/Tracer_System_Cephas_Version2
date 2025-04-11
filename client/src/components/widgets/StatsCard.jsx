import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown } from 'lucide-react';

/**
 * StatsCard component to display summary statistics
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value to display
 * @param {string} props.icon - Icon to display
 * @param {string} props.iconBgColor - Background color for icon
 * @param {string} props.iconColor - Color for icon
 * @param {string} props.borderColor - Color for card border
 * @param {string} props.link - Link to navigate to
 * @param {string} props.linkText - Text for link
 * @param {number} props.change - Percentage change
 * @param {string} props.changeLabel - Label for change
 * @param {string} props.subtitle - Subtitle text
 * @param {string} props.className - Additional CSS classes
 */
const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
  borderColor = 'border-blue-500',
  link,
  linkText,
  change,
  changeLabel = 'from last period',
  subtitle,
  className = '',
}) => {
  // Determine change color and icon
  const isPositiveChange = change > 0;
  const changeColorClass = isPositiveChange ? 'text-green-600' : 'text-red-600';
  const ChangeIcon = isPositiveChange ? ArrowUp : ArrowDown;
  
  return (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${borderColor} ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-full ${iconBgColor}`}>
          {icon && <div className={iconColor}>{icon}</div>}
        </div>
      </div>
      
      {(change !== undefined || link) && (
        <div className="mt-4 flex items-center justify-between">
          {change !== undefined && (
            <div className={`flex items-center text-sm ${changeColorClass}`}>
              <ChangeIcon size={16} className="mr-1" />
              <span>
                {Math.abs(change)}% {changeLabel}
              </span>
            </div>
          )}
          
          {link && (
            <Link to={link} className="text-sm text-blue-600 hover:underline">
              {linkText || 'View Details'}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;