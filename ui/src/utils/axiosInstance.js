import axios from 'axios';

const PORT = 3000;

console.log(PORT)

const axiosInstance = axios.create({
    baseURL: `http://localhost:${PORT}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;