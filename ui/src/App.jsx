import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateOrder from './pages/user/CreateOrder';
import CheckOrder from './pages/user/CheckOrder';
import './App.css'

const App = () => {
  const [admin, setAdmin] = useState(null);

  return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar admin={admin} />
          <Routes>
            {/* Admin Routes */}
            <Route
                path="/admin"
                element={admin ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={setAdmin} />}
            />
            <Route
                path="/admin/dashboard"
                element={admin ? <AdminDashboard admin={admin} /> : <Navigate to="/admin" />}
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