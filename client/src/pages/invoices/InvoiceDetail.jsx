import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  DollarSign, 
  Printer, 
  Download, 
  Mail, 
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/modals/ConfirmModal';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { hasActionPermission } from '../../utils/accessControl';
import api from '../../services/api';

/**
 * InvoiceDetail component for viewing invoice details
 */
const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserRole } = useAuth();
  const { showSuccess, showError, showLoading, updateNotification } = useNotification();
  
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check user permissions
  const userRole = getUserRole();
  const canEditInvoice = hasActionPermission(userRole, 'edit_invoice');
  const canDeleteInvoice = hasActionPermission(userRole, 'delete_invoice');

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/invoices/${id}`);
        
        if (response.success) {
          setInvoice(response.data);
        } else {
          showError(response.message || 'Failed to load invoice details');
          navigate('/invoices');
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        showError('An error occurred while loading the invoice');
        navigate('/invoices');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [id, navigate, showError]);

  // Handle invoice deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await api.delete(`/invoices/${id}`);
      
      if (response.success) {
        showSuccess('Invoice deleted successfully');
        navigate('/invoices');
      } else {
        showError(response.message || 'Failed to delete invoice');
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      showError('An error occurred while deleting the invoice');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Mark invoice as paid
  const handleMarkPaid = async () => {
    setIsProcessing(true);
    try {
      const response = await api.put(`/invoices/${id}/status`, {
        status: 'PAID',
        paymentDate: new Date().toISOString()
      });
      
      if (response.success) {
        showSuccess('Invoice marked as paid successfully');
        setInvoice({ ...invoice, status: 'PAID' });
      } else {
        showError(response.message || 'Failed to update invoice status');
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
      showError('An error occurred while updating the invoice status');
    } finally {
      setIsProcessing(false);
      setShowMarkPaidModal(false);
    }
  };

  // Print invoice
  const handlePrint = () => {
    window.print();
  };

  // Download invoice as PDF
  const handleDownload = async () => {
    const loadingId = showLoading('Generating PDF...');
    
    try {
      const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
      
      if (response) {
        // Create a download link
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice-${invoice?.invoiceNumber || id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        updateNotification(loadingId, 'PDF downloaded successfully', 'success');
      } else {
        updateNotification(loadingId, 'Failed to generate PDF', 'error');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      updateNotification(loadingId, 'An error occurred while generating the PDF', 'error');
    }
  };

  // Send invoice via email
  const handleSendEmail = async () => {
    const loadingId = showLoading('Sending email...');
    
    try {
      const response = await api.post(`/invoices/${id}/send`);
      
      if (response.success) {
        updateNotification(loadingId, 'Invoice sent successfully', 'success');
      } else {
        updateNotification(loadingId, response.message || 'Failed to send invoice', 'error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      updateNotification(loadingId, 'An error occurred while sending the invoice', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Invoice {invoice?.invoiceNumber}
            </h1>
            <p className="mt-1 text-gray-500">
              {invoice?.status === 'PAID' ? 'Paid' : 
               invoice?.status === 'OVERDUE' ? 'Overdue' : 'Pending'} • Created on {invoice?.date}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/invoices')}
            >
              Back to List
            </Button>
            
            <Button
              variant="outline"
              leftIcon={<Printer size={16} />}
              onClick={handlePrint}
            >
              Print
            </Button>
            
            <Button
              variant="outline"
              leftIcon={<Download size={16} />}
              onClick={handleDownload}
            >
              Download
            </Button>
            
            <Button
              variant="outline"
              leftIcon={<Mail size={16} />}
              onClick={handleSendEmail}
            >
              Send
            </Button>
            
            {invoice?.status !== 'PAID' && (
              <Button
                variant="primary"
                leftIcon={<DollarSign size={16} />}
                onClick={() => setShowMarkPaidModal(true)}
              >
                Mark as Paid
              </Button>
            )}
            
            {canEditInvoice && (
              <Button
                variant="primary"
                leftIcon={<Edit size={16} />}
                onClick={() => navigate(`/invoices/${id}/edit`)}
              >
                Edit
              </Button>
            )}
            
            {canDeleteInvoice && (
              <Button
                variant="danger"
                leftIcon={<Trash2 size={16} />}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status banner */}
      {invoice?.status && (
        <div className={`p-4 rounded-lg ${
          invoice.status === 'PAID' ? 'bg-green-50 border border-green-200' :
          invoice.status === 'OVERDUE' ? 'bg-red-50 border border-red-200' :
          'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center">
            {invoice.status === 'PAID' ? (
              <CheckCircle size={20} className="text-green-500 mr-2" />
            ) : invoice.status === 'OVERDUE' ? (
              <AlertTriangle size={20} className="text-red-500 mr-2" />
            ) : (
              <Clock size={20} className="text-yellow-500 mr-2" />
            )}
            
            <div>
              <p className={`font-medium ${
                invoice.status === 'PAID' ? 'text-green-800' :
                invoice.status === 'OVERDUE' ? 'text-red-800' :
                'text-yellow-800'
              }`}>
                {invoice.status === 'PAID' ? 'This invoice has been paid' :
                 invoice.status === 'OVERDUE' ? 'This invoice is overdue' :
                 'This invoice is pending payment'}
              </p>
              
              {invoice.status === 'PAID' && invoice.paymentDate && (
                <p className="text-sm text-green-700">
                  Payment received on {new Date(invoice.paymentDate).toLocaleDateString()}
                </p>
              )}
              
              {invoice.status !== 'PAID' && (
                <p className="text-sm">
                  Due date: {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invoice content */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="print:text-black">
          {/* Invoice header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">From</h2>
              <div className="space-y-1">
                <p className="font-semibold">Cephas Sdn Bhd</p>
                <p>123 Business Street</p>
                <p>Kuala Lumpur, 50000</p>
                <p>Malaysia</p>
                <p>Phone: +60 3-1234 5678</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Bill To</h2>
              <div className="space-y-1">
                <p className="font-semibold">{invoice?.customer}</p>
              </div>
            </div>
          </div>

          {/* Invoice details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Invoice Number</h2>
              <p>{invoice?.invoiceNumber}</p>
            </div>
            
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Invoice Date</h2>
              <p>{invoice?.date}</p>
            </div>
            
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Due Date</h2>
              <p>{invoice?.dueDate}</p>
            </div>
          </div>

          {/* Invoice items */}
          <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h2>
          <div className="overflow-x-auto mb-8">
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
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice?.lineItems?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      RM {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      RM {item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-xs">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">RM {invoice?.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">RM {invoice?.tax?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-800 font-semibold">Total:</span>
                  <span className="font-semibold">RM {invoice?.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice?.notes && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Notes</h2>
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <p className="text-sm text-gray-700">{invoice.notes}</p>
              </div>
            </div>
          )}

          {/* Payment information */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3>
                <p>Bank Transfer</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Bank Account</h3>
                <p>Bank: Maybank</p>
                <p>Account Name: Cephas Sdn Bhd</p>
                <p>Account Number: 123456789012</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${invoice?.invoiceNumber || ''}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Mark as paid confirmation modal */}
      <ConfirmModal
        isOpen={showMarkPaidModal}
        onClose={() => setShowMarkPaidModal(false)}
        onConfirm={handleMarkPaid}
        title="Mark Invoice as Paid"
        message={`Are you sure you want to mark invoice ${invoice?.invoiceNumber || ''} as paid? This will update the invoice status.`}
        confirmText="Mark as Paid"
        cancelText="Cancel"
        type="success"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default InvoiceDetail;