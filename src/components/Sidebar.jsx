import React from 'react';
import { Link } from 'react-router-dom'; // 👈 importá Link

const navItems = [
  { name: 'Reporte mensual', icon: '📊', path: '/' },
  { name: 'Card Expenses', icon: '💳', path: '/card-expenses' },
  { name: 'Gastos', icon: '💸', path: '/expenses' },
  { name: 'Sincronizar datos', icon: '🔄', path: '/sync-data' }
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeNavItem, onNavItemClick }) => {
  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white z-40 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out pt-16`}>
        <div className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => {
                    onNavItemClick(item.name);
                    setSidebarOpen(false); // Cerrar el sidebar si estás en móvil
                  }}
                  className={`w-full block px-4 py-2 rounded-lg flex items-center ${activeNavItem === item.name ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
