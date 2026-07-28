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
  const [mailboxes, setMailboxes] = useState([]);

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
        fetchEmails(token);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
      if (err.response?.status === 401) {
        window.location.href = 'https://b2auth.com/';
      }
    }
  };
  const fetchEmails = async (token) => {
    try {
      const res = await axios.get(`${API_BASE}/emails/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMailboxes(res.data.data.emails);
      }
    } catch (err) {
      console.error("Failed to fetch emails", err);
    }
  };

  const handleMakePrimary = async (emailId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('bnx_accessToken');
      // Using the verification flow to securely update primary email
      const res = await axios.post(
        `${API_BASE}/verification/initiate/${emailId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        window.location.href = res.data.data.redirectUrl;
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to initiate primary email update' });
    } finally {
      setLoading(false);
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

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('bnx_accessToken');
      const res = await axios.post(`${API_BASE}/users/2fa/enable`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Two-Factor Authentication enabled successfully!' });
        setUser({ ...user, twoFactorEnabled: true });
      }
    } catch (err) {
      // If simple enable fails (no secret), then initiate full setup
      handleInitiate2FA();
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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    try {
      const token = localStorage.getItem('bnx_accessToken');
      const res = await axios.post(`${API_BASE}/users/profile-picture`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
        setUser({ ...user, profilePicture: res.data.data.profilePicture });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload photo' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('bnx_accessToken');
      const res = await axios.delete(`${API_BASE}/users/profile-picture`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Profile picture removed.' });
        setUser({ ...user, profilePicture: null });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to remove photo' });
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
          <div className="user-avatar-mini" title={user.email} style={{ overflow: 'hidden' }}>
            <img 
              src={`${API_BASE}/users/profile-picture/${user.username}?t=${user.profilePicture || ''}`} 
              alt={user.firstName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
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
              className={`nav-item ${activeTab === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveTab('billing')}
            >
              <CreditCard size={20} />
              <span>Payment & subscription</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'storage' ? 'active' : ''}`}
              onClick={() => setActiveTab('storage')}
            >
              <HardDrive size={20} />
              <span>Account storage</span>
            </button>
            <button 
              className="nav-item"
              onClick={() => window.location.href = 'https://b2auth.com/'}
            >
              <ShieldCheck size={20} />
              <span>B2Auth</span>
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
              <div className="avatar-large" style={{ overflow: 'hidden' }}>
                <img 
                  src={`${API_BASE}/users/profile-picture/${user.username}?t=${user.profilePicture || ''}`} 
                  alt={user.firstName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
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
                      <div className="card-icon-header"><Mail color="#1a73e8" size={40} /></div>
                      <h3>Emails & Identities</h3>
                      <p>Manage your primary and secondary email addresses associated with this account</p>
                      <div className="primary-email-preview">
                        <CheckCircle2 size={16} color="#188038" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <div className="card-footer-link" onClick={() => setActiveTab('emails')}>
                      Manage your emails
                    </div>
                  </div>

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
                      <div className="card-icon-header"><ShieldCheck color="#1a73e8" size={40} /></div>
                      <h3>Account & Security</h3>
                      <p>Security checkup and recommendations for your {user.accountType} account.</p>
                      <div className="account-tag-elite">
                        <Globe size={14} />
                        <span>{user.accountType} Account</span>
                      </div>
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
                    <div className="card-footer-link" onClick={() => setActiveTab('storage')}>
                      Manage storage
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'emails' && (
                <motion.div 
                  key="emails"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="content-card">
                    <h2>Your Email Identities</h2>
                    <p className="card-desc">Your primary email is used for account-related notifications and as your default identity.</p>
                    
                    <div className="email-list-elite">
                      {mailboxes.map((mailbox) => (
                        <div className={`email-item-elite ${mailbox.isPrimary ? 'primary' : ''}`} key={mailbox.emailId}>
                          <div className="email-info-group">
                            <div className="email-icon-box">
                              <Mail size={20} />
                            </div>
                            <div className="email-text">
                              <h3>{mailbox.email}</h3>
                              <p>{mailbox.isPrimary ? 'Primary email' : 'Secondary email'}</p>
                            </div>
                          </div>
                          <div className="email-actions">
                            {mailbox.isPrimary ? (
                              <span className="badge-primary">Primary</span>
                            ) : (
                              <button 
                                className="make-primary-btn"
                                onClick={() => handleMakePrimary(mailbox.emailId)}
                                disabled={loading}
                              >
                                {loading ? 'Processing...' : 'Make Primary'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="info-box-light" style={{ marginTop: '24px' }}>
                      <Info size={18} />
                      <p>To add a new email address, you must register it through the BNX Mail application.</p>
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
                        <div className="value" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div className="avatar-small" style={{ overflow: 'hidden' }}>
                            <img 
                              src={`${API_BASE}/users/profile-picture/${user.username}?t=${user.profilePicture || ''}`} 
                              alt={user.firstName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div>
                            <input 
                              type="file" 
                              id="avatar-upload" 
                              accept="image/*" 
                              style={{ display: 'none' }} 
                              onChange={handleAvatarUpload}
                            />
                            <label htmlFor="avatar-upload" className="setup-btn" style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '13px' }}>
                              Change photo
                            </label>
                            {user.profilePicture && (
                              <button 
                                onClick={handleAvatarDelete}
                                className="setup-btn" 
                                style={{ marginLeft: '8px', color: '#d93025', borderColor: '#dadce0', padding: '6px 12px', fontSize: '13px' }}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="info-block">
                        <label>FULL NAME</label>
                        <div className="value">{user.fullName || (user.firstName + ' ' + user.lastName)}</div>
                      </div>
                      <div className="info-block">
                        <label>USERNAME</label>
                        <div className="value">{user.username}</div>
                      </div>
                      <div className="info-block">
                        <label>ACCOUNT ID</label>
                        <div className="value">#{user.id}</div>
                      </div>
                      <div className="info-block">
                        <label>BIRTHDAY</label>
                        <div className="value">{user.dob ? new Date(user.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}</div>
                      </div>
                      <div className="info-block">
                        <label>ACCOUNT TYPE</label>
                        <div className="value">
                          <span className="type-badge-elite">{user.accountType}</span>
                        </div>
                      </div>
                      <div className="info-block">
                        <label>JOINED ON</label>
                        <div className="value">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="content-card mb-24">
                    <h2>Contact info</h2>
                    <p className="card-desc">Your contact information used for communication and recovery.</p>
                    <div className="info-grid">
                      <div className="info-block">
                        <label>PRIMARY EMAIL</label>
                        <div className="value-with-badge">
                          <span>{user.email}</span>
                          {user.isPrimary && <span className="mini-badge primary">Primary</span>}
                        </div>
                      </div>
                      <div className="info-block">
                        <label>RECOVERY EMAIL</label>
                        <div className="value">{user.recoveryEmail || 'None added'}</div>
                      </div>
                      <div className="info-block">
                        <label>PHONE NUMBER</label>
                        <div className="value">{user.phoneNumber || 'None added'}</div>
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
                            <button className="setup-btn" onClick={handleEnable2FA}>Set up</button>
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

              {activeTab === 'billing' && (
                <motion.div 
                  key="billing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="content-card mb-24">
                    <h2>Payment & subscription</h2>
                    <p className="card-desc">Manage your payment methods, billing address, and subscription settings.</p>
                    
                    <div className="billing-grid">
                      <div className="info-block">
                        <label>CURRENT PLAN</label>
                        <div className="value" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span className="type-badge-elite">{user.accountType || 'Free'} Account</span>
                          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            {user.accountType === 'Elite' ? '$9.99 / month' : 'Free access'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="info-block">
                        <label>PAYMENT METHOD</label>
                        <div className="value">
                          <div className="payment-card-visual">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div className="payment-card-chip"></div>
                              <span className="payment-card-logo">Visa</span>
                            </div>
                            <div className="payment-card-number">•••• •••• •••• 8842</div>
                            <div className="payment-card-footer">
                              <div>
                                <div style={{ fontSize: '9px', opacity: 0.8 }}>CARDHOLDER</div>
                                <div className="payment-card-holder">{user.firstName} {user.lastName}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '9px', opacity: 0.8 }}>EXPIRES</div>
                                <div className="payment-card-expiry">12/29</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="content-card">
                    <h2>Billing History</h2>
                    <p className="card-desc">View and download invoices for your past transactions.</p>
                    
                    <div className="billing-table-wrapper">
                      <table className="billing-table">
                        <thead>
                          <tr>
                            <th>DATE</th>
                            <th>DESCRIPTION</th>
                            <th>AMOUNT</th>
                            <th>STATUS</th>
                            <th>INVOICE</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>July 28, 2026</td>
                            <td>BNX Account Storage Plan - 50GB</td>
                            <td>$1.99</td>
                            <td><span className="badge-status-paid">Paid</span></td>
                            <td><span className="download-link">Download PDF</span></td>
                          </tr>
                          <tr>
                            <td>June 28, 2026</td>
                            <td>BNX Account Storage Plan - 50GB</td>
                            <td>$1.99</td>
                            <td><span className="badge-status-paid">Paid</span></td>
                            <td><span className="download-link">Download PDF</span></td>
                          </tr>
                          <tr>
                            <td>May 28, 2026</td>
                            <td>BNX Account Storage Plan - 50GB</td>
                            <td>$1.99</td>
                            <td><span className="badge-status-paid">Paid</span></td>
                            <td><span className="download-link">Download PDF</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'storage' && (
                <motion.div 
                  key="storage"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="content-card mb-24">
                    <h2>Account storage</h2>
                    <p className="card-desc">Your account storage is shared across BNX services like BNX Mail and Drive.</p>
                    
                    <div className="storage-detail-grid">
                      <div>
                        <div className="storage-status" style={{ marginTop: 0 }}>
                          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px' }}>Usage details</h3>
                          <div className="progress-bar" style={{ height: '12px', borderRadius: '6px' }}>
                            <div className="progress-fill" style={{ width: `${storagePercentage}%`, background: 'var(--primary)' }}></div>
                          </div>
                          <span className="storage-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                            {formatStorage(user.storageUsed)} of {formatStorage(user.storageLimit)} used ({storagePercentage.toFixed(1)}%)
                          </span>
                        </div>

                        <div className="storage-breakdown-list">
                          <div className="storage-breakdown-item">
                            <div className="storage-color-dot mail"></div>
                            <span className="storage-item-name">BNX Mail</span>
                            <span className="storage-item-val">{formatStorage(user.storageUsed * 0.4)}</span>
                          </div>
                          <div className="storage-breakdown-item">
                            <div className="storage-color-dot drive"></div>
                            <span className="storage-item-name">BNX Drive</span>
                            <span className="storage-item-val">{formatStorage(user.storageUsed * 0.5)}</span>
                          </div>
                          <div className="storage-breakdown-item">
                            <div className="storage-color-dot system"></div>
                            <span className="storage-item-name">System & Backups</span>
                            <span className="storage-item-val">{formatStorage(user.storageUsed * 0.1)}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
                        <HardDrive size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Need more space?</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '16px' }}>
                          Upgrade your storage plan to get more space for your emails, files, and backups.
                        </p>
                        <button className="setup-btn" onClick={() => alert('Storage upgrade flow coming soon!')}>Get more storage</button>
                      </div>
                    </div>
                  </div>

                  <div className="content-card">
                    <h2>Upgrade Storage Plans</h2>
                    <p className="card-desc">Choose a plan that fits your storage and feature requirements.</p>
                    
                    <div className="upgrade-plans-grid">
                      <div className="plan-card">
                        <div className="plan-title">Basic Storage</div>
                        <div className="plan-price">$1.99<span>/mo</span></div>
                        <ul className="plan-features">
                          <li>50 GB total storage</li>
                          <li>Standard support</li>
                          <li>Ad-free Mail</li>
                        </ul>
                        <button className="plan-btn">Choose plan</button>
                      </div>
                      
                      <div className="plan-card featured">
                        <div className="plan-title">Standard</div>
                        <div className="plan-price">$2.99<span>/mo</span></div>
                        <ul className="plan-features">
                          <li>200 GB total storage</li>
                          <li>Priority support</li>
                          <li>Ad-free Mail & Drive</li>
                          <li>Advanced security tools</li>
                        </ul>
                        <button className="plan-btn">Upgrade</button>
                      </div>
                      
                      <div className="plan-card">
                        <div className="plan-title">Premium</div>
                        <div className="plan-price">$9.99<span>/mo</span></div>
                        <ul className="plan-features">
                          <li>2 TB total storage</li>
                          <li>24/7 Phone & Email support</li>
                          <li>Full Suite premium access</li>
                          <li>Custom domain support</li>
                        </ul>
                        <button className="plan-btn">Choose plan</button>
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
