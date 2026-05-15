import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, ShieldCheck, Key, Bell, CreditCard, 
  ChevronRight, LogOut, Shield, Smartphone, 
  CheckCircle2, AlertCircle, Copy, RefreshCw,
  Mail, Info, Globe, Lock, Eye, Trash2, HelpCircle, Grid,
  Home, HardDrive, Database, Settings, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE;

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // 2FA Setup State
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('bnx_accessToken', urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem('bnx_accessToken');
    if (!token) {
      window.location.href = 'https://b2auth.com/';
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

  const handleDisable2FA = async () => {
    if (!window.confirm("Are you sure you want to disable 2-Step Verification?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('bnx_accessToken');
      const res = await axios.post(`${API_BASE}/users/2fa/disable`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Two-Factor Authentication disabled successfully.' });
        setUser({ ...user, twoFactorEnabled: false });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to disable 2FA' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="loading-screen">Loading your B2Auth Account...</div>;

  const formatStorage = (bytes) => {
    if (!bytes) return '0 GB';
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(1) + ' GB';
  };

  const storagePercentage = user.storageLimit > 0 ? (user.storageUsed / user.storageLimit) * 100 : 0;

  return (
    <div className="account-app-container">
      {/* Top Navigation */}
      <header className="account-top-nav">
        <div className="top-nav-left">
          <div className="sidebar-brand">
            <div className="brand-logo">B2</div>
            <span className="brand-name">Account</span>
          </div>
        </div>
        <div className="top-nav-right">
          <button className="top-icon-btn"><HelpCircle size={20} /></button>
          <button className="top-icon-btn"><Grid size={20} /></button>
          <div className="user-avatar-mini" title={user.email}>
            {user.firstName?.[0] || 'U'}
          </div>
        </div>
      </header>

      <div className="account-layout-body">
        <nav className="account-sidebar">
          <div className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <Home size={20} />
              <span>Home</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              <span>Personal info</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <Shield size={20} />
              <span>Data & privacy</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <ShieldCheck size={20} />
              <span>Security</span>
            </button>
          </div>

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={() => {
              localStorage.clear();
              window.location.href = 'https://b2auth.com/';
            }}>
              <LogOut size={18} />
              <span>Sign out</span>
            </button>
          </div>
        </nav>

        <main className="account-main">
          <header className="account-header">
            <div className="user-brief">
              <div className="avatar-large">{user.firstName?.[0] || 'U'}</div>
              <div className="header-titles">
                <h1>Welcome, {user.firstName}</h1>
                <p>Manage your info, privacy, and security to make B2Auth work better for you.</p>
              </div>
            </div>
          </header>

          <section className="content-area">
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div 
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="dashboard-grid"
                >
                  <div className="summary-card">
                    <div className="card-body">
                      <div className="card-icon-header"><Shield color="#1a73e8" size={40} /></div>
                      <h3>Privacy & personalization</h3>
                      <p>See the data in your BNX Account and choose what activity is saved to personalize your BNX experience</p>
                    </div>
                    <div className="card-footer-link" onClick={() => setActiveTab('privacy')}>
                      Manage your data & privacy
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="card-body">
                      <div className="card-icon-header"><Smartphone color="#1a73e8" size={40} /></div>
                      <h3>Security recommendations</h3>
                      <p>Recommended actions found in the Security Checkup to help keep your account secure</p>
                    </div>
                    <div className="card-footer-link" onClick={() => setActiveTab('security')}>
                      Protect your account
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="card-body">
                      <div className="card-icon-header"><HardDrive color="#1a73e8" size={40} /></div>
                      <h3>Account storage</h3>
                      <p>Your account storage is shared across BNX services, like BNX Mail and Drive</p>
                      <div className="storage-status">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${storagePercentage}%` }}></div>
                        </div>
                        <span className="storage-label">{formatStorage(user.storageUsed)} of {formatStorage(user.storageLimit)} used</span>
                      </div>
                    </div>
                    <div className="card-footer-link">
                      Manage storage
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="card-body">
                      <div className="card-icon-header"><Info color="#1a73e8" size={40} /></div>
                      <h3>Personal info</h3>
                      <p>See your basic info and update it to help others find you and to make your BNX services more personal</p>
                    </div>
                    <div className="card-footer-link" onClick={() => setActiveTab('profile')}>
                      Manage personal info
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="content-card mb-24">
                    <h2>Basic info</h2>
                    <p className="card-desc">Some info may be visible to other people using BNX services. <a href="#">Learn more</a></p>
                    
                    <div className="info-grid">
                      <div className="info-block">
                        <label>PHOTO</label>
                        <div className="value">
                          <div className="avatar-small">{user.firstName?.[0]}</div>
                        </div>
                      </div>
                      <div className="info-block">
                        <label>NAME</label>
                        <div className="value">{user.firstName} {user.lastName}</div>
                      </div>
                      <div className="info-block">
                        <label>BIRTHDAY</label>
                        <div className="value">{user.dob ? new Date(user.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="content-card mb-24">
                    <h2>Other info and preferences</h2>
                    <p className="card-desc">Options and settings for your BNX services</p>
                    <div className="info-grid">
                      <div className="info-block clickable">
                        <label>LANGUAGE</label>
                        <div className="value-with-action">
                          <span>English (United States)</span>
                          <ChevronRight size={18} color="var(--text-muted)" />
                        </div>
                      </div>
                      <div className="info-block clickable">
                        <label>ACCESSIBILITY</label>
                        <div className="value-with-action">
                          <span>High contrast off</span>
                          <ChevronRight size={18} color="var(--text-muted)" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div 
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="content-card">
                    <h2>Signing in to BNX</h2>
                    <p className="card-desc">Settings and recommendations to help you keep your account secure</p>

                    <div className="security-list">
                      <div className="security-item">
                        <div className="item-info">
                          <div className="item-icon"><Smartphone size={20} /></div>
                          <div>
                            <h3>2-Step Verification</h3>
                            <p>Protect your account with an extra layer of security.</p>
                          </div>
                        </div>
                        <div className="item-action">
                           {user.twoFactorEnabled ? (
                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 <CheckCircle2 size={16} color="#188038" />
                                 <span className="status-badge success">On</span>
                               </div>
                               <button 
                                 className="setup-btn" 
                                 style={{ color: '#d93025', borderColor: '#dadce0' }}
                                 onClick={handleDisable2FA}
                               >
                                 Disable
                               </button>
                             </div>
                           ) : (
                            <button className="setup-btn" onClick={handleInitiate2FA}>Set up</button>
                          )}
                        </div>
                      </div>
                      
                      <div className="security-item clickable">
                        <div className="item-info">
                          <div className="item-icon"><Key size={20} /></div>
                          <div>
                            <h3>Password</h3>
                            <p>Last changed {new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="item-action">
                          <ChevronRight size={20} color="var(--text-muted)" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'privacy' && (
                <motion.div 
                  key="privacy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="content-card"
                >
                  <h2>Data & privacy</h2>
                  <p className="card-desc">Key settings, and data from your use of BNX services</p>

                  <div className="security-list">
                    <div className="security-item clickable">
                      <div className="item-info">
                        <div className="item-icon"><Globe size={20} /></div>
                        <div>
                          <h3>Web & App Activity</h3>
                          <p>Saves your activity on BNX sites and apps.</p>
                        </div>
                      </div>
                      <div className="item-action">
                        <span className="status-badge success">On</span>
                        <ChevronRight size={18} color="var(--text-muted)" />
                      </div>
                    </div>
                    <div className="security-item clickable">
                      <div className="item-info">
                        <div className="item-icon"><Trash2 size={20} /></div>
                        <div>
                          <h3>Delete your account</h3>
                          <p>Permanently delete your B2Auth account and data.</p>
                        </div>
                      </div>
                      <div className="item-action">
                        <ChevronRight size={20} color="var(--text-muted)" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </main>
      </div>
      
      {show2FASetup && (
        <div className="setup-overlay">
          <div className="setup-modal animate-scale-in">
            <h3>Set up BNX Authenticator</h3>
            <p>Scan this QR code with the <b>B2Auth</b> app or any other authenticator app to get verification codes.</p>
            
            <div className="qr-container">
              <QRCodeSVG value={qrCodeUrl} size={160} />
            </div>

            <div className="secret-display">
              <label>Can't scan?</label>
              <div className="secret-code">
                <code>{twoFactorSecret}</code>
              </div>
            </div>

            <div className="verify-step">
              <label>Enter code</label>
              <input 
                type="text" 
                maxLength="6"
                placeholder="6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button 
                className="verify-btn" 
                onClick={handleVerify2FA}
                disabled={verificationCode.length !== 6 || loading}
              >
                {loading ? <RefreshCw className="spin" size={18} /> : 'Verify'}
              </button>
            </div>
            
            <button className="close-link" onClick={() => setShow2FASetup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {message.text && (
        <div className={`toast ${message.type}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;
