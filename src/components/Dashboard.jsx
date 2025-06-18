import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totals: {
      expense: 0,
      income: 0,
      remaining: 0,
      card: 0
    },
    categories: [],
    loading: true,
    error: null
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(value);
  };

  const [isMobile, setIsMobile] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchExpensesData = async () => {
    try {
      const response = await fetch('http://192.168.1.11:8000/expenses/2025/6');
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const totalExpense = parseFloat(data.expenses.total.replace(/\./g, '').replace(',', '.'));
      const categories = Object.entries(data.expenses.total_by_expense_type).map(([name, value]) => ({
        name,
        value: parseFloat(value.replace(/\./g, '').replace(',', '.'))
      }));

      setDashboardData({
        totals: {
          expense: totalExpense,
          income: 0,
          remaining: -totalExpense,
          card: 0
        },
        categories,
        loading: false,
        error: null
      });
    } catch (error) {
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  useEffect(() => {
    fetchExpensesData();
  }, []);

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Cargando datos...</div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">Error: {dashboardData.error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Resumen de Gastos - Junio 2025</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card 
            title="Balance" 
            value={dashboardData.totals.remaining} 
            icon="🏦" 
            color={dashboardData.totals.remaining >= 0 ? 'blue' : 'orange'}
          />
          <Card 
            title="Gastos en efectivo / debito" 
            value={dashboardData.totals.expense} 
            icon="💸" 
            color="red"
          />
          <Card 
            title="Ingreso" 
            value={dashboardData.totals.income} 
            icon="💰" 
            color="green"
          />
          <Card 
            title="Total resumen tarjetas" 
            value={dashboardData.totals.card} 
            icon="💳" 
            color="purple"
          />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Gastos en efectivo / debito</h2>
          <div className="h-96">
            <DoughnutChart 
              data={dashboardData.categories} 
              isMobile={isMobile}
              showGraph={showGraph}
              setShowGraph={setShowGraph}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, icon, color }) => {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800'
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className={`${colorClasses[color]} p-5 rounded-lg border flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{formatCurrency(value)}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  );
};

const DoughnutChart = ({ data, isMobile, showGraph, setShowGraph }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(value);
  };

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const total = sortedData.reduce((sum, item) => sum + item.value, 0);

  const chartData = {
    labels: sortedData.map(item => item.name),
    datasets: [{
      data: sortedData.map(item => item.value),
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
            <button 
              onClick={() => setShowGraph(false)}
              className="flex items-center text-blue-600 mb-2 text-sm"
            >
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
                          font: { size: 10 },
                          generateLabels: (chart) => {
                            return chart.data.labels.map((label, i) => ({
                              text: label,
                              fillStyle: chartData.datasets[0].backgroundColor[i],
                              hidden: false,
                              index: i
                            }));
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
                    cutout: '50%',
                    maintainAspectRatio: true
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <button 
              onClick={() => setShowGraph(true)}
              className="flex items-center justify-end w-full text-blue-600 mb-2 text-sm"
            >
              Ver gráfico
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <ul className="space-y-2">
              {sortedData.map((item, index) => {
                const percentage = Math.round((item.value / total) * 100);
                return (
                  <li key={index} className="flex items-center">
                    <span 
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor: chartData.datasets[0].backgroundColor[index % 11]
                      }}
                    ></span>
                    <span className="text-sm">
                      {item.name}: {formatCurrency(item.value)} ({percentage}%)
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
  const options = {
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
        enabled: true,
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
  };

  return <Doughnut data={chartData} options={options} />;
};

export default Dashboard;