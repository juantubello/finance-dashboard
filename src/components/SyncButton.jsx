import React from 'react';

const SyncButton = ({ 
  onClick, 
  disabled, 
  icon, 
  iconColor, 
  hoverColor, 
  children,
  isLoading 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
        disabled 
          ? 'bg-gray-100 cursor-not-allowed' 
          : `bg-white hover:bg-${hoverColor}-50 hover:border-${hoverColor}-200 hover:text-${hoverColor}-700`
      }`}
    >
      <div className="flex items-center">
        {isLoading ? (
          <div className={`bg-${iconColor}-100 p-2 rounded-full mr-3`}>
            <svg className={`animate-spin h-6 w-6 text-${iconColor}-600`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className={`bg-${iconColor}-100 p-2 rounded-full mr-3`}>
            {icon}
          </div>
        )}
        <span>{children}</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </button>
  );
};

export default SyncButton;