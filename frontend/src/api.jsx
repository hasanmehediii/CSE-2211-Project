import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const getApiBaseUrl = () => {
  if (!configuredApiUrl) {
    return 'http://localhost:8000/api';
  }

  const baseUrl = configuredApiUrl.replace(/\/+$/, '');

  // Accept both forms in deployment settings:
  //   https://server.example.com
  //   https://server.example.com/api
  // Relative /api is used by the Docker nginx proxy.
  return baseUrl === '/api' || baseUrl.endsWith('/api')
    ? baseUrl
    : `${baseUrl}/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

export default api;
