import axios from 'axios';

// Since frontend is served from backend/public, use relative paths
// This works on both localhost and Render without rebuild
const getBaseURL = () => {
  // If VITE_API_URL is set, use it (for custom backend URL)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // For same-origin (backend serves frontend), use relative path
  // Empty string means same origin - works on localhost and Render
  return 'http://localhost:3030';
};

const client = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  withCredentials: true,
});

export default client;
