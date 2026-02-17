import React, { useState, useEffect } from 'react';

function PropertyForm({ onSave, onCancel, property }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    type: 'apartment',
    notes: '',
  });

  useEffect(() => {
    if (property) {
      setFormData(property);
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      alert('Please fill in required fields');
      return;
    }
    onSave(formData);
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      type: 'apartment',
      notes: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Property Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Downtown Apartment"
          className="input-field"
          required
        />
      </div>

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
          <label className="label">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="input-field"
          />
        </div>
        <div>
          <label className="label">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="label">Zip Code</label>
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          placeholder="Zip Code"
          className="input-field"
        />
      </div>

      <div>
        <label className="label">Property Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="input-field"
        >
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
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
