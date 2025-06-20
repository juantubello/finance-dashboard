import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CardExpensesPage = ({ activeNavItem, filters, setFilters }) => {
  const [cardData, setCardData] = useState({
    visa: null,
    mastercard: null
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedHolders, setExpandedHolders] = useState({});

  const getCardLogo = (type) => {
    const logos = {
      visa: 'https://upload.wikimedia.org/wikipedia/commons/archive/5/5a/20210725073357%21Visa_2014.svg',
      mastercard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg'
    };
    return logos[type] || '';
  };

  const formatCurrency = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(parseFloat(value.replace(/\./g, '').replace(',', '.')));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCardData = async (cardType) => {
      try {
        const { selectedYear, selectedMonth } = filters;
        const response = await fetch(
          `http://192.168.1.11:8000/getResumeExpenses/${selectedYear}/${selectedMonth}/${cardType}`
        );
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`Error fetching ${cardType} expenses:`, error);
        return null;
      }
    };

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [visaData, mastercardData] = await Promise.all([
          fetchCardData('visa'),
          fetchCardData('mastercard')
        ]);

        setCardData({
          visa: visaData,
          mastercard: mastercardData
        });

        const initialExpandedState = {};
        ['visa', 'mastercard'].forEach((cardType) => {
          const data = cardType === 'visa' ? visaData : mastercardData;
          data?.cards?.forEach((card, cardIndex) => {
            card.holders.forEach((holder, holderIndex) => {
              initialExpandedState[`${cardType}-${cardIndex}-${holderIndex}`] = false;
            });
          });
        });
        setExpandedHolders(initialExpandedState);
      } catch (error) {
        console.error('Error fetching card expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [filters]);

  const toggleHolderExpansion = (cardType, cardIndex, holderIndex) => {
    setExpandedHolders(prev => ({
      ...prev,
      [`${cardType}-${cardIndex}-${holderIndex}`]: !prev[`${cardType}-${cardIndex}-${holderIndex}`]
    }));
  };

  if (loading) {
    return (
      <div className="p-6 pt-16 w-full mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center py-8">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-16 w-full mx-auto max-w-screen-2xl">
      <div className="space-y-6 w-full">
        {['visa', 'mastercard'].map((cardType) => (
          <div key={cardType} className="bg-white rounded-xl shadow-sm overflow-hidden w-full">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <img
                  src={getCardLogo(cardType)}
                  alt={cardType}
                  className="h-8 md:h-10 mr-3 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <h1 className="text-lg md:text-2xl font-bold text-gray-800">
                  Resumen de {cardType === 'visa' ? 'Visa' : 'Mastercard'} - {new Date(filters.selectedYear, filters.selectedMonth - 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                </h1>
              </div>
            </div>

            <div className="space-y-4 p-4 w-full">
              {cardData[cardType]?.cards?.map((card, cardIndex) => (
                <div key={cardIndex} className="space-y-4 w-full">
                  {card.holders.map((holder, holderIndex) => {
                    const isExpanded = expandedHolders[`${cardType}-${cardIndex}-${holderIndex}`];
                    return (
                      <div key={holderIndex} className="border border-gray-200 rounded-lg overflow-hidden w-full">
                        <div 
                          className="bg-gray-50 p-3 md:p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors w-full"
                          onClick={() => toggleHolderExpansion(cardType, cardIndex, holderIndex)}
                        >
                          <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                            {holder.holder}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-50 text-blue-800 px-2 py-1 rounded-lg text-xs md:text-sm whitespace-nowrap">
                              ARS: {formatCurrency(holder.total_ars)}
                            </div>
                            <div className="bg-green-50 text-green-800 px-2 py-1 rounded-lg text-xs md:text-sm whitespace-nowrap">
                              USD: {formatCurrency(holder.total_usd)}
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-4 w-4 md:h-5 md:w-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="overflow-auto w-full" style={{ maxHeight: '500px' }}>
                            {isMobile ? (
                              <div className="p-2 md:p-3 space-y-2 md:space-y-3">
                                {holder.expenses.map((expense, expenseIndex) => (
                                  <div
                                    key={expenseIndex}
                                    className="border border-gray-200 rounded-lg p-2 md:p-3 hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="flex justify-between text-sm">
                                      <span className="font-medium text-gray-700">Fecha:</span>
                                      <span className="text-gray-700">{expense.date}</span>
                                    </div>
                                    <div className="mt-2">
                                      <span className="text-sm font-medium text-gray-700">Descripción:</span>
                                      <p className="text-sm text-gray-700 mt-1">{expense.descriptions}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                      <div>
                                        <span className="text-sm text-gray-500">ARS:</span>
                                        <p className="text-sm font-medium text-gray-700">
                                          {expense.amount_pesos ? formatCurrency(expense.amount_pesos) : '-'}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="text-sm text-gray-500">USD:</span>
                                        <p className="text-sm font-medium text-gray-700">
                                          {expense.amount_usd ? formatCurrency(expense.amount_usd) : '-'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <table className="min-w-full divide-y divide-gray-200 w-full">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                      Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                      Descripción
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                      ARS
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                      USD
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {holder.expenses.map((expense, expenseIndex) => (
                                    <tr
                                      key={expenseIndex}
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {expense.date}
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                                        <div className="truncate">{expense.descriptions}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {expense.amount_pesos ? formatCurrency(expense.amount_pesos) : '-'}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {expense.amount_usd ? formatCurrency(expense.amount_usd) : '-'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardExpensesPage;