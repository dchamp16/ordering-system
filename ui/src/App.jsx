import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import DashboardPage from './pages/Dashboard';

const App = () => {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <DashboardPage user={user} /> : <Login onLogin={setUser} />} />
            </Routes>
        </Router>
    );
};

export default App;
