import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusDistributionChart = ({ dataValues }) => {
  const data = {
    labels: ['New', 'Contacted', 'Qualified', 'Lost', 'Won'],
    datasets: [
      {
        data: [
          dataValues.New || 0,
          dataValues.Contacted || 0,
          dataValues.Qualified || 0,
          dataValues.Lost || 0,
          dataValues.Won || 0,
        ],
        backgroundColor: ['#3b82f6', '#a855f7', '#10b981', '#ef4444', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter' } } },
    },
    cutout: '70%',
    maintainAspectRatio: false,
  };

  return <div className="h-64"><Doughnut data={data} options={options} /></div>;
};

export default StatusDistributionChart;