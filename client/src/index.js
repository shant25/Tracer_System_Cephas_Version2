import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App';
import './assets/styles/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render application
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  </React.StrictMode>
);