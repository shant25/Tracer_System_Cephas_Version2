# Cephas Tracker

A comprehensive Building and Installation Management System for Cephas Sdn Bhd.

## Overview

Cephas Tracker is a web application designed to manage fiber optic installation projects, tracking buildings, splitters, materials, service installers, and more. The system provides role-based access for different user types including administrators, supervisors, installers, accountants, and warehouse managers.

## Features

- **Dashboard**: Role-specific dashboards with key performance indicators
- **User Management**: Admin tools for managing users and permissions
- **Building Management**: Track buildings, services, and installations
- **Splitter Management**: Manage fiber optic splitters and their assignments
- **Material Inventory**: Track materials, stock levels, and assignments
- **Service Installer Management**: Manage field technicians and job assignments
- **Order Tracking**: Track installation and service orders
- **Invoice Management**: Generate and track invoices
- **Reporting**: Comprehensive reporting for operations and finances

## Technology Stack

- **Frontend**: React, React Router, TailwindCSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: Custom components with Lucide React icons
- **Form Handling**: Formik with Yup validation
- **Date Handling**: date-fns
- **Notifications**: react-toastify
- **Charts**: Recharts

## Project Structure

```
cephas-tracker/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, styles, etc.
│   ├── components/         # Reusable components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── App.js              # Main application component
│   ├── config.js           # Application configuration
│   ├── index.js            # Application entry point
│   └── routes.js           # Route definitions
├── .env                    # Environment variables
├── .env.development        # Development environment variables
├── .env.production         # Production environment variables
├── .gitignore              # Git ignore configuration
├── jsconfig.json           # JavaScript configuration
├── package.json            # Project dependencies
├── README.md               # Project documentation
└── tailwind.config.js      # TailwindCSS configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cephas/cephas-tracker.git
   cd cephas-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and visit [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build:prod
# or
yarn build:prod
```

## User Roles

- **Super Admin**: Full system access
- **Supervisor**: Manages day-to-day operations
- **Service Installer**: Field technicians who perform installations
- **Accountant**: Manages financial aspects
- **Warehouse**: Manages inventory and materials

## Environment Variables

- `.env`: Shared environment variables
- `.env.development`: Development-specific variables
- `.env.production`: Production-specific variables

For local development, you can create a `.env.local` file which will override the default values.

## Deployment

The application can be deployed to any static hosting service such as Netlify, Vercel, AWS S3, or Firebase Hosting.

## License

This project is proprietary and confidential. Unauthorized copying of files, via any medium is strictly prohibited.

## Support

For support, contact:
- Email: support@cephas.com
- Phone: +60 1-234-5678