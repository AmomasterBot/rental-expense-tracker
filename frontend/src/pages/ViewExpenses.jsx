import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiPlus, FiFilter, FiX } from 'react-icons/fi';
import ExpenseTable from '../components/ExpenseTable';

function ViewExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [properties, setProperties] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    property: '',
    provider: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const storedProperties = JSON.parse(localStorage.getItem('properties')) || [];
    setExpenses(storedExpenses);
    setProperties(storedProperties);
  }, []);

  // Get unique providers from expenses
  const uniqueProviders = [...new Set(expenses.map((e) => e.provider))].sort();

  const filteredExpenses = expenses.filter((expense) => {
    if (filters.property && expense.property !== filters.property) return false;
    if (filters.provider && expense.provider !== filters.provider) return false;
    if (filters.startDate && new Date(expense.date) < new Date(filters.startDate))
      return false;
    if (filters.endDate && new Date(expense.date) > new Date(filters.endDate))
      return false;
    return true;
  });

  const handleDeleteExpense = (id) => {
    const updatedExpenses = expenses.filter((e) => e.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Property', 'Provider', 'Amount', 'Category', 'Notes'],
      ...filteredExpenses.map((e) => [
        e.date,
        e.property,
        e.provider,
        e.amount,
        e.category,
        e.notes || '',
      ]),
    ]
      .map((row) =>
        row
          .map((cell) =>
            typeof cell === 'string' && cell.includes(',')
              ? `"${cell}"`
              : cell
          )
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleClearFilters = () => {
    setFilters({
      property: '',
      provider: '',
      startDate: '',
      endDate: '',
    });
  };

  const isFiltered =
    filters.property || filters.provider || filters.startDate || filters.endDate;

  return (
    <div className="view-expenses-container">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-start gap-4 flex-col sm:flex-row mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Expenses
            </h2>
            <p className="text-gray-600 text-sm">
              View and manage your expenses
              {filteredExpenses.length > 0 && (
                <span className="ml-2 font-semibold text-gray-900">
                  ({filteredExpenses.length})
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link
              to="/expenses/add"
              className="btn-primary flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <FiPlus size={20} />
              <span>Add</span>
            </Link>
            {filteredExpenses.length > 0 && (
              <button
                onClick={handleExport}
                className="btn-secondary flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                <FiDownload size={20} />
                <span>Export</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 text-blue-600 hover:text-blue-900 font-medium text-sm"
        >
          <FiFilter size={18} />
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {/* Filters */}
      {(showFilters || window.innerWidth >= 768) && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {isFiltered && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiX size={16} />
                Clear All
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label">Property</label>
              <select
                value={filters.property}
                onChange={(e) =>
                  setFilters({ ...filters, property: e.target.value })
                }
                className="input-field"
              >
                <option value="">All Properties</option>
                {properties.map((prop) => (
                  <option key={prop.id} value={prop.name}>
                    {prop.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Provider</label>
              <select
                value={filters.provider}
                onChange={(e) =>
                  setFilters({ ...filters, provider: e.target.value })
                }
                className="input-field"
              >
                <option value="">All Providers</option>
                {uniqueProviders.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="input-field"
              />
            </div>
          </div>
        </div>
      )}

      {/* Expenses Table */}
      {filteredExpenses.length > 0 ? (
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredExpenses.length} of {expenses.length} expenses
            </p>
          </div>
          <ExpenseTable
            expenses={filteredExpenses}
            onDelete={handleDeleteExpense}
          />
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">
            {expenses.length === 0
              ? 'No expenses yet. Start adding expenses to track your spending.'
              : 'No expenses match your filters.'}
          </p>
          {expenses.length === 0 && (
            <Link to="/expenses/add" className="btn-primary inline-block">
              Add First Expense
            </Link>
          )}
          {expenses.length > 0 && isFiltered && (
            <button
              onClick={handleClearFilters}
              className="btn-secondary inline-block mt-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ViewExpenses;
