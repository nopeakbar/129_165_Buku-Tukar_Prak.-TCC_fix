import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    condition: '',
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Educational',
    'Children', 'Poetry', 'Drama', 'Comedy', 'Other'
  ];

  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Test connection function
  const testConnection = async () => {
    try {
      console.log('🧪 Testing backend connection...');
      toast.info('Testing connection...');
      
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend data:', data);
        toast.success('✅ Backend connection successful!');
        console.log(`📊 Found ${data.data?.length || 0} books in database`);
      } else {
        console.error('❌ Response not OK:', response.status, response.statusText);
        toast.error(`❌ Backend error: ${response.status} ${response.statusText}`);
      }
      
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      toast.error(`❌ Connection failed: ${error.message}`);
      
      // More specific error messages
      if (error.message.includes('fetch')) {
        toast.error('🚨 Cannot reach backend. Check if backend is running on port 5000.');
      }
      if (error.message.includes('CORS')) {
        toast.error('🚨 CORS error. Check backend CORS configuration.');
      }
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a book title');
      return false;
    }
    if (!formData.author.trim()) {
      toast.error('Please enter the author name');
      return false;
    }
    if (!formData.genre) {
      toast.error('Please select a genre');
      return false;
    }
    if (!formData.condition) {
      toast.error('Please select the book condition');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      console.log('🔑 Token exists:', !!token);
      
      if (!token) {
        toast.error('Please login to add a book');
        navigate('/login');
        return;
      }

      console.log('📤 Sending book data:', formData);
      console.log('🔑 Using token:', token.substring(0, 20) + '...');

      // Enhanced API call with better error handling
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      // Read response regardless of status
      const data = await response.json();
      console.log('📥 Response data:', data);

      if (response.ok && data.status === 'Success') {
        console.log('✅ Book added successfully!');
        toast.success('Book added successfully!');
        navigate('/my-books');
      } else {
        console.error('❌ API Error:', data);
        
        // Handle specific error cases
        if (response.status === 401) {
          toast.error('Authentication failed. Please login again.');
          localStorage.removeItem('accessToken');
          navigate('/login');
        } else if (response.status === 400) {
          toast.error(data.message || 'Invalid book data. Please check your inputs.');
        } else {
          toast.error(data.message || `Server error: ${response.status}`);
        }
      }
      
    } catch (error) {
      console.error('❌ Network Error:', error);
      
      // More specific error handling
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('🚨 Cannot connect to backend. Make sure server is running on port 5000.');
      } else if (error.message.includes('CORS')) {
        toast.error('🚨 CORS error. Check backend configuration.');
      } else {
        toast.error(`❌ Network error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-books');
  };

  return (
    <div className="add-book-page">
      <div className="container">
        <div className="page-header">
          <h1>Add New Book</h1>
          <p>Share a book with the community</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="book-form">
            <div className="form-section">
              <h3>Book Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter book title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="author">Author *</label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Enter author name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="genre">Genre *</label>
                  <select
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select genre</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="condition">Condition *</label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select condition</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">Image URL (Optional)</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Enter image URL (optional)"
                />
                <small className="form-help">
                  You can add an image URL from the web (e.g., book cover from online stores)
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the book, its condition, or any additional notes..."
                  rows="4"
                />
              </div>
            </div>

            <div className="form-actions">
              {/* Test Connection Button */}
              <button
                type="button"
                onClick={testConnection}
                className="btn btn-secondary"
                style={{marginRight: '10px'}}
              >
                🧪 Test Connection
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Adding Book...' : 'Add Book'}
              </button>
            </div>
          </form>

          {/* Preview */}
          {(formData.title || formData.author) && (
            <div className="book-preview">
              <h3>Preview</h3>
              <div className="preview-card">
                <div className="preview-image">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Book preview" />
                  ) : (
                    <div className="preview-placeholder">📖</div>
                  )}
                  {formData.condition && (
                    <div className={`condition-badge condition-${formData.condition.toLowerCase()}`}>
                      {formData.condition}
                    </div>
                  )}
                </div>
                <div className="preview-content">
                  <h4>{formData.title || 'Book Title'}</h4>
                  <p>by {formData.author || 'Author Name'}</p>
                  {formData.genre && (
                    <span className="genre-tag">{formData.genre}</span>
                  )}
                  {formData.description && (
                    <p className="preview-description">{formData.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBook;