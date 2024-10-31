// axiosInstance.js
import axios from 'axios';

// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // API base URL
  headers: {
    'Content-Type': 'application/json', // change according header type accordingly
  },
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    const token = localStorage.getItem('token'); // Get token from local storage or other sources
    // Check if the request should have the Authorization header
    if (token && !config.url.includes('/auth')) {  // Exclude /auth endpoint
      config.headers.Authorization = `Bearer ${token}`; // Add the token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
