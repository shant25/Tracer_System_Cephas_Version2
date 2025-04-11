import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Settings, 
  Database, 
  Bell, 
  Mail, 
  Shield, 
  Save,
  Users
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import useNotification from '../../hooks/useNotification';

/**
 * SystemSettings component for managing system-wide settings
 */
const SystemSettings = () => {
  const { showSuccess } = useNotification();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  
  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'Cephas Tracker',
    companyName: 'Cephas Sdn Bhd',
    adminEmail: 'admin@cephas.com',
    timezone: 'Asia/Kuala_Lumpur',
    dateFormat: 'MMMM d, yyyy',
    timeFormat: 'h:mm a'
  });
  
  // Email settings state
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'notifications@cephas.com',
    smtpPassword: '********',
    senderName: 'Cephas Notifications',
    senderEmail: 'no-reply@cephas.com',
    enableSmtpAuth: true,
    enableTLS: true
  });
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableBrowserNotifications: true,
    newOrderNotification: true,
    assignmentNotification: true,
    statusChangeNotification: true,
    reminderNotification: true,
    dailyDigest: false,
    weeklyReport: true
  });
  
  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '30',
    passwordExpiryDays: '90',
    loginAttempts: '5',
    requireMFA: false,
    passwordComplexity: 'medium',
    ipRestriction: '',
    allowRememberMe: true
  });
  
  // Backup settings state
  const [backupSettings, setBackupSettings] = useState({
    enableAutoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: '30',
    backupLocation: 'cloud',
    includeAttachments: true,
    includeAuditLogs: true
  });

  // Role settings state
  const [roleSettings, setRoleSettings] = useState({
    enableCustomRoles: false,
    defaultUserRole: 'installer',
    allowRoleAssignment: false
  });
  
  /**
   * Handle form submission for the active tab
   */
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      showSuccess(`${getTabName(activeTab)} settings saved successfully`);
      setIsLoading(false);
    }, 1000);
  };
  
  /**
   * Handle input change for any settings form
   */
  const handleInputChange = (event, settingsKey) => {
    const { name, value, type, checked } = event.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    // Update the appropriate settings object based on the active tab
    switch (settingsKey) {
      case 'general':
        setGeneralSettings({
          ...generalSettings,
          [name]: inputValue
        });
        break;
      case 'email':
        setEmailSettings({
          ...emailSettings,
          [name]: inputValue
        });
        break;
      case 'notification':
        setNotificationSettings({
          ...notificationSettings,
          [name]: inputValue
        });
        break;
      case 'security':
        setSecuritySettings({
          ...securitySettings,
          [name]: inputValue
        });
        break;
      case 'backup':
        setBackupSettings({
          ...backupSettings,
          [name]: inputValue
        });
        break;
      case 'roles':
        setRoleSettings({
          ...roleSettings,
          [name]: inputValue
        });
        break;
      default:
        break;
    }
  };
  
  /**
   * Get readable name for the active tab
   */
  const getTabName = (tab) => {
    switch (tab) {
      case 'general':
        return 'General';
      case 'email':
        return 'Email';
      case 'notification':
        return 'Notification';
      case 'security':
        return 'Security';
      case 'backup':
        return 'Backup';
      case 'roles':
        return 'Roles';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <Button
          type="submit"
          form={`${activeTab}-settings-form`}
          variant="primary"
          leftIcon={<Save size={16} />}
          loading={isLoading}
        >
          Save {getTabName(activeTab)} Settings
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-64 p-4 border-r">
            <nav className="space-y-1">
              <button
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeTab === 'general' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('general')}
              >
                <Settings size={16} className="mr-3" />
                General
              </button>
              <button
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeTab === 'email' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('email')}
              >
                <Mail size={16} className="mr-3" />
                Email
              </button>
              <button
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeTab === 'notification' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('notification')}
              >
                <Bell size={16} className="mr-3" />
                Notifications
              </button>
              <button
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeTab === 'security' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <Shield size={16} className="mr-3" />
                Security
              </button>
              <button
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeTab === 'backup' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('backup')}
              >
                <Database size={16} className="mr-3" />
                Backup & Restore
              </button>
              <button
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeTab === 'roles' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('roles')}
              >
                <Users size={16} className="mr-3" />
                Roles & Permissions
              </button>
            </nav>
          </div>
          
          <div className="flex-1 p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <form id="general-settings-form" onSubmit={handleSaveSettings}>
                <h2 className="text-lg font-medium mb-4">General Settings</h2>
                <div className="space-y-4">
                  <FormInput
                    label="System Name"
                    name="systemName"
                    value={generalSettings.systemName}
                    onChange={(e) => handleInputChange(e, 'general')}
                    hint="Name displayed in the browser title and header"
                  />
                  
                  <FormInput
                    label="Company Name"
                    name="companyName"
                    value={generalSettings.companyName}
                    onChange={(e) => handleInputChange(e, 'general')}
                    hint="Your organization name used in notifications and reports"
                  />
                  
                  <FormInput
                    label="Admin Email"
                    name="adminEmail"
                    type="email"
                    value={generalSettings.adminEmail}
                    onChange={(e) => handleInputChange(e, 'general')}
                    hint="Primary contact for system notifications"
                  />
                  
                  <FormInput
                    label="Timezone"
                    name="timezone"
                    type="select"
                    value={generalSettings.timezone}
                    onChange={(e) => handleInputChange(e, 'general')}
                    options={[
                      { value: 'Asia/Kuala_Lumpur', label: 'Malaysia (GMT+8)' },
                      { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
                      { value: 'Asia/Jakarta', label: 'Indonesia (GMT+7)' },
                      { value: 'Asia/Bangkok', label: 'Thailand (GMT+7)' }
                    ]}
                    hint="Default timezone for all dates and times"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Date Format"
                      name="dateFormat"
                      type="select"
                      value={generalSettings.dateFormat}
                      onChange={(e) => handleInputChange(e, 'general')}
                      options={[
                        { value: 'MMMM d, yyyy', label: 'January 1, 2025' },
                        { value: 'MMM d, yyyy', label: 'Jan 1, 2025' },
                        { value: 'd MMMM yyyy', label: '1 January 2025' },
                        { value: 'yyyy-MM-dd', label: '2025-01-01' },
                        { value: 'dd/MM/yyyy', label: '01/01/2025' },
                        { value: 'MM/dd/yyyy', label: '01/01/2025' }
                      ]}
                    />
                    
                    <FormInput
                      label="Time Format"
                      name="timeFormat"
                      type="select"
                      value={generalSettings.timeFormat}
                      onChange={(e) => handleInputChange(e, 'general')}
                      options={[
                        { value: 'h:mm a', label: '1:30 PM' },
                        { value: 'HH:mm', label: '13:30' },
                        { value: 'h:mm:ss a', label: '1:30:45 PM' },
                        { value: 'HH:mm:ss', label: '13:30:45' }
                      ]}
                    />
                  </div>
                </div>
              </form>
            )}
            
            {/* Email Settings */}
            {activeTab === 'email' && (
              <form id="email-settings-form" onSubmit={handleSaveSettings}>
                <h2 className="text-lg font-medium mb-4">Email Settings</h2>
                <div className="space-y-4">
                  <FormInput
                    label="SMTP Server"
                    name="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={(e) => handleInputChange(e, 'email')}
                    hint="Server for outgoing emails"
                  />
                  
                  <FormInput
                    label="SMTP Port"
                    name="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) => handleInputChange(e, 'email')}
                    hint="Common ports: 25, 465, 587"
                  />
                  
                  <FormInput
                    label="SMTP Username"
                    name="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => handleInputChange(e, 'email')}
                  />
                  
                  <FormInput
                    label="SMTP Password"
                    name="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => handleInputChange(e, 'email')}
                  />
                  
                  <FormInput
                    label="Sender Name"
                    name="senderName"
                    value={emailSettings.senderName}
                    onChange={(e) => handleInputChange(e, 'email')}
                    hint="Name displayed in the 'From' field"
                  />
                  
                  <FormInput
                    label="Sender Email"
                    name="senderEmail"
                    type="email"
                    value={emailSettings.senderEmail}
                    onChange={(e) => handleInputChange(e, 'email')}
                    hint="Email address displayed in the 'From' field"
                  />
                  
                  <div className="space-y-2">
                    <FormInput
                      label="Enable SMTP Authentication"
                      name="enableSmtpAuth"
                      type="checkbox"
                      checked={emailSettings.enableSmtpAuth}
                      onChange={(e) => handleInputChange(e, 'email')}
                    />
                    
                    <FormInput
                      label="Enable TLS/SSL"
                      name="enableTLS"
                      type="checkbox"
                      checked={emailSettings.enableTLS}
                      onChange={(e) => handleInputChange(e, 'email')}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => showSuccess('Test email sent successfully')}
                    >
                      Send Test Email
                    </Button>
                  </div>
                </div>
              </form>
            )}
            
            {/* Notification Settings */}
            {activeTab === 'notification' && (
              <form id="notification-settings-form" onSubmit={handleSaveSettings}>
                <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <FormInput
                      label="Enable Email Notifications"
                      name="enableEmailNotifications"
                      type="checkbox"
                      checked={notificationSettings.enableEmailNotifications}
                      onChange={(e) => handleInputChange(e, 'notification')}
                    />
                    
                    <FormInput
                      label="Enable Browser Notifications"
                      name="enableBrowserNotifications"
                      type="checkbox"
                      checked={notificationSettings.enableBrowserNotifications}
                      onChange={(e) => handleInputChange(e, 'notification')}
                    />
                  </div>
                  
                  <h3 className="text-md font-medium mt-4">Notification Events</h3>
                  <div className="space-y-2 ml-4">
                    <FormInput
                      label="New Order Notification"
                      name="newOrderNotification"
                      type="checkbox"
                      checked={notificationSettings.newOrderNotification}
                      onChange={(e) => handleInputChange(e, 'notification')}
                    />
                    
                    <FormInput
                      label="Assignment Notification"
                      name="assignmentNotification"
                      type="checkbox"
                      checked={notificationSettings.assignmentNotification}
                      onChange={(e) => handleInputChange(e, 'notification')}
                    />
                    
                    <FormInput
                      label="Status Change Notification"
                      name="statusChangeNotification"
                      type="checkbox"
                      checked={notificationSettings.statusChangeNotification}
                      onChange={(e) => handleInputChange(e, 'notification')}
                    />
                    
                    <FormInput
                      label="Reminder Notification"
                      name="reminderNotification"
                      type="checkbox"
                      checked={notificationSettings.reminderNotification}
                      onChange={(e) => handleInputChange(e, 'notification')}
                    />
                  </div>
                  
                  <h3 className="text-md font-medium mt-4">Digest & Reports</h3>
                  <div className="space-y-2 ml-4">
                    <FormInput
                      label="Daily Digest"
                      name="dailyDigest"
                      type="checkbox"
                      checked={notificationSettings.dailyDigest}
                      onChange={(e) => handleInputChange(e, 'notification')}
                    />
                    
                    <FormInput
                      label="Weekly Report"
                      name="weeklyReport"
                      type="checkbox"
                      checked={notificationSettings.weeklyReport}
                      onChange={(e) => handleInputChange(e, 'notification')}
                    />
                  </div>
                </div>
              </form>
            )}
            
            {/* Security Settings */}
            {activeTab === 'security' && (
              <form id="security-settings-form" onSubmit={handleSaveSettings}>
                <h2 className="text-lg font-medium mb-4">Security Settings</h2>
                <div className="space-y-4">
                  <FormInput
                    label="Session Timeout (minutes)"
                    name="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleInputChange(e, 'security')}
                    hint="Automatically log out inactive users"
                    min="5"
                    max="120"
                  />
                  
                  <FormInput
                    label="Password Expiry (days)"
                    name="passwordExpiryDays"
                    type="number"
                    value={securitySettings.passwordExpiryDays}
                    onChange={(e) => handleInputChange(e, 'security')}
                    hint="Force password change after this many days"
                    min="0"
                    max="365"
                  />
                  
                  <FormInput
                    label="Failed Login Attempts"
                    name="loginAttempts"
                    type="number"
                    value={securitySettings.loginAttempts}
                    onChange={(e) => handleInputChange(e, 'security')}
                    hint="Number of attempts before account lockout"
                    min="1"
                    max="10"
                  />
                  
                  <FormInput
                    label="Password Complexity"
                    name="passwordComplexity"
                    type="select"
                    value={securitySettings.passwordComplexity}
                    onChange={(e) => handleInputChange(e, 'security')}
                    options={[
                      { value: 'low', label: 'Low - Minimum 6 characters' },
                      { value: 'medium', label: 'Medium - 8+ chars, mixed case, numbers' },
                      { value: 'high', label: 'High - 10+ chars, mixed case, numbers, symbols' }
                    ]}
                    hint="Required password complexity for all users"
                  />
                  
                  <FormInput
                    label="IP Restriction"
                    name="ipRestriction"
                    value={securitySettings.ipRestriction}
                    onChange={(e) => handleInputChange(e, 'security')}
                    hint="Comma-separated list of allowed IP addresses (leave empty for no restriction)"
                  />
                  
                  <div className="space-y-2">
                    <FormInput
                      label="Require Multi-Factor Authentication"
                      name="requireMFA"
                      type="checkbox"
                      checked={securitySettings.requireMFA}
                      onChange={(e) => handleInputChange(e, 'security')}
                    />
                    
                    <FormInput
                      label="Allow 'Remember Me' Login Option"
                      name="allowRememberMe"
                      type="checkbox"
                      checked={securitySettings.allowRememberMe}
                      onChange={(e) => handleInputChange(e, 'security')}
                    />
                  </div>
                </div>
              </form>
            )}
            
            {/* Backup Settings */}
            {activeTab === 'backup' && (
              <form id="backup-settings-form" onSubmit={handleSaveSettings}>
                <h2 className="text-lg font-medium mb-4">Backup & Restore Settings</h2>
                <div className="space-y-4">
                  <FormInput
                    label="Enable Automatic Backups"
                    name="enableAutoBackup"
                    type="checkbox"
                    checked={backupSettings.enableAutoBackup}
                    onChange={(e) => handleInputChange(e, 'backup')}
                  />
                  
                  <FormInput
                    label="Backup Frequency"
                    name="backupFrequency"
                    type="select"
                    value={backupSettings.backupFrequency}
                    onChange={(e) => handleInputChange(e, 'backup')}
                    options={[
                      { value: 'hourly', label: 'Hourly' },
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                      { value: 'monthly', label: 'Monthly' }
                    ]}
                    hint="How often backups are performed"
                    disabled={!backupSettings.enableAutoBackup}
                  />
                  
                  <FormInput
                    label="Backup Time"
                    name="backupTime"
                    type="time"
                    value={backupSettings.backupTime}
                    onChange={(e) => handleInputChange(e, 'backup')}
                    hint="When daily/weekly/monthly backups are performed"
                    disabled={!backupSettings.enableAutoBackup || backupSettings.backupFrequency === 'hourly'}
                  />
                  
                  <FormInput
                    label="Backup Retention (days)"
                    name="retentionDays"
                    type="number"
                    value={backupSettings.retentionDays}
                    onChange={(e) => handleInputChange(e, 'backup')}
                    hint="How long to keep backups before deletion"
                    min="1"
                    max="365"
                    disabled={!backupSettings.enableAutoBackup}
                  />
                  
                  <FormInput
                    label="Backup Location"
                    name="backupLocation"
                    type="select"
                    value={backupSettings.backupLocation}
                    onChange={(e) => handleInputChange(e, 'backup')}
                    options={[
                      { value: 'local', label: 'Local Server' },
                      { value: 'cloud', label: 'Cloud Storage' },
                      { value: 'both', label: 'Both Local and Cloud' }
                    ]}
                    hint="Where backups are stored"
                  />
                  
                  <div className="space-y-2">
                    <FormInput
                      label="Include Attachments"
                      name="includeAttachments"
                      type="checkbox"
                      checked={backupSettings.includeAttachments}
                      onChange={(e) => handleInputChange(e, 'backup')}
                      hint="Include uploaded files in backups"
                    />
                    
                    <FormInput
                      label="Include Audit Logs"
                      name="includeAuditLogs"
                      type="checkbox"
                      checked={backupSettings.includeAuditLogs}
                      onChange={(e) => handleInputChange(e, 'backup')}
                      hint="Include system audit logs in backups"
                    />
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => showSuccess('Manual backup started')}
                      className="mr-2"
                    >
                      Create Manual Backup
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline-danger"
                      onClick={() => showSuccess('Restore started from selected backup')}
                    >
                      Restore from Backup
                    </Button>
                  </div>
                </div>
              </form>
            )}
            
            {/* Role Settings */}
            {activeTab === 'roles' && (
              <form id="roles-settings-form" onSubmit={handleSaveSettings}>
                <h2 className="text-lg font-medium mb-4">Roles & Permissions Settings</h2>
                <div className="space-y-4">
                  <FormInput
                    label="Enable Custom Roles"
                    name="enableCustomRoles"
                    type="checkbox"
                    checked={roleSettings.enableCustomRoles}
                    onChange={(e) => handleInputChange(e, 'roles')}
                    hint="Allow creation of custom user roles beyond the default ones"
                  />
                  
                  <FormInput
                    label="Default User Role"
                    name="defaultUserRole"
                    type="select"
                    value={roleSettings.defaultUserRole}
                    onChange={(e) => handleInputChange(e, 'roles')}
                    options={[
                      { value: 'installer', label: 'Service Installer' },
                      { value: 'supervisor', label: 'Supervisor' },
                      { value: 'accountant', label: 'Accountant' },
                      { value: 'warehouse', label: 'Warehouse Manager' },
                      { value: 'readonly', label: 'Read Only' }
                    ]}
                    hint="Default role assigned to new users"
                  />
                  
                  <FormInput
                    label="Allow Role Assignment"
                    name="allowRoleAssignment"
                    type="checkbox"
                    checked={roleSettings.allowRoleAssignment}
                    onChange={(e) => handleInputChange(e, 'roles')}
                    hint="Allow supervisors to assign roles to users (otherwise only admins can)"
                  />
                  
                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/settings/users')}
                    >
                      Manage User Roles
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;