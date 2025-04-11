import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Save, AlertCircle, CheckCircle, Camera, Eye, EyeOff } from 'lucide-react';
import { validatePassword } from '../../utils/validators';
import { showSuccess, showError } from '../../utils/notification';
import useCephas from '../../hooks/useCephas';

/**
 * Profile Settings Component
 * Allows users to update their personal information and preferences
 */
const ProfileSettings = () => {
  const { currentUser } = useCephas();
  
  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    profileImage: null
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // Interface preferences
  const [preferences, setPreferences] = useState({
    enableNotifications: true,
    darkMode: false,
    compactView: false,
    showTips: true,
    defaultView: 'dashboard'
  });
  
  // Simulate fetching user profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock user data
        setProfile({
          name: currentUser?.name || 'Admin User',
          email: currentUser?.email || 'admin@cephas.com',
          phone: '+60 17-676 7625',
          jobTitle: 'System Administrator',
          department: 'IT Department',
          profileImage: null
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        showError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [currentUser]);
  
  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess(false);
    
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSaveSuccess(true);
      showSuccess('Profile updated successfully');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Handle password change form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setPasswordErrors({});
    setPasswordLoading(true);
    setPasswordSuccess(false);
    
    // Validation
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    // Validate new password
    const passwordValidation = validatePassword(passwordData.newPassword);
    if (!passwordValidation.valid) {
      errors.newPassword = passwordValidation.message;
    }
    
    // Confirm passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // If there are errors, show them and stop
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      setPasswordLoading(false);
      return;
    }
    
    try {
      // Simulate API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setPasswordSuccess(true);
      showSuccess('Password changed successfully');
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      showError('Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };
  
  // Handle profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle preference changes
  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For now, just create a local URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Calculate password strength (0-4)
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Lowercase and number check
    if (/[a-z]/.test(password) && /[0-9]/.test(password)) strength += 1;
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    return strength;
  };
  
  // Password strength indicator
  const passwordStrength = getPasswordStrength(passwordData.newPassword);
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Profile Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your personal information and contact details
                </p>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleProfileSubmit}>
                  <div className="flex flex-col md:flex-row">
                    {/* Profile Image */}
                    <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-6">
                      <div className="relative">
                        <div className="h-40 w-40 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {profile.profileImage ? (
                            <img src={profile.profileImage} alt="Profile" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-4xl font-medium text-gray-600">
                              {profile.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          )}
                        </div>
                        <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 p-2 rounded-full bg-white shadow-md cursor-pointer">
                          <Camera className="h-5 w-5 text-gray-700" />
                          <input
                            id="profile-image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                    
                    {/* Profile Details */}
                    <div className="flex-grow space-y-4">
                      <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={profile.name}
                              onChange={handleProfileChange}
                              className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={profile.email}
                              onChange={handleProfileChange}
                              className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              name="phone"
                              id="phone"
                              value={profile.phone}
                              onChange={handleProfileChange}
                              className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                            Job Title
                          </label>
                          <input
                            type="text"
                            name="jobTitle"
                            id="jobTitle"
                            value={profile.jobTitle}
                            onChange={handleProfileChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                            Department
                          </label>
                          <input
                            type="text"
                            name="department"
                            id="department"
                            value={profile.department}
                            onChange={handleProfileChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={saveLoading}
                          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                            saveLoading ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {saveLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 -ml-1 h-4 w-4" />
                              Save Profile
                            </>
                          )}
                        </button>
                      </div>
                      
                      {saveSuccess && (
                        <div className="text-right">
                          <span className="inline-flex items-center text-sm text-green-600">
                            <CheckCircle className="mr-1.5 h-4 w-4" />
                            Profile updated successfully
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Change Password */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Change Password
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your password to maintain account security
                </p>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          id="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className={`block w-full pl-10 pr-10 py-2 border ${
                            passwordErrors.currentPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                          } rounded-md shadow-sm focus:outline-none`}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordErrors.currentPassword}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={`block w-full pl-10 pr-10 py-2 border ${
                            passwordErrors.newPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                          } rounded-md shadow-sm focus:outline-none`}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordErrors.newPassword}
                        </p>
                      )}
                      
                      {/* Password Strength Indicator */}
                      {passwordData.newPassword && (
                        <div className="mt-2">
                          <div className="flex items-center mb-1">
                            <div className="flex-grow h-2 bg-gray-200 rounded-full">
                              <div 
                                className={`h-2 rounded-full ${
                                  passwordStrength === 0 ? 'bg-red-500' :
                                  passwordStrength === 1 ? 'bg-orange-500' :
                                  passwordStrength === 2 ? 'bg-yellow-500' :
                                  passwordStrength === 3 ? 'bg-blue-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${passwordStrength * 25}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs text-gray-500">
                              {passwordStrength === 0 ? 'Weak' :
                              passwordStrength === 1 ? 'Fair' :
                              passwordStrength === 2 ? 'Good' :
                              passwordStrength === 3 ? 'Strong' :
                              'Very Strong'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Password should contain at least 8 characters, uppercase, lowercase, numbers, and special characters.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          id="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={`block w-full pl-10 pr-10 py-2 border ${
                            passwordErrors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                          } rounded-md shadow-sm focus:outline-none`}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                          passwordLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {passwordLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </>
                        ) : (
                          'Change Password'
                        )}
                      </button>
                    </div>
                    
                    {passwordSuccess && (
                      <div className="text-right">
                        <span className="inline-flex items-center text-sm text-green-600">
                          <CheckCircle className="mr-1.5 h-4 w-4" />
                          Password changed successfully
                        </span>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
            
            {/* Interface Preferences */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Interface Preferences
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Customize your application experience
                </p>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enableNotifications"
                        name="enableNotifications"
                        type="checkbox"
                        checked={preferences.enableNotifications}
                        onChange={handlePreferenceChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enableNotifications" className="font-medium text-gray-700">Enable In-App Notifications</label>
                      <p className="text-gray-500">Show notifications within the application for important events</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="darkMode"
                        name="darkMode"
                        type="checkbox"
                        checked={preferences.darkMode}
                        onChange={handlePreferenceChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="darkMode" className="font-medium text-gray-700">Dark Mode</label>
                      <p className="text-gray-500">Use dark color scheme for the interface</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="compactView"
                        name="compactView"
                        type="checkbox"
                        checked={preferences.compactView}
                        onChange={handlePreferenceChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="compactView" className="font-medium text-gray-700">Compact View</label>
                      <p className="text-gray-500">Display more content with less spacing</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="showTips"
                        name="showTips"
                        type="checkbox"
                        checked={preferences.showTips}
                        onChange={handlePreferenceChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="showTips" className="font-medium text-gray-700">Show Tips and Hints</label>
                      <p className="text-gray-500">Display helpful tips and hints throughout the application</p>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="defaultView" className="block text-sm font-medium text-gray-700">
                      Default Landing Page
                    </label>
                    <select
                      id="defaultView"
                      name="defaultView"
                      value={preferences.defaultView}
                      onChange={(e) => setPreferences(prev => ({ ...prev, defaultView: e.target.value }))}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                      <option value="dashboard">Dashboard</option>
                      <option value="orders">Orders</option>
                      <option value="activations">Activations</option>
                      <option value="materials">Materials</option>
                      <option value="installers">Service Installers</option>
                    </select>
                  </div>
                  
                  <div className="pt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        // Save preferences
                        setSaveSuccess(true);
                        showSuccess('Preferences saved successfully');
                        
                        // Reset success message after 3 seconds
                        setTimeout(() => {
                          setSaveSuccess(false);
                        }, 3000);
                      }}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Save className="mr-2 -ml-1 h-4 w-4" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Management */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Account Management
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Options for your account security and management
                </p>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          The following actions affect your entire account. Please proceed with caution.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Export My Data
                  </button>
                  
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;