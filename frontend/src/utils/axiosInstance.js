import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

console.log('Base URL:', baseURL);

const axiosInstance = axios.create({
    baseURL: `${baseURL}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
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
