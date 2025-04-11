import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import useForm from '../../hooks/useForm';
import useNotification from '../../hooks/useNotification';
import api from '../../services/api';

/**
 * CreateInvoice component for creating new invoices
 */
const CreateInvoice = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [lineItems, setLineItems] = useState([
    { description: '', quantity: 1, unitPrice: 0, amount: 0 }
  ]);

  // Define validation rules
  const validationRules = {
    invoiceNumber: {
      required: true,
      minLength: 3,
      maxLength: 50
    },
    customer: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    date: {
      required: true
    },
    dueDate: {
      required: true
    }
  };
  
  // Initialize form with default values
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isFormValid
  } = useForm(
    {
      invoiceNumber: '',
      submissionNumber: '',
      customer: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'PENDING',
      notes: ''
    },
    onSubmit,
    validationRules
  );

  // Add a new line item
  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { description: '', quantity: 1, unitPrice: 0, amount: 0 }
    ]);
  };

  // Remove a line item
  const removeLineItem = (index) => {
    if (lineItems.length > 1) {
      const updatedItems = [...lineItems];
      updatedItems.splice(index, 1);
      setLineItems(updatedItems);
      updateTotals(updatedItems);
    }
  };

  // Update line item values
  const updateLineItem = (index, field, value) => {
    const updatedItems = [...lineItems];
    updatedItems[index][field] = value;
    
    // Calculate amount for the line item
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? value : updatedItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? value : updatedItems[index].unitPrice;
      updatedItems[index].amount = quantity * unitPrice;
    }
    
    setLineItems(updatedItems);
    updateTotals(updatedItems);
  };

  // Update invoice totals
  const updateTotals = (items) => {
    const subtotal = items.reduce((total, item) => total + item.amount, 0);
    // Calculate tax if applicable
    const tax = 0; // No tax for now
    const total = subtotal + tax;
    
    setFieldValue('subtotal', subtotal.toFixed(2));
    setFieldValue('tax', tax.toFixed(2));
    setFieldValue('total', total.toFixed(2));
  };

  // Form submission handler
  async function onSubmit(formData) {
    setIsLoading(true);
    
    try {
      // Combine form data with line items
      const invoiceData = {
        ...formData,
        lineItems,
        subtotal: parseFloat(formData.subtotal || 0),
        tax: parseFloat(formData.tax || 0),
        total: parseFloat(formData.total || 0)
      };
      
      const response = await api.post('/invoices', invoiceData);
      
      if (response.success) {
        showSuccess('Invoice created successfully');
        navigate('/invoices');
      } else {
        showError(response.message || 'Failed to create invoice');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      showError('An error occurred while creating the invoice');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
            <p className="mt-1 text-gray-500">
              Create a new invoice for a customer
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/invoices')}
            >
              Back to List
            </Button>
            
            <Button
              type="submit"
              form="invoice-form"
              variant="primary"
              leftIcon={<Save size={16} />}
              disabled={isLoading || !isFormValid}
              loading={isLoading}
            >
              Save Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form id="invoice-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Bill From</h2>
              <div className="space-y-4">
                <p className="text-gray-700">Cephas Sdn Bhd</p>
                <p className="text-gray-700">123 Business Street</p>
                <p className="text-gray-700">Kuala Lumpur, 50000</p>
                <p className="text-gray-700">Malaysia</p>
                <p className="text-gray-700">Phone: +60 3-1234 5678</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Bill To</h2>
              <div className="space-y-4">
                <FormInput
                  label="Customer Name"
                  name="customer"
                  value={values.customer || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.customer && errors.customer}
                  required
                />
              </div>
            </div>
          </div>

          {/* Invoice details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <FormInput
                label="Invoice Number"
                name="invoiceNumber"
                value={values.invoiceNumber || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.invoiceNumber && errors.invoiceNumber}
                required
              />
              
              <FormInput
                label="Submission Number"
                name="submissionNumber"
                value={values.submissionNumber || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.submissionNumber && errors.submissionNumber}
              />
            </div>
            
            <div className="space-y-4">
              <FormInput
                label="Invoice Date"
                name="date"
                type="date"
                value={values.date || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.date && errors.date}
                required
              />
              
              <FormInput
                label="Due Date"
                name="dueDate"
                type="date"
                value={values.dueDate || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.dueDate && errors.dueDate}
                required
              />
            </div>
          </div>

          {/* Line items */}
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Items</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price (RM)
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount (RM)
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lineItems.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="Item description"
                          required
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full text-right border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          min="1"
                          required
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full text-right border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          min="0"
                          step="0.01"
                          required
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="number"
                          value={item.amount}
                          className="w-full text-right border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
                          readOnly
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() => removeLineItem(index)}
                          className="text-red-600 hover:text-red-800"
                          disabled={lineItems.length === 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={addLineItem}
              >
                Add Item
              </Button>
            </div>
          </div>

          {/* Invoice totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">RM {values.subtotal || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">RM {values.tax || '0.00'}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-800 font-semibold">Total:</span>
                  <span className="font-semibold">RM {values.total || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <FormInput
              label="Notes"
              name="notes"
              value={values.notes || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.notes && errors.notes}
              textarea
              rows={3}
              placeholder="Any additional notes or payment instructions"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;