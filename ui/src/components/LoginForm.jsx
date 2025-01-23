import {useState} from "react";
import axiosInstance from "../utils/axiosInstance.js";

const LoginForm = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/auth/login', {username, password});
            const data = response.data.user;
            onLogin(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed')
        }
    };

    return (
        <form
            className="max-w-sm mx-auto mt-20 p-6 border rounded shadow-lg"
            onSubmit={handleSubmit} >
            <h2 className="text-2xl font-bold mb-4" >Login</h2 >
            {error &&
                <p className="text-red-500" >{error}</p >}
            <div className="mb-4" >
                <label htmlFor="username"
                       className="block mb-1" >Username</label >
                <input
                    type="text"
                    id="username"
                    className="w-full px-4 py-2 border rounded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div >
            <div className="mb-4" >
                <label htmlFor="password"
                       className="block mb-1" >Password</label >
                <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div >
            <button type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded" >Login
            </button >
        </form >
    )
}

export default LoginForm;