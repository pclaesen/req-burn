'use client';

import { ExternalLink, Copy, CheckCircle } from 'lucide-react';
import '@/styles/components/contract-card.css';

export default function ContractCard({ title, network, address, status }) {
  const networkColors = {
    ethereum: '#627eea',
    gnosis: '#3e885b'
  };

  const truncateAddress = (addr) => {
    if (!addr) return 'Not set';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Add toast notification later
  };

  return (
    <div className="contract-card">
      <div className="card-header">
        <div className="card-title">
          <h3>{title}</h3>
          <div 
            className="network-badge"
            style={{ backgroundColor: networkColors[network] }}
          >
            {network}
          </div>
        </div>
        <div className={`status-indicator ${status}`}>
          <CheckCircle className="status-icon" />
          <span className="status-text">{status}</span>
        </div>
      </div>
      
      <div className="card-content">
        <div className="address-section">
          <label className="address-label">Contract Address</label>
          <div className="address-row">
            <code className="address-text">{truncateAddress(address)}</code>
            <div className="address-actions">
              <button 
                className="action-btn"
                onClick={() => copyToClipboard(address)}
                title="Copy address"
              >
                <Copy className="action-icon" />
              </button>
              <button 
                className="action-btn"
                title="View on explorer"
              >
                <ExternalLink className="action-icon" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="card-stats">
          <div className="stat-item">
            <span className="stat-label">Last Updated</span>
            <span className="stat-value">--</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Block Height</span>
            <span className="stat-value">--</span>
          </div>
        </div>
      </div>
    </div>
  );
}