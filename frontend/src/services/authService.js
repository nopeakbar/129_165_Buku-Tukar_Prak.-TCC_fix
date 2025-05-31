import { apiService } from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      
      if (userData.whatsappNumber) {
        formData.append('whatsappNumber', userData.whatsappNumber);
      }
      
      if (userData.addressUser) {
        formData.append('addressUser', userData.addressUser);
      }
      
      // Add avatar file if provided
      if (userData.avatar) {
        formData.append('avatar', userData.avatar);
      }

      const response = await apiService.postFormData('/auth/register', formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await apiService.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiService.post('/auth/refresh-token', { refreshToken });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async (refreshToken) => {
    try {
      const response = await apiService.post('/auth/logout', { refreshToken });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};