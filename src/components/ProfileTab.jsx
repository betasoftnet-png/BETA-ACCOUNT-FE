import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

function ProfileTab({ user, setUser, loading, setLoading, setMessage, API_BASE }) {
  const [editModal, setEditModal] = useState({ show: false, section: '' });
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    displayName: '',
    dob: '',
    gender: '',
    recoveryEmail: '',
    phoneNumber: '',
    homeAddress: '',
    workAddress: '',
    occupation: '',
    bio: ''
  });

  const openEditModal = (section) => {
    setProfileForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      nickname: user.nickname || '',
      displayName: user.displayName || '',
      dob: user.dob || '',
      gender: user.gender || '',
      recoveryEmail: user.recoveryEmail || '',
      phoneNumber: user.phoneNumber || '',
      homeAddress: user.homeAddress || '',
      workAddress: user.workAddress || '',
      occupation: user.occupation || '',
      bio: user.bio || ''
    });
    setEditModal({ show: true, section });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('bnx_accessToken');
      const res = await axios.patch(`${API_BASE}/users/profile`, profileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setUser({ ...user, ...res.data.data });
        setEditModal({ show: false, section: '' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
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

  return (
    <>
      <motion.div 
        key="profile"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        <div className="content-card mb-24">
          <h2>Basic info</h2>
          <p className="card-desc">Some info may be visible to other people using BNX services. Click any row to update.</p>
          
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
            
            <div className="info-block clickable" onClick={() => openEditModal('basic')}>
              <label>NAME</label>
              <div className="value-with-action">
                <span>{user.firstName} {user.lastName}</span>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('basic')}>
              <label>NICKNAME</label>
              <div className="value-with-action">
                <span>{user.nickname || 'Not set'}</span>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('basic')}>
              <label>DISPLAY NAME</label>
              <div className="value-with-action">
                <span>{user.displayName || 'Not set'}</span>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('basic')}>
              <label>BIRTHDAY</label>
              <div className="value-with-action">
                <span>{user.dob ? new Date(user.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}</span>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('basic')}>
              <label>GENDER</label>
              <div className="value-with-action">
                <span>{user.gender || 'Rather not say'}</span>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
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
          <p className="card-desc">Your contact information used for communication and recovery. Click to edit.</p>
          <div className="info-grid">
            <div className="info-block">
              <label>PRIMARY EMAIL</label>
              <div className="value-with-badge">
                <span>{user.email}</span>
                {user.isPrimary && <span className="mini-badge primary">Primary</span>}
              </div>
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('contact')}>
              <label>RECOVERY EMAIL</label>
              <div className="value-with-action">
                <span>{user.recoveryEmail || 'None added'}</span>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('contact')}>
              <label>PHONE NUMBER</label>
              <div className="value-with-action">
                <span>{user.phoneNumber || 'None added'}</span>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </div>
          </div>
        </div>

        <div className="content-card mb-24">
          <h2>Addresses</h2>
          <p className="card-desc">Your physical addresses for billing and shipping. Click to edit.</p>
          <div className="info-grid">
            <div className="info-block clickable" onClick={() => openEditModal('addresses')}>
              <label>HOME ADDRESS</label>
              <div className="value-with-action">
                <span style={{ whiteSpace: 'pre-wrap' }}>{user.homeAddress || 'None added'}</span>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('addresses')}>
              <label>WORK ADDRESS</label>
              <div className="value-with-action">
                <span style={{ whiteSpace: 'pre-wrap' }}>{user.workAddress || 'None added'}</span>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </div>
          </div>
        </div>

        <div className="content-card mb-24">
          <h2>About me</h2>
          <p className="card-desc">Your profile description and occupation. Click to edit.</p>
          <div className="info-grid">
            <div className="info-block clickable" onClick={() => openEditModal('about')}>
              <label>OCCUPATION</label>
              <div className="value-with-action">
                <span>{user.occupation || 'None added'}</span>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('about')}>
              <label>BIO</label>
              <div className="value-with-action">
                <span style={{ whiteSpace: 'pre-wrap' }}>{user.bio || 'Write a brief description about yourself'}</span>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {editModal.show && (
        <div className="setup-overlay">
          <div className="setup-modal animate-scale-in" style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '8px' }}>
              Edit {editModal.section === 'basic' ? 'Basic Info' : 
                    editModal.section === 'contact' ? 'Contact Info' : 
                    editModal.section === 'addresses' ? 'Addresses' : 'About Me'}
            </h3>
            <p className="card-desc" style={{ marginBottom: '16px' }}>Update your personal details below.</p>
            
            <form onSubmit={handleSaveProfile}>
              {editModal.section === 'basic' && (
                <>
                  <div className="verify-step" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>First Name</label>
                    <input 
                      type="text" 
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      style={{ padding: '8px', margin: '4px 0 12px 0' }}
                      required
                    />
                  </div>
                  <div className="verify-step" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Last Name</label>
                    <input 
                      type="text" 
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      style={{ padding: '8px', margin: '4px 0 12px 0' }}
                      required
                    />
                  </div>
                  <div className="verify-step" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Nickname</label>
                    <input 
                      type="text" 
                      value={profileForm.nickname}
                      onChange={(e) => setProfileForm({ ...profileForm, nickname: e.target.value })}
                      style={{ padding: '8px', margin: '4px 0 12px 0' }}
                    />
                  </div>
                  <div className="verify-step" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Display Name</label>
                    <input 
                      type="text" 
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                      style={{ padding: '8px', margin: '4px 0 12px 0' }}
                    />
                  </div>
                  <div className="verify-step" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Birthday (YYYY-MM-DD)</label>
                    <input 
                      type="date" 
                      value={profileForm.dob}
                      onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                      style={{ padding: '8px', margin: '4px 0 12px 0' }}
                    />
                  </div>
                  <div className="verify-step" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Gender</label>
                    <select 
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '14px', margin: '4px 0 12px 0', outline: 'none' }}
                    >
                      <option value="">Rather not say</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                </>
              )}

              {editModal.section === 'contact' && (
                <>
                  <div className="verify-step" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Recovery Email</label>
                    <input 
                      type="email" 
                      value={profileForm.recoveryEmail}
                      onChange={(e) => setProfileForm({ ...profileForm, recoveryEmail: e.target.value })}
                      style={{ padding: '8px', margin: '4px 0 12px 0' }}
                    />
                  </div>
                  <div className="verify-step" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Phone Number</label>
                    <input 
                      type="text" 
                      value={profileForm.phoneNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                      style={{ padding: '8px', margin: '4px 0 12px 0' }}
                    />
                  </div>
                </>
              )}

              {editModal.section === 'addresses' && (
                <>
                  <div className="verify-step" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Home Address</label>
                    <textarea 
                      value={profileForm.homeAddress}
                      onChange={(e) => setProfileForm({ ...profileForm, homeAddress: e.target.value })}
                      rows="3"
                      style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '14px', margin: '4px 0 12px 0', outline: 'none', resize: 'vertical' }}
                    />
                  </div>
                  <div className="verify-step" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Work Address</label>
                    <textarea 
                      value={profileForm.workAddress}
                      onChange={(e) => setProfileForm({ ...profileForm, workAddress: e.target.value })}
                      rows="3"
                      style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '14px', margin: '4px 0 12px 0', outline: 'none', resize: 'vertical' }}
                    />
                  </div>
                </>
              )}

              {editModal.section === 'about' && (
                <>
                  <div className="verify-step" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Occupation</label>
                    <input 
                      type="text" 
                      value={profileForm.occupation}
                      onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                      style={{ padding: '8px', margin: '4px 0 12px 0' }}
                    />
                  </div>
                  <div className="verify-step" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Bio</label>
                    <textarea 
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      rows="4"
                      style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '14px', margin: '4px 0 12px 0', outline: 'none', resize: 'vertical' }}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </>
              )}

              <button 
                type="submit" 
                className="verify-btn" 
                disabled={loading}
                style={{ marginTop: '16px' }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
            
            <button className="close-link" onClick={() => setEditModal({ show: false, section: '' })}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileTab;
