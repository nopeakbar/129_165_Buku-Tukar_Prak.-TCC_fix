// API Configuration
export const API_BASE_URL = 'http://localhost:5000/api';

// Book Genres
export const BOOK_GENRES = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Biography',
  'History',
  'Self-Help',
  'Educational',
  'Children',
  'Poetry',
  'Drama',
  'Comedy',
  'Other'
];

// Book Conditions
export const BOOK_CONDITIONS = [
  'Excellent',
  'Good',
  'Fair',
  'Poor'
];

// Exchange Statuses
export const EXCHANGE_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// File Upload Limits
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};