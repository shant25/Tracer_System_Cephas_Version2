import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

/**
 * NotFound component for 404 errors
 */
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-md mx-auto">
        {/* 404 Icon */}
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        {/* Error Message */}
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">404</h1>
        <p className="mt-1 text-xl font-bold text-gray-900">Page Not Found</p>
        <p className="mt-3 text-base text-gray-500">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
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

export default NotFound;