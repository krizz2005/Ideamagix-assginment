import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AgentPerformanceChart = ({ agents }) => {
  const data = {
    labels: agents.map(a => a.name),
    datasets: [
      {
        label: 'Total Assigned',
        data: agents.map(a => a.totalAssigned),
        backgroundColor: '#475569',
        borderRadius: 4,
      },
      {
        label: 'Leads Won',
        data: agents.map(a => a.wonCount),
        backgroundColor: '#6366f1',
        borderRadius: 4,
      }
    ]
  };

  const options = {
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } }
    },
    plugins: {
      legend: { position: 'top', labels: { color: '#94a3b8' } }
    },
    maintainAspectRatio: false,
  };

  return <div className="h-64"><Bar data={data} options={options} /></div>;
};

export default AgentPerformanceChart;