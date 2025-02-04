import { Link, useLocation } from 'react-router-dom';
import { Package, ClipboardList, LogIn, LogOut } from 'lucide-react';

const Navbar = ({ admin }) => {
  const location = useLocation();
  const isAdminSection = location.pathname.startsWith('/admin');

  return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Package className="h-6 w-6 text-blue-600" />
                <span className="ml-2 text-xl font-semibold">Ordering System</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAdminSection ? (
                  // Admin Navigation
                  admin && (
                      <>
                        <Link
                            to="/admin/dashboard"
                            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                        >
                          <ClipboardList className="h-5 w-5 mr-1" />
                          Dashboard
                        </Link>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                        >
                          <LogOut className="h-5 w-5 mr-1" />
                          Exit Admin
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
        </div>
      </nav>
  );
};

export default Navbar;