import React, { useState, useEffect } from 'react';
import { FiPlus, FiHome } from 'react-icons/fi';
import PropertyCard from '../components/PropertyCard';
import PropertyForm from '../components/PropertyForm';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/properties`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      const data = await response.json();
      setProperties(data.properties || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSaveProperty = async (property) => {
    try {
      if (editingId) {
        // Update existing property
        const response = await fetch(`${API_BASE_URL}/api/properties/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(property)
        });
        if (!response.ok) throw new Error('Failed to update property');
      } else {
        // Create new property
        const response = await fetch(`${API_BASE_URL}/api/properties`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(property)
        });
        if (!response.ok) throw new Error('Failed to create property');
      }
      
      // Refresh the list
      await fetchProperties();
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
      console.error('Error saving property:', err);
    }
  };

  const handleDeleteProperty = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete property');
      
      // Refresh the list
      await fetchProperties();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting property:', err);
    }
  };

  const handleEditProperty = (property) => {
    setEditingId(property.id);
    setShowForm(true);
  };

  return (
    <div className="properties-container">
      <div className="mb-8 flex justify-between items-center flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Properties</h2>
          <p className="text-gray-600">Manage your rental properties</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={20} />
          Add Property
        </button>
      </div>

      {/* Property Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">
                {editingId ? 'Edit Property' : 'Add New Property'}
              </h3>
              <PropertyForm
                onSave={handleSaveProperty}
                onCancel={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                property={
                  editingId ? properties.find((p) => p.id === editingId) : null
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="card bg-red-50 border border-red-200 mb-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchProperties}
            className="mt-2 text-red-600 underline hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">Loading properties...</p>
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={handleEditProperty}
              onDelete={handleDeleteProperty}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FiHome size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties</h3>
          <p className="text-gray-600 mb-4">Add your first rental property to get started.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Add Property
          </button>
        </div>
      )}
    </div>
  );
}

export default Properties;
