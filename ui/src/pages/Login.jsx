import { useState } from 'react';
import LoginForm from '../components/LoginForm';

const Login = ({ onLogin }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <LoginForm onLogin={onLogin} />
        </div>
    );
};

export default Login;
