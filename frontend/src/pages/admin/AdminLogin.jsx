import { useState } from "react";
import { LogIn, HelpCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import HelpModal from "../../components/HelpModal";

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 text-blue-600">
            <LogIn className="h-full w-full" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => setShowHelp(true)}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              Just here to look around?
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
      {showHelp && (
        <HelpModal title="Demo Access" onClose={() => setShowHelp(false)}>
          <p>This is a live demo of the admin panel's authentication system.</p>
          <p>
            Want to explore without an account? Log in with the read-only viewer
            account below you can browse every section, but nothing can be
            added, edited, or deleted:
          </p>
          <div className="p-3 bg-gray-100 rounded font-mono text-xs">
            Username: johnDoe
            <br />
            Password: johndoe123
          </div>
        </HelpModal>
      )}
    </div>
  );
};

export default AdminLogin;
