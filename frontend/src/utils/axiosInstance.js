import axios from 'axios';

const PORT = 5000;

const axiosInstance = axios.create({
    baseURL: `http://localhost:${PORT}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    // Adding default timeout
    timeout: 10000,
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 403) {
            console.error('Authentication error:', error.response.data);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;