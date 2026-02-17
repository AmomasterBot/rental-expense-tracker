import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import ExpenseForm from '../components/ExpenseForm';
import '../styles/add-expense.css';

function AddExpense() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const storedProperties = JSON.parse(localStorage.getItem('properties')) || [];
    setProperties(storedProperties);
  }, []);

  const handleSaveExpense = (expense) => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const newExpense = {
      ...expense,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    storedExpenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(storedExpenses));

    // Show success message
    alert('Expense added successfully!');
    navigate('/expenses');
  };

  return (
    <div className="add-expense-container">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <FiArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Add New Expense</h2>
          <p className="text-gray-600">Record a rental expense</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="card">
          {properties.length > 0 ? (
            <ExpenseForm
              properties={properties}
              onSave={handleSaveExpense}
              onCancel={() => navigate('/expenses')}
            />
          ) : (
            <div className="text-center py-12">
              <FiUpload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 mb-4">
                Please add a property first before adding expenses.
              </p>
              <button
                onClick={() => navigate('/properties')}
                className="btn-primary"
              >
                Go to Properties
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddExpense;
