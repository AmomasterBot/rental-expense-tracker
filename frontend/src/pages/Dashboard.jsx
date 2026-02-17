import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiDollarSign, FiHome } from 'react-icons/fi';
import PropertyCard from '../components/PropertyCard';
import StatsCard from '../components/StatsCard';
import '../styles/dashboard.css';

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    propertyCount: 0,
    monthlyAverage: 0,
  });

  useEffect(() => {
    // Load data from localStorage (offline support)
    const storedProperties = JSON.parse(localStorage.getItem('properties')) || [];
    const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];

    setProperties(storedProperties);
    setExpenses(storedExpenses);

    // Calculate stats
    const totalExpenses = storedExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const recentExpenses = storedExpenses.slice(-5);

    setStats({
      totalExpenses: totalExpenses,
      propertyCount: storedProperties.length,
      monthlyAverage: storedExpenses.length > 0 ? (totalExpenses / 12).toFixed(2) : 0,
    });
  }, []);

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
        <p className="text-gray-600">Manage your rental property expenses efficiently.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Expenses"
          value={`$${stats.totalExpenses.toFixed(2)}`}
          icon={FiDollarSign}
          color="blue"
        />
        <StatsCard
          title="Properties"
          value={stats.propertyCount}
          icon={FiHome}
          color="green"
        />
        <StatsCard
          title="Monthly Average"
          value={`$${stats.monthlyAverage}`}
          icon={FiDollarSign}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/expenses/add"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <FiPlus size={20} />
            Add Expense
          </Link>
          <Link
            to="/properties"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <FiHome size={20} />
            View Properties
          </Link>
        </div>
      </div>

      {/* Recent Properties */}
      {properties.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          {properties.length > 3 && (
            <div className="mt-4 text-center">
              <Link to="/properties" className="text-blue-600 hover:text-blue-800 font-medium">
                View all properties →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {properties.length === 0 && (
        <div className="card text-center py-12">
          <FiHome size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
          <p className="text-gray-600 mb-4">Add your first rental property to get started.</p>
          <Link to="/properties" className="btn-primary inline-block">
            Add Property
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
