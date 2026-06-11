import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-content">
        <div className="stat-header">
          <span className="stat-title">{title}</span>
          {trend && (
            <span className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <div className="stat-value">{value}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
      {Icon && (
        <div className="stat-icon" style={{ background: `${color}20`, color }}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
