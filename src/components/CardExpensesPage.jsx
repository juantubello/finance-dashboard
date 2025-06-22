import React, { useState, useEffect, useMemo } from 'react';

const CardExpensesPage = ({ activeNavItem, filters }) => {
  const [cardData, setCardData] = useState({ visa: null, mastercard: null });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedHolders, setExpandedHolders] = useState({});
  const [filtersByHolder, setFiltersByHolder] = useState({});

  const getCardLogo = (type) => {
    const logos = {
      visa: 'https://upload.wikimedia.org/wikipedia/commons/archive/5/5a/20210725073357%21Visa_2014.svg',
      mastercard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg'
    };
    return logos[type] || '';
  };

  const formatCurrency = (value) => {
    const parsed = typeof value === 'number' ? value : parseFloat(value?.toString().replace(/\./g, '').replace(',', '.'));
    if (isNaN(parsed)) return '-';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(parsed);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCardData = async (cardType) => {
      try {
        const { selectedYear, selectedMonth } = filters;
        const res = await fetch(`http://192.168.1.11:8000/getResumeExpenses/${selectedYear}/${selectedMonth}/${cardType}`);
        return await res.json();
      } catch (err) {
        console.error(`Error fetching ${cardType}:`, err);
        return null;
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      const [visaData, mcData] = await Promise.all([
        fetchCardData('visa'),
        fetchCardData('mastercard')
      ]);
      setCardData({ visa: visaData, mastercard: mcData });

      const initialExpanded = {};
      ['visa', 'mastercard'].forEach(type => {
        const data = type === 'visa' ? visaData : mcData;
        data?.cards?.forEach((card, ci) => {
          card.holders.forEach((_, hi) => {
            initialExpanded[`${type}-${ci}-${hi}`] = false;
          });
        });
      });
      setExpandedHolders(initialExpanded);
    };

    fetchAllData().finally(() => setLoading(false));
  }, [filters]);

  const toggleHolderExpansion = (cardType, cardIndex, holderIndex) => {
    setExpandedHolders(prev => ({
      ...prev,
      [`${cardType}-${cardIndex}-${holderIndex}`]: !prev[`${cardType}-${cardIndex}-${holderIndex}`]
    }));
  };

  if (loading) {
    return <div className="p-6 pt-16 w-full mx-auto text-center">Cargando...</div>;
  }

  return (
    <div className="p-4 pt-16 max-w-screen-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Resumen de tarjetas</h1>

      {['visa', 'mastercard'].map(cardType => (
        <div key={cardType} className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className={`p-4 border-b ${cardType === 'visa' ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-800 to-gray-700'}`}>
            <div className="flex items-center">
              <img
                src={getCardLogo(cardType)}
                alt={cardType}
                className="mr-3 h-8 md:h-10 object-contain brightness-0 invert"
              />
              <h2 className="text-lg md:text-2xl font-bold text-white">
                {cardType.toUpperCase()} - {new Date(filters.selectedYear, filters.selectedMonth - 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
              </h2>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {cardData[cardType]?.cards?.map((card, cardIndex) => (
              <div key={cardIndex} className="space-y-4">
                {card.holders.map((holder, holderIndex) => {
                  const key = `${cardType}-${cardIndex}-${holderIndex}`;
                  const isExpanded = expandedHolders[key];
                  const search = filtersByHolder[key] || '';

                  const filtered = holder.expenses.filter(e =>
                    e.descriptions?.toLowerCase().includes(search.toLowerCase())
                  );

                  const totalARS = filtered.reduce((acc, e) => acc + (parseFloat(e.amount_pesos?.replace(/\./g, '').replace(',', '.')) || 0), 0);
                  const totalUSD = filtered.reduce((acc, e) => acc + (parseFloat(e.amount_usd?.replace(/\./g, '').replace(',', '.')) || 0), 0);

                  return (
                    <div key={holderIndex} className="border border-gray-200 rounded-lg">
                      <div
                        className="bg-gray-100 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-200"
                        onClick={() => toggleHolderExpansion(cardType, cardIndex, holderIndex)}
                      >
                        <span className="font-semibold text-gray-800 text-sm md:text-base truncate">{holder.holder}</span>
                        <div className="flex gap-2 items-center flex-wrap justify-end text-xs md:text-sm">
                          <span className="text-blue-800 font-medium whitespace-nowrap">ARS: {formatCurrency(totalARS)}</span>
                          <span className="text-green-800 font-medium whitespace-nowrap">USD: {formatCurrency(totalUSD)}</span>
                          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 space-y-4">
                          <input
                            type="text"
                            inputMode="text"
                            className="w-full border px-3 py-2 rounded-md text-sm text-gray-700 appearance-none focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Filtrar por descripción..."
                            value={search}
                            onChange={(e) => setFiltersByHolder(prev => ({ ...prev, [key]: e.target.value }))}
                            style={{ fontSize: '16px' }}
                          />

                          <div className="text-right text-sm font-semibold text-gray-700">
                            ARS: {formatCurrency(totalARS)} | USD: {formatCurrency(totalUSD)}
                          </div>

                          {isMobile ? (
                            <div className="space-y-3">
                              {filtered.map((e, i) => (
                                <div
                                  key={i}
                                  className={`border border-gray-200 rounded-lg p-3 transition-colors ${
                                    e.amount_pesos && parseFloat(e.amount_pesos.replace(/\./g, '').replace(',', '.')) > 0
                                      ? 'bg-blue-50 hover:bg-blue-100'
                                      : e.amount_usd && parseFloat(e.amount_usd.replace(/\./g, '').replace(',', '.')) > 0
                                      ? 'bg-green-50 hover:bg-green-100'
                                      : 'bg-white hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="text-sm text-gray-500">{e.date}</div>
                                  <div className="mt-2 text-sm font-medium text-gray-700">{e.descriptions}</div>
                                  <div className="mt-2 flex justify-between text-sm">
                                    <span className="text-gray-600">ARS: {formatCurrency(e.amount_pesos)}</span>
                                    <span className="text-gray-600">USD: {formatCurrency(e.amount_usd)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="overflow-auto max-h-[400px]">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="sticky top-0 bg-gray-50 z-10">
                                  <tr className="text-gray-600 text-xs">
                                    <th className="px-4 py-2 text-left">Fecha</th>
                                    <th className="px-4 py-2 text-left">Descripción</th>
                                    <th className="px-4 py-2 text-left">ARS</th>
                                    <th className="px-4 py-2 text-left">USD</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filtered.map((e, i) => (
                                    <tr
                                      key={i}
                                      className={`hover:bg-gray-50 ${
                                        e.amount_pesos && parseFloat(e.amount_pesos.replace(/\./g, '').replace(',', '.')) > 0
                                          ? 'bg-blue-50'
                                          : e.amount_usd && parseFloat(e.amount_usd.replace(/\./g, '').replace(',', '.')) > 0
                                          ? 'bg-green-50'
                                          : ''
                                      }`}
                                    >
                                      <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{e.date}</td>
                                      <td className="px-4 py-2 text-sm text-gray-700 max-w-xs truncate">{e.descriptions}</td>
                                      <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{formatCurrency(e.amount_pesos)}</td>
                                      <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{formatCurrency(e.amount_usd)}</td>
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
  );
};

export default CardExpensesPage;
