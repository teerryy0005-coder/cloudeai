import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import './ActivityList.css';

const ActivityList = ({ activities, title }) => {
  return (
    <div className="activity-list">
      <div className="activity-header">
        <h3 className="activity-title">{title}</h3>
        <button className="view-all-btn">Barchasini ko'rish</button>
      </div>
      
      <div className="activity-items">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-icon" style={{ 
              background: activity.type === 'success' ? '#DCFCE7' : '#FEF3C7',
              color: activity.type === 'success' ? '#16A34A' : '#F59E0B'
            }}>
              {activity.type === 'success' ? <CheckCircle size={16} /> : <Clock size={16} />}
            </div>
            <div className="activity-content">
              <div className="activity-main">{activity.title}</div>
              <div className="activity-desc">{activity.description}</div>
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="activity-empty">
            <p>Hozircha faollik yo'q</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityList;
