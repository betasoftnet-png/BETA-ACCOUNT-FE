import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, ShieldCheck, Key, Bell, CreditCard, 
  ChevronRight, LogOut, Shield, Smartphone, 
  CheckCircle2, AlertCircle, Copy, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE;

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // 2FA Setup State
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('bnx_accessToken', urlToken);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem('bnx_accessToken');
    if (!token) {
      window.location.href = 'https://b2auth.com/'; // Redirect to auth app
      return;
    }
    fetchProfile(token);
  }, []);

  const fetchProfile = async (token) => {
    try {
      const res = await axios.get(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        window.location.href = 'https://b2auth.com/';
      }
    }
  };

  const handleInitiate2FA = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('bnx_accessToken');
      const res = await axios.post(`${API_BASE}/users/2fa/setup`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setTwoFactorSecret(res.data.data.secret);
        setQrCodeUrl(res.data.data.qrCodeUrl);
        setShow2FASetup(true);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to initiate 2FA' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('bnx_accessToken');
      const res = await axios.post(`${API_BASE}/users/2fa/verify`, {
        code: verificationCode
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Two-Factor Authentication enabled successfully!' });
        setShow2FASetup(false);
        setUser({ ...user, twoFactorEnabled: true });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Invalid verification code. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="loading-screen">Loading your B2Auth Account...</div>;

  return (
    <div className="account-app-container">
      <nav className="account-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">B2</div>
          <span className="brand-name">Account</span>
        </div>
        
        <div className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            <span>Personal Info</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <ShieldCheck size={20} />
            <span>Security</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <Shield size={20} />
            <span>Data & Privacy</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => {
            localStorage.clear();
            window.location.href = 'http://localhost:5173';
          }}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      <main className="account-main">
        <header className="account-header">
          <div className="user-brief">
            <div className="avatar-large">{user.firstName?.[0] || 'U'}</div>
            <div className="header-titles">
              <h1>Welcome, {user.firstName} {user.lastName}</h1>
              <p>Manage your info, privacy, and security to make B2Auth work better for you.</p>
            </div>
          </div>
        </header>

        <section className="content-area">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="content-card"
              >
                <h2>Personal Information</h2>
                <div className="info-grid">
                  <div className="info-block">
                    <label>First Name</label>
                    <div className="value">{user.firstName || 'Not set'}</div>
                  </div>
                  <div className="info-block">
                    <label>Last Name</label>
                    <div className="value">{user.lastName || 'Not set'}</div>
                  </div>
                  <div className="info-block">
                    <label>Username</label>
                    <div className="value">@{user.username}</div>
                  </div>
                  <div className="info-block">
                    <label>Primary Email</label>
                    <div className="value-with-badge">
                      <span>{user.email || 'Not set'}</span>
                      {user.isPrimary && <span className="mini-badge primary">Primary</span>}
                    </div>
                  </div>
                  <div className="info-block">
                    <label>Recovery Email</label>
                    <div className="value">{user.recoveryEmail || 'Not set'}</div>
                  </div>
                  <div className="info-block">
                    <label>Phone Number</label>
                    <div className="value">{user.phoneNumber || 'Not set'}</div>
                  </div>
                  <div className="info-block">
                    <label>Date of Birth</label>
                    <div className="value">{user.dob ? new Date(user.dob).toLocaleDateString() : 'Not set'}</div>
                  </div>
                  <div className="info-block">
                    <label>Account Type</label>
                    <div className="value-badge">{user.accountType}</div>
                  </div>
                  {user.organization && (
                    <div className="info-block">
                      <label>Organization</label>
                      <div className="value">{user.organization.name}</div>
                    </div>
                  )}
                  <div className="info-block">
                    <label>Created On</label>
                    <div className="value">{new Date(user.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="content-card"
              >
                <h2>Security Settings</h2>
                <div className="security-list">
                  <div className="security-item">
                    <div className="item-info">
                      <div className="item-icon"><Smartphone /></div>
                      <div>
                        <h3>Two-Factor Authentication</h3>
                        <p>Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <div className="item-action">
                      {user.twoFactorEnabled ? (
                        <span className="status-badge success">Enabled</span>
                      ) : (
                        <button className="setup-btn" onClick={handleInitiate2FA}>Set Up 2FA</button>
                      )}
                    </div>
                  </div>
                </div>

                {show2FASetup && (
                  <div className="setup-overlay">
                    <div className="setup-modal animate-scale-in">
                      <h3>Configure Authenticator App</h3>
                      <p>Scan the QR code below using your <b>BNX Auth</b> app or any other authenticator.</p>
                      
                      <div className="qr-container">
                        <QRCodeSVG value={qrCodeUrl} size={180} />
                      </div>

                      <div className="secret-display">
                        <label>Can't scan? Use this code:</label>
                        <div className="secret-code">
                          <code>{twoFactorSecret}</code>
                        </div>
                      </div>

                      <div className="verify-step">
                        <label>Enter the 6-digit code from your app:</label>
                        <input 
                          type="text" 
                          maxLength="6"
                          placeholder="000 000"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        <button 
                          className="verify-btn" 
                          onClick={handleVerify2FA}
                          disabled={verificationCode.length !== 6 || loading}
                        >
                          {loading ? <RefreshCw className="spin" /> : 'Verify & Enable'}
                        </button>
                      </div>
                      
                      <button className="close-link" onClick={() => setShow2FASetup(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
      
      {message.text && (
        <div className={`toast ${message.type}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}
    </div>
  );
}

export default App;
