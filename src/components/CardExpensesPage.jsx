import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CardExpensesPage = () => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState({
    visa: null,
    mastercard: null
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedHolders, setExpandedHolders] = useState({});

  const getCardLogo = (type) => {
    const logos = {
      visa: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
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
        const currentDate = new Date();
        const response = await fetch(
          `http://192.168.1.11:8000/getResumeExpenses/${currentDate.getFullYear()}/${
            currentDate.getMonth() + 1
          }/${cardType}`
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
        const [visaData, mastercardData] = await Promise.all([
          fetchCardData('visa'),
          fetchCardData('mastercard')
        ]);

        setCardData({
          visa: visaData,
          mastercard: mastercardData
        });

        // Initialize all holders as collapsed by default
        const initialExpandedState = {};
        ['visa', 'mastercard'].forEach((cardType) => {
          cardData[cardType]?.cards?.forEach((card, cardIndex) => {
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
  }, []);

  const toggleHolderExpansion = (cardType, cardIndex, holderIndex) => {
    setExpandedHolders(prev => ({
      ...prev,
      [`${cardType}-${cardIndex}-${holderIndex}`]: !prev[`${cardType}-${cardIndex}-${holderIndex}`]
    }));
  };

  if (loading) {
    return (
      <div className="p-6 pt-24 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center py-8">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-24 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 mb-4 hover:text-blue-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Volver
      </button>

      <div className="space-y-6">
        {['visa', 'mastercard'].map((cardType) => (
          <div key={cardType} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <img
                  src={getCardLogo(cardType)}
                  alt={cardType}
                  className="h-8 mr-3 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <h1 className="text-xl font-bold text-gray-800">
                  Resumen de {cardType === 'visa' ? 'Visa' : 'Mastercard'}
                </h1>
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(50vh - 100px)' }}>
              {cardData[cardType]?.cards?.map((card, cardIndex) => (
                <div key={cardIndex} className="border-b border-gray-200 last:border-b-0">
                  {card.holders.map((holder, holderIndex) => {
                    const isExpanded = expandedHolders[`${cardType}-${cardIndex}-${holderIndex}`];
                    return (
                      <div key={holderIndex} className="relative">
                        <div 
                          className="sticky top-0 bg-gray-50 z-10 p-2 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => toggleHolderExpansion(cardType, cardIndex, holderIndex)}
                        >
                          <h3 className="font-semibold text-gray-800 ml-2">
                            {holder.holder}
                          </h3>
                          <div className="flex items-center">
                            <div className="flex flex-wrap gap-2 mr-3">
                              <div className="bg-blue-50 text-blue-800 px-2 py-1 rounded-lg text-xs whitespace-nowrap">
                                ARS: {formatCurrency(holder.total_ars)}
                              </div>
                              <div className="bg-green-50 text-green-800 px-2 py-1 rounded-lg text-xs whitespace-nowrap">
                                USD: {formatCurrency(holder.total_usd)}
                              </div>
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
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
                          <div className="overflow-y-auto" style={{ maxHeight: '40vh' }}>
                            {isMobile ? (
                              <div className="p-3 space-y-2">
                                {holder.expenses.map((expense, expenseIndex) => (
                                  <div
                                    key={expenseIndex}
                                    className="border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="flex justify-between text-xs">
                                      <span className="font-medium text-gray-700">Fecha:</span>
                                      <span className="text-gray-700">{expense.date}</span>
                                    </div>
                                    <div className="mt-1">
                                      <span className="text-xs font-medium text-gray-700">Descripción:</span>
                                      <p className="text-xs text-gray-700 mt-0.5">{expense.descriptions}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1 mt-1">
                                      <div>
                                        <span className="text-xs text-gray-500">ARS:</span>
                                        <p className="text-xs font-medium text-gray-700">
                                          {expense.amount_pesos ? formatCurrency(expense.amount_pesos) : '-'}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="text-xs text-gray-500">USD:</span>
                                        <p className="text-xs font-medium text-gray-700">
                                          {expense.amount_usd ? formatCurrency(expense.amount_usd) : '-'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-2">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Descripción
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ARS
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                          {expense.date}
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-700 max-w-xs">
                                          <div className="truncate">{expense.descriptions}</div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                          {expense.amount_pesos ? formatCurrency(expense.amount_pesos) : '-'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                          {expense.amount_usd ? formatCurrency(expense.amount_usd) : '-'}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
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