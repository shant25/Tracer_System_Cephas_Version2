import React, { useState, useEffect } from 'react';
import { Search, Package, User, Building, Calendar, Minus, Plus } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import useCephas from '../../hooks/useCephas';
import StatusBadge from '../common/StatusBadge';

/**
 * MaterialAssignModal component for assigning materials to jobs
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Close handler
 * @param {Object} props.job - Job to assign materials to
 * @param {Function} props.onAssign - Assignment handler
 * @param {boolean} props.loading - Loading state
 */
const MaterialAssignModal = ({
  isOpen,
  onClose,
  job,
  onAssign,
  loading = false
}) => {
  const { materials } = useCephas();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [notes, setNotes] = useState('');
  
  // Reset form when modal opens/job changes
  useEffect(() => {
    if (isOpen && job) {
      setSearchQuery('');
      setSelectedMaterials([]);
      setNotes('');
    }
  }, [isOpen, job]);
  
  // Filter materials based on search query
  useEffect(() => {
    if (!materials) return;
    
    if (!searchQuery) {
      setFilteredMaterials(materials);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = materials.filter(material => 
        material.description.toLowerCase().includes(query) || 
        material.sapCode.toLowerCase().includes(query)
      );
      setFilteredMaterials(filtered);
    }
  }, [searchQuery, materials]);
  
  // Add material to selection
  const addMaterial = (material) => {
    // Check if already selected
    const existing = selectedMaterials.find(m => m.id === material.id);
    
    if (existing) {
      // Update quantity
      setSelectedMaterials(selectedMaterials.map(m => 
        m.id === material.id 
          ? { ...m, quantity: m.quantity + 1 }
          : m
      ));
    } else {
      // Add new material with quantity 1
      setSelectedMaterials([
        ...selectedMaterials, 
        { ...material, quantity: 1 }
      ]);
    }
  };
  
  // Remove material from selection
  const removeMaterial = (materialId) => {
    setSelectedMaterials(selectedMaterials.filter(m => m.id !== materialId));
  };
  
  // Update material quantity
  const updateQuantity = (materialId, newQuantity) => {
    if (newQuantity <= 0) {
      removeMaterial(materialId);
      return;
    }
    
    setSelectedMaterials(selectedMaterials.map(m => 
      m.id === materialId 
        ? { ...m, quantity: newQuantity }
        : m
    ));
  };
  
  // Handle assignment submission
  const handleAssign = () => {
    if (selectedMaterials.length === 0) {
      return; // Validate required fields
    }
    
    const assignmentData = {
      materials: selectedMaterials.map(m => ({
        materialId: m.id,
        quantity: m.quantity
      })),
      notes
    };
    
    onAssign(job.id, assignmentData);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Materials"
      size="lg"
      footer={
        <>
          <Button
            variant="primary"
            onClick={handleAssign}
            loading={loading}
            disabled={selectedMaterials.length === 0 || loading}
          >
            Assign Materials
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Material Search */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Available Materials</h3>
              
              <div className="mb-3">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Search materials..."
                  />
                </div>
              </div>
              
              <div className="bg-white border rounded-md max-h-80 overflow-y-auto">
                {filteredMaterials.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No materials available
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredMaterials.map((material) => (
                      <div
                        key={material.id}
                        className="p-3 hover:bg-gray-50"
                      >
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Package size={16} className="text-blue-600" />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{material.description}</div>
                              <div className="text-sm text-gray-500">{material.sapCode}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <StatusBadge 
                              status={material.stockKeepingUnit > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'} 
                              size="sm"
                              showIcon={false}
                            />
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addMaterial(material)}
                              className="ml-2"
                              disabled={material.stockKeepingUnit <= 0}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-1 text-sm">
                          <span className="font-medium">Stock:</span> {material.stockKeepingUnit}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Selected Materials */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Selected Materials</h3>
              
              <div className="bg-white border rounded-md max-h-80 overflow-y-auto">
                {selectedMaterials.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No materials selected. Add materials from the left panel.
                  </div>
                ) : (
                  <div className="divide-y">
                    {selectedMaterials.map((material) => (
                      <div key={material.id} className="p-3">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{material.description}</div>
                            <div className="text-sm text-gray-500">{material.sapCode}</div>
                          </div>
                          
                          <Button
                            variant="outline-danger"
                            size="sm"
                            leftIcon={<Minus size={14} />}
                            onClick={() => removeMaterial(material.id)}
                          >
                            Remove
                          </Button>
                        </div>
                        
                        <div className="mt-3 flex items-center">
                          <span className="text-sm mr-3">Quantity:</span>
                          <div className="flex items-center border rounded">
                            <button
                              className="px-2 py-1 border-r hover:bg-gray-100"
                              onClick={() => updateQuantity(material.id, material.quantity - 1)}
                            >
                              <Minus size={14} />
                            </button>
                            
                            <input 
                              type="number" 
                              className="w-16 text-center border-none focus:ring-0"
                              value={material.quantity}
                              onChange={(e) => updateQuantity(material.id, parseInt(e.target.value) || 0)}
                              min="1"
                            />
                            
                            <button
                              className="px-2 py-1 border-l hover:bg-gray-100"
                              onClick={() => updateQuantity(material.id, material.quantity + 1)}
                              disabled={material.quantity >= material.stockKeepingUnit}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Notes */}
              <FormInput
                label="Assignment Notes"
                id="notes"
                name="notes"
                type="textarea"
                placeholder="Additional notes about this material assignment (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-4"
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MaterialAssignModal;