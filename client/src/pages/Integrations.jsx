import React, { useEffect, useState } from 'react';
import { Repeat, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { integrationAPI } from '../services/api';
import './Integrations.css';

const Integrations = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchIntegrations();
  }, []);
  
  const fetchIntegrations = async () => {
    try {
      const response = await integrationAPI.getAllIntegrations();
      setIntegrations(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Yuklanmoqda...</div>;
  }
  
  return (
    <div className="integrations-page">
      <div className="page-header">
        <h1>Integratsiyalar</h1>
        <p>Facebook Lead Ads va boshqa integratsiyalar</p>
      </div>
      
      <div className="integrations-grid">
        <div className="integration-card-large">
          <div className="integration-icon facebook">
            <Repeat size={32} />
          </div>
          <h3>Facebook Lead Ads</h3>
          <p>Facebook reklamalaridan avtomatik lead olish</p>
          <div className="integration-status active">
            <CheckCircle size={16} />
            <span>Faol</span>
          </div>
          <button className="btn-primary">Sozlash</button>
        </div>
        
        <div className="integration-card-large">
          <div className="integration-icon">
            <RefreshCw size={32} />
          </div>
          <h3>Tashqi API</h3>
          <p>Leadlarni tashqi saytga avtomatik yuborish</p>
          <div className="integration-status active">
            <CheckCircle size={16} />
            <span>Faol</span>
          </div>
          <button className="btn-primary">Sozlash</button>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
