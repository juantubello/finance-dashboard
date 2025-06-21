import React from 'react';

const colorClasses = {
  green: 'bg-green-100 border-green-200 text-green-800',
  red: 'bg-red-100 border-red-200 text-red-800',
  blue: 'bg-blue-100 border-blue-200 text-blue-800',
  orange: 'bg-orange-100 border-orange-200 text-orange-800',
  purple: 'bg-purple-100 border-purple-200 text-purple-800'
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(value);
};

const Card = ({ 
  title, 
  value, 
  icon, 
  color, 
  showDetailButton, 
  onDetailClick, 
  className = '', 
  iconClassName = '', 
  textClassName = '',
  useVisaLogo = false
}) => {
  const isDarkTheme = className.includes('from-gray-900') || className.includes('bg-gray-800');

  return (
    <div className={`${colorClasses[color]} ${className} p-4 rounded-lg border flex flex-col h-full`}>
      <div className="flex justify-between items-center">
        <div className={textClassName || (isDarkTheme ? 'text-white' : '')}>
          <p className={`text-xs font-medium uppercase tracking-wider ${isDarkTheme ? 'opacity-80' : ''}`}>
            {title}
          </p>
          <p className={`text-xl font-semibold mt-1 ${isDarkTheme ? '' : ''}`}>
            {formatCurrency(value)}
          </p>
        </div>
        {useVisaLogo ? (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/archive/5/5a/20210725073357%21Visa_2014.svg"
            alt="Visa"
            className={`h-3 ${iconClassName || (isDarkTheme ? 'brightness-0 invert' : '')}`}
            onError={(e) => {
              e.target.style.display = 'none';
              // Fallback to emoji if image fails to load
              if (icon) {
                e.target.parentElement.innerHTML = `<span class="text-2xl ${isDarkTheme ? 'text-white opacity-80' : ''}">${icon}</span>`;
              }
            }}
          />
        ) : icon && (
          <span className={`text-2xl ${iconClassName || (isDarkTheme ? 'text-white opacity-80' : '')}`}>
            {icon}
          </span>
        )}
      </div>
      {showDetailButton && (
        <button 
          onClick={onDetailClick}
          className={`mt-3 text-xs font-medium self-start transition-colors duration-150 text-white hover:text-gray-200`}
        >
          Ver detalle →
        </button>
      )}
    </div>
  );
};

export default Card;
