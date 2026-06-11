import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Integrations from './pages/Integrations';

import './App.css';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        
        <Route
          path="/integrations"
          element={
            <AppLayout>
              <Integrations />
            </AppLayout>
          }
        />
        
        <Route
          path="/reports"
          element={
            <AppLayout>
              <div style={{ padding: '30px' }}>
                <h1>Hisobotlar</h1>
                <p>Tez orada...</p>
              </div>
            </AppLayout>
          }
        />
        
        <Route
          path="/products"
          element={
            <AppLayout>
              <div style={{ padding: '30px' }}>
                <h1>Mahsulotlar</h1>
                <p>Tez orada...</p>
              </div>
            </AppLayout>
          }
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
