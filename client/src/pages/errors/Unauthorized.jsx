import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Shield } from 'lucide-react';
import Button from '../../components/common/Button';

/**
 * Unauthorized component for 403 errors
 */
const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-md mx-auto">
        {/* 403 Icon */}
        <div className="mb-6">
          <Shield size={80} className="mx-auto text-red-500" />
        </div>
        
        {/* Error Message */}
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">403</h1>
        <p className="mt-1 text-xl font-bold text-gray-900">Access Denied</p>
        <p className="mt-3 text-base text-gray-500">
          Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            as={Link}
            to="/"
            variant="primary"
            leftIcon={<Home size={16} />}
          >
            Go to Dashboard
          </Button>
          <Button
            as="button"
            variant="outline"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;