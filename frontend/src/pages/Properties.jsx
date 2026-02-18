import React, { useState, useEffect } from 'react';
import { FiPlus, FiHome } from 'react-icons/fi';
import PropertyCard from '../components/PropertyCard';
import PropertyForm from '../components/PropertyForm';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const storedProperties = JSON.parse(localStorage.getItem('properties')) || [];
    setProperties(storedProperties);
  }, []);

  const handleSaveProperty = (property) => {
    let updatedProperties;

    if (editingId) {
      updatedProperties = properties.map((p) =>
        p.id === editingId ? { ...property, id: editingId } : p
      );
      setEditingId(null);
    } else {
      updatedProperties = [...properties, { ...property, id: Date.now() }];
    }

    setProperties(updatedProperties);
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
    setShowForm(false);
  };

  const handleDeleteProperty = (id) => {
    const updatedProperties = properties.filter((p) => p.id !== id);
    setProperties(updatedProperties);
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
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

      {/* Properties Grid */}
      {properties.length > 0 ? (
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
