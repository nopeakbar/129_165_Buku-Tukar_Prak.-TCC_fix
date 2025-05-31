import React from 'react';
import { Link } from 'react-router-dom';

const ExchangeCard = ({ 
  exchange, 
  type = 'received', // 'received', 'sent', 'history'
  onAccept, 
  onDecline, 
  onMarkComplete 
}) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'declined': return 'status-declined';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isActionable = type === 'received' && exchange.status === 'pending';
  const canComplete = type === 'sent' && exchange.status === 'accepted';

  return (
    <div className="exchange-card">
      <div className="exchange-header">
        <div className="exchange-info">
          <h4>
            {type === 'received' ? 'Exchange Request from' : 'Request to'}{' '}
            <strong>
              {type === 'received' 
                ? exchange.requester?.username 
                : exchange.owner?.username
              }
            </strong>
          </h4>
          <small className="text-muted">
            Requested on {formatDate(exchange.createdAt)}
          </small>
        </div>
        <span className={`exchange-status ${getStatusColor(exchange.status)}`}>
          {exchange.status}
        </span>
      </div>

      <div className="exchange-books">
        {/* Offered Book */}
        <div className="exchange-book">
          <div className="book-info">
            <div className="book-image-small">
              {exchange.offeredBook?.imageUrl ? (
                <img 
                  src={exchange.offeredBook.imageUrl} 
                  alt={exchange.offeredBook.title}
                  className="exchange-book-image"
                />
              ) : (
                <div className="exchange-book-placeholder">📖</div>
              )}
            </div>
            <div className="exchange-book-info">
              <h5>
                <Link to={`/books/${exchange.offeredBook?.id}`}>
                  {exchange.offeredBook?.title}
                </Link>
              </h5>
              <p>by {exchange.offeredBook?.author}</p>
              <span className="book-condition">
                Condition: {exchange.offeredBook?.condition}
              </span>
            </div>
          </div>
          <div className="book-label">
            {type === 'received' ? 'Offered by requester' : 'Your book'}
          </div>
        </div>

        <div className="exchange-arrow">⇄</div>

        {/* Requested Book */}
        <div className="exchange-book">
          <div className="book-info">
            <div className="book-image-small">
              {exchange.requestedBook?.imageUrl ? (
                <img 
                  src={exchange.requestedBook.imageUrl} 
                  alt={exchange.requestedBook.title}
                  className="exchange-book-image"
                />
              ) : (
                <div className="exchange-book-placeholder">📖</div>
              )}
            </div>
            <div className="exchange-book-info">
              <h5>
                <Link to={`/books/${exchange.requestedBook?.id}`}>
                  {exchange.requestedBook?.title}
                </Link>
              </h5>
              <p>by {exchange.requestedBook?.author}</p>
              <span className="book-condition">
                Condition: {exchange.requestedBook?.condition}
              </span>
            </div>
          </div>
          <div className="book-label">
            {type === 'received' ? 'Your book' : 'Requested book'}
          </div>
        </div>
      </div>

      {/* Exchange Details */}
      {(exchange.messages || exchange.location || exchange.meetingDatetime) && (
        <div className="exchange-details">
          {exchange.messages && (
            <div className="exchange-field">
              <strong>Message:</strong>
              <p>{exchange.messages}</p>
            </div>
          )}
          
          {exchange.location && (
            <div className="exchange-field">
              <strong>Preferred Location:</strong>
              <p>{exchange.location}</p>
            </div>
          )}
          
          {exchange.meetingDatetime && (
            <div className="exchange-field">
              <strong>Proposed Meeting Time:</strong>
              <p>{formatDate(exchange.meetingDatetime)}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="exchange-actions">
        {isActionable && (
          <>
            <button 
              onClick={() => onAccept && onAccept(exchange.id)}
              className="btn btn-primary btn-sm"
            >
              Accept Exchange
            </button>
            <button 
              onClick={() => onDecline && onDecline(exchange.id)}
              className="btn btn-danger btn-sm"
            >
              Decline
            </button>
          </>
        )}

        {canComplete && (
          <button 
            onClick={() => onMarkComplete && onMarkComplete(exchange.id)}
            className="btn btn-primary btn-sm"
          >
            Mark as Completed
          </button>
        )}

        {exchange.status === 'accepted' && type === 'received' && (
          <div className="exchange-reminder">
            <p className="text-success">
              ✅ Exchange accepted! Please coordinate with {exchange.requester?.username} to complete the exchange.
            </p>
          </div>
        )}

        {exchange.status === 'declined' && (
          <div className="exchange-reminder">
            <p className="text-danger">
              ❌ Exchange was declined.
            </p>
          </div>
        )}
      </div>

      <div className="exchange-meta">
        <small className="text-muted">
          Exchange ID: {exchange.id} • 
          Last updated: {formatDate(exchange.updatedAt)}
        </small>
      </div>
    </div>
  );
};

export default ExchangeCard;