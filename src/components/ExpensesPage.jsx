import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';

const formatCurrency = (value) => {
  if (!value) return '-';
  try {
    const parsed = typeof value === 'number'
      ? value
      : parseFloat(value.replaceAll('.', '').replace(',', '.'));
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(parsed);
  } catch (e) {
    return value;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getTypeColor = (type) => {
  const colors = {
    'Gatas': 'bg-red-100 text-red-800',
    'Cafe (Amelia/Posta etc)': 'bg-yellow-100 text-yellow-800',
    'Traslado (Uber - Taxi)': 'bg-blue-100 text-blue-800',
    'Comida y vivienda': 'bg-green-100 text-green-800',
    'Boludeces necesarias': 'bg-purple-100 text-purple-800',
    'Boludeces innecesarias': 'bg-pink-100 text-pink-800',
    'Regalos': 'bg-yellow-200 text-yellow-900',
    'Comida fuera de casa': 'bg-indigo-100 text-indigo-800',
    'Alquiler y expensas': 'bg-gray-200 text-gray-800',
    'Delivery': 'bg-teal-100 text-teal-800',
    'Servicios': 'bg-orange-100 text-orange-800',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
};

const GlobalFilter = ({ globalFilter, setGlobalFilter, types, selectedType, setSelectedType }) => (
  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
    <input
      className="p-2 border rounded-md w-full md:w-1/3"
      value={globalFilter || ''}
      onChange={e => setGlobalFilter(e.target.value)}
      placeholder="Buscar gasto..."
    />
    <select
      className="p-2 border rounded-md w-full md:w-1/4"
      value={selectedType}
      onChange={e => setSelectedType(e.target.value)}
    >
      <option value="">Todos los tipos</option>
      {types.map(type => (
        <option key={type} value={type}>{type}</option>
      ))}
    </select>
  </div>
);

const ExpensesPage = ({ filters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { selectedYear, selectedMonth } = filters;
        const res = await fetch(`http://192.168.1.11:8000/expenses/${selectedYear}/${selectedMonth}`);
        const json = await res.json();
        setData(json.expenses.expenses || []);
      } catch (e) {
        console.error('Error al cargar los datos:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const filteredData = useMemo(() => {
    return selectedType ? data.filter(row => row.type === selectedType) : data;
  }, [data, selectedType]);

  const columns = useMemo(() => [
    {
      Header: 'Fecha',
      accessor: 'datetime',
      Cell: ({ value }) => formatDate(value)
    },
    {
      Header: 'Descripción',
      accessor: 'description'
    },
    {
      Header: 'Tipo',
      accessor: 'type',
      Cell: ({ value }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      Header: 'Monto',
      accessor: 'amount',
      Cell: ({ value }) => (
        <span className="font-semibold text-black">{formatCurrency(value)}</span>
      )
    },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { sortBy: [{ id: 'datetime', desc: true }] }
    },
    useGlobalFilter,
    useSortBy
  );

  const { globalFilter } = state;

  const totalVisible = useMemo(() => {
    return rows.reduce((acc, row) => {
      const value = typeof row.original.amount === 'number'
        ? row.original.amount
        : parseFloat(row.original.amount.replace(/\./g, '').replace(',', '.'));
      return acc + value;
    }, 0);
  }, [rows]);

  const uniqueTypes = useMemo(() => {
    const set = new Set(data.map(e => e.type));
    return [...set].sort();
  }, [data]);

  return (
    <div className="p-4 pt-16 max-w-screen-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg overflow-hidden">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Listado de gastos</h2>
        <div className="h-1 w-20 bg-blue-500 rounded-full mb-4"></div>

        <GlobalFilter
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          types={uniqueTypes}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />

        <div className="flex justify-end mb-4">
          <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-lg text-sm font-semibold">
            Total visible: {formatCurrency(totalVisible)}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-6 text-gray-500">Cargando...</div>
        ) : (
          <>
            <div className="space-y-4 md:hidden">
              {rows.map(row => {
                prepareRow(row);
                const expense = row.original;
                return (
                  <div key={expense.uuid} className="border border-gray-200 rounded-lg p-4 bg-white shadow hover:bg-gray-50 transition-colors">
                    <div className="text-sm text-gray-500">{formatDate(expense.datetime)}</div>
                    <div className="mt-2 text-sm font-medium text-gray-700">{expense.description}</div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(expense.type)}`}>
                        {expense.type}
                      </span>
                      <span className="text-black font-bold text-sm">{formatCurrency(expense.amount)}</span>
                    </div>
                  </div>
                );
              })}
              {rows.length === 0 && (
                <div className="text-center py-8 text-gray-500">No se encontraron resultados.</div>
              )}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                  {headerGroups.map((headerGroup, i) => (
                    <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, j) => (
                        <th
                          key={j}
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center">
                            {column.render('Header')}
                            <span className="ml-1">
                              {column.isSorted ? (column.isSortedDesc ? '↓' : '↑') : ''}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-100">
                  {rows.map(row => {
                    prepareRow(row);
                    return (
                      <tr key={row.id} {...row.getRowProps()} className="hover:bg-blue-50 transition-colors">
                        {row.cells.map((cell, i) => (
                          <td key={i} {...cell.getCellProps()} className="px-4 py-3 text-sm text-gray-700">
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {rows.length === 0 && (
                <div className="text-center py-8 text-gray-500">No se encontraron resultados.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;
