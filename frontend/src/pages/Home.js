import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      
      // Real API call to get all books
      const response = await fetch('https://buku-tukar-559917148272.us-central1.run.app/api/books', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.status === 'Success') {
        setBooks(data.data || []);
      } else {
        console.error('Failed to load books:', data.message);
        // Don't show error toast on home page, just show empty state
      }
      
    } catch (error) {
      console.error('Error fetching books:', error);
      // Don't show error toast on home page, just show empty state
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

  // Filter books based on search and filters
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !genreFilter || book.genre.toLowerCase() === genreFilter.toLowerCase();
    const matchesCondition = !conditionFilter || book.condition.toLowerCase() === conditionFilter.toLowerCase();
    
    return matchesSearch && matchesGenre && matchesCondition;
  });

  // Get unique genres and conditions for filters
  const genres = [...new Set(books.map(book => book.genre))];
  const conditions = [...new Set(books.map(book => book.condition))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="loading-text">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Selamat Datang di Buku Tukar!</h1>
          <p>Komunitas Pecinta Buku untuk Berbagi Bacaan</p>
          {!isAuthenticated && (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/login" className="btn btn-secondary">Login</Link>
            </div>
          )}
        </div>
      </div>

      <div className="container">
        {books.length > 0 && (
          <div className="search-filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filters">
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>

              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Conditions</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>

              {(searchTerm || genreFilter || conditionFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setGenreFilter('');
                    setConditionFilter('');
                  }}
                  className="btn btn-outline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        <div className="books-section">
          <div className="section-header">
            <h2>Available Books ({filteredBooks.length})</h2>
            {isAuthenticated && (
              <Link to="/add-book" className="btn btn-primary">
                Add Book
              </Link>
            )}
          </div>

          {filteredBooks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>
                {books.length === 0 
                  ? 'No books available yet' 
                  : 'No books found'
                }
              </h3>
              <p>
                {books.length === 0 
                  ? 'Be the first to add a book to the exchange!'
                  : 'Try adjusting your search filters'
                }
              </p>
              {isAuthenticated && (
                <Link to="/add-book" className="btn btn-primary">
                  Add First Book
                </Link>
              )}
            </div>
          ) : (
            <div className="books-grid">
              {filteredBooks.map(book => (
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

                    {/* Owner Info */}
                    {book.owner && (
                      <div className="book-owner">
                        <div className="owner-info">
                          {book.owner.avatar_url ? (
                            <img 
                              src={book.owner.avatar_url} 
                              alt={book.owner.username}
                              className="owner-avatar"
                            />
                          ) : (
                            <div className="owner-avatar-placeholder">
                              {book.owner.username?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="owner-name">{book.owner.username}</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="book-actions">
                      <Link 
                        to={`/books/${book.id}`} 
                        className="btn btn-outline btn-sm"
                      >
                        View Details
                      </Link>

                      {isAuthenticated && user && user.id !== book.userId && (
                        <Link 
                          to={`/books/${book.id}`}
                          state={{ requestExchange: true }}
                          className="btn btn-primary btn-sm"
                        >
                          Request Exchange
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;