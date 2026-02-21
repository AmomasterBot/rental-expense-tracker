import React, { useState, useEffect } from 'react';

function PropertyForm({ onSave, onCancel, property }) {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zip_code: '',
    property_type: 'apartment',
    notes: '',
  });

  useEffect(() => {
    if (property) {
      setFormData({
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zip_code: property.zip_code || '',
        property_type: property.property_type || 'apartment',
        notes: property.notes || '',
      });
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.address || !formData.city || !formData.state || !formData.zip_code) {
      alert('Please fill in all required fields: address, city, state, and zip code');
      return;
    }
    onSave(formData);
    setFormData({
      address: '',
      city: '',
      state: '',
      zip_code: '',
      property_type: 'apartment',
      notes: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Address *</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="e.g., 123 Main St"
          className="input-field"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="label">State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="input-field"
            required
          />
        </div>
      </div>

      <div>
        <label className="label">Zip Code *</label>
        <input
          type="text"
          name="zip_code"
          value={formData.zip_code}
          onChange={handleChange}
          placeholder="Zip Code"
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="label">Property Type</label>
        <select
          name="property_type"
          value={formData.property_type}
          onChange={handleChange}
          className="input-field"
        >
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
          <option value="commercial">Commercial</option>
          <option value="townhouse">Townhouse</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="label">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any additional notes..."
          className="input-field"
          rows="3"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" className="btn-primary flex-1">
          {property ? 'Update Property' : 'Add Property'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default PropertyForm;
