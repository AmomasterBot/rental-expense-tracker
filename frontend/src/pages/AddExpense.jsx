import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import ExpenseForm from '../components/ExpenseForm';

function AddExpense() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-detect backend URL based on current hostname
  // This allows the app to work on localhost, LAN IP, and Tailscale IP
  const getApiBaseUrl = () => {
    // Check if custom URL is set in environment
    if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'http://localhost:3001') {
      return import.meta.env.VITE_API_URL;
    }
    
    // Auto-detect: use same host as frontend, port 3001
    const host = window.location.hostname;
    const port = 3001;
    return `http://${host}:${port}`;
  };

  const API_BASE_URL = getApiBaseUrl();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/properties`);
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        setProperties(data.properties || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError(error.message);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
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
        {/* Error Message */}
        {error && (
          <div className="card bg-red-50 border border-red-200 mb-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-red-600 underline hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        <div className="card">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading properties...</p>
            </div>
          ) : properties.length > 0 ? (
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
