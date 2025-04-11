// client/src/components/common/Card.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component for displaying content in a boxed layout
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.titleAction - Action component rendered in card header
 * @param {boolean} props.noPadding - Remove padding from card body
 * @param {boolean} props.noShadow - Remove shadow from card
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.footer - Footer content
 * @param {React.ReactNode} props.children - Card content
 */
const Card = ({
  title,
  titleAction,
  noPadding = false,
  noShadow = false,
  className = '',
  footer,
  children,
  ...rest
}) => {
  return (
    <div 
      className={`
        bg-white rounded-lg overflow-hidden
        ${noShadow ? 'border' : 'shadow'}
        ${className}
      `}
      {...rest}
    >
      {/* Card Header */}
      {(title || titleAction) && (
        <div className="px-4 py-3 border-b flex items-center justify-between">
          {title && <h3 className="font-semibold text-gray-700">{title}</h3>}
          {titleAction && <div>{titleAction}</div>}
        </div>
      )}
      
      {/* Card Body */}
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
      
      {/* Card Footer */}
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t">
          {footer}
        </div>
      )}
    </div>
  );
};

// PropTypes validation
Card.propTypes = {
  title: PropTypes.string,
  titleAction: PropTypes.node,
  noPadding: PropTypes.bool,
  noShadow: PropTypes.bool,
  className: PropTypes.string,
  footer: PropTypes.node,
  children: PropTypes.node
};

export default Card;