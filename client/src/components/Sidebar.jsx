import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Repeat,
  BarChart3,
  Package,
  Activity,
  Users,
  Globe,
  Key,
  Settings,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Bosh sahifa', section: 'ASOSIY' },
    { path: '/integrations', icon: Repeat, label: 'Integratsiyalar' },
    { path: '/reports', icon: BarChart3, label: 'Hisobotlar' },
    { path: '/products', icon: Package, label: 'Mahsulotlar', section: 'RESURSLAR' },
    { path: '/lead-flow', icon: Activity, label: 'Lid tempi' },
    { path: '/connections', icon: Users, label: 'Ulanishlar' },
    { path: '/domains', icon: Globe, label: 'Domenlar', section: 'HISOB' },
    { path: '/api-keys', icon: Key, label: 'API Kalitlar' },
    { path: '/settings', icon: Settings, label: 'Sozlamalar' },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Package size={24} />
          </div>
          {isOpen && <span className="logo-text">Yuboraman</span>}
        </div>
        <button onClick={toggleSidebar} className="toggle-btn">
          <ChevronLeft size={20} style={{ transform: isOpen ? 'rotate(0)' : 'rotate(180deg)' }} />
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.path}>
            {item.section && (
              <div className="nav-section">{isOpen && item.section}</div>
            )}
            <Link
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              title={!isOpen ? item.label : ''}
            >
              <item.icon size={20} className="nav-icon" />
              {isOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          </React.Fragment>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'Z'}
          </div>
          {isOpen && (
            <div className="user-details">
              <div className="user-name">{user?.name || 'Ziyodulla Xushvaqtov'}</div>
              <div className="user-phone">+998901784542</div>
            </div>
          )}
        </div>
        
        {isOpen && (
          <div className="balance-card">
            <div className="balance-label">Balans</div>
            <div className="balance-amount">0 so'm</div>
          </div>
        )}
        
        <button onClick={logout} className="logout-btn" title="Chiqish">
          <LogOut size={20} />
          {isOpen && <span>Chiqish</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
