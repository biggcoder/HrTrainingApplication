import axios from 'axios';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// We can add an interceptor here later to automatically attach the auth token
// to every request.

export default axiosInstance;