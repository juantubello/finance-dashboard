import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import SyncDataPage from './SyncDataPage';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('Reporte mensual');
  const [filters, setFilters] = useState({
    selectedYear: new Date().getFullYear(),
    selectedMonth: new Date().getMonth() + 1
  });
  const navigate = useNavigate();

  // Handle navigation when sidebar items are clicked
  const handleNavItemClick = (itemName) => {
    setActiveNavItem(itemName);
    setSidebarOpen(false);
    
    if (itemName === 'Reporte mensual') {
      navigate('/');
    } else if (itemName === 'Card Expenses') {
      navigate('/card-expenses');
    } else if (itemName === 'Sincronizar datos') {
      navigate('/sync-data');
    }
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') {
      setActiveNavItem('Reporte mensual');
    } else if (path === '/card-expenses') {
      setActiveNavItem('Card Expenses');
    } else if (path === '/sync-data') {
      setActiveNavItem('Sincronizar datos');
    }
  }, [window.location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ bottom: '6rem' }}
        toastClassName="bg-white text-gray-800 shadow-md rounded-lg border border-gray-200"
        bodyClassName="font-medium"
        progressClassName="bg-blue-500"
      />
      
      <Navbar 
        filters={filters}
        setFilters={setFilters}
        setSidebarOpen={setSidebarOpen} 
      />
      
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        activeNavItem={activeNavItem}
        onNavItemClick={handleNavItemClick}
      />

      <div className="max-w-7xl mx-auto p-6 pt-24">
        {activeNavItem === 'Sincronizar datos' ? (
          <SyncDataPage />
        ) : (
          React.cloneElement(children, { 
            filters,
            setFilters,
            activeNavItem
          })
        )}
      </div>
    </div>
  );
};

export default Layout;