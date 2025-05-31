import { apiService } from './api';

export const exchangeService = {
  // Request book exchange
  requestExchange: async (exchangeData) => {
    try {
      const response = await apiService.post('/exchanges', exchangeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get received exchange requests
  getReceivedExchanges: async () => {
    try {
      const response = await apiService.get('/exchanges/received');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get sent exchange requests
  getMySentExchanges: async () => {
    try {
      const response = await apiService.get('/exchanges/sent');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update exchange status (accept/decline)
  updateExchangeStatus: async (id, status) => {
    try {
      const response = await apiService.put(`/exchanges/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add exchange to history (mark as completed)
  addToHistory: async (exchangeRequestId) => {
    try {
      const response = await apiService.post('/exchanges/history', {
        exchangeRequestId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get exchange history
  getExchangeHistory: async () => {
    try {
      const response = await apiService.get('/exchanges/history');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get exchange history by ID
  getExchangeHistoryById: async (id) => {
    try {
      const response = await apiService.get(`/exchanges/history/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};