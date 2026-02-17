import React, { useState, useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

function ExpenseForm({ properties, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    property: properties[0]?.name || '',
    provider: '',
    amount: '',
    category: 'maintenance',
    notes: '',
    receipt: null,
  });

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, receipt: event.target.result }));
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReceipt = () => {
    setFormData((prev) => ({ ...prev, receipt: null }));
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.property || !formData.provider || !formData.amount) {
      alert('Please fill in required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="label">Property *</label>
          <select
            name="property"
            value={formData.property}
            onChange={handleChange}
            className="input-field"
            required
          >
            {properties.map((prop) => (
              <option key={prop.id} value={prop.name}>
                {prop.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Provider *</label>
        <input
          type="text"
          name="provider"
          value={formData.provider}
          onChange={handleChange}
          placeholder="e.g., ABC Plumbing, Maintenance Co."
          className="input-field"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Amount *</label>
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">$</span>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label className="label">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="maintenance">Maintenance</option>
            <option value="repair">Repair</option>
            <option value="utilities">Utilities</option>
            <option value="insurance">Insurance</option>
            <option value="property-tax">Property Tax</option>
            <option value="mortgage">Mortgage</option>
            <option value="cleaning">Cleaning</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional details about this expense..."
          className="input-field"
          rows="3"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="label">Receipt (Optional)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          {preview ? (
            <div className="space-y-3">
              <img
                src={preview}
                alt="Receipt preview"
                className="max-h-48 mx-auto rounded"
              />
              <button
                type="button"
                onClick={handleRemoveReceipt}
                className="text-red-600 hover:text-red-800 font-medium flex items-center justify-center gap-2"
              >
                <FiX size={16} />
                Remove
              </button>
            </div>
          ) : (
            <div>
              <FiUpload size={32} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to upload receipt or drag and drop
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Select File
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" className="btn-primary flex-1">
          Add Expense
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

export default ExpenseForm;
