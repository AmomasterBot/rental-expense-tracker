import React, { useState } from 'react';
import { FiTrash2, FiImage, FiX } from 'react-icons/fi';
import { formatDateShort } from '../utils/formatters';

// Category color mapping
const getCategoryColor = (category) => {
  const colors = {
    maintenance: 'bg-blue-100 text-blue-800',
    repair: 'bg-red-100 text-red-800',
    utilities: 'bg-yellow-100 text-yellow-800',
    insurance: 'bg-green-100 text-green-800',
    'property-tax': 'bg-purple-100 text-purple-800',
    mortgage: 'bg-indigo-100 text-indigo-800',
    cleaning: 'bg-teal-100 text-teal-800',
    other: 'bg-gray-100 text-gray-800',
  };
  return colors[category] || colors.other;
};

// Receipt Modal Component
function ReceiptModal({ receipt, onClose }) {
  if (!receipt) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10 bg-white"
          aria-label="Close"
        >
          <FiX size={24} />
        </button>
        {receipt.endsWith('.pdf') || receipt.includes('application/pdf') ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-4">PDF Receipt Preview</p>
            <a
              href={receipt}
              download="receipt.pdf"
              className="btn-primary inline-block"
            >
              Download PDF
            </a>
          </div>
        ) : (
          <img
            src={receipt}
            alt="Receipt"
            className="w-full h-auto"
          />
        )}
      </div>
    </div>
  );
}

// SortHeader Component
function SortHeader({ label, sortKey, sortConfig, handleSort }) {
  return (
    <th
      onClick={() => handleSort(sortKey)}
      className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {sortConfig.key === sortKey && (
          <span className="text-blue-600">
            {sortConfig.direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );
}

// Desktop Table Component
function DesktopTable({ sortedExpenses, sortConfig, handleSort, onDelete, setSelectedReceipt }) {
  return (
    <div className="overflow-x-auto hidden md:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <SortHeader label="Date" sortKey="date" sortConfig={sortConfig} handleSort={handleSort} />
            <SortHeader label="Property" sortKey="property" sortConfig={sortConfig} handleSort={handleSort} />
            <SortHeader label="Provider" sortKey="provider" sortConfig={sortConfig} handleSort={handleSort} />
            <SortHeader label="Category" sortKey="category" sortConfig={sortConfig} handleSort={handleSort} />
            <SortHeader label="Amount" sortKey="amount" sortConfig={sortConfig} handleSort={handleSort} />
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Receipt
            </th>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Comments
            </th>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedExpenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDateShort(expense.date)}
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {expense.property}
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {expense.provider}
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                  {expense.category}
                </span>
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${Number(expense.amount).toFixed(2)}
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                {expense.receipt ? (
                  <button
                    onClick={() => setSelectedReceipt(expense.receipt)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-900 transition-colors"
                    title="Click to enlarge"
                  >
                    <FiImage size={18} />
                    <span className="hidden sm:inline">View</span>
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs">No receipt</span>
                )}
              </td>
              <td className="px-3 sm:px-6 py-4 text-sm text-gray-600">
                <span className="truncate block max-w-xs" title={expense.notes || 'No comments'}>
                  {expense.notes || '—'}
                </span>
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you want to delete this expense?'
                      )
                    ) {
                      onDelete(expense.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-900 transition-colors p-1"
                  title="Delete"
                >
                  <FiTrash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Mobile Cards Component
function MobileCards({ sortedExpenses, onDelete, setSelectedReceipt }) {
  return (
    <div className="md:hidden space-y-4">
      {sortedExpenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Date
              </p>
              <p className="font-semibold text-gray-900">
                {formatDateShort(expense.date)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Amount
              </p>
              <p className="font-semibold text-gray-900">
                ${Number(expense.amount).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Property
              </p>
              <p className="text-sm text-gray-900">{expense.property}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Provider
              </p>
              <p className="text-sm text-gray-900">{expense.provider}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Category
            </p>
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
              {expense.category}
            </span>
          </div>

          {expense.notes && (
            <div className="mb-4 pb-4 border-t pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Comments
              </p>
              <p className="text-sm text-gray-600">{expense.notes}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t gap-2">
            {expense.receipt ? (
              <button
                onClick={() => setSelectedReceipt(expense.receipt)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-900 transition-colors text-sm"
              >
                <FiImage size={16} />
                View Receipt
              </button>
            ) : (
              <span className="text-gray-400 text-xs">No receipt</span>
            )}
            <button
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to delete this expense?'
                  )
                ) {
                  onDelete(expense.id);
                }
              }}
              className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded"
              title="Delete"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main ExpenseTable Component
function ExpenseTable({ expenses, onDelete }) {
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc',
  });

  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const sortedExpenses = [...expenses].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (typeof aVal === 'number') {
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    }

    if (sortConfig.key === 'date') {
      const aDate = new Date(aVal);
      const bDate = new Date(bVal);
      return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();

    return sortConfig.direction === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div>
      <DesktopTable
        sortedExpenses={sortedExpenses}
        sortConfig={sortConfig}
        handleSort={handleSort}
        onDelete={onDelete}
        setSelectedReceipt={setSelectedReceipt}
      />
      <MobileCards
        sortedExpenses={sortedExpenses}
        onDelete={onDelete}
        setSelectedReceipt={setSelectedReceipt}
      />
      <ReceiptModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}

export default ExpenseTable;
