import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateOrder from './pages/user/CreateOrder';
import CheckOrder from './pages/user/CheckOrder';
import './App.css'
import SuperAdminDashboard from './components/SuperAdminDashboard';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar user={user} onLogout={handleLogout}/>
          <Routes>
            {/* Admin Routes */}
            <Route
                path="/admin"
                element={user ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={setUser} />}
            />
            <Route
                path="/admin/dashboard"
                element={
                  user ? (
                    user?.role === 'superadmin' ? 
                      <SuperAdminDashboard /> : 
                      <AdminDashboard />
                  ) : (
                    <Navigate to="/admin" />
                  )
                }
            />

            {/* User Routes (No login required) */}
            <Route path="/" element={<CreateOrder />} />
            <Route path="/check-order" element={<CheckOrder />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;