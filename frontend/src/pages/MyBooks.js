import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getMyBooks();
      if (response.status === 'Success') {
        setBooks(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching my books:', error);
      toast.error('Failed to load your books');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      setDeleting(bookId);
      const response = await bookService.deleteBook(bookId);
      
      if (response.status === 'Success') {
        toast.success('Book deleted successfully');
        setBooks(books.filter(book => book.id !== bookId));
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
    } finally {
      setDeleting(null);
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

  if (loading) {
    return <Loading message="Loading your books..." />;
  }

  return (
    <div className="my-books-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>My Books</h1>
            <p>Manage your book collection</p>
          </div>
          <Link to="/add-book" className="btn btn-primary">
            Add New Book
          </Link>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{books.length}</div>
            <div className="stat-label">Total Books</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {books.filter(book => book.condition === 'Excellent').length}
            </div>
            <div className="stat-label">Excellent Condition</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {[...new Set(books.map(book => book.genre))].length}
            </div>
            <div className="stat-label">Different Genres</div>
          </div>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No books yet</h3>
            <p>Start building your library by adding your first book!</p>
            <Link to="/add-book" className="btn btn-primary">
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="books-grid">
            {books.map(book => (
              <div key={book.id} className="book-card">
                {/* Book Image */}
                <div className="book-image">
                  {book.imageUrl ? (
                    <img src={book.imageUrl} alt={book.title} />
                  ) : (
                    <div className="book-placeholder">📖</div>
                  )}
                  <div className={`condition-badge ${getConditionColor(book.condition)}`}>
                    {book.condition}
                  </div>
                </div>

                {/* Book Content */}
                <div className="book-content">
                  <h3 className="book-title">
                    <Link to={`/books/${book.id}`}>
                      {book.title}
                    </Link>
                  </h3>
                  
                  <p className="book-author">by {book.author}</p>
                  
                  <div className="book-genre">
                    <span className="genre-tag">{book.genre}</span>
                  </div>

                  {book.description && (
                    <p className="book-description">
                      {book.description.length > 100 
                        ? `${book.description.substring(0, 100)}...` 
                        : book.description
                      }
                    </p>
                  )}

                  {/* Book Actions */}
                  <div className="book-actions">
                    <Link 
                      to={`/books/${book.id}`} 
                      className="btn btn-outline btn-sm"
                    >
                      View Details
                    </Link>

                    <div className="owner-actions">
                      <Link 
                        to={`/edit-book/${book.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteBook(book.id)}
                        className="btn btn-danger btn-sm"
                        disabled={deleting === book.id}
                      >
                        {deleting === book.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>

                  {/* Book Meta Info */}
                  <div className="book-meta">
                    <small className="text-muted">
                      Added: {new Date(book.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooks;