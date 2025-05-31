import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { toast } from 'react-toastify';
import Loading from '../components/common/Loading';

const EditBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    condition: '',
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Educational',
    'Children', 'Poetry', 'Drama', 'Comedy', 'Other'
  ];

  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBookById(id);
      const book = response.data;
      
      setFormData({
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        condition: book.condition || '',
        description: book.description || '',
        imageUrl: book.imageUrl || '',
      });
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book details');
      navigate('/my-books');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
      setSaving(true);
      const response = await bookService.updateBook(id, formData);
      
      if (response.status === 'Success') {
        toast.success('Book updated successfully!');
        navigate('/my-books');
      }
    } catch (error) {
      console.error('Error updating book:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-books');
  };

  if (loading) {
    return <Loading message="Loading book details..." />;
  }

  return (
    <div className="edit-book-page">
      <div className="container">
        <div className="page-header">
          <h1>Edit Book</h1>
          <p>Update your book information</p>
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
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Updating...' : 'Update Book'}
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

export default EditBook;