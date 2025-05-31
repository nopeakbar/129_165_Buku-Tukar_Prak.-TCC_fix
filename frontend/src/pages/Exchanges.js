import React, { useState, useEffect } from 'react';
import { exchangeService } from '../services/exchangeService';
import ExchangeCard from '../components/exchanges/ExchangeCard';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';

const Exchanges = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [receivedExchanges, setReceivedExchanges] = useState([]);
  const [sentExchanges, setSentExchanges] = useState([]);
  const [exchangeHistory, setExchangeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAllExchanges();
  }, []);

  const fetchAllExchanges = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchReceivedExchanges(),
        fetchSentExchanges(),
        fetchExchangeHistory()
      ]);
    } catch (error) {
      console.error('Error fetching exchanges:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReceivedExchanges = async () => {
    try {
      console.log('📥 Fetching received exchanges...');
      const response = await exchangeService.getReceivedExchanges();
      console.log('📥 Received exchanges response:', response);
      
      if (response.status === 'Success') {
        setReceivedExchanges(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching received exchanges:', error);
      toast.error('Failed to load received exchanges');
    }
  };

  const fetchSentExchanges = async () => {
    try {
      console.log('📤 Fetching sent exchanges...');
      const response = await exchangeService.getMySentExchanges();
      console.log('📤 Sent exchanges response:', response);
      
      if (response.status === 'Success') {
        setSentExchanges(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching sent exchanges:', error);
      toast.error('Failed to load sent exchanges');
    }
  };

  const fetchExchangeHistory = async () => {
    try {
      console.log('📚 Fetching exchange history...');
      const response = await exchangeService.getExchangeHistory();
      console.log('📚 Exchange history response:', response);
      
      if (response.status === 'Success') {
        setExchangeHistory(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching exchange history:', error);
      toast.error('Failed to load exchange history');
    }
  };

  const handleAcceptExchange = async (exchangeId) => {
    try {
      setActionLoading(exchangeId);
      console.log('✅ Accepting exchange:', exchangeId);
      
      const response = await exchangeService.updateExchangeStatus(exchangeId, 'accepted');
      
      if (response.status === 'Success') {
        toast.success('Exchange request accepted!');
        // Refresh the exchanges
        await fetchAllExchanges();
      }
    } catch (error) {
      console.error('Error accepting exchange:', error);
      toast.error('Failed to accept exchange');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineExchange = async (exchangeId) => {
    if (!window.confirm('Are you sure you want to decline this exchange request?')) {
      return;
    }

    try {
      setActionLoading(exchangeId);
      console.log('❌ Declining exchange:', exchangeId);
      
      const response = await exchangeService.updateExchangeStatus(exchangeId, 'declined');
      
      if (response.status === 'Success') {
        toast.success('Exchange request declined');
        // Refresh the exchanges
        await fetchAllExchanges();
      }
    } catch (error) {
      console.error('Error declining exchange:', error);
      toast.error('Failed to decline exchange');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkComplete = async (exchangeId) => {
    if (!window.confirm('Mark this exchange as completed? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(exchangeId);
      console.log('✅ Marking exchange as complete:', exchangeId);
      
      const response = await exchangeService.addToHistory(exchangeId);
      
      if (response.status === 'Success') {
        toast.success('Exchange marked as completed!');
        // Refresh all exchanges to update the data
        await fetchAllExchanges();
      }
    } catch (error) {
      console.error('Error marking exchange as complete:', error);
      toast.error('Failed to mark exchange as complete');
    } finally {
      setActionLoading(null);
    }
  };

  const getTabCounts = () => {
    return {
      received: receivedExchanges.length,
      sent: sentExchanges.length,
      history: exchangeHistory.length,
    };
  };

  const counts = getTabCounts();

  if (loading) {
    return <Loading message="Loading exchanges..." />;
  }

  return (
    <div className="exchanges-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>Exchange Requests</h1>
            <p>Manage your book exchange requests</p>
          </div>
        </div>

        {/* Exchange Stats */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{counts.received}</div>
            <div className="stat-label">Received Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{counts.sent}</div>
            <div className="stat-label">Sent Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{counts.history}</div>
            <div className="stat-label">Completed Exchanges</div>
          </div>
        </div>

        <div className="exchange-tabs">
          <button 
            className={`tab ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            📥 Received Requests ({counts.received})
          </button>
          <button 
            className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            📤 Sent Requests ({counts.sent})
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📚 Exchange History ({counts.history})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'received' && (
            <div className="received-exchanges">
              {receivedExchanges.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📥</div>
                  <h3>No received requests</h3>
                  <p>When someone requests to exchange with your books, they'll appear here.</p>
                </div>
              ) : (
                <div className="exchanges-list">
                  {receivedExchanges.map(exchange => (
                    <ExchangeCard
                      key={exchange.id}
                      exchange={exchange}
                      type="received"
                      onAccept={handleAcceptExchange}
                      onDecline={handleDeclineExchange}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sent' && (
            <div className="sent-exchanges">
              {sentExchanges.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📤</div>
                  <h3>No sent requests</h3>
                  <p>Browse books and request exchanges to see your requests here.</p>
                  <a href="/" className="btn btn-primary">Browse Books</a>
                </div>
              ) : (
                <div className="exchanges-list">
                  {sentExchanges.map(exchange => (
                    <ExchangeCard
                      key={exchange.id}
                      exchange={exchange}
                      type="sent"
                      onMarkComplete={handleMarkComplete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="exchange-history">
              {exchangeHistory.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📚</div>
                  <h3>No exchange history</h3>
                  <p>Your completed exchanges will appear here.</p>
                </div>
              ) : (
                <div className="exchanges-list">
                  {exchangeHistory.map(historyItem => (
                    <div key={historyItem.id} className="history-item">
                      <div className="history-header">
                        <h4>Completed Exchange</h4>
                        <span className="completion-date">
                          Completed: {new Date(historyItem.completed_at).toLocaleDateString()}
                        </span>
                      </div>
                      {historyItem.exchange && (
                        <ExchangeCard
                          exchange={historyItem.exchange}
                          type="history"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Loading Overlay */}
        {actionLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Processing request...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exchanges;