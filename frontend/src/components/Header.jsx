import React from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiHome } from 'react-icons/fi';

function Header({ isOnline, onMenuClick }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Menu button (mobile) */}
          <button
            onClick={onMenuClick}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <FiMenu size={24} />
          </button>

          {/* Logo/Title */}
          <Link to="/" className="flex items-center gap-2">
            <FiHome size={24} className="text-blue-600" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Rental Expense Tracker
            </h1>
          </Link>

          {/* Right side info */}
          <div className="flex items-center gap-4">
            {isOnline ? (
              <span className="text-xs md:text-sm text-green-600 font-medium">
                Online
              </span>
            ) : (
              <span className="text-xs md:text-sm text-red-600 font-medium">
                Offline
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
