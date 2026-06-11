import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Clock, Users, CheckCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import ActivityList from '../components/ActivityList';
import { leadAPI } from '../services/api';
import socketService from '../services/socket';
import './Dashboard.css';

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
    
    // Connect socket
    const socket = socketService.connect();
    
    // Listen for new leads
    socket.on('newLead', (lead) => {
      fetchData(); // Refresh data
    });
    
    return () => {
      socket.off('newLead');
    };
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const statsResponse = await leadAPI.getStatistics();
      setStatistics(statsResponse.data.data);
      
      // Fetch recent activities
      const activitiesResponse = await leadAPI.getRecentActivities(10);
      setActivities(activitiesResponse.data.data);
      
      // Prepare chart data
      if (statsResponse.data.data.dailyStats) {
        const formattedData = statsResponse.data.data.dailyStats.map((day) => ({
          date: new Date(day._id).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' }),
          Xato: day.failed || 0,
          Kerakli: day.successful || 0,
        }));
        setChartData(formattedData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Yuklanmoqda...</div>;
  }
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bosh sahifa</h1>
        <p>Sizning biznesingiz statistikasi</p>
      </div>
      
      {/* Statistics Cards */}
      <div className="stats-grid">
        <StatCard
          title="TARIF QOLDI RUCHI"
          value={statistics?.totalLeads.toLocaleString() || '4 164'}
          subtitle="836/5 000"
          icon={TrendingUp}
          color="#00D1B2"
          trend={17}
        />
        
        <StatCard
          title="TARIF MUDDATI"
          value="16 kun qoldi"
          subtitle="27-iyun, 2026 · 21:00"
          icon={Clock}
          color="#3B82F6"
        />
        
        <StatCard
          title="Bugun"
          value={statistics?.todayLeads || '45'}
          subtitle="ta uchdi"
          icon={Users}
          color="#7C3AED"
        />
        
        <StatCard
          title="Bir haftada"
          value="247"
          subtitle="ta uchen"
          icon={CheckCircle}
          color="#10B981"
        />
        
        <StatCard
          title="Bir oyida"
          value="836"
          subtitle="ta uchen"
          icon={CheckCircle}
          color="#22C55E"
        />
      </div>
      
      {/* Chart and Activity Feed */}
      <div className="dashboard-grid">
        <div className="chart-container">
          <div className="chart-header">
            <div>
              <h3>Kunlik</h3>
              <p className="chart-date">iyun 2026</p>
            </div>
            <div className="chart-tabs">
              <button className="chart-tab active">Bugun</button>
              <button className="chart-tab">Hafta</button>
              <button className="chart-tab">Oy</button>
              <button className="chart-tab">Yil</button>
            </div>
          </div>
          
          <div className="chart-stats">
            <span className="chart-value">836</span>
            <span className="chart-label">Jami</span>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '13px' }}
                iconType="circle"
              />
              <Line 
                type="monotone" 
                dataKey="Xato" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="Kerakli" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="activity-container">
          <ActivityList 
            activities={activities}
            title="So'nggi voqealar"
          />
        </div>
      </div>
      
      {/* Integrations Status */}
      <div className="integrations-section">
        <div className="section-header">
          <h3>Integratsiyalar samaradarligi</h3>
          <p>Yaboqiy berish — Integratsiya bo'yicha</p>
        </div>
        
        <div className="integration-cards">
          <div className="integration-card">
            <div className="integration-info">
              <span className="integration-name">fraink (Ziyodullabek Xushvaqtov)</span>
              <span className="integration-stats">2 / 114</span>
            </div>
            <div className="integration-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '100%', background: '#10B981' }}></div>
              </div>
              <span className="integration-percentage">100%</span>
            </div>
          </div>
          
          <div className="integration-card">
            <div className="integration-info">
              <span className="integration-name">snayper - 79.000 (Ziyodullabek Xushvaqtov)</span>
              <span className="integration-stats">114 ta</span>
            </div>
            <div className="integration-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '100%', background: '#10B981' }}></div>
              </div>
              <span className="integration-percentage">100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
