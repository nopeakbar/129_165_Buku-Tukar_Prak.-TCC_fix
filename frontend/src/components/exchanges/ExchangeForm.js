import React, { useState, useEffect } from 'react';
import { bookService } from '../../services/bookService';
import { exchangeService } from '../../services/exchangeService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ExchangeForm = ({ 
  requestedBook, 
  onSubmit, 
  onCancel, 
  isOpen = false 
}) => {
  const [myBooks, setMyBooks] = useState([]);
  const [formData, setFormData] = useState({
    offeredBookId: '',
    messages: '',
    location: '',
    meetingDatetime: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchingBooks, setFetchingBooks] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchMyBooks();
    }
  }, [isOpen]);

  const fetchMyBooks = async () => {
    try {
      setFetchingBooks(true);
      const response = await bookService.getMyBooks();
      if (response.status === 'Success') {
        // Filter out the requested book from my books (can't exchange same book)
        const availableBooks = response.data.filter(
          book => book.id !== requestedBook?.id
        );
        setMyBooks(availableBooks);
      }
    } catch (error) {
      console.error('Error fetching my books:', error);
      toast.error('Failed to load your books');
    } finally {
      setFetchingBooks(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.offeredBookId) {
      toast.error('Please select a book to offer');
      return;
    }

    try {
      setLoading(true);
      
      const exchangeData = {
        offeredBookId: parseInt(formData.offeredBookId),
        requestedBookId: requestedBook.id,
        messages: formData.messages || null,
        location: formData.location || null,
        meetingDatetime: formData.meetingDatetime || null,
      };

      console.log('🔄 Submitting exchange request:', exchangeData);

      const response = await exchangeService.requestExchange(exchangeData);
      
      if (response.status === 'Success') {
        toast.success('Exchange request sent successfully!');
        onSubmit && onSubmit(response.data);
        
        // Reset form
        setFormData({
          offeredBookId: '',
          messages: '',
          location: '',
          meetingDatetime: '',
        });
      }
    } catch (error) {
      console.error('Error submitting exchange request:', error);
      toast.error('Failed to send exchange request');
    } finally {
      setLoading(false);
    }
  };

  const selectedBook = myBooks.find(book => book.id === parseInt(formData.offeredBookId));

  if (!isOpen) return null;

  return (
    <div className="exchange-form-overlay">
      <div className="exchange-form-modal">
        <div className="modal-header">
          <h3>Request Book Exchange</h3>
          <button 
            type="button" 
            className="close-btn"
            onClick={onCancel}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Requested Book Info */}
          <div className="requested-book-info">
            <h4>You want to get:</h4>
            <div className="book-summary">
              {requestedBook?.imageUrl && (
                <img 
                  src={requestedBook.imageUrl} 
                  alt={requestedBook.title}
                  className="book-thumbnail"
                />
              )}
              <div>
                <strong>{requestedBook?.title}</strong>
                <p>by {requestedBook?.author}</p>
                <span className="condition-tag">
                  Condition: {requestedBook?.condition}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="exchange-form">
            {/* Book Selection */}
            <div className="form-group">
              <label htmlFor="offeredBookId">
                Select a book to offer in exchange *
              </label>
              {fetchingBooks ? (
                <div className="loading-books">Loading your books...</div>
              ) : myBooks.length === 0 ? (
                <div className="no-books-message">
                  <p>You don't have any books available for exchange.</p>
                  <p>Please add some books to your collection first.</p>
                </div>
              ) : (
                <select
                  id="offeredBookId"
                  name="offeredBookId"
                  value={formData.offeredBookId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a book...</option>
                  {myBooks.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.title} by {book.author} ({book.condition})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Selected Book Preview */}
            {selectedBook && (
              <div className="selected-book-preview">
                <h5>Your offering:</h5>
                <div className="book-summary">
                  {selectedBook.imageUrl && (
                    <img 
                      src={selectedBook.imageUrl} 
                      alt={selectedBook.title}
                      className="book-thumbnail"
                    />
                  )}
                  <div>
                    <strong>{selectedBook.title}</strong>
                    <p>by {selectedBook.author}</p>
                    <span className="condition-tag">
                      Condition: {selectedBook.condition}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="form-group">
              <label htmlFor="messages">Message (Optional)</label>
              <textarea
                id="messages"
                name="messages"
                value={formData.messages}
                onChange={handleChange}
                placeholder="Add a personal message or additional details..."
                rows="3"
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">Preferred Meeting Location (Optional)</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Central Library, Coffee Shop on Main St"
              />
            </div>

            {/* Meeting Time */}
            <div className="form-group">
              <label htmlFor="meetingDatetime">Preferred Meeting Time (Optional)</label>
              <input
                type="datetime-local"
                id="meetingDatetime"
                name="meetingDatetime"
                value={formData.meetingDatetime}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-outline"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || myBooks.length === 0}
              >
                {loading ? 'Sending Request...' : 'Send Exchange Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExchangeForm;