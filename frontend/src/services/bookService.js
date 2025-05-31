import { apiService } from './api';

export const bookService = {
  // Get all books
  getAllBooks: async () => {
    try {
      const response = await apiService.get('/books');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's books
  getMyBooks: async () => {
    try {
      const response = await apiService.get('/books/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get book by ID
  getBookById: async (id) => {
    try {
      const response = await apiService.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add new book
  addBook: async (bookData) => {
    try {
      const response = await apiService.post('/books', bookData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update book
  updateBook: async (id, bookData) => {
    try {
      const response = await apiService.put(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete book
  deleteBook: async (id) => {
    try {
      const response = await apiService.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};