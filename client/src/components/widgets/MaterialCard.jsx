import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Minus, Edit, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';

/**
 * MaterialCard component for displaying material information
 * @param {Object} props - Component props
 * @param {Object} props.material - Material data
 * @param {Function} props.onAddStock - Add stock handler
 * @param {Function} props.onRemoveStock - Remove stock handler
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showActions - Whether to show action buttons
 * @param {boolean} props.compact - Whether to use compact layout
 */
const MaterialCard = ({
  material,
  onAddStock,
  onRemoveStock,
  className = '',
  showActions = true,
  compact = false
}) => {
  if (!material) return null;
  
  // Get stock status
  const getStockStatus = () => {
    const stock = material.stockKeepingUnit || 0;
    const minStock = material.minimumStock || 10;
    
    if (stock <= 0) return 'OUT_OF_STOCK';
    if (stock < minStock) return 'LOW_STOCK';
    return 'IN_STOCK';
  };
  
  const stockStatus = getStockStatus();
  
  // Handle stock actions
  const handleAddStock = () => {
    if (onAddStock) {
      onAddStock(material.id);
    }
  };
  
  const handleRemoveStock = () => {
    if (onRemoveStock) {
      onRemoveStock(material.id);
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {/* Card Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <Package size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{material.description}</h3>
              <div className="text-sm text-gray-500">{material.sapCode}</div>
            </div>
          </div>
          <StatusBadge status={stockStatus} />
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-4">
        {/* Compact view just shows basic info */}
        {compact ? (
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gray-500">Stock</div>
              <div className="text-lg font-semibold">{material.stockKeepingUnit || 0}</div>
            </div>
            
            {material.unitPrice > 0 && (
              <div className="text-right">
                <div className="text-sm font-medium text-gray-500">Unit Price</div>
                <div>{formatCurrency(material.unitPrice, 'MYR')}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Current Stock</div>
                <div className="text-xl font-semibold">{material.stockKeepingUnit || 0}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Minimum Stock</div>
                <div className="flex items-center">
                  <span className="text-lg">{material.minimumStock || 10}</span>
                  {stockStatus === 'LOW_STOCK' && (
                    <AlertTriangle size={16} className="ml-2 text-yellow-500" />
                  )}
                </div>
              </div>
            </div>
            
            {material.unitPrice > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-500">Unit Price</div>
                <div>{formatCurrency(material.unitPrice, 'MYR')}</div>
              </div>
            )}
            
            {material.materialType && (
              <div>
                <div className="text-sm font-medium text-gray-500">Type</div>
                <div>{material.materialType.replace('_', ' ')}</div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Card Footer with Actions */}
      {showActions && (
        <div className="px-4 py-3 bg-gray-50 border-t flex flex-wrap gap-2">
          <Link to={`/material/${material.id}`}>
            <Button variant="outline" size="sm" leftIcon={<Edit size={16} />}>
              View
            </Button>
          </Link>
          
          <Button 
            variant="outline-primary" 
            size="sm" 
            leftIcon={<Plus size={16} />}
            onClick={handleAddStock}
          >
            Add Stock
          </Button>
          
          <Button 
            variant="outline-danger" 
            size="sm" 
            leftIcon={<Minus size={16} />}
            onClick={handleRemoveStock}
            disabled={material.stockKeepingUnit <= 0}
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default MaterialCard;