import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import ExchangeForm from '../components/exchanges/ExchangeForm';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExchangeForm, setShowExchangeForm] = useState(false);
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchBookDetails();
    
    // Check if we should auto-open exchange form
    if (location.state?.requestExchange) {
      setShowExchangeForm(true);
    }
  }, [id, location.state]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      console.log('📖 Fetching book details for ID:', id);
      
      const response = await bookService.getBookById(id);
      console.log('📖 Book details response:', response);
      
      if (response.status === 'Success') {
        setBook(response.data);
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      toast.error('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent': return 'condition-excellent';
      case 'good': return 'condition-good';
      case 'fair': return 'condition-fair';
      case 'poor': return 'condition-poor';
      default: return 'condition-good';
    }
  };

  const handleExchangeSuccess = (exchangeData) => {
    console.log('✅ Exchange request submitted:', exchangeData);
    setShowExchangeForm(false);
    toast.success('Exchange request sent successfully!');
  };

  const handleExchangeCancel = () => {
    setShowExchangeForm(false);
  };

  const isOwner = user && book && user.id === book.userId;
  const canRequestExchange = isAuthenticated && !isOwner && book;

  if (loading) {
    return <Loading message="Loading book details..." />;
  }

  if (!book) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Book not found</h3>
          <p>The book you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="book-details-page">
      <div className="container">
        <div className="book-details">
          <div className="book-image-section">
            {book.imageUrl ? (
              <img src={book.imageUrl} alt={book.title} className="book-detail-image" />
            ) : (
              <div className="book-detail-placeholder">📖</div>
            )}
          </div>

          <div className="book-info-section">
            <div className="book-header">
              <h1>{book.title}</h1>
              <p className="book-author">by {book.author}</p>
              
              <div className="book-meta">
                <span className="genre-tag">{book.genre}</span>
                <span className={`condition-badge ${getConditionColor(book.condition)}`}>
                  {book.condition}
                </span>
              </div>
            </div>

            {book.description && (
              <div className="book-description">
                <h3>Description</h3>
                <p>{book.description}</p>
              </div>
            )}

            {book.owner && (
              <div className="book-owner">
                <h3>Owner Information</h3>
                <div className="owner-card">
                  {book.owner.avatarUrl ? (
                    <img src={book.owner.avatarUrl} alt={book.owner.username} className="owner-avatar" />
                  ) : (
                    <div className="owner-avatar-placeholder">
                      {book.owner.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="owner-details">
                    <h4>{book.owner.username}</h4>
                    <p>{book.owner.email}</p>
                    {book.owner.whatsappNumber && (
                      <p>WhatsApp: {book.owner.whatsappNumber}</p>
                    )}
                    {book.owner.addressUser && (
                      <p>Location: {book.owner.addressUser}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Book Meta Information */}
            <div className="book-additional-info">
              <h3>Additional Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Genre:</strong> {book.genre}
                </div>
                <div className="info-item">
                  <strong>Condition:</strong> {book.condition}
                </div>
                <div className="info-item">
                  <strong>Added:</strong> {new Date(book.createdAt).toLocaleDateString()}
                </div>
                {book.updatedAt !== book.createdAt && (
                  <div className="info-item">
                    <strong>Last Updated:</strong> {new Date(book.updatedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <div className="book-actions">
              {isOwner ? (
                <div className="owner-actions">
                  <Link to={`/edit-book/${book.id}`} className="btn btn-secondary">
                    Edit Book
                  </Link>
                  <Link to="/my-books" className="btn btn-outline">
                    My Books
                  </Link>
                </div>
              ) : isAuthenticated ? (
                <div className="exchange-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowExchangeForm(true)}
                  >
                    Request Exchange
                  </button>
                  <Link to="/" className="btn btn-outline">
                    Browse More Books
                  </Link>
                </div>
              ) : (
                <div className="guest-actions">
                  <p>Sign in to request an exchange for this book</p>
                  <Link to="/login" className="btn btn-primary">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-outline">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Books Section */}
        <div className="related-section">
          <h3>More books by {book.author}</h3>
          <p>Explore other books by the same author or similar genres.</p>
          <Link to={`/?author=${encodeURIComponent(book.author)}`} className="btn btn-outline">
            View More by {book.author}
          </Link>
        </div>
      </div>

      {/* Exchange Form Modal */}
      {showExchangeForm && canRequestExchange && (
        <ExchangeForm
          requestedBook={book}
          isOpen={showExchangeForm}
          onSubmit={handleExchangeSuccess}
          onCancel={handleExchangeCancel}
        />
      )}
    </div>
  );
};

export default BookDetails;