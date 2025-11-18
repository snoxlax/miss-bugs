import axios from 'axios';

// Determine API URL at runtime
function getApiUrl() {
  // If VITE_API_URL is set (build-time), use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // If running on Render (production), backend serves frontend from same origin
  if (window.location.hostname.includes('onrender.com')) {
    // Backend serves the frontend, so use same origin
    return window.location.origin + '/';
  }

  // Default to localhost for local development
  return 'http://localhost:3030/';
}

const client = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  withCredentials: true,
});

export default client;
