import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BookCard = ({ book, showOwner = false, showActions = false, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user && user.id === book.userId;

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent':
        return 'condition-excellent';
      case 'good':
        return 'condition-good';
      case 'fair':
        return 'condition-fair';
      case 'poor':
        return 'condition-poor';
      default:
        return 'condition-good';
    }
  };

  return (
    <div className="book-card">
      {/* Book Image */}
      <div className="book-image">
        {book.imageUrl ? (
          <img src={book.imageUrl} alt={book.title} />
        ) : (
          <div className="book-placeholder">
            📖
          </div>
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
        {showOwner && book.owner && (
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

          {showActions && isOwner && (
            <div className="owner-actions">
              <button 
                onClick={() => onEdit && onEdit(book)}
                className="btn btn-secondary btn-sm"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete && onDelete(book)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </div>
          )}

          {!isOwner && user && (
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
  );
};

export default BookCard;