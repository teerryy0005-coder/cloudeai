import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Integrations from './pages/Integrations';
import Login from './pages/Login';
import useAuthStore from './store/useAuthStore';

import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

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
  const { loadUser, isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    loadUser();
  }, []);
  
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
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/integrations"
          element={
            <PrivateRoute>
              <AppLayout>
                <Integrations />
              </AppLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <AppLayout>
                <div style={{ padding: '30px' }}>
                  <h1>Hisobotlar</h1>
                  <p>Tez orada...</p>
                </div>
              </AppLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <AppLayout>
                <div style={{ padding: '30px' }}>
                  <h1>Mahsulotlar</h1>
                  <p>Tez orada...</p>
                </div>
              </AppLayout>
            </PrivateRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
