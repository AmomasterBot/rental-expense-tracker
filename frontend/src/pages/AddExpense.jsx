import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import ExpenseForm from '../components/ExpenseForm';

function AddExpense() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    // Fetch properties from API
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/properties`);
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        setProperties(data.properties || []);
      } catch (err) {
        console.error('Error fetching properties:', err);
        // Fallback to localStorage if API fails
        const storedProperties = JSON.parse(localStorage.getItem('properties')) || [];
        setProperties(storedProperties);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

  const handleSaveExpense = async (expense) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      });
      
      if (!response.ok) throw new Error('Failed to create expense');
      
      // Show success message
      alert('Expense added successfully!');
      navigate('/expenses');
    } catch (err) {
      console.error('Error saving expense:', err);
      alert('Failed to add expense. Please try again.');
    }
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
