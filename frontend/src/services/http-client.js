import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL;
  }
  return '';
};

const client = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  withCredentials: true,
});

export default client;
