/**
 * Application routes configuration
 * Defines all routes and their configurations for the Cephas Tracker application
 */
import { lazy } from 'react';
import { 
  Home, 
  Search, 
  Settings, 
  FileText, 
  List, 
  Package, 
  Users, 
  File, 
  Download, 
  Upload, 
  BarChart,
  Calendar,
  DollarSign,
  Tool,
  Building
} from 'lucide-react';
import { ROLES } from './config';

// Main Dashboard Pages (lazy loaded)
const SuperAdminDashboard = lazy(() => import('./pages/dashboard/SuperAdminDashboard'));
const SupervisorDashboard = lazy(() => import('./pages/dashboard/SupervisorDashboard'));
const ServiceInstallerDashboard = lazy(() => import('./pages/dashboard/ServiceInstallerDashboard'));
const AccountantDashboard = lazy(() => import('./pages/dashboard/AccountantDashboard'));
const WarehouseDashboard = lazy(() => import('./pages/dashboard/WarehouseDashboard'));

// Activation/Modification Pages
const ActivationList = lazy(() => import('./pages/activation/ActivationList'));
const CreateActivation = lazy(() => import('./pages/activation/CreateActivation'));
const EditActivation = lazy(() => import('./pages/activation/EditActivation'));

// Assurance Pages
const AssuranceList = lazy(() => import('./pages/assurance/AssuranceList'));
const CreateAssurance = lazy(() => import('./pages/assurance/CreateAssurance'));
const EditAssurance = lazy(() => import('./pages/assurance/EditAssurance'));

// Building Pages
const BuildingList = lazy(() => import('./pages/building/BuildingList'));
const BuildingDetail = lazy(() => import('./pages/building/BuildingDetail'));
const CreateBuilding = lazy(() => import('./pages/building/CreateBuilding'));
const EditBuilding = lazy(() => import('./pages/building/EditBuilding'));

// Material Pages
const MaterialList = lazy(() => import('./pages/material/MaterialList'));
const CreateMaterial = lazy(() => import('./pages/material/CreateMaterial'));
const EditMaterial = lazy(() => import('./pages/material/EditMaterial'));

// Order Pages
const OrderList = lazy(() => import('./pages/order/OrderList'));
const OrderDetail = lazy(() => import('./pages/order/OrderDetail'));
const CreateOrder = lazy(() => import('./pages/order/CreateOrder'));
const EditOrder = lazy(() => import('./pages/order/EditOrder'));

// Splitter Pages
const SplitterList = lazy(() => import('./pages/splitters/SplitterList'));
const SplitterDetail = lazy(() => import('./pages/splitters/SplitterDetail'));
const CreateSplitter = lazy(() => import('./pages/splitters/CreateSplitter'));
const EditSplitter = lazy(() => import('./pages/splitters/EditSplitter'));

// Service Installer Pages
const ServiceInstallerList = lazy(() => import('./pages/serviceInstaller/ServiceInstallerList'));
const ServiceInstallerDetail = lazy(() => import('./pages/serviceInstaller/ServiceInstallerDetail'));
const CreateServiceInstaller = lazy(() => import('./pages/serviceInstaller/CreateServiceInstaller'));
const EditServiceInstaller = lazy(() => import('./pages/serviceInstaller/EditServiceInstaller'));

// Invoice Pages
const InvoiceList = lazy(() => import('./pages/invoice/InvoiceList'));
const InvoiceDetail = lazy(() => import('./pages/invoice/InvoiceDetail'));
const CreateInvoice = lazy(() => import('./pages/invoice/CreateInvoice'));
const EditInvoice = lazy(() => import('./pages/invoice/EditInvoice'));

// Report Pages
const Reports = lazy(() => import('./pages/reports/Reports'));
const FinancialReports = lazy(() => import('./pages/reports/FinancialReports'));
const OperationalReports = lazy(() => import('./pages/reports/OperationalReports'));
const PerformanceReports = lazy(() => import('./pages/reports/PerformanceReports'));

// Search Pages
const SearchPage = lazy(() => import('./pages/search/SearchPage'));
const AdvancedSearchPage = lazy(() => import('./pages/search/AdvancedSearchPage'));

// Settings Pages
const UserManagement = lazy(() => import('./pages/settings/UserManagement'));
const SystemSettings = lazy(() => import('./pages/settings/SystemSettings'));
const ProfileSettings = lazy(() => import('./pages/settings/ProfileSettings'));

// Authentication Pages
const Login = lazy(() => import('./pages/auth/Login'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

// Import/Export Pages
const ImportPage = lazy(() => import('./pages/import/ImportPage'));
const ExportPage = lazy(() => import('./pages/export/ExportPage'));

// Error Pages
const NotFound = lazy(() => import('./pages/errors/NotFound'));
const Unauthorized = lazy(() => import('./pages/errors/Unauthorized'));

/**
 * Route configuration
 * 
 * @typedef {Object} Route
 * @property {string} path - Route path
 * @property {React.ComponentType} component - Route component
 * @property {string} title - Route title for navigation and document title
 * @property {JSX.Element} icon - Icon component for navigation
 * @property {string[]} roles - Allowed roles for this route
 * @property {boolean} sidebar - Whether to show in sidebar navigation
 * @property {boolean} auth - Whether route requires authentication
 * @property {boolean} exact - Whether route should match exactly
 * @property {Route[]} children - Child routes
 */
export const routes = [
  // Dashboard routes
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: <Home size={20} />,
    roles: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.INSTALLER, ROLES.ACCOUNTANT, ROLES.WAREHOUSE],
    sidebar: true,
    auth: true,
    exact: true,
    component: null, // Components are assigned dynamically based on user role
  },
  
  // Activation/Modification routes
  {
    path: '/activation',
    title: 'Activation/Modification',
    icon: <Settings size={20} />,
    roles: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
    sidebar: true,
    auth: true,
    children: [
      {
        path: '/activation',
        component: ActivationList,
        title: 'All Activations',
        exact: true,
      },
      {
        path: '/activation/create',
        component: CreateActivation,
        title: 'Create Activation',
      },
      {
        path: '/activation/:id',
        component: EditActivation,
        title: 'Edit Activation',
      }
    ]
  },
  
  // Assurance routes
  {
    path: '/assurance',
    title: 'Assurance',
    icon: <Tool size={20} />,
    roles: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
    sidebar: true,
    auth: true,
    children: [
      {
        path: '/assurance',
        component: AssuranceList,
        title: 'All Assurances',
        exact: true,
      },
      {
        path: '/assurance/create',
        component: CreateAssurance,
        title: 'Create Assurance',
      },
      {
        path: '/assurance/:id',
        component: EditAssurance,
        title: 'Edit Assurance',
      }
    ]
  },
  
  // Building routes
  {
    path: '/building',
    title: 'Buildings',
    icon: <Building size={20} />,
    roles: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
    sidebar: true,
    auth: true,
    children: [
      {
        path: '/building',
        component: BuildingList,
        title: 'Building List',
        exact: true,
      },
      {
        path: '/building/create',
        component: CreateBuilding,
        title: 'Create Building',
      },
      {
        path: '/building/:id/detail',
        component: BuildingDetail,
        title: 'Building Detail',
      },
      {
        path: '/building/:id/edit',
        component: EditBuilding,
        title: 'Edit Building',
      }
    ]
  },
  
  // Splitter routes
  {
    path: '/splitter',
    title: 'Splitter List',
    icon: <List size={20} />,
    roles: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
    sidebar: true,
    auth: true,
    children: [
      {
        path: '/splitter',
        component: SplitterList,
        title: 'Splitter List',
        exact: true,
      },
      {
        path: '/splitter/create',
        component: CreateSplitter,
        title: 'Create Splitter',
      },
      {
        path: '/splitter/:id',
        component: SplitterDetail,
        title: 'View Splitter',
        exact: true,
      },
      {
        path: '/splitter/:id/edit',
        component: EditSplitter,
        title: 'Edit Splitter',
      }
    ]
  },
  
  // Materials routes
  {
    path: '/material',
    title: 'Materials',
    icon: <Package size={20} />,
    roles: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.WAREHOUSE],
    sidebar: true,
    auth: true,
    children: [
      {
        path: '/material',
        component: MaterialList,
        title: 'Material List',
        exact: true,
      },
      {
        path: '/material/create',
        component: CreateMaterial,
        title: 'Create Material',
        roles: [ROLES.SUPER_ADMIN, ROLES.WAREHOUSE],
      },
      {
        path: '/material/:id',
        component: EditMaterial,
        title: 'Edit Material',
        roles: [ROLES.SUPER_ADMIN, ROLES.WAREHOUSE],
      }
    ]
  },
  
  // Service Installer routes
  {
    path: '/service-installer',
    title: 'Service Installers',
    icon: <Users size={20} />,
    roles: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
    sidebar: true,
    auth: true,
    children: [
      {
        path: '/service-installer',
        component: ServiceInstallerList,
        title: 'Service Installer List',
        exact: true,
      },
      {
        path: '/service-installer/create',
        component: CreateServiceInstaller,
        title: 'Create Service Installer',
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        path: '/service-installer/:id/detail',
        component: ServiceInstallerDetail,
        title: 'Service Installer Detail',
      },
      {
        path: '/service-installer/:id/edit',
        component: EditServiceInstaller,
        title: 'Edit Service Installer',
        roles: [ROLES.SUPER_ADMIN],
      }
    ]
  },
  
  // Order routes
  {
    path: '/order',
    title: 'Orders',
    icon: <List size={20} />,
    roles: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
    sidebar: true,
    auth: true,
    children: [
      {
        path: '/order',
        component: OrderList,
        title: 'Order List',
        exact: true,
      },
      {
        path: '/order/create',
        component: CreateOrder,
        title: 'Create Order',
      },
      {
        path: '/order/:id/detail',
        component: OrderDetail,
        title: 'Order Detail',
      },
      {
        path: '/order/:id/edit',
        component: EditOrder,
        title: 'Edit Order',
      }
    ]
  },
  
  // Installer My Jobs routes
  {
    path: '/my-jobs',
    title: 'My Jobs',
    icon: <Calendar size={20} />,
    roles: [ROLES.INSTALLER],
    sidebar: true,
    auth: true,
    component: OrderList, // Uses the same component with different props
    exact: true,
  },
  
  // Invoice routes
  {
    path: '/invoice',
    title: 'Invoices',
    icon: <File size={20} />,
    roles: [ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT],
    sidebar: true,
    auth: true,
    children: [
      {
        path: '/invoice',
        component: InvoiceList,
        title: 'Invoice List',
        exact: true,
      },
      {
        path: '/invoice/create',
        component: CreateInvoice,
        title: 'Create Invoice',
      },
      {
        path: '/invoice/:id/detail',
        component: InvoiceDetail,
        title: 'Invoice Detail',
      },
      {
        path: '/invoice/:id/edit',
        component: EditInvoice,
        title: 'Edit Invoice',
      }
    ]
  },
  
  // Installer Income routes
  {
    path: '/my-income',
    title: 'My Income',
    icon: <DollarSign size={20} />,
    roles: [ROLES.INSTALLER],
    sidebar: true,
    auth: true,
    component: InvoiceList, // Uses the same component with different props
    exact: true,
  },
  
  // Reports routes
  {
    path: '/reports',
    title: 'Reports',
    icon: <BarChart size={20} />,
    roles: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.ACCOUNTANT],
    sidebar: true,
    auth: true,
    children: [
      {
        path: '/reports',
        component: Reports,
        title: 'All Reports',
        exact: true,
      },
      {
        path: '/reports/financial',
        component: FinancialReports,
        title: 'Financial Reports',
        roles: [ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT],
      },
      {
        path: '/reports/operational',
        component: OperationalReports,
        title: 'Operational Reports',
        roles: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
      },
      {
        path: '/reports/performance',
        component: PerformanceReports,
        title: 'Performance Reports',
        roles: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
      }
    ]
  },
  
  // Search routes
  {
    path: '/search',
    title: 'Search',
    icon: <Search size={20} />,
    roles: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.INSTALLER, ROLES.ACCOUNTANT, ROLES.WAREHOUSE],
    sidebar: true,
    auth: true,
    children: [
      {
        path: '/search',
        component: SearchPage,
        title: 'Quick Search',
        exact: true,
      },
      {
        path: '/search/advanced',
        component: AdvancedSearchPage,
        title: 'Advanced Search',
      }
    ]
  },
  
  // Settings routes
  {
    path: '/settings',
    title: 'Settings',
    icon: <Settings size={20} />,
    roles: [ROLES.SUPER_ADMIN],
    sidebar: true,
    auth: true,
    children: [
      {
        path: '/settings/users',
        component: UserManagement,
        title: 'User Management',
      },
      {
        path: '/settings/system',
        component: SystemSettings,
        title: 'System Settings',
      },
      {
        path: '/settings/profile',
        component: ProfileSettings,
        title: 'Profile Settings',
        roles: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.INSTALLER, ROLES.ACCOUNTANT, ROLES.WAREHOUSE],
      }
    ]
  },
  
  // Import routes
  {
    path: '/import',
    title: 'Import',
    icon: <Download size={20} />,
    roles: [ROLES.SUPER_ADMIN],
    sidebar: true,
    auth: true,
    component: ImportPage,
    exact: true,
  },
  
  // Export routes
  {
    path: '/export',
    title: 'Export',
    icon: <Upload size={20} />,
    roles: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.ACCOUNTANT],
    sidebar: true,
    auth: true,
    component: ExportPage,
    exact: true,
  },
  
  // Authentication routes
  {
    path: '/login',
    component: Login,
    title: 'Login',
    sidebar: false,
    auth: false,
    exact: true,
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
    title: 'Forgot Password',
    sidebar: false,
    auth: false,
    exact: true,
  },
  {
    path: '/reset-password',
    component: ResetPassword,
    title: 'Reset Password',
    sidebar: false,
    auth: false,
    exact: true,
  },
  
  // Error routes
  {
    path: '/unauthorized',
    component: Unauthorized,
    title: 'Unauthorized',
    sidebar: false,
    auth: false,
    exact: true,
  },
  
  // 404 route - must be last
  {
    path: '*',
    component: NotFound,
    title: 'Page Not Found',
    sidebar: false,
    auth: false,
  }
];

/**
 * Get routes available for a specific role
 * 
 * @param {string} role - User role
 * @returns {Array} - Filtered routes for the role
 */
export const getRoutesByRole = (role) => {
  return routes.filter(route => {
    // Check if route has roles specified and if the user's role is included
    if (!route.roles) return false;
    return route.roles.includes(role);
  });
};

/**
 * Get all sidebar links for navigation
 * 
 * @param {string} role - User role
 * @returns {Array} - Sidebar links for navigation
 */
export const getSidebarLinks = (role) => {
  return routes
    .filter(route => route.sidebar && (route.roles ? route.roles.includes(role) : false))
    .map(route => ({
      path: route.path,
      title: route.title,
      icon: route.icon,
      children: route.children 
        ? route.children
            .filter(child => !child.roles || child.roles.includes(role))
            .map(child => ({
              path: child.path,
              title: child.title
            }))
        : []
    }));
};

/**
 * Get component for dashboard based on user role
 * 
 * @param {string} role - User role
 * @returns {React.ComponentType} - Dashboard component for the role
 */
export const getDashboardComponentByRole = (role) => {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return SuperAdminDashboard;
    case ROLES.SUPERVISOR:
      return SupervisorDashboard;
    case ROLES.INSTALLER:
      return ServiceInstallerDashboard;
    case ROLES.ACCOUNTANT:
      return AccountantDashboard;
    case ROLES.WAREHOUSE:
      return WarehouseDashboard;
    default:
      return SuperAdminDashboard;
  }
};

export default routes;