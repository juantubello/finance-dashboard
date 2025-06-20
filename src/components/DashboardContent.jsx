import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(value);
};

const DashboardContent = ({ data = [], isMobile, showGraph, setShowGraph }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const total = sortedData.reduce((sum, item) => sum + (item?.value || 0), 0);

  const chartData = {
    labels: sortedData.map(item => item?.name || ''),
    datasets: [{
      data: sortedData.map(item => item?.value || 0),
      backgroundColor: [
        '#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#37353d',
        '#EC4899', '#84CC16', '#F97316', '#06B6D4', '#A855F7',
        '#E1F755'
      ],
      borderWidth: 1,
      borderColor: '#fff',
      hoverOffset: 10
    }]
  };

  if (isMobile) {
    return (
      <div className="w-full bg-white rounded-xl p-4">
        {showGraph ? (
          <>
            <button onClick={() => setShowGraph(false)} className="flex items-center text-blue-600 mb-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Ver lista
            </button>
            <div className="h-64 flex justify-center items-center">
              <div className="w-full max-w-[300px]">
                <Doughnut 
                  data={chartData}
                  options={{
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          padding: 10,
                          boxWidth: 8,
                          font: { size: 10 }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                          }
                        }
                      }
                    },
                    cutout: '50%',
                    maintainAspectRatio: true
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setShowGraph(true)} className="flex items-center justify-end w-full text-blue-600 mb-2 text-sm">
              Ver gráfico
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <ul className="space-y-2">
              {sortedData.map((item, index) => {
                const percentage = Math.round(((item?.value || 0) / total) * 100);
                return (
                  <li key={index} className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full mr-2" style={{
                      backgroundColor: chartData.datasets[0].backgroundColor[index % 11]
                    }}></span>
                    <span className="text-sm">
                      {item?.name || ''}: {formatCurrency(item?.value || 0)} ({percentage}%)
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <Doughnut 
      data={chartData}
      options={{
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 12,
              boxWidth: 12,
              font: { size: 13 },
              generateLabels: (chart) => {
                return chart.data.labels.map((label, i) => {
                  const value = chart.data.datasets[0].data[i];
                  const percentage = Math.round((value / total) * 100);
                  return {
                    text: `${label}: ${formatCurrency(value)} (${percentage}%)`,
                    fillStyle: chartData.datasets[0].backgroundColor[i],
                    hidden: false,
                    index: i
                  };
                });
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${formatCurrency(value)} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '65%',
        maintainAspectRatio: false,
        responsive: true
      }}
    />
  );
};

export default DashboardContent;