// API utility functions for DevBoma SaaS Platform
import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('devboma_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error - backend may not be running:', error.message);
      // Don't redirect on network errors, let components handle fallback
      return Promise.reject(new Error('Backend server not available. Using demo mode.'));
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('devboma_token');
      localStorage.removeItem('devboma_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Shops API
export const shopsAPI = {
  getShops: async (clientId: string) => {
    const response = await api.get(`/shops/${clientId}`);
    return response.data;
  },
  
  createShop: async (shopData: any) => {
    const response = await api.post('/shops/create', shopData);
    return response.data;
  },
  
  updateShop: async (clientId: string, shopId: string, shopData: any) => {
    const response = await api.put(`/shops/${clientId}/${shopId}`, shopData);
    return response.data;
  }
};

// Products API
export const productsAPI = {
  getProducts: async (clientId: string, shopId?: string) => {
    const params = shopId ? `?shopId=${shopId}` : '';
    const response = await api.get(`/products/${clientId}${params}`);
    return response.data;
  },
  
  createProduct: async (clientId: string, productData: any) => {
    const response = await api.post(`/products/${clientId}`, productData);
    return response.data;
  },
  
  updateProduct: async (clientId: string, productId: string, productData: any) => {
    const response = await api.put(`/products/${clientId}/${productId}`, productData);
    return response.data;
  },
  
  deleteProduct: async (clientId: string, productId: string) => {
    const response = await api.delete(`/products/${clientId}/${productId}`);
    return response.data;
  }
};

// Orders API
export const ordersAPI = {
  getOrders: async (clientId: string, params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    const response = await api.get(`/orders/${clientId}${queryString}`);
    return response.data;
  },
  
  createOrder: async (clientId: string, orderData: any) => {
    const response = await api.post(`/orders/${clientId}`, orderData);
    return response.data;
  },
  
  updateOrderStatus: async (clientId: string, orderId: string, statusData: any) => {
    const response = await api.patch(`/orders/${clientId}/${orderId}/status`, statusData);
    return response.data;
  }
};

// Analytics API
export const analyticsAPI = {
  getDashboardData: async (clientId: string, period = '30') => {
    const response = await api.get(`/analytics/${clientId}/dashboard?period=${period}`);
    return response.data;
  },
  
  getSalesReport: async (clientId: string, startDate: string, endDate: string, format = 'json') => {
    const response = await api.get(`/analytics/${clientId}/sales-report?startDate=${startDate}&endDate=${endDate}&format=${format}`);
    return response.data;
  }
};

// Admin API
export const adminAPI = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  getClients: async (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    const response = await api.get(`/admin/clients${queryString}`);
    return response.data;
  },
  
  createClient: async (clientData: any) => {
    const response = await api.post('/admin/clients', clientData);
    return response.data;
  },
  
  updateClient: async (clientId: string, clientData: any) => {
    const response = await api.put(`/admin/clients/${clientId}`, clientData);
    return response.data;
  }
};

export default api;