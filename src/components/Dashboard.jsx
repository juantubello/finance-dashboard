import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';

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

  const [filters, setFilters] = useState({
    selectedYear: new Date().getFullYear(),
    selectedMonth: new Date().getMonth() + 1
  });

  const [isMobile, setIsMobile] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('Reporte mensual');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const retrieveFilters = () => {
    return {
      selectedYear: filters.selectedYear,
      selectedMonth: filters.selectedMonth
    };
  };

  const fetchExpensesData = async () => {
    try {
      const { selectedYear, selectedMonth } = retrieveFilters();
      const expensesResponse = await fetch(`http://192.168.1.11:8000/expenses/${selectedYear}/${selectedMonth}`);
      if (!expensesResponse.ok) throw new Error('Network response was not ok');
      
      const expensesData = await expensesResponse.json();
      const totalExpense = parseFloat(expensesData.expenses.total.replace(/\./g, '').replace(',', '.'));
      const categories = Object.entries(expensesData.expenses.total_by_expense_type).map(([name, value]) => ({
        name,
        value: parseFloat(value.replace(/\./g, '').replace(',', '.'))
      }));

      const incomeResponse = await fetch(`http://192.168.1.11:8000/incomes/${selectedYear}/${selectedMonth}`);
      if (!incomeResponse.ok) throw new Error('Network response was not ok');
      const incomeData = await incomeResponse.json();
      const totalIncome = parseFloat(incomeData.income.total_ars.replace(/\./g, '').replace(',', '.'));

      setDashboardData({
        totals: {
          expense: totalExpense,
          income: totalIncome,
          remaining: totalIncome - totalExpense,
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
  }, [filters]);

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
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        filters={filters} 
        setFilters={setFilters} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        activeNavItem={activeNavItem}
        setActiveNavItem={setActiveNavItem}
      />

      <div className="max-w-7xl mx-auto p-6 pt-24">  
        {activeNavItem === 'Reporte mensual' && (
          <DashboardContent 
            dashboardData={dashboardData}
            isMobile={isMobile}
            showGraph={showGraph}
            setShowGraph={setShowGraph}
          />
        )}
        
        {activeNavItem === 'Reporte anual' && (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Reporte anual</h2>
            <p className="text-gray-600">Algun diaaa jijiji</p>
          </div>
        )}
        
        {activeNavItem === 'Sincronizar datos' && (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Sincronizar datos</h2>
            <p className="text-gray-600">tengo que hacerlo me da paja ahora</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;