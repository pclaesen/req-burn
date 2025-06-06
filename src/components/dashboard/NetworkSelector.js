'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import '@/styles/components/network-selector.css';

const networks = [
  { id: 'all', name: 'All Networks', color: '#6366f1' },
  { id: 'ethereum', name: 'Ethereum', color: '#627eea' },
  { id: 'gnosis', name: 'Gnosis Chain', color: '#3e885b' }
];

export default function NetworkSelector() {
  const [selected, setSelected] = useState('all');
  const [isOpen, setIsOpen] = useState(false);

  const selectedNetwork = networks.find(n => n.id === selected);

  return (
    <div className="network-selector">
      <button 
        className="selector-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="selected-network">
          <div 
            className="network-dot"
            style={{ backgroundColor: selectedNetwork.color }}
          />
          <span>{selectedNetwork.name}</span>
        </div>
        <ChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="selector-dropdown">
          {networks.map(network => (
            <button
              key={network.id}
              className={`dropdown-item ${selected === network.id ? 'active' : ''}`}
              onClick={() => {
                setSelected(network.id);
                setIsOpen(false);
              }}
            >
              <div className="network-dot" style={{ backgroundColor: network.color }} />
              <span>{network.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}