import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 35000, // 35 seconds to allow for LLM latency
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred.';
    if (error.response) {
      // Backend returned an error response
      message = error.response.data?.detail || error.response.data?.message || message;
    } else if (error.request) {
      // No response was received (network issue or timeout)
      message = 'Unable to connect to the backend server. Please check if the backend is running.';
    }
    return Promise.reject(new Error(message));
  }
);
