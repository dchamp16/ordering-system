import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ClipboardList, LogIn, LogOut, Menu, X } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isAdminSection = location.pathname.startsWith('/admin');

  const handleLogout = async () => {
    try {
      await axiosInstance.get('/auth/logout');
      onLogout();
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <Package className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">Ordering System</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            {isAdminSection ? (
              // Admin Navigation
              user && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <ClipboardList className="h-5 w-5 mr-1" />
                    {user.role === 'superadmin' ? 'Super Admin' : 'Admin'} Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Logout
                  </button>
                </>
              )
            ) : (
              // User Navigation
              <>
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <ClipboardList className="h-5 w-5 mr-1" />
                  Create Order
                </Link>
                <Link
                  to="/check-order"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <Package className="h-5 w-5 mr-1" />
                  Check Order
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <LogIn className="h-5 w-5 mr-1" />
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden py-2 space-y-1">
            {isAdminSection ? (
              // Admin Navigation
              user && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                    onClick={closeMenu}
                  >
                    <ClipboardList className="h-5 w-5 mr-1" />
                    {user.role === 'superadmin' ? 'Super Admin' : 'Admin'} Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="flex w-full items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Logout
                  </button>
                </>
              )
            ) : (
              // User Navigation
              <>
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                  onClick={closeMenu}
                >
                  <ClipboardList className="h-5 w-5 mr-1" />
                  Create Order
                </Link>
                <Link
                  to="/check-order"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                  onClick={closeMenu}
                >
                  <Package className="h-5 w-5 mr-1" />
                  Check Order
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                  onClick={closeMenu}
                >
                  <LogIn className="h-5 w-5 mr-1" />
                  Admin Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;