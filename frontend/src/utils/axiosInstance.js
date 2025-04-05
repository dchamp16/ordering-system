import axios from 'axios';
// import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const baseURL = 'http://localhost:5000'

const axiosInstance = axios.create({
    baseURL: `${baseURL}/api/`,
  });
  
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  export default axiosInstance;