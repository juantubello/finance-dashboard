import React from 'react';
import SyncButton from './SyncButton';
import SyncStatus from './SyncStatus';

const SyncDataPage = ({ 
  syncStatus,
  isSyncing,
  activeSync,
  syncExpensesCurrentMonth,
  syncExpensesHistorical,
  syncIncomesCurrentMonth,
  syncIncomesHistorical
}) => {
  // Define icons here
  const clockIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const calendarIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const incomeClockIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const incomeCalendarIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const expenseButtons = [
    {
      id: 'expensesCurrentMonth',
      label: "Sincronizar gastos del mes",
      onClick: syncExpensesCurrentMonth,
      disabled: isSyncing,
      icon: clockIcon,
      iconColor: "blue",
      hoverColor: "blue",
      isLoading: activeSync === 'expensesCurrentMonth'
    },
    {
      id: 'expensesHistorical',
      label: "Sincronizar gastos históricos",
      onClick: syncExpensesHistorical,
      disabled: isSyncing,
      icon: calendarIcon,
      iconColor: "blue",
      hoverColor: "blue",
      isLoading: activeSync === 'expensesHistorical'
    }
  ];

  const incomeButtons = [
    {
      id: 'incomesCurrentMonth',
      label: "Sincronizar ingresos del mes",
      onClick: syncIncomesCurrentMonth,
      disabled: isSyncing,
      icon: incomeClockIcon,
      iconColor: "green",
      hoverColor: "green",
      isLoading: activeSync === 'incomesCurrentMonth'
    },
    {
      id: 'incomesHistorical',
      label: "Sincronizar ingresos históricos",
      onClick: syncIncomesHistorical,
      disabled: isSyncing,
      icon: incomeCalendarIcon,
      iconColor: "green",
      hoverColor: "green",
      isLoading: activeSync === 'incomesHistorical'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Sincronizar datos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Gastos</h3>
          {expenseButtons.map((button) => (
            <SyncButton
              key={button.id}
              onClick={button.onClick}
              disabled={button.disabled}
              icon={button.icon}
              iconColor={button.iconColor}
              hoverColor={button.hoverColor}
              isLoading={button.isLoading}
            >
              {button.label}
            </SyncButton>
          ))}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Ingresos</h3>
          {incomeButtons.map((button) => (
            <SyncButton
              key={button.id}
              onClick={button.onClick}
              disabled={button.disabled}
              icon={button.icon}
              iconColor={button.iconColor}
              hoverColor={button.hoverColor}
              isLoading={button.isLoading}
            >
              {button.label}
            </SyncButton>
          ))}
        </div>
      </div>
      
      <SyncStatus status={syncStatus} />
    </div>
  );
};

export default SyncDataPage;