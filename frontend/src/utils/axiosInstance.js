import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: `http://localhost:5000/api`,
    withCredentials: true,
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
