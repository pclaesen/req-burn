'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '@/styles/components/chart-container.css';

export default function ChartContainer({ title, chartType = 'line', address, contractName }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDrained, setTotalDrained] = useState(0);

  useEffect(() => {
    if (address) {
      fetchTransactionData();
    }
  }, [address]);

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/transactions/${address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction data from response');
      }
      
      const data = await response.json();
      
      // Process transactions into chart data
      const drainData = processTransactionData(data.transactions);
      setChartData(drainData);
      setTotalDrained(data.totalDrained);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      // Fallback to sample data
      setChartData(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const processTransactionData = (transactions) => {
    // Group outgoing transactions by day and sum xDAI amounts
    const drainsByDay = {};
    
    transactions
      .filter(tx => tx.type === 'outgoing' && parseFloat(tx.value) > 0)
      .forEach(tx => {
        const date = new Date(tx.timestamp * 1000);
        const dayKey = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        
        if (!drainsByDay[dayKey]) {
          drainsByDay[dayKey] = {
            name: dayKey,
            value: 0,
            transactions: 0
          };
        }
        
        drainsByDay[dayKey].value += parseFloat(tx.value);
        drainsByDay[dayKey].transactions += 1;
      });

    // Convert to array and sort by date
    const chartData = Object.values(drainsByDay)
      .sort((a, b) => new Date(a.name) - new Date(b.name))
      .slice(-10); // Last 10 data points

    return chartData.length > 0 ? chartData : getSampleData();
  };

  const getSampleData = () => [
    { name: 'No Data', value: 0, transactions: 0 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            xDAI Drained: <span className="value">{data.value.toFixed(4)}</span>
          </p>
          <p className="tooltip-transactions">
            Transactions: <span className="count">{data.transactions}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#ef4444" />
        </BarChart>
      );
    }
    
    return (
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#ef4444" 
          strokeWidth={2}
          dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    );
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">{title}</h3>
          {!loading && (
            <p className="chart-subtitle">
              Total Drained: <span className="total-drained">{totalDrained.toFixed(4)} xDAI</span>
            </p>
          )}
        </div>
        <div className="chart-controls">
          <select className="time-selector">
            <option value="recent">Recent</option>
            <option value="24h">24H</option>
            <option value="7d">7D</option>
            <option value="30d">30D</option>
          </select>
          <button 
            onClick={fetchTransactionData}
            className="refresh-chart-btn"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      <div className="chart-content">
        {loading ? (
          <div className="chart-loading">
            <div className="loading-spinner">Loading transaction data...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}