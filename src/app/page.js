import Header from '@/components/dashboard/Header';
import NetworkSelector from '@/components/dashboard/NetworkSelector';
import ContractCard from '@/components/dashboard/ContractCard';
import ChartContainer from '@/components/charts/ChartContainer';
import '@/styles/components/dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Header />
      
      <main className="dashboard-main">
        <div className="dashboard-controls">
          <NetworkSelector />
        </div>
        
        <div className="contracts-grid">
          <ContractCard 
            title="Ethereum Contract"
            network="ethereum"
            address="0x..." // Will be configurable later
            status="connected"
          />
          <ContractCard 
            title="Gnosis Chain Contract"
            network="gnosis"
            address="0x..." // Will be configurable later
            status="connected"
          />
        </div>
        
        <div className="charts-section">
          <ChartContainer 
            title="Contract Activity Overview"
            chartType="line"
          />
          <ChartContainer 
            title="Token Burns"
            chartType="bar"
          />
        </div>
      </main>
    </div>
  );
}