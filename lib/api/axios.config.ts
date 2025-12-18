import axios from 'axios';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.zatiqeasy.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens or encryption
apiClient.interceptors.request.use(
  (config) => {
    // Add shop token if available
    const shopToken = localStorage.getItem('zatiq_shop_token');
    if (shopToken) {
      config.headers.Authorization = `Bearer ${shopToken}`;
    }

    // Add shop ID if available
    const shopId = localStorage.getItem('zatiq_shop_id');
    if (shopId) {
      config.headers['X-Shop-ID'] = shopId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and decryption
apiClient.interceptors.response.use(
  (response) => {
    // Decrypt response data if encrypted
    if (response.data?.encrypted) {
      // TODO: Implement decryption logic
      // const decryptedData = decryptData(response.data.data);
      // response.data = decryptedData;
    }

    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear tokens and redirect to login
      localStorage.removeItem('zatiq_shop_token');
      localStorage.removeItem('zatiq_shop_id');
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      console.error('Access forbidden:', error.response.data);
    }

    if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default apiClient;