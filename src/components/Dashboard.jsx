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

  // Función para formatear números con separadores de miles
  const formatNumber = (numStr) => {
    return parseFloat(numStr.replace(/\./g, '').replace(',', '.'));
  };

  // Función para obtener los datos del endpoint
  const fetchExpensesData = async () => {
    try {
      const response = await fetch('http://192.168.1.11:8000/expenses/2025/6');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // Procesar los datos para el dashboard
      const totalExpense = formatNumber(data.expenses.total);
      const categories = Object.entries(data.expenses.total_by_expense_type).map(([name, value]) => ({
        name,
        value: formatNumber(value)
      }));

      setDashboardData({
        totals: {
          expense: totalExpense,
          income: 0, // Puedes obtener esto de otro endpoint si es necesario
          remaining: -totalExpense, // Asumiendo que no hay ingresos en este ejemplo
          card: 0 // Puedes obtener esto de otro endpoint si es necesario
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
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            title="Total Gastos" 
            value={dashboardData.totals.expense} 
            icon="💸" 
            color="red"
          />
          <Card 
            title="Total Ingresos" 
            value={dashboardData.totals.income} 
            icon="💰" 
            color="green"
          />
          <Card 
            title="Balance" 
            value={dashboardData.totals.remaining} 
            icon="🏦" 
            color={dashboardData.totals.remaining >= 0 ? 'blue' : 'orange'}
          />
          <Card 
            title="Pagos con Tarjeta" 
            value={dashboardData.totals.card} 
            icon="💳" 
            color="purple"
          />
        </div>
        
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Distribución de Gastos por Categoría</h2>
          <div className="h-96">
            <DoughnutChart data={dashboardData.categories} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Card (mejorado para mostrar números formateados)
const Card = ({ title, value, icon, color }) => {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800'
  };

  // Función para formatear el valor como moneda
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

// Componente DoughnutChart (actualizado)
const DoughnutChart = ({ data }) => {
  // Ordenar categorías de mayor a menor
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  const chartData = {
    labels: sortedData.map(item => item.name),
    datasets: [
      {
        data: sortedData.map(item => item.value),
        backgroundColor: [
          '#EF4444', // red-500
          '#3B82F6', // blue-500
          '#F59E0B', // amber-500
          '#10B981', // emerald-500
          '#8B5CF6', // violet-500
          '#EC4899', // pink-500
          '#84CC16', // lime-500
          '#F97316', // orange-500
          '#06B6D4', // cyan-500
          '#A855F7'  // purple-500
        ],
        borderWidth: 0
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toLocaleString('es-AR')} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '65%',
    maintainAspectRatio: false
  };

  return <Doughnut data={chartData} options={options} />;
};

export default Dashboard;