import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiTrash2, FiPlus } from 'react-icons/fi';
import ExpenseTable from '../components/ExpenseTable';
import '../styles/view-expenses.css';

function ViewExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    property: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const storedProperties = JSON.parse(localStorage.getItem('properties')) || [];
    setExpenses(storedExpenses);
    setProperties(storedProperties);
  }, []);

  const filteredExpenses = expenses.filter((expense) => {
    if (filters.property && expense.property !== filters.property) return false;
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
        e.notes,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="view-expenses-container">
      <div className="mb-8 flex justify-between items-center flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Expenses</h2>
          <p className="text-gray-600">View and manage your expenses</p>
        </div>
        <div className="flex gap-2">
          <Link to="/expenses/add" className="btn-primary flex items-center gap-2">
            <FiPlus size={20} />
            Add Expense
          </Link>
          {filteredExpenses.length > 0 && (
            <button
              onClick={handleExport}
              className="btn-secondary flex items-center gap-2"
            >
              <FiDownload size={20} />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Expenses Table */}
      {filteredExpenses.length > 0 ? (
        <div className="card overflow-x-auto">
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
        </div>
      )}
    </div>
  );
}

export default ViewExpenses;
