import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import DashboardPage from './pages/Dashboard';
import CreateOrder from './pages/CreateOrder';
import MyOrders from './pages/MyOrders';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <Routes>
          <Route 
            path="/" 
            element={user ? <DashboardPage user={user} /> : <Login onLogin={setUser} />} 
          />
          <Route 
            path="/create-order" 
            element={user ? <CreateOrder /> : <Login onLogin={setUser} />} 
          />
          <Route 
            path="/my-orders" 
            element={user ? <MyOrders user={user} /> : <Login onLogin={setUser} />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;