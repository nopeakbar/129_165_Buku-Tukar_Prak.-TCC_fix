import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    whatsappNumber: '',
    addressUser: '',
    avatar: null,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        avatar: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatar: null,
    }));
    setAvatarPreview(null);
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
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
      
      console.log('📝 Attempting registration for:', formData.username);
      
      // Create FormData for file upload (as your backend expects)
      const registrationData = new FormData();
      registrationData.append('username', formData.username);
      registrationData.append('email', formData.email);
      registrationData.append('password', formData.password);
      
      if (formData.whatsappNumber) {
        registrationData.append('whatsappNumber', formData.whatsappNumber);
      }
      
      if (formData.addressUser) {
        registrationData.append('addressUser', formData.addressUser);
      }
      
      // Add avatar file if provided
      if (formData.avatar) {
        registrationData.append('avatar', formData.avatar);
      }

      // REAL API call to your backend
      const response = await fetch('http://https://buku-tukar-559917148272.us-central1.run.app/api/auth/register', {
        method: 'POST',
        body: registrationData // Don't set Content-Type header for FormData
      });

      console.log('📡 Registration response status:', response.status);
      
      const data = await response.json();
      console.log('📥 Registration response data:', data);

      if (response.ok && data.status === 'Success') {
        // Real registration successful
        console.log('✅ Registration successful!');
        login(data.data); // data.data contains { user, accessToken, refreshToken }
        toast.success('Registration successful! Welcome to Book Exchange!');
        navigate('/', { replace: true });
      } else {
        // Handle registration errors
        console.error('❌ Registration failed:', data);
        
        if (response.status === 400) {
          if (data.message.includes('email') || data.message.includes('username')) {
            toast.error('Email or username already exists');
          } else {
            toast.error(data.message || 'Registration failed');
          }
        } else {
          toast.error(data.message || 'Registration failed');
        }
      }
      
    } catch (error) {
      console.error('❌ Registration network error:', error);
      
      if (error.message.includes('fetch')) {
        toast.error('Cannot connect to server. Make sure backend is running on port 5000.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card register-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join our book exchange community</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Avatar Upload */}
            <div className="form-group avatar-upload">
              <label>Profile Picture (Optional)</label>
              <div className="avatar-upload-area">
                {avatarPreview ? (
                  <div className="avatar-preview">
                    <img src={avatarPreview} alt="Avatar preview" />
                    <button
                      type="button"
                      className="remove-avatar"
                      onClick={removeAvatar}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="avatar-placeholder">
                    <input
                      type="file"
                      id="avatar"
                      name="avatar"
                      accept="image/*"
                      onChange={handleFileChange}
                      hidden
                    />
                    <label htmlFor="avatar" className="avatar-upload-btn">
                      📷 Add Photo
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="whatsappNumber">WhatsApp Number (Optional)</label>
              <input
                type="tel"
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="e.g., +62812345678"
                autoComplete="tel"
              />
            </div>

            <div className="form-group">
              <label htmlFor="addressUser">Address (Optional)</label>
              <textarea
                id="addressUser"
                name="addressUser"
                value={formData.addressUser}
                onChange={handleChange}
                placeholder="Enter your address"
                rows="3"
                autoComplete="address-level1"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;