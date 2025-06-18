import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  // Estado para los datos dummy
  const [dummyData, setDummyData] = useState({
    expenses: [
      { id: 1, amount: 150, category: 'Food', date: '2023-05-01' },
      { id: 2, amount: 200, category: 'Transport', date: '2023-05-02' },
      { id: 3, amount: 100, category: 'Entertainment', date: '2023-05-03' },
      { id: 4, amount: 300, category: 'Food', date: '2023-05-04' },
      { id: 5, amount: 50, category: 'Other', date: '2023-05-05' }
    ],
    incomes: [
      { id: 1, amount: 1000, category: 'Salary', date: '2023-05-01' },
      { id: 2, amount: 200, category: 'Freelance', date: '2023-05-10' }
    ],
    cardPayments: [
      { id: 1, amount: 150, category: 'Food', date: '2023-05-01' }
    ]
  });

  // Estado para los datos calculados
  const [dashboardData, setDashboardData] = useState({
    totals: {
      expense: 0,
      income: 0,
      remaining: 0,
      card: 0
    },
    categories: []
  });

  // Calcular totales y categorías
  useEffect(() => {
    const totalExpense = dummyData.expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalIncome = dummyData.incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalCard = dummyData.cardPayments.reduce((sum, item) => sum + item.amount, 0);
    const remainingCash = totalIncome - totalExpense;

    // Agrupar por categoría
    const categoryMap = {};
    dummyData.expenses.forEach(expense => {
      categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
    });

    setDashboardData({
      totals: {
        expense: totalExpense,
        income: totalIncome,
        remaining: remainingCash,
        card: totalCard
      },
      categories: Object.keys(categoryMap).map(category => ({
        name: category,
        value: categoryMap[category]
      }))
    });
  }, [dummyData]);

  // Función para agregar transacción
  const addTransaction = (type, transaction) => {
    setDummyData(prev => ({
      ...prev,
      [type]: [...prev[type], {
        ...transaction,
        id: prev[type].length + 1,
        date: new Date().toISOString().split('T')[0]
      }]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Finance Dashboard</h1>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            title="Total Income" 
            value={dashboardData.totals.income} 
            icon="💰" 
            color="green"
          />
          <Card 
            title="Total Expense" 
            value={dashboardData.totals.expense} 
            icon="💸" 
            color="red"
          />
          <Card 
            title="Remaining Cash" 
            value={dashboardData.totals.remaining} 
            icon="🏦" 
            color={dashboardData.totals.remaining >= 0 ? 'blue' : 'orange'}
          />
          <Card 
            title="Card Payments" 
            value={dashboardData.totals.card} 
            icon="💳" 
            color="purple"
          />
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Expense Distribution</h2>
            <div className="h-80">
              <DoughnutChart data={dashboardData.categories} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Transactions</h2>
            <TransactionList transactions={[...dummyData.expenses, ...dummyData.incomes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)} />
          </div>
        </div>
        
        {/* Add Transaction Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add Transaction</h2>
          <TransactionForm onSubmit={addTransaction} />
        </div>
      </div>
    </div>
  );
};

// Componente Card mejorado con Tailwind
const Card = ({ title, value, icon, color }) => {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800'
  };

  return (
    <div className={`${colorClasses[color]} p-5 rounded-lg border flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">${value.toLocaleString()}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  );
};

// Componente DoughnutChart
const DoughnutChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: [
          '#EF4444', // red-500
          '#3B82F6', // blue-500
          '#F59E0B', // amber-500
          '#10B981', // emerald-500
          '#8B5CF6', // violet-500
          '#EC4899'  // pink-500
        ],
        borderWidth: 0
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    },
    cutout: '70%',
    maintainAspectRatio: false
  };

  return <Doughnut data={chartData} options={options} />;
};

// Componente TransactionList
const TransactionList = ({ transactions }) => {
  return (
    <div className="space-y-4">
      {transactions.map(transaction => (
        <div key={transaction.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              transaction.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {transaction.amount > 0 ? '⬆️' : '⬇️'}
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-800">{transaction.category}</p>
              <p className="text-sm text-gray-500">{transaction.date}</p>
            </div>
          </div>
          <p className={`font-semibold ${
            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
          </p>
        </div>
      ))}
    </div>
  );
};

// Componente TransactionForm mejorado
const TransactionForm = ({ onSubmit }) => {
  const [type, setType] = useState('expenses');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    
    onSubmit(type, { amount: Number(amount), category });
    setAmount('');
    setCategory('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="expenses">Expense</option>
            <option value="incomes">Income</option>
            <option value="cardPayments">Card Payment</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Transaction
      </button>
    </form>
  );
};

export default Dashboard;