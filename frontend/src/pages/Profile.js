import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { bookService } from '../services/bookService';
import { exchangeService } from '../services/exchangeService';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    exchangesReceived: 0,
    exchangesSent: 0,
    completedExchanges: 0
  });
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    whatsappNumber: user?.whatsappNumber || '',
    addressUser: user?.addressUser || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    fetchUserStats();
    
    // Update form data when user changes
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        whatsappNumber: user.whatsappNumber || '',
        addressUser: user.addressUser || '',
      });
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Fetch user statistics
      const [booksRes, receivedRes, sentRes, historyRes] = await Promise.all([
        bookService.getMyBooks(),
        exchangeService.getReceivedExchanges(),
        exchangeService.getMySentExchanges(),
        exchangeService.getExchangeHistory()
      ]);

      setStats({
        totalBooks: booksRes.data?.length || 0,
        exchangesReceived: receivedRes.data?.length || 0,
        exchangesSent: sentRes.data?.length || 0,
        completedExchanges: historyRes.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
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

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileData.username.trim() || !profileData.email.trim()) {
      toast.error('Username and email are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      const updateData = { ...profileData };
      
      // Add avatar file if selected
      if (avatarFile) {
        updateData.avatar = avatarFile;
      }

      const response = await userService.updateProfile(updateData);
      
      if (response.status === 'Success') {
        // Update auth context
        updateUser(response.data);
        toast.success('Profile updated successfully!');
        
        // Clear avatar selection
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      
      const response = await userService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.status === 'Success') {
        toast.success('Password changed successfully!');
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response?.status === 400) {
        toast.error('Current password is incorrect');
      } else {
        toast.error('Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error('Please select an image first');
      return;
    }

    try {
      setUploadingAvatar(true);
      
      const response = await userService.uploadAvatar(avatarFile);
      
      if (response.status === 'Success') {
        // Update user in auth context
        updateUser({ avatarUrl: response.data.avatarUrl });
        toast.success('Avatar uploaded successfully!');
        
        // Clear selection
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (!user) {
    return <Loading message="Loading profile..." />;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>My Profile</h1>
            <p>Manage your account settings</p>
          </div>
        </div>

        {/* Profile Statistics */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{stats.totalBooks}</div>
            <div className="stat-label">Books Shared</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.exchangesReceived}</div>
            <div className="stat-label">Requests Received</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.exchangesSent}</div>
            <div className="stat-label">Requests Sent</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.completedExchanges}</div>
            <div className="stat-label">Completed Exchanges</div>
          </div>
        </div>

        <div className="profile-container">
          <div className="profile-sidebar">
            {/* Avatar Section */}
            <div className="profile-avatar">
              {avatarPreview ? (
                <div className="avatar-preview">
                  <img src={avatarPreview} alt="New avatar" />
                  <button
                    type="button"
                    className="remove-avatar"
                    onClick={removeAvatar}
                  >
                    ✕
                  </button>
                </div>
              ) : user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="avatar-upload-section">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="avatar-upload" className="btn btn-outline btn-sm">
                  📷 Change Photo
                </label>
                
                {avatarFile && (
                  <button
                    onClick={handleAvatarUpload}
                    className="btn btn-primary btn-sm"
                    disabled={uploadingAvatar}
                  >
                    {uploadingAvatar ? 'Uploading...' : 'Save Photo'}
                  </button>
                )}
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="profile-tabs">
              <button 
                className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                👤 Profile Information
              </button>
              <button 
                className={`tab ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                🔐 Change Password
              </button>
              <button 
                className={`tab ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                ⚙️ Account Settings
              </button>
            </div>
          </div>

          <div className="profile-content">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <h3>Profile Information</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="username">Username *</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="whatsappNumber">WhatsApp Number</label>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={profileData.whatsappNumber}
                    onChange={handleProfileChange}
                    placeholder="e.g., +62812345678"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="addressUser">Address</label>
                  <textarea
                    id="addressUser"
                    name="addressUser"
                    value={profileData.addressUser}
                    onChange={handleProfileChange}
                    placeholder="Enter your address"
                    rows="3"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="profile-form">
                <h3>Change Password</h3>
                
                <div className="form-group">
                  <label htmlFor="oldPassword">Current Password *</label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password *</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                  />
                  <small className="form-help">Minimum 6 characters</small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            )}

            {activeTab === 'account' && (
              <div className="account-settings">
                <h3>Account Settings</h3>
                
                <div className="settings-section">
                  <h4>Account Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <strong>User ID:</strong>
                      <span>{user.id}</span>
                    </div>
                    <div className="info-item">
                      <strong>Member Since:</strong>
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <strong>Last Updated:</strong>
                      <span>{new Date(user.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Account Actions</h4>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-outline"
                      onClick={() => window.location.href = '/my-books'}
                    >
                      📚 View My Books
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={() => window.location.href = '/exchanges'}
                    >
                      🔄 View Exchanges
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={() => window.location.href = '/add-book'}
                    >
                      ➕ Add New Book
                    </button>
                  </div>
                </div>

                <div className="settings-section danger-zone">
                  <h4>Danger Zone</h4>
                  <p>Once you delete your account, there is no going back. Please be certain.</p>
                  <button 
                    className="btn btn-danger"
                    onClick={() => toast.info('Account deletion feature coming soon')}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;