import { useState, useCallback, useEffect } from 'react';
import { validateForm } from '../utils/validators';

/**
 * Custom hook for form handling with validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Form validation rules
 * @param {Function} onSubmit - Form submission handler
 * @returns {Object} Form state and handlers
 */
const useForm = (initialValues = {}, validationRules = {}, onSubmit = () => {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Validate form when values change
  useEffect(() => {
    const validateValues = () => {
      const formErrors = validateForm(values, validationRules);
      setErrors(formErrors);
      setIsFormValid(Object.keys(formErrors).length === 0);
    };
    
    validateValues();
  }, [values, validationRules]);
  
  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Set specific form values
  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);
  
  // Set a single field value
  const setFieldValue = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);
  
  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  }, [touched]);
  
  // Handle input blur (for validation)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    // Validate all fields
    const formErrors = validateForm(values, validationRules);
    setErrors(formErrors);
    
    // Check if form is valid
    const isValid = Object.keys(formErrors).length === 0;
    setIsFormValid(isValid);
    
    if (isValid) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        setErrors(prev => ({
          ...prev,
          form: error.message || 'Form submission failed'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validationRules, onSubmit]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues,
    setFieldValue
  };
};

export default useForm;