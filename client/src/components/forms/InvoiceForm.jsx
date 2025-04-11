import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, DollarSign, Plus, Trash2, Package, Hash } from 'lucide-react';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import useForm from '../../hooks/useForm';
import useCephas from '../../hooks/useCephas';
import { isNumberInRange } from '../../utils/validators';
import { formatCurrency } from '../../utils/formatters';

/**
 * InvoiceForm component for creating and editing invoices
 * @param {Object} props - Component props
 * @param {Object} props.initialData - Initial form data
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.submitButtonText - Submit button text
 */
const InvoiceForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  submitButtonText = 'Save Invoice'
}) => {
  // Get service installers and materials from context
  const { serviceInstallers, materials } = useCephas();
  
  // Local state for invoice items
  const [invoiceItems, setInvoiceItems] = useState(initialData.items || []);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemRate, setItemRate] = useState(0);
  const [itemDescription, setItemDescription] = useState('');
  
  // Calculate total amount
  const [totalAmount, setTotalAmount] = useState(initialData.totalAmount || 0);
  
  // Update total amount when invoice items change
  useEffect(() => {
    const total = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    setTotalAmount(total);
  }, [invoiceItems]);
  
  // Define validation rules
  const validationRules = {
    invoiceNumber: { required: true },
    submissionNumber: { required: false },
    customer: { required: true },
    date: { required: true },
    description: { required: true },
    totalAmount: { 
      required: true,
      custom: (value) => {
        if (!isNumberInRange(value, 0, null)) {
          return 'Total amount cannot be negative';
        }
        return null;
      }
    },
    notes: { required: false }
  };
  
  // Initialize form
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormValues
  } = useForm(
    {
      invoiceNumber: initialData.invoiceNumber || '',
      submissionNumber: initialData.submissionNumber || '',
      customer: initialData.customer || '',
      date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      description: initialData.description || '',
      totalAmount: initialData.totalAmount || 0,
      notes: initialData.notes || '',
      paid: initialData.paid || false
    },
    validationRules,
    (formValues) => {
      // Combine form values with invoice items
      const finalData = {
        ...formValues,
        items: invoiceItems
      };
      
      onSubmit(finalData);
    }
  );
  
  // Update total amount in form values when it changes
  useEffect(() => {
    setFormValues({ totalAmount });
  }, [totalAmount, setFormValues]);
  
  // Get material options
  const materialOptions = materials?.map(material => ({
    value: material.id.toString(),
    label: `${material.description} (${material.sapCode})`
  })) || [];
  
  // Handle material selection
  const handleMaterialChange = (e) => {
    const materialId = e.target.value;
    setSelectedMaterial(materialId);
    
    // Find selected material and set rate and description
    if (materialId && materials) {
      const material = materials.find(m => m.id.toString() === materialId);
      if (material) {
        setItemRate(material.unitPrice || 0);
        setItemDescription(material.description);
      }
    }
  };
  
  // Add invoice item
  const handleAddItem = () => {
    if (!itemDescription || itemQuantity <= 0 || itemRate <= 0) return;
    
    const newItem = {
      id: Date.now().toString(), // Temporary ID
      materialId: selectedMaterial || null,
      description: itemDescription,
      quantity: itemQuantity,
      rate: itemRate,
      amount: itemQuantity * itemRate
    };
    
    setInvoiceItems([...invoiceItems, newItem]);
    
    // Reset item form
    setSelectedMaterial('');
    setItemQuantity(1);
    setItemRate(0);
    setItemDescription('');
  };
  
  // Remove invoice item
  const handleRemoveItem = (itemId) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== itemId));
  };
  
  // Get invoice descriptions
  const invoiceDescriptionOptions = [
    { value: 'Prelaid Activation', label: 'Prelaid Activation' },
    { value: 'Non-Prelaid Activation', label: 'Non-Prelaid Activation' },
    { value: 'Prelaid Modification', label: 'Prelaid Modification' },
    { value: 'Non-Prelaid Modification', label: 'Non-Prelaid Modification' },
    { value: 'Assurance Visit', label: 'Assurance Visit' },
    { value: 'Installation Service', label: 'Installation Service' },
    { value: 'Material Supply', label: 'Material Supply' },
    { value: 'Other Service', label: 'Other Service' }
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Invoice Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Information</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label="Invoice Number"
            id="invoiceNumber"
            name="invoiceNumber"
            type="text"
            required
            placeholder="Enter invoice number"
            value={values.invoiceNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.invoiceNumber && errors.invoiceNumber}
            leftIcon={<Hash size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Submission Number"
            id="submissionNumber"
            name="submissionNumber"
            type="text"
            placeholder="Enter submission number (optional)"
            value={values.submissionNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.submissionNumber && errors.submissionNumber}
            leftIcon={<Hash size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Customer"
            id="customer"
            name="customer"
            type="text"
            required
            placeholder="Enter customer name"
            value={values.customer}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.customer && errors.customer}
            leftIcon={<User size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Invoice Date"
            id="date"
            name="date"
            type="date"
            required
            value={values.date}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.date && errors.date}
            leftIcon={<Calendar size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Service Description"
            id="description"
            name="description"
            type="select"
            required
            options={invoiceDescriptionOptions}
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.description && errors.description}
            leftIcon={<FileText size={18} className="text-gray-400" />}
          />
          
          <FormInput
            label="Payment Status"
            id="paid"
            name="paid"
            type="checkbox"
            checked={values.paid}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.paid && errors.paid}
          />
        </div>
      </div>
      
      {/* Invoice Items */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h3>
        
        {/* Add Item Form */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
          <div className="md:col-span-2">
            <FormInput
              label="Item Description"
              id="itemDescription"
              type="text"
              placeholder="Enter item description"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            />
          </div>
          
          <div>
            <FormInput
              label="Quantity"
              id="itemQuantity"
              type="number"
              min="1"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
            />
          </div>
          
          <div>
            <FormInput
              label="Rate (RM)"
              id="itemRate"
              type="number"
              min="0"
              step="0.01"
              value={itemRate}
              onChange={(e) => setItemRate(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <FormInput
            label="Material (Optional)"
            id="selectedMaterial"
            type="select"
            options={[{ value: '', label: 'Select Material' }, ...materialOptions]}
            value={selectedMaterial}
            onChange={handleMaterialChange}
            className="flex-grow max-w-md"
            leftIcon={<Package size={18} className="text-gray-400" />}
          />
          
          <Button
            type="button"
            onClick={handleAddItem}
            disabled={!itemDescription || itemQuantity <= 0 || itemRate <= 0}
            leftIcon={<Plus size={16} />}
            className="mt-4"
          >
            Add Item
          </Button>
        </div>
        
        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate (RM)
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount (RM)
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoiceItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No items added yet
                  </td>
                </tr>
              ) : (
                invoiceItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-normal">
                      <div className="text-sm text-gray-900">{item.description}</div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.rate, 'MYR')}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(item.amount, 'MYR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              
              {/* Total Row */}
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  Total
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap text-base text-gray-900 font-bold">
                  {formatCurrency(totalAmount, 'MYR')}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Additional Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
        
        <div className="grid grid-cols-1 gap-6">
          <FormInput
            label="Notes"
            id="notes"
            name="notes"
            type="textarea"
            placeholder="Additional notes (optional)"
            value={values.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.notes && errors.notes}
            leftIcon={<FileText size={18} className="text-gray-400" />}
          />
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading || isSubmitting}
          disabled={isLoading || isSubmitting || invoiceItems.length === 0}
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;