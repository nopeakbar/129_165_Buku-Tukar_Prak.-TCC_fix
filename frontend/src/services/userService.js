import { apiService } from './api';

export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await apiService.get('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await apiService.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await apiService.get('/users/profile/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      console.log('🔄 Updating profile with data:', userData);
      
      const formData = new FormData();
      
      // Add text fields if provided
      if (userData.username) formData.append('username', userData.username);
      if (userData.email) formData.append('email', userData.email);
      if (userData.whatsappNumber) formData.append('whatsappNumber', userData.whatsappNumber);
      if (userData.addressUser) formData.append('addressUser', userData.addressUser);
      
      // Add avatar file if provided
      if (userData.avatar) {
        formData.append('avatar', userData.avatar);
        console.log('📎 Avatar file attached');
      }

      // Debug: Log FormData contents
      for (let pair of formData.entries()) {
        console.log('📋 FormData:', pair[0], pair[1]);
      }

      const response = await apiService.putFormData('/users/profile', formData);
      console.log('✅ Profile update response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Profile update error:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      console.log('🔐 Changing password...');
      
      const response = await apiService.put('/users/profile/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      console.log('✅ Password change response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Password change error:', error);
      throw error;
    }
  },

  // Upload avatar only
  uploadAvatar: async (avatarFile) => {
    try {
      console.log('📷 Uploading avatar...', avatarFile);
      
      if (!avatarFile) {
        throw new Error('No avatar file provided');
      }

      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await apiService.postFormData('/users/profile/upload-avatar', formData);
      console.log('✅ Avatar upload response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Avatar upload error:', error);
      throw error;
    }
  },

  // Create user (admin)
  createUser: async (userData) => {
    try {
      const formData = new FormData();
      
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      
      if (userData.whatsappNumber) {
        formData.append('whatsappNumber', userData.whatsappNumber);
      }
      
      if (userData.addressUser) {
        formData.append('addressUser', userData.addressUser);
      }
      
      if (userData.avatar) {
        formData.append('avatar', userData.avatar);
      }

      const response = await apiService.postFormData('/users', formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user (admin)
  updateUser: async (id, userData) => {
    try {
      const formData = new FormData();
      
      if (userData.username) formData.append('username', userData.username);
      if (userData.email) formData.append('email', userData.email);
      if (userData.password) formData.append('password', userData.password);
      if (userData.whatsappNumber) formData.append('whatsappNumber', userData.whatsappNumber);
      if (userData.addressUser) formData.append('addressUser', userData.addressUser);
      
      if (userData.avatar) {
        formData.append('avatar', userData.avatar);
      }

      const response = await apiService.putFormData(`/users/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user (admin)
  deleteUser: async (id) => {
    try {
      const response = await apiService.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};