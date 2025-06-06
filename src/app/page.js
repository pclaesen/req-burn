import Header from '@/components/dashboard/Header';
import NetworkSelector from '@/components/dashboard/NetworkSelector';
import ContractCard from '@/components/dashboard/ContractCard';
import ChartContainer from '@/components/charts/ChartContainer';
import TransactionList from '@/components/transactions/TransactionList';
import '@/styles/components/transaction-list.css';
import '@/styles/components/dashboard.css';

export default function Dashboard() {
  const gnosisContract = {
    title: 'lockForREQBurn',
    network: 'gnosis',
    address: '0x2171a0dc12a9E5b1659feF2BB20E54c84Fa7dB0C',
    status: 'active'
  };

  return (
    <div className="dashboard-container">
      {/* Header from original design */}
      <Header />
      
      <div className="dashboard-main">
        <div className="dashboard-controls">
          <div className="dashboard-header">
            <h1>Contract Dashboard</h1>
            <p>Monitor your smart contracts and transaction activity</p>
          </div>
          <NetworkSelector />
        </div>

        <div className="dashboard-content">
          {/* Contract Cards Grid */}
          <div className="contracts-grid">
            <ContractCard
              title={gnosisContract.title}
              network={gnosisContract.network}
              address={gnosisContract.address}
              status={gnosisContract.status}
            />
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <ChartContainer
              title="xDAI Drainage Over Time"
              chartType="line"
              address={gnosisContract.address}
              contractName={gnosisContract.title}
            />
          </div>

          {/* Transaction List */}
          <TransactionList
            address={gnosisContract.address}
            contractName={gnosisContract.title}
          />
        </div>
      </div>
    </div>
  );
}