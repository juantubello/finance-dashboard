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
  const [syncStatus, setSyncStatus] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync functions
  const syncExpensesCurrentMonth = async () => {
    setIsSyncing(true);
    setSyncStatus('Sincronizando gastos del mes...');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSyncStatus('Gastos del mes sincronizados correctamente ✅');
    } catch (error) {
      setSyncStatus('Error al sincronizar gastos del mes ❌');
    } finally {
      setIsSyncing(false);
    }
  };

  const syncExpensesHistorical = async () => {
    setIsSyncing(true);
    setSyncStatus('Sincronizando gastos históricos...');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSyncStatus('Gastos históricos sincronizados correctamente ✅');
    } catch (error) {
      setSyncStatus('Error al sincronizar gastos históricos ❌');
    } finally {
      setIsSyncing(false);
    }
  };

  const syncIncomesCurrentMonth = async () => {
    setIsSyncing(true);
    setSyncStatus('Sincronizando ingresos del mes...');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      setSyncStatus('Ingresos del mes sincronizados correctamente ✅');
    } catch (error) {
      setSyncStatus('Error al sincronizar ingresos del mes ❌');
    } finally {
      setIsSyncing(false);
    }
  };

  const syncIncomesHistorical = async () => {
    setIsSyncing(true);
    setSyncStatus('Sincronizando ingresos históricos...');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      setSyncStatus('Ingresos históricos sincronizados correctamente ✅');
    } catch (error) {
      setSyncStatus('Error al sincronizar ingresos históricos ❌');
    } finally {
      setIsSyncing(false);
    }
  };

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
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Sincronizar datos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Expense Sync Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Gastos</h3>
                
                <button
                  onClick={syncExpensesCurrentMonth}
                  disabled={isSyncing}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${isSyncing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'}`}
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Sincronizar gastos del mes</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button
                  onClick={syncExpensesHistorical}
                  disabled={isSyncing}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${isSyncing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'}`}
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span>Sincronizar gastos históricos</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {/* Income Sync Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Ingresos</h3>
                
                <button
                  onClick={syncIncomesCurrentMonth}
                  disabled={isSyncing}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${isSyncing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-green-50 hover:border-green-200 hover:text-green-700'}`}
                >
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Sincronizar ingresos del mes</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button
                  onClick={syncIncomesHistorical}
                  disabled={isSyncing}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${isSyncing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-green-50 hover:border-green-200 hover:text-green-700'}`}
                >
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span>Sincronizar ingresos históricos</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Status Message */}
            {syncStatus && (
              <div className={`p-4 rounded-lg ${syncStatus.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                <div className="flex items-center">
                  {syncStatus.includes('Error') ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{syncStatus}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;