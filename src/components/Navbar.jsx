import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ filters, setFilters, setSidebarOpen }) => {
  const navigate = useNavigate();

const handleLogoClick = () => {
  const newFilters = {
    selectedYear: new Date().getFullYear(),
    selectedMonth: new Date().getMonth() + 1
  };
  setFilters(newFilters);
  navigate('/', { 
    state: { filters: newFilters },
    replace: true  // This replaces the current entry in history instead of adding a new one
  });
};

  return (
    <div className="bg-gray-700 shadow-md w-full py-3 px-6 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button 
          onClick={handleLogoClick}
          className="bg-gray-800 rounded-lg p-2 hover:bg-gray-900 transition-colors"
        >
          <h1 className="text-xl font-bold text-white">FP</h1>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={filters.selectedMonth}
              onChange={(e) => setFilters(prev => ({...prev, selectedMonth: parseInt(e.target.value)}))}
              className="appearance-none bg-gray-600 text-white border border-gray-500 rounded-lg px-4 py-1 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                <option key={month} value={month} className="bg-gray-700">
                  {new Date(2000, month - 1, 1).toLocaleString('es-AR', {month: 'long'})}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select
              value={filters.selectedYear}
              onChange={(e) => setFilters(prev => ({...prev, selectedYear: parseInt(e.target.value)}))}
              className="appearance-none bg-gray-600 text-white border border-gray-500 rounded-lg px-4 py-1 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({length: 5}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                <option key={year} value={year} className="bg-gray-700">{year}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setSidebarOpen(prev => !prev)}
          className="text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Navbar;