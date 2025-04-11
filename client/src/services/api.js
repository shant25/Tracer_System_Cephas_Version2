// Mock API service for development
import { AUTH_TOKEN_KEY } from '../config';

// Mock database
const mockDB = {
  buildings: [
    { 
      id: 1, 
      name: 'Sunway Velocity', 
      type: 'Prelaid',
      location: 'Kuala Lumpur',
      address: '123 Jalan Cheras, 56000 Kuala Lumpur',
      contactPerson: 'Ahmad Zainal',
      contactNumber: '012-345-6789',
      contactEmail: 'ahmad@example.com',
      notes: 'Main building in Cheras area'
    },
    { 
      id: 2, 
      name: 'Parkview Residence', 
      type: 'Non Prelaid',
      location: 'Petaling Jaya',
      address: '456 Jalan PJ, 47800 Petaling Jaya, Selangor',
      contactPerson: 'Lee Wei Ming',
      contactNumber: '013-456-7890',
      contactEmail: 'lee@example.com',
      notes: 'High-rise residential building'
    },
    { 
      id: 3, 
      name: 'Setia City Mall', 
      type: 'Both',
      location: 'Shah Alam',
      address: '789 Persiaran Setia, 40170 Shah Alam, Selangor',
      contactPerson: 'Sarah Tan',
      contactNumber: '014-567-8901',
      contactEmail: 'sarah@example.com',
      notes: 'Shopping mall with residential apartments'
    }
  ],
  serviceInstallers: [
    { 
      id: 1, 
      name: 'K. MARIAPPAN A/L KUPPATHAN', 
      contactNo: '017-123-4567', 
      email: 'mariappan@example.com',
      address: '42, Jalan Sri Ampang, Kuala Lumpur',
      bankName: 'MAYBANK',
      bankAccountNo: '12345678901',
      isActive: true,
      activeJobs: 3, 
      completedToday: 2
    },
    { 
      id: 2, 
      name: 'SARAVANAN A/L I. CHINNIAH', 
      contactNo: '018-234-5678', 
      email: 'saravanan@example.com',
      address: '50, Taman Sri Muda, Shah Alam',
      bankName: 'CIMB',
      bankAccountNo: '98765432109',
      isActive: true,
      activeJobs: 2, 
      completedToday: 1 
    },
    { 
      id: 3, 
      name: 'AHMAD BIN ALI', 
      contactNo: '019-345-6789', 
      email: 'ahmad@example.com',
      address: '22, Taman Melawati, Ampang',
      bankName: 'RHB',
      bankAccountNo: '45678901234',
      isActive: true,
      activeJobs: 4, 
      completedToday: 0 
    }
  ],
  materials: [
    { 
      id: 1, 
      sapCode: 'MTL-001', 
      description: 'Fiber Optic Cable 50m',
      stockKeepingUnit: 25,
      minimumStock: 10,
      unitPrice: 150.00,
      materialType: 'EQUIPMENT',
      isActive: true,
      notes: 'Standard fiber optic cable for installations'
    },
    { 
      id: 2, 
      sapCode: 'MTL-002', 
      description: 'Fiber Optic Connector',
      stockKeepingUnit: 100,
      minimumStock: 20,
      unitPrice: 5.50,
      materialType: 'CONSUMABLE',
      isActive: true,
      notes: 'Connectors for fiber optic cables'
    },
    { 
      id: 3, 
      sapCode: 'MTL-003', 
      description: 'Wireless Router',
      stockKeepingUnit: 15,
      minimumStock: 5,
      unitPrice: 120.00,
      materialType: 'EQUIPMENT',
      isActive: true,
      notes: 'Standard router for residential installations'
    }
  ],
  activations: [
    { 
      id: 1, 
      trbnNo: 'TBBNA870523G', 
      name: 'TAN PUI YEE',
      contactNo: '017-3781691 / 60173781691',
      serviceInstallerId: null,
      serviceInstaller: null,
      buildingId: 1,
      building: 'SOLARIS PARQ RESIDENSI',
      status: 'NOT_COMPLETED',
      materialsAssigned: false,
      appointmentDate: '2025-05-10',
      appointmentTime: '10:00',
      orderType: 'ACTIVATION',
      orderSubType: 'RESCHEDULE',
      notes: 'Customer has requested installation in the morning'
    },
    { 
      id: 2, 
      trbnNo: 'TBBNA872851G', 
      name: 'CHOY YUEN LENG',
      contactNo: '012-2239707 / 0122539707',
      serviceInstallerId: null,
      serviceInstaller: null,
      buildingId: 2,
      building: 'RESIDENSI M LUNA',
      status: 'NOT_COMPLETED',
      materialsAssigned: false,
      appointmentDate: '2025-05-03',
      appointmentTime: '10:00',
      orderType: 'ACTIVATION',
      orderSubType: '',
      notes: ''
    },
    { 
      id: 3, 
      trbnNo: 'TBBNA872853G', 
      name: 'LEE CHONG WEI',
      contactNo: '013-3456789',
      serviceInstallerId: 1,
      serviceInstaller: 'K. MARIAPPAN A/L KUPPATHAN',
      buildingId: 3,
      building: 'THE WESTSIDE II',
      status: 'IN_PROGRESS',
      materialsAssigned: true,
      appointmentDate: '2025-05-01',
      appointmentTime: '14:30',
      orderType: 'ACTIVATION',
      orderSubType: '',
      notes: 'Previous installation was unsuccessful'
    }
  ],
  assurances: [
    {
      id: 1,
      ticketNumber: 'ASR00125',
      trbnNo: 'TBBNA865423G',
      name: 'LISA TAN',
      contactNo: '017-8765432',
      serviceInstallerId: 2,
      serviceInstaller: 'SARAVANAN A/L I. CHINNIAH',
      buildingId: 1,
      building: 'SOLARIS PARQ RESIDENSI',
      status: 'IN_PROGRESS',
      appointmentDate: '2025-05-02',
      appointmentTime: '09:00',
      reason: 'INTERMITTENT',
      troubleshooting: 'Customer reports intermittent connection issues',
      remarks: 'Will need to check fiber connection'
    },
    {
      id: 2,
      ticketNumber: 'ASR00126',
      trbnNo: 'TBBNA865789G',
      name: 'AHMAD ZAKARIA',
      contactNo: '018-2345678',
      serviceInstallerId: null,
      serviceInstaller: null,
      buildingId: 2,
      building: 'PARKVIEW RESIDENCE',
      status: 'NOT_COMPLETED',
      appointmentDate: '2025-05-06',
      appointmentTime: '14:00',
      reason: 'SLOW_SPEED',
      troubleshooting: 'Customer complains about slow internet speed',
      remarks: 'Need to check line quality'
    }
  ]
};

/**
 * Simulate API delay
 * @param {number} ms - Milliseconds to delay
 */
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate new ID for collection items
 * @param {Array} collection - Collection to generate ID for
 * @returns {number} - New ID
 */
const generateId = (collection) => {
  const maxId = collection.reduce((max, item) => Math.max(max, item.id), 0);
  return maxId + 1;
};

/**
 * Find item by ID in collection
 * @param {Array} collection - Collection to search
 * @param {number|string} id - ID to find
 * @returns {Object|null} - Found item or null
 */
const findById = (collection, id) => {
  const numId = parseInt(id, 10);
  return collection.find(item => item.id === numId) || null;
};

/**
 * Mock API service
 */
const api = {
  /**
   * Send a GET request
   * @param {string} url - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - Promise with response
   */
  get: async (url, options = {}) => {
    await delay();
    
    // Extract collection and ID from URL
    const parts = url.split('/').filter(Boolean);
    const collection = parts[0];
    const id = parts[1];
    
    // Handle collection endpoints
    switch (collection) {
      case 'buildings':
        if (id) {
          const building = findById(mockDB.buildings, id);
          if (building) {
            return { success: true, data: building };
          } else {
            return { success: false, message: 'Building not found' };
          }
        } else {
          return { success: true, data: mockDB.buildings };
        }
      
      case 'service-installers':
        if (id) {
          const installer = findById(mockDB.serviceInstallers, id);
          if (installer) {
            return { success: true, data: installer };
          } else {
            return { success: false, message: 'Service installer not found' };
          }
        } else {
          return { success: true, data: mockDB.serviceInstallers };
        }
      
      case 'materials':
        if (id) {
          const material = findById(mockDB.materials, id);
          if (material) {
            return { success: true, data: material };
          } else {
            return { success: false, message: 'Material not found' };
          }
        } else {
          return { success: true, data: mockDB.materials };
        }
      
      case 'activations':
        if (id) {
          const activation = findById(mockDB.activations, id);
          if (activation) {
            return { success: true, data: activation };
          } else {
            return { success: false, message: 'Activation not found' };
          }
        } else {
          return { success: true, data: mockDB.activations };
        }
      
      case 'assurances':
        if (id) {
          const assurance = findById(mockDB.assurances, id);
          if (assurance) {
            return { success: true, data: assurance };
          } else {
            return { success: false, message: 'Assurance not found' };
          }
        } else {
          return { success: true, data: mockDB.assurances };
        }
      
      default:
        return { success: false, message: 'Endpoint not found' };
    }
  },
  
  /**
   * Send a POST request
   * @param {string} url - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise} - Promise with response
   */
  post: async (url, data = {}, options = {}) => {
    await delay();
    
    // Extract collection from URL
    const parts = url.split('/').filter(Boolean);
    const collection = parts[0];
    
    // Handle collection endpoints
    switch (collection) {
      case 'buildings':
        const newBuilding = {
          id: generateId(mockDB.buildings),
          ...data
        };
        mockDB.buildings.push(newBuilding);
        return { success: true, data: newBuilding };
      
      case 'service-installers':
        const newInstaller = {
          id: generateId(mockDB.serviceInstallers),
          ...data
        };
        mockDB.serviceInstallers.push(newInstaller);
        return { success: true, data: newInstaller };
      
      case 'materials':
        const newMaterial = {
          id: generateId(mockDB.materials),
          ...data
        };
        mockDB.materials.push(newMaterial);
        return { success: true, data: newMaterial };
      
      case 'activations':
        const newActivation = {
          id: generateId(mockDB.activations),
          status: 'NOT_COMPLETED',
          materialsAssigned: false,
          ...data
        };
        mockDB.activations.push(newActivation);
        return { success: true, data: newActivation };
      
      case 'assurances':
        const newAssurance = {
          id: generateId(mockDB.assurances),
          ticketNumber: `ASR${Math.floor(10000 + Math.random() * 90000)}`,
          status: 'NOT_COMPLETED',
          ...data
        };
        mockDB.assurances.push(newAssurance);
        return { success: true, data: newAssurance };
      
      // Handle login
      case 'auth':
        if (parts[1] === 'login') {
          // Mock login functionality
          const { email, password } = data;
          
          // Very simple auth for demo purposes
          if (email && password) {
            let role = 'supervisor'; // Default role
            
            // Determine role based on email for demo
            if (email.includes('admin')) {
              role = 'super_admin';
            } else if (email.includes('supervisor')) {
              role = 'supervisor';
            } else if (email.includes('installer')) {
              role = 'service_installer';
            } else if (email.includes('accountant')) {
              role = 'accountant';
            } else if (email.includes('warehouse')) {
              role = 'warehouse';
            }
            
            // Create mock user and token
            const user = {
              id: 1,
              name: email.split('@')[0].toUpperCase(),
              email,
              role
            };
            
            const token = `mock-token-${Date.now()}`;
            
            return {
              success: true,
              data: {
                user,
                token
              },
              message: 'Login successful'
            };
          } else {
            return {
              success: false,
              message: 'Invalid credentials'
            };
          }
        }
        break;
      
      default:
        return { success: false, message: 'Endpoint not found' };
    }
  },
  
  /**
   * Send a PUT request
   * @param {string} url - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise} - Promise with response
   */
  put: async (url, data = {}, options = {}) => {
    await delay();
    
    // Extract collection and ID from URL
    const parts = url.split('/').filter(Boolean);
    const collection = parts[0];
    const id = parts[1];
    
    if (!id) {
      return { success: false, message: 'ID is required for PUT requests' };
    }
    
    // Handle collection endpoints
    switch (collection) {
      case 'buildings':
        const buildingIndex = mockDB.buildings.findIndex(b => b.id === parseInt(id, 10));
        if (buildingIndex !== -1) {
          mockDB.buildings[buildingIndex] = {
            ...mockDB.buildings[buildingIndex],
            ...data,
            id: parseInt(id, 10) // Ensure ID doesn't change
          };
          return { success: true, data: mockDB.buildings[buildingIndex] };
        } else {
          return { success: false, message: 'Building not found' };
        }
      
      case 'service-installers':
        const installerIndex = mockDB.serviceInstallers.findIndex(i => i.id === parseInt(id, 10));
        if (installerIndex !== -1) {
          mockDB.serviceInstallers[installerIndex] = {
            ...mockDB.serviceInstallers[installerIndex],
            ...data,
            id: parseInt(id, 10)
          };
          return { success: true, data: mockDB.serviceInstallers[installerIndex] };
        } else {
          return { success: false, message: 'Service installer not found' };
        }
      
      case 'materials':
        const materialIndex = mockDB.materials.findIndex(m => m.id === parseInt(id, 10));
        if (materialIndex !== -1) {
          mockDB.materials[materialIndex] = {
            ...mockDB.materials[materialIndex],
            ...data,
            id: parseInt(id, 10)
          };
          return { success: true, data: mockDB.materials[materialIndex] };
        } else {
          return { success: false, message: 'Material not found' };
        }
      
      case 'activations':
        const activationIndex = mockDB.activations.findIndex(a => a.id === parseInt(id, 10));
        if (activationIndex !== -1) {
          mockDB.activations[activationIndex] = {
            ...mockDB.activations[activationIndex],
            ...data,
            id: parseInt(id, 10)
          };
          return { success: true, data: mockDB.activations[activationIndex] };
        } else {
          return { success: false, message: 'Activation not found' };
        }
      
      case 'assurances':
        const assuranceIndex = mockDB.assurances.findIndex(a => a.id === parseInt(id, 10));
        if (assuranceIndex !== -1) {
          mockDB.assurances[assuranceIndex] = {
            ...mockDB.assurances[assuranceIndex],
            ...data,
            id: parseInt(id, 10)
          };
          return { success: true, data: mockDB.assurances[assuranceIndex] };
        } else {
          return { success: false, message: 'Assurance not found' };
        }
      
      default:
        return { success: false, message: 'Endpoint not found' };
    }
  },
  
  /**
   * Send a DELETE request
   * @param {string} url - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - Promise with response
   */
  delete: async (url, options = {}) => {
    await delay();
    
    // Extract collection and ID from URL
    const parts = url.split('/').filter(Boolean);
    const collection = parts[0];
    const id = parts[1];
    
    if (!id) {
      return { success: false, message: 'ID is required for DELETE requests' };
    }
    
    // Handle collection endpoints
    switch (collection) {
      case 'buildings':
        const buildingIndex = mockDB.buildings.findIndex(b => b.id === parseInt(id, 10));
        if (buildingIndex !== -1) {
          mockDB.buildings.splice(buildingIndex, 1);
          return { success: true, message: 'Building deleted successfully' };
        } else {
          return { success: false, message: 'Building not found' };
        }
      
      case 'service-installers':
        const installerIndex = mockDB.serviceInstallers.findIndex(i => i.id === parseInt(id, 10));
        if (installerIndex !== -1) {
          mockDB.serviceInstallers.splice(installerIndex, 1);
          return { success: true, message: 'Service installer deleted successfully' };
        } else {
          return { success: false, message: 'Service installer not found' };
        }
      
      case 'materials':
        const materialIndex = mockDB.materials.findIndex(m => m.id === parseInt(id, 10));
        if (materialIndex !== -1) {
          mockDB.materials.splice(materialIndex, 1);
          return { success: true, message: 'Material deleted successfully' };
        } else {
          return { success: false, message: 'Material not found' };
        }
      
      case 'activations':
        const activationIndex = mockDB.activations.findIndex(a => a.id === parseInt(id, 10));
        if (activationIndex !== -1) {
          mockDB.activations.splice(activationIndex, 1);
          return { success: true, message: 'Activation deleted successfully' };
        } else {
          return { success: false, message: 'Activation not found' };
        }
      
      case 'assurances':
        const assuranceIndex = mockDB.assurances.findIndex(a => a.id === parseInt(id, 10));
        if (assuranceIndex !== -1) {
          mockDB.assurances.splice(assuranceIndex, 1);
          return { success: true, message: 'Assurance deleted successfully' };
        } else {
          return { success: false, message: 'Assurance not found' };
        }
      
      default:
        return { success: false, message: 'Endpoint not found' };
    }
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} - Whether user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
  
  /**
   * Set auth token
   * @param {string} token - Auth token
   */
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }
};

export default api;