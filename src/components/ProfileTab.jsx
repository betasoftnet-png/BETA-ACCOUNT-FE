import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  ChevronRight, User, Calendar, Smile, Mail, Phone, 
  MapPin, Briefcase, AlignLeft, Camera, Trash2 
} from 'lucide-react';

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
        <div className="content-card mb-24" style={{ padding: '32px' }}>
          <h2>Basic info</h2>
          <p className="card-desc">Some info may be visible to other people using BNX services. Click any row to update.</p>
          
          <div className="info-grid" style={{ marginTop: '16px' }}>
            <div className="info-block" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px' }}>
              <div className="info-icon-wrapper">
                <Camera size={18} />
              </div>
              <div className="info-label-value" style={{ flex: 1 }}>
                <label>PHOTO</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                  <div className="avatar-small" style={{ overflow: 'hidden', width: '56px', height: '56px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <img 
                      src={`${API_BASE}/users/profile-picture/${user.username}?t=${user.profilePicture || ''}`} 
                      alt={user.firstName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="file" 
                      id="avatar-upload" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleAvatarUpload}
                    />
                    <label htmlFor="avatar-upload" className="setup-btn" style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '13px', borderRadius: '6px' }}>
                      Change photo
                    </label>
                    {user.profilePicture && (
                      <button 
                        onClick={handleAvatarDelete}
                        className="setup-btn" 
                        style={{ color: '#d93025', borderColor: '#dadce0', padding: '8px 16px', fontSize: '13px', borderRadius: '6px' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="info-block clickable" onClick={() => openEditModal('basic')}>
              <div className="info-icon-wrapper">
                <User size={18} />
              </div>
              <div className="info-label-value">
                <label>NAME</label>
                <div className="value">{user.firstName} {user.lastName}</div>
              </div>
              <ChevronRight size={18} className="chevron-icon" />
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('basic')}>
              <div className="info-icon-wrapper">
                <User size={18} />
              </div>
              <div className="info-label-value">
                <label>NICKNAME</label>
                <div className="value">{user.nickname || 'Not set'}</div>
              </div>
              <ChevronRight size={18} className="chevron-icon" />
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('basic')}>
              <div className="info-icon-wrapper">
                <User size={18} />
              </div>
              <div className="info-label-value">
                <label>DISPLAY NAME</label>
                <div className="value">{user.displayName || 'Not set'}</div>
              </div>
              <ChevronRight size={18} className="chevron-icon" />
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('basic')}>
              <div className="info-icon-wrapper">
                <Calendar size={18} />
              </div>
              <div className="info-label-value">
                <label>BIRTHDAY</label>
                <div className="value">
                  {user.dob ? new Date(user.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}
                </div>
              </div>
              <ChevronRight size={18} className="chevron-icon" />
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('basic')}>
              <div className="info-icon-wrapper">
                <Smile size={18} />
              </div>
              <div className="info-label-value">
                <label>GENDER</label>
                <div className="value">{user.gender || 'Rather not say'}</div>
              </div>
              <ChevronRight size={18} className="chevron-icon" />
            </div>
          </div>
        </div>

        <div className="content-card mb-24" style={{ padding: '32px' }}>
          <h2>Contact info</h2>
          <p className="card-desc">Your contact information used for communication and recovery. Click to edit.</p>
          <div className="info-grid" style={{ marginTop: '16px' }}>
            <div className="info-block" style={{ padding: '16px 24px' }}>
              <div className="info-icon-wrapper">
                <Mail size={18} />
              </div>
              <div className="info-label-value">
                <label>PRIMARY EMAIL</label>
                <div className="value-with-badge" style={{ gap: '8px' }}>
                  <span>{user.email}</span>
                  {user.isPrimary && <span className="mini-badge primary">Primary</span>}
                </div>
              </div>
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('contact')}>
              <div className="info-icon-wrapper">
                <Mail size={18} />
              </div>
              <div className="info-label-value">
                <label>RECOVERY EMAIL</label>
                <div className="value">{user.recoveryEmail || 'None added'}</div>
              </div>
              <ChevronRight size={18} className="chevron-icon" />
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('contact')}>
              <div className="info-icon-wrapper">
                <Phone size={18} />
              </div>
              <div className="info-label-value">
                <label>PHONE NUMBER</label>
                <div className="value">{user.phoneNumber || 'None added'}</div>
              </div>
              <ChevronRight size={18} className="chevron-icon" />
            </div>
          </div>
        </div>

        <div className="content-card mb-24" style={{ padding: '32px' }}>
          <h2>Addresses</h2>
          <p className="card-desc">Your physical addresses for billing and shipping. Click to edit.</p>
          <div className="info-grid" style={{ marginTop: '16px' }}>
            <div className="info-block clickable" onClick={() => openEditModal('addresses')}>
              <div className="info-icon-wrapper">
                <MapPin size={18} />
              </div>
              <div className="info-label-value">
                <label>HOME ADDRESS</label>
                <div className="value" style={{ whiteSpace: 'pre-wrap' }}>{user.homeAddress || 'None added'}</div>
              </div>
              <ChevronRight size={18} className="chevron-icon" />
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('addresses')}>
              <div className="info-icon-wrapper">
                <MapPin size={18} />
              </div>
              <div className="info-label-value">
                <label>WORK ADDRESS</label>
                <div className="value" style={{ whiteSpace: 'pre-wrap' }}>{user.workAddress || 'None added'}</div>
              </div>
              <ChevronRight size={18} className="chevron-icon" />
            </div>
          </div>
        </div>

        <div className="content-card mb-24" style={{ padding: '32px' }}>
          <h2>About me</h2>
          <p className="card-desc">Your profile description and occupation. Click to edit.</p>
          <div className="info-grid" style={{ marginTop: '16px' }}>
            <div className="info-block clickable" onClick={() => openEditModal('about')}>
              <div className="info-icon-wrapper">
                <Briefcase size={18} />
              </div>
              <div className="info-label-value">
                <label>OCCUPATION</label>
                <div className="value">{user.occupation || 'None added'}</div>
              </div>
              <ChevronRight size={18} className="chevron-icon" />
            </div>

            <div className="info-block clickable" onClick={() => openEditModal('about')}>
              <div className="info-icon-wrapper">
                <AlignLeft size={18} />
              </div>
              <div className="info-label-value">
                <label>BIO</label>
                <div className="value" style={{ whiteSpace: 'pre-wrap' }}>
                  {user.bio || 'Write a brief description about yourself'}
                </div>
              </div>
              <ChevronRight size={18} className="chevron-icon" />
            </div>
          </div>
        </div>
      </motion.div>

      {editModal.show && (
        <div className="setup-overlay">
          <div className="setup-modal animate-scale-in" style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '8px', fontSize: '20px', fontWeight: '500' }}>
              Edit {editModal.section === 'basic' ? 'Basic Info' : 
                    editModal.section === 'contact' ? 'Contact Info' : 
                    editModal.section === 'addresses' ? 'Addresses' : 'About Me'}
            </h3>
            <p className="card-desc" style={{ marginBottom: '20px' }}>Update your personal details below.</p>
            
            <form onSubmit={handleSaveProfile}>
              {editModal.section === 'basic' && (
                <>
                  <div className="profile-input-group">
                    <label>First Name</label>
                    <input 
                      type="text" 
                      className="profile-input-field"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="profile-input-group">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      className="profile-input-field"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="profile-input-group">
                    <label>Nickname</label>
                    <input 
                      type="text" 
                      className="profile-input-field"
                      value={profileForm.nickname}
                      onChange={(e) => setProfileForm({ ...profileForm, nickname: e.target.value })}
                    />
                  </div>
                  <div className="profile-input-group">
                    <label>Display Name</label>
                    <input 
                      type="text" 
                      className="profile-input-field"
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                    />
                  </div>
                  <div className="profile-input-group">
                    <label>Birthday</label>
                    <input 
                      type="date" 
                      className="profile-input-field"
                      value={profileForm.dob}
                      onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                    />
                  </div>
                  <div className="profile-input-group">
                    <label>Gender</label>
                    <select 
                      className="profile-input-field"
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
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
                  <div className="profile-input-group">
                    <label>Recovery Email</label>
                    <input 
                      type="email" 
                      className="profile-input-field"
                      value={profileForm.recoveryEmail}
                      onChange={(e) => setProfileForm({ ...profileForm, recoveryEmail: e.target.value })}
                    />
                  </div>
                  <div className="profile-input-group">
                    <label>Phone Number</label>
                    <input 
                      type="text" 
                      className="profile-input-field"
                      value={profileForm.phoneNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                    />
                  </div>
                </>
              )}

              {editModal.section === 'addresses' && (
                <>
                  <div className="profile-input-group">
                    <label>Home Address</label>
                    <textarea 
                      className="profile-input-field"
                      value={profileForm.homeAddress}
                      onChange={(e) => setProfileForm({ ...profileForm, homeAddress: e.target.value })}
                      rows="3"
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <div className="profile-input-group">
                    <label>Work Address</label>
                    <textarea 
                      className="profile-input-field"
                      value={profileForm.workAddress}
                      onChange={(e) => setProfileForm({ ...profileForm, workAddress: e.target.value })}
                      rows="3"
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </>
              )}

              {editModal.section === 'about' && (
                <>
                  <div className="profile-input-group">
                    <label>Occupation</label>
                    <input 
                      type="text" 
                      className="profile-input-field"
                      value={profileForm.occupation}
                      onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                    />
                  </div>
                  <div className="profile-input-group">
                    <label>Bio</label>
                    <textarea 
                      className="profile-input-field"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      rows="4"
                      style={{ resize: 'vertical' }}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </>
              )}

              <button 
                type="submit" 
                className="verify-btn" 
                disabled={loading}
                style={{ marginTop: '24px', padding: '12px', borderRadius: '6px', fontSize: '15px' }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
            
            <button className="close-link" onClick={() => setEditModal({ show: false, section: '' })} style={{ marginTop: '20px' }}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileTab;
