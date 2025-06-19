import React from 'react';
import Card from './Card';
import DoughnutChart from './DoughnutChart';

const DashboardContent = ({ dashboardData, isMobile, showGraph, setShowGraph }) => {
  return (
    <>
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
    </>
  );
};

export default DashboardContent;