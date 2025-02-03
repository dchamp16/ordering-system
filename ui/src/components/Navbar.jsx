import { Link } from 'react-router-dom';
import { Package, ClipboardList, User } from 'lucide-react';

const Navbar = ({ user }) => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">Ordering System</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/create-order" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <ClipboardList className="h-5 w-5 mr-1" />
              Create Order
            </Link>
            
            {user && (
              <Link 
                to="/my-orders" 
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <User className="h-5 w-5 mr-1" />
                My Orders
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;