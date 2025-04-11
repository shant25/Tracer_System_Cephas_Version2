import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, UserPlus, Shield, CheckCircle } from 'lucide-react';
import useCephas from '../../hooks/useCephas';
import { showConfirmation, showSuccess, showError } from '../../utils/notification';
import { ROLES } from '../../config';

/**
 * User Management Component
 * Allows super admins to manage user accounts, roles, and permissions
 */
const UserManagement = () => {
  const { currentUser } = useCephas();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  // Mock user data
  const mockUsers = [
    { 
      id: 1, 
      name: 'Admin User', 
      email: 'admin@cephas.com', 
      role: ROLES.SUPER_ADMIN, 
      status: 'active',
      lastLogin: 'Apr 2, 2025 09:45 AM',
      createdAt: 'Jan 15, 2025',
    },
    { 
      id: 2, 
      name: 'Jane Supervisor', 
      email: 'supervisor@cephas.com', 
      role: ROLES.SUPERVISOR, 
      status: 'active',
      lastLogin: 'Apr 1, 2025 02:30 PM',
      createdAt: 'Jan 20, 2025',
    },
    { 
      id: 3, 
      name: 'John Installer', 
      email: 'installer@cephas.com', 
      role: ROLES.INSTALLER, 
      status: 'active',
      lastLogin: 'Apr 2, 2025 08:15 AM',
      createdAt: 'Feb 5, 2025',
    },
    { 
      id: 4, 
      name: 'Sarah Accountant', 
      email: 'accountant@cephas.com', 
      role: ROLES.ACCOUNTANT, 
      status: 'active',
      lastLogin: 'Apr 2, 2025 10:20 AM',
      createdAt: 'Feb 10, 2025',
    },
    { 
      id: 5, 
      name: 'Mark Warehouse', 
      email: 'warehouse@cephas.com', 
      role: ROLES.WAREHOUSE, 
      status: 'active',
      lastLogin: 'Apr 1, 2025 09:00 AM',
      createdAt: 'Feb 15, 2025',
    },
    { 
      id: 6, 
      name: 'Tom Smith', 
      email: 'tom.smith@cephas.com', 
      role: ROLES.SUPERVISOR, 
      status: 'inactive',
      lastLogin: 'Mar 15, 2025 11:30 AM',
      createdAt: 'Mar 1, 2025',
    },
  ];
  
  // Simulate fetching users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        showError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Filter users based on search term and role filter
  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);
  
  // Handle user deletion with confirmation
  const handleDeleteUser = (userId) => {
    showConfirmation(
      'Are you sure you want to delete this user? This action cannot be undone.',
      () => {
        // Simulate API call to delete user
        setUsers(users.filter(user => user.id !== userId));
        showSuccess('User deleted successfully');
      },
      () => {} // Cancel action
    );
  };
  
  // Toggle user status (active/inactive)
  const toggleUserStatus = (userId) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        return { ...user, status: newStatus };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    showSuccess('User status updated successfully');
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch(role) {
      case ROLES.SUPER_ADMIN:
        return 'bg-purple-100 text-purple-800';
      case ROLES.SUPERVISOR:
        return 'bg-blue-100 text-blue-800';
      case ROLES.INSTALLER:
        return 'bg-green-100 text-green-800';
      case ROLES.ACCOUNTANT:
        return 'bg-yellow-100 text-yellow-800';
      case ROLES.WAREHOUSE:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format role name for display
  const formatRoleName = (role) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
        
        {/* Filters and Actions Bar */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="py-2 px-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
                <option value={ROLES.SUPERVISOR}>Supervisor</option>
                <option value={ROLES.INSTALLER}>Service Installer</option>
                <option value={ROLES.ACCOUNTANT}>Accountant</option>
                <option value={ROLES.WAREHOUSE}>Warehouse</option>
              </select>
            </div>
            
            {/* Add User Button */}
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => setShowAddUserModal(true)}
            >
              <UserPlus size={18} className="mr-2" />
              Add New User
            </button>
          </div>
        </div>
        
        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">System Users</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage user accounts and permissions
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="font-medium text-gray-600">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                            {formatRoleName(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit User"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className={`${user.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                              title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                              onClick={() => toggleUserStatus(user.id)}
                            >
                              {user.status === 'active' ? 
                                <Shield size={18} /> : 
                                <CheckCircle size={18} />
                              }
                            </button>
                            {/* Don't allow deletion of the current user */}
                            {user.email !== currentUser?.email && (
                              <button
                                className="text-red-600 hover:text-red-900"
                                title="Delete User"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                        No users found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* User Role Descriptions */}
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Role Descriptions</h3>
            <p className="mt-1 text-sm text-gray-500">
              System access levels and permissions
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100 mr-3">
                  <Shield size={20} className="text-purple-600" />
                </div>
                <h4 className="text-lg font-medium">Super Admin</h4>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Full system access with ability to manage users, system settings, and all operational features.
                Can create and delete any data in the system.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-3">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <h4 className="text-lg font-medium">Supervisor</h4>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Can manage day-to-day operations, including job assignments, scheduling, and monitoring work.
                Limited access to user management and system settings.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 mr-3">
                  <Shield size={20} className="text-green-600" />
                </div>
                <h4 className="text-lg font-medium">Service Installer</h4>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Field staff who perform installations and service work. Can update their assigned jobs,
                manage materials for their work, and report job status.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-100 mr-3">
                  <Shield size={20} className="text-yellow-600" />
                </div>
                <h4 className="text-lg font-medium">Accountant</h4>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Manages financial aspects including invoicing, payment tracking, and financial reporting.
                Limited access to operational features.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-orange-100 mr-3">
                  <Shield size={20} className="text-orange-600" />
                </div>
                <h4 className="text-lg font-medium">Warehouse</h4>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Manages inventory and material assignments. Can update stock levels, assign materials to
                jobs, and maintain the material catalog.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add User Modal (just the placeholder - would be a separate component in production) */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <UserPlus className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add New User</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Create a new user account with assigned role and permissions.
                      </p>
                    </div>
                    
                    <form className="mt-4 space-y-4">
                      {/* Form fields would go here */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                      </div>
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                        <select id="role" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                          <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
                          <option value={ROLES.SUPERVISOR}>Supervisor</option>
                          <option value={ROLES.INSTALLER}>Service Installer</option>
                          <option value={ROLES.ACCOUNTANT}>Accountant</option>
                          <option value={ROLES.WAREHOUSE}>Warehouse</option>
                        </select>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // Add user logic would go here
                    setShowAddUserModal(false);
                    showSuccess('User created successfully');
                  }}
                >
                  Create User
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;