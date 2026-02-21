import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiCheck } from 'react-icons/fi';
import FileUpload from './FileUpload';

function ExpenseForm({ properties = [], onSave, onCancel }) {
  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    propertyId: properties[0]?.id || '',
    provider: '',
    amount: '',
    categoryId: 'maintenance',
    comments: '',
    fileData: null,
  });

  // Validation and UI state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [categories, setCategories] = useState([]);

  // Mock categories - will be replaced with API call
  useEffect(() => {
    const mockCategories = [
      { id: 'maintenance', name: 'Maintenance' },
      { id: 'repair', name: 'Repair' },
      { id: 'utilities', name: 'Utilities' },
      { id: 'insurance', name: 'Insurance' },
      { id: 'property-tax', name: 'Property Tax' },
      { id: 'mortgage', name: 'Mortgage' },
      { id: 'cleaning', name: 'Cleaning' },
      { id: 'other', name: 'Other' },
    ];
    setCategories(mockCategories);
  }, []);

  // Validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }

    if (!formData.propertyId) {
      newErrors.propertyId = 'Property is required';
    }

    if (!formData.provider || formData.provider.trim() === '') {
      newErrors.provider = 'Provider name is required';
    } else if (formData.provider.trim().length < 2) {
      newErrors.provider = 'Provider name must be at least 2 characters';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    } else if (parseFloat(formData.amount) > 999999.99) {
      newErrors.amount = 'Amount is too large';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts editing
    if (touched[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // Handle field blur (mark as touched for validation)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate single field
    const newErrors = { ...errors };
    if (name === 'date') {
      if (!formData.date) {
        newErrors.date = 'Date is required';
      } else {
        const selectedDate = new Date(formData.date);
        const today = new Date();
        if (selectedDate > today) {
          newErrors.date = 'Date cannot be in the future';
        } else {
          delete newErrors.date;
        }
      }
    } else if (name === 'provider') {
      if (!formData.provider || formData.provider.trim() === '') {
        newErrors.provider = 'Provider name is required';
      } else if (formData.provider.trim().length < 2) {
        newErrors.provider = 'Provider name must be at least 2 characters';
      } else {
        delete newErrors.provider;
      }
    } else if (name === 'amount') {
      if (!formData.amount) {
        newErrors.amount = 'Amount is required';
      } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      } else if (parseFloat(formData.amount) > 999999.99) {
        newErrors.amount = 'Amount is too large';
      } else {
        delete newErrors.amount;
      }
    }

    setErrors(newErrors);
  };

  // Handle file upload
  const handleFileSelect = (fileInfo) => {
    setFormData((prev) => ({ ...prev, fileData: fileInfo }));
    setTouched((prev) => ({ ...prev, fileData: true }));
  };

  const handleFileError = () => {
    setFormData((prev) => ({ ...prev, fileData: null }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Prepare data for API
      const submissionData = {
        date: formData.date,
        propertyId: formData.propertyId,
        provider: formData.provider,
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        comments: formData.comments || null,
        receipt: formData.fileData ? {
          name: formData.fileData.name,
          size: formData.fileData.size,
          type: formData.fileData.type,
          data: formData.fileData.preview,
        } : null,
      };

      // Simulate API call - will be replaced with real endpoint
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Success feedback
      setSubmitSuccess(true);
      setTimeout(() => {
        onSave(submissionData);
      }, 1000);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to add expense. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedPropertyName = () => {
    const prop = properties.find(p => p.id === formData.propertyId);
    return prop?.name || '';
  };

  const getSelectedCategoryName = () => {
    const cat = categories.find(c => c.id === formData.categoryId);
    return cat?.name || '';
  };

  const hasFormError = (fieldName) => touched[fieldName] && errors[fieldName];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Submit Error Alert */}
      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <FiAlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">{errors.submit}</p>
          </div>
        </div>
      )}

      {/* Date and Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="label">
            Date <span className="text-red-600">*</span>
          </label>
          <input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input-field ${hasFormError('date') ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={isSubmitting}
          />
          {hasFormError('date') && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <FiAlertCircle size={14} />
              {errors.date}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="propertyId" className="label">
            Property <span className="text-red-600">*</span>
          </label>
          <select
            id="propertyId"
            name="propertyId"
            value={formData.propertyId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input-field ${hasFormError('propertyId') ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={isSubmitting || properties.length === 0}
          >
            <option value="">Select a property...</option>
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.name}
              </option>
            ))}
          </select>
          {hasFormError('propertyId') && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <FiAlertCircle size={14} />
              {errors.propertyId}
            </p>
          )}
          {properties.length === 0 && (
            <p className="mt-1 text-sm text-yellow-600">No properties available</p>
          )}
        </div>
      </div>

      {/* Provider */}
      <div>
        <label htmlFor="provider" className="label">
          Provider/Vendor <span className="text-red-600">*</span>
        </label>
        <input
          id="provider"
          type="text"
          name="provider"
          value={formData.provider}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., ABC Plumbing, Maintenance Co."
          className={`input-field ${hasFormError('provider') ? 'border-red-500 focus:ring-red-500' : ''}`}
          disabled={isSubmitting}
        />
        {hasFormError('provider') && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <FiAlertCircle size={14} />
            {errors.provider}
          </p>
        )}
      </div>

      {/* Amount and Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="label">
            Amount <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
              $
            </span>
            <input
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              step="0.01"
              min="0"
              max="999999.99"
              className={`input-field pl-8 ${hasFormError('amount') ? 'border-red-500 focus:ring-red-500' : ''}`}
              disabled={isSubmitting}
            />
          </div>
          {hasFormError('amount') && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <FiAlertCircle size={14} />
              {errors.amount}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="categoryId" className="label">
            Category <span className="text-red-600">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input-field ${hasFormError('categoryId') ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={isSubmitting || categories.length === 0}
          >
            <option value="">Select a category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {hasFormError('categoryId') && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <FiAlertCircle size={14} />
              {errors.categoryId}
            </p>
          )}
        </div>
      </div>

      {/* Comments */}
      <div>
        <label htmlFor="comments" className="label">
          Comments <span className="text-gray-500">(Optional)</span>
        </label>
        <textarea
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          placeholder="Additional details about this expense (notes, reference numbers, etc.)"
          className="input-field"
          rows="3"
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.comments.length}/500 characters
        </p>
      </div>

      {/* File Upload */}
      <div>
        <label className="label">
          Receipt/Proof <span className="text-gray-500">(Optional)</span>
        </label>
        <FileUpload
          onFileSelect={handleFileSelect}
          onError={handleFileError}
          allowedTypes={['image/jpeg', 'image/png', 'image/heic', 'application/pdf']}
          maxSizeMB={10}
        />
      </div>

      {/* Form Summary (for debugging/verification) */}
      {Object.keys(formData).length > 0 && formData.provider && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg hidden sm:block">
          <p className="text-xs font-medium text-blue-900 mb-2">Form Summary:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
            <p><strong>Date:</strong> {formData.date}</p>
            <p><strong>Property:</strong> {getSelectedPropertyName()}</p>
            <p><strong>Provider:</strong> {formData.provider}</p>
            <p><strong>Amount:</strong> ${parseFloat(formData.amount || 0).toFixed(2)}</p>
            <p><strong>Category:</strong> {getSelectedCategoryName()}</p>
            <p><strong>File:</strong> {formData.fileData?.name || 'None'}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting || submitSuccess}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            submitSuccess
              ? 'bg-green-600 text-white'
              : isSubmitting
              ? 'bg-blue-500 text-white cursor-wait'
              : 'btn-primary'
          }`}
        >
          {submitSuccess ? (
            <>
              <FiCheck size={18} />
              Success!
            </>
          ) : isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding...
            </>
          ) : (
            'Add Expense'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-500 text-center">
        Fields marked with <span className="text-red-600">*</span> are required.
        Your expense will be saved to the database.
      </p>
    </form>
  );
}

export default ExpenseForm;
