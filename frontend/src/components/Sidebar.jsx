import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiX, FiHome, FiBriefcase, FiPlus, FiList } from 'react-icons/fi';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: FiHome },
    { label: 'Properties', path: '/properties', icon: FiBriefcase },
    { label: 'Add Expense', path: '/expenses/add', icon: FiPlus },
    { label: 'View Expenses', path: '/expenses', icon: FiList },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-gray-50 border-r border-gray-200 transform transition-transform md:translate-x-0 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex items-center justify-between md:hidden">
          <h2 className="text-lg font-bold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-600 hover:bg-gray-200"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isOpen && onClose()}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
