import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMenu}>
            📚 Book Exchange
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-books" className="nav-link">
                  My Books
                </Link>
                <Link to="/add-book" className="nav-link">
                  Add Book
                </Link>
                <Link to="/exchanges" className="nav-link">
                  Exchanges
                </Link>
              </>
            ) : null}
          </nav>

          {/* User Actions */}
          <div className="user-actions">
            {isAuthenticated ? (
              <div className="user-menu">
                <button 
                  className="user-menu-trigger"
                  onClick={toggleMenu}
                >
                  {user?.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.username}
                      className="user-avatar"
                    />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="user-name">{user?.username}</span>
                  <span className="menu-arrow">▼</span>
                </button>

                {isMenuOpen && (
                  <div className="user-dropdown">
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      👤 Profile
                    </Link>
                    <Link 
                      to="/my-books" 
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      📚 My Books
                    </Link>
                    <Link 
                      to="/exchanges" 
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      🔄 Exchanges
                    </Link>
                    <hr className="dropdown-divider" />
                    <button 
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMenu}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-nav">
            <Link to="/" className="mobile-nav-link" onClick={closeMenu}>
              🏠 Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-books" className="mobile-nav-link" onClick={closeMenu}>
                  📚 My Books
                </Link>
                <Link to="/add-book" className="mobile-nav-link" onClick={closeMenu}>
                  ➕ Add Book
                </Link>
                <Link to="/exchanges" className="mobile-nav-link" onClick={closeMenu}>
                  🔄 Exchanges
                </Link>
                <Link to="/profile" className="mobile-nav-link" onClick={closeMenu}>
                  👤 Profile
                </Link>
                <hr className="mobile-nav-divider" />
                <button 
                  onClick={handleLogout}
                  className="mobile-nav-link logout-item"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-link" onClick={closeMenu}>
                  🔐 Login
                </Link>
                <Link to="/register" className="mobile-nav-link" onClick={closeMenu}>
                  📝 Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </header>
  );
};

export default Header;