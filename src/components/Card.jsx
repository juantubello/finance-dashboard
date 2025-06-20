import React from 'react';

const colorClasses = {
  green: 'bg-green-50 border-green-200 text-green-800',
  red: 'bg-red-50 border-red-200 text-red-800',
  blue: 'bg-blue-50 border-blue-200 text-blue-800',
  orange: 'bg-orange-50 border-orange-200 text-orange-800',
  purple: 'bg-purple-50 border-purple-200 text-purple-800'
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(value);
};

const Card = ({ title, value, icon, color, showDetailButton, onDetailClick }) => {
  return (
    <div className={`${colorClasses[color]} p-5 rounded-lg border flex flex-col justify-between h-full`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(value)}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      {showDetailButton && (
        <button 
          onClick={onDetailClick}
          className="mt-4 bg-white hover:bg-gray-100 text-purple-700 font-medium py-1 px-3 rounded-lg border border-purple-200 text-sm self-end transition-colors duration-200"
        >
          Ver detalle
        </button>
      )}
    </div>
  );
};

export default Card;