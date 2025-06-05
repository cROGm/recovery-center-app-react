import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Function to get display name
  const getDisplayName = () => {
    if (!user) return '';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-2 mr-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M12 21a9 9 0 100-18 9 9 0 000 18z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">Recovery Center</h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/dashboard')
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/items"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/items')
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
            >
              Browse Items
            </Link>

            <Link
              to="/my-requests"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/my-requests')
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
            >
              My Requests
            </Link>

            {(user.role === 'ADMIN' || user.role === 'STAFF') && (
              <>
                <Link
                  to="/manage-items"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/manage-items')
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  Manage Items
                </Link>
                <Link
                  to="/manage-requests"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/manage-requests')
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  Manage Requests
                </Link>
              </>
            )}

            {user.role === 'ADMIN' && (
              <Link
                to="/manage-users"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/manage-users')
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Manage Users
              </Link>
            )}

            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
              <span className="text-sm text-gray-700">
                {getDisplayName()}
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-emerald-600 focus:outline-none focus:text-emerald-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/dashboard')
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/items"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/items')
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Items
              </Link>

              <Link
                to="/my-requests"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/my-requests')
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Requests
              </Link>

              {(user.role === 'ADMIN' || user.role === 'STAFF') && (
                <>
                  <Link
                    to="/manage-items"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/manage-items')
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-700 hover:text-emerald-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manage Items
                  </Link>
                  <Link
                    to="/manage-requests"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/manage-requests')
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-700 hover:text-emerald-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manage Requests
                  </Link>
                </>
              )}

              {user.role === 'ADMIN' && (
                <Link
                  to="/manage-users"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/manage-users')
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-700 hover:text-emerald-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manage Users
                </Link>
              )}

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-700">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full mt-1 inline-block">
                    {user.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md mt-1"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;