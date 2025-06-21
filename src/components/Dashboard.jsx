import React, { useState, useEffect } from 'react';
import DashboardContent from './DashboardContent';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ activeNavItem, filters, setFilters }) => {
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

  const [isMobile, setIsMobile] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const navigate = useNavigate();

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
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      const { selectedYear, selectedMonth } = filters;
      const expensesResponse = await fetch(`http://192.168.1.11:8000/expenses/${selectedYear}/${selectedMonth}`);
      if (!expensesResponse.ok) throw new Error('Network response was not ok');

      const expensesData = await expensesResponse.json();
      const totalExpense = parseFloat(expensesData.expenses?.total?.replace(/\./g, '').replace(',', '.') || 0);

      const categories = Object.entries(expensesData.expenses?.total_by_expense_type || {}).map(([name, value]) => ({
        name,
        value: parseFloat(value?.replace(/\./g, '').replace(',', '.') || 0)
      }));

      const incomeResponse = await fetch(`http://192.168.1.11:8000/incomes/${selectedYear}/${selectedMonth}`);
      if (!incomeResponse.ok) throw new Error('Network response was not ok');
      const incomeData = await incomeResponse.json();
      const totalIncome = parseFloat(incomeData.income?.total_ars?.replace(/\./g, '').replace(',', '.') || 0);

      const currentDate = new Date();
      const cardResponse = await fetch(`http://192.168.1.11:8000/getResumeExpenses/${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/all`);
      const cardData = await cardResponse.json();

      let totalCardExpense = 0;
      cardData.cards?.forEach(card => {
        card.holders?.forEach(holder => {
          totalCardExpense += parseFloat(holder?.total_ars?.replace(/\./g, '').replace(',', '.') || 0);
        });
      });

      setDashboardData({
        totals: {
          expense: totalExpense,
          income: totalIncome,
          remaining: totalIncome - totalExpense,
          card: totalCardExpense
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
    if (activeNavItem === 'Reporte mensual') {
      fetchExpensesData();
    }
  }, [filters, activeNavItem]);

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center pt-24">
        <div className="text-xl font-semibold text-gray-700">Cargando datos...</div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center pt-24">
        <div className="text-xl font-semibold text-red-600">Error: {dashboardData.error}</div>
      </div>
    );
  }

  return (
    <>
      {activeNavItem === 'Reporte mensual' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             <Card 
    title="Balance" 
    value={dashboardData.totals?.remaining || 0} 
    className={`${dashboardData.totals?.remaining >= 0 
      ? 'bg-gradient-to-r from-blue-900 to-blue-800' 
      : 'bg-gradient-to-r from-orange-900 to-orange-800'
    } text-white border-gray-700`}
    icon="🏦"
    iconClassName="text-white opacity-90"
    textClassName="text-white"
  />
  
  <Card 
    title="Gastos" 
    value={dashboardData.totals?.expense || 0} 
    className="bg-gradient-to-r from-red-900 to-red-800 text-white border-gray-700"
    icon="💸"
    iconClassName="text-white opacity-90"
    textClassName="text-white"
  />
  
  <Card 
    title="Ingreso" 
    value={dashboardData.totals?.income || 0} 
    className="bg-gradient-to-r from-green-900 to-green-800 text-white border-gray-700"
    icon="💰"
    iconClassName="text-white opacity-90"
    textClassName="text-white"
  />
  
  <Card 
    title="Tarjetas" 
    value={dashboardData.totals?.card || 0}
    showDetailButton={true}
    onDetailClick={() => navigate('/card-expenses')}
    className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-gray-700"
    useVisaLogo={true}
    logoSize="h-5"
  />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Gastos en efectivo / debito</h2>
            <div className="h-96">
              <DashboardContent
                data={dashboardData.categories || []}
                isMobile={isMobile}
                showGraph={showGraph}
                setShowGraph={setShowGraph}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;