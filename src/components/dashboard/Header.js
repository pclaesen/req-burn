import { Activity, Shield } from 'lucide-react';
import '@/styles/components/header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <Shield className="brand-icon" />
          <h1 className="brand-title">Web3 Dashboard</h1>
        </div>
        
        <div className="header-status">
          <div className="connection-indicator">
            <Activity className="status-icon active" />
            <span className="status-text">Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
}