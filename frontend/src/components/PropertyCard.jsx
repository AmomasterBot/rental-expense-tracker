import React from 'react';
import { FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';

function PropertyCard({ property, onEdit, onDelete }) {
  const handleEdit = () => onEdit?.(property);
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      onDelete?.(property.id);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{property.address}</h3>
          <div className="flex items-center gap-1 text-gray-600 mt-1">
            <FiMapPin size={16} />
            <span className="text-sm">{property.city}, {property.state}</span>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={handleEdit}
                className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                aria-label="Edit property"
              >
                <FiEdit2 size={18} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                aria-label="Delete property"
              >
                <FiTrash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {property.zip_code && <p>📍 Zip: {property.zip_code}</p>}
        {property.property_type && <p>Type: {property.property_type}</p>}
        {property.created_at && <p className="text-xs text-gray-500">Added: {new Date(property.created_at).toLocaleDateString()}</p>}
      </div>

      {property.notes && (
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
          {property.notes}
        </div>
      )}
    </div>
  );
}

export default PropertyCard;
