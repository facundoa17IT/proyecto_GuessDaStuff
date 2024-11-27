// axiosInstance.js
import axios from 'axios';

// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: 'http://proyectoguessdastuff-production.up.railway.app/api', // API base URL
  headers: {
    'Content-Type': 'application/json', // change according header type accordingly
  },
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.baseURL}${config.url} - Authentication: ${config.requiresAuth}`);
    
    const token = localStorage.getItem('token'); // Get token from local storage or other sources
    
    // Verificar el flag `requiresAuth` en config
    if (config.requiresAuth && token) {  
      config.headers.Authorization = `Bearer ${token}`; // Añadir el token
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
