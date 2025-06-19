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

const Card = ({ title, value, icon, color }) => {
  return (
    <div className={`${colorClasses[color]} p-5 rounded-lg border flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{formatCurrency(value)}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  );
};

export default Card;