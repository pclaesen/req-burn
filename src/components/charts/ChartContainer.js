'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '@/styles/components/chart-container.css';

// Sample data - will be replaced with real contract data
const sampleData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 }
];

export default function ChartContainer({ title, chartType = 'line' }) {
  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '6px'
            }} 
          />
          <Bar dataKey="value" fill="#6366f1" />
        </BarChart>
      );
    }
    
    return (
      <LineChart data={sampleData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '6px'
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#6366f1" 
          strokeWidth={2}
          dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    );
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-controls">
          <select className="time-selector">
            <option value="24h">24H</option>
            <option value="7d">7D</option>
            <option value="30d">30D</option>
            <option value="90d">90D</option>
          </select>
        </div>
      </div>
      
      <div className="chart-content">
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}