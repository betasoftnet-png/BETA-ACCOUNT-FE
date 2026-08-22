import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Shield, User as UserIcon, Loader } from 'lucide-react';
import { API_BASE } from '../App';

export default function SubIdManager({ token, user }) {
  const [subIds, setSubIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    prefix: '',
    password: '',
    firstName: '',
    lastName: '',
    accountType: 'BUSINESS' // default
  });

  const [creating, setCreating] = useState(false);

  const fetchSubIds = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/subid/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubIds(res.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch Sub-IDs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSubIds();
    }
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      await axios.post(`${API_BASE}/subid/create`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      setFormData({ prefix: '', password: '', firstName: '', lastName: '', accountType: 'BUSINESS' });
      fetchSubIds();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create Sub-ID');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="content-panel subid-manager">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '8px' }}>Team & Sub-IDs</h2>
          <p style={{ color: '#5f6368' }}>Manage isolated Sub-IDs and delegate access.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#0b57d0', color: 'white', padding: '10px 20px',
            borderRadius: '24px', border: 'none', cursor: 'pointer', fontWeight: '500'
          }}
        >
          <Plus size={18} />
          Create Sub-ID
        </button>
      </div>

      {error && (
        <div style={{ padding: '16px', backgroundColor: '#fce8e6', color: '#d93025', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loader size={32} className="animate-spin" color="#1a73e8" />
        </div>
      ) : (
        <div className="subid-list" style={{ border: '1px solid #dadce0', borderRadius: '8px', overflow: 'hidden' }}>
          {subIds.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#5f6368' }}>
              <Shield size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>No Sub-IDs created yet.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #dadce0', textAlign: 'left' }}>
                  <th style={{ padding: '16px', fontWeight: '500', color: '#5f6368' }}>Username</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: '#5f6368' }}>Name</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: '#5f6368' }}>Type</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: '#5f6368', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subIds.map((sub, i) => (
                  <tr key={sub.id} style={{ borderBottom: i === subIds.length - 1 ? 'none' : '1px solid #dadce0' }}>
                    <td style={{ padding: '16px' }}>{sub.username}</td>
                    <td style={{ padding: '16px' }}>{sub.firstName} {sub.lastName}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: sub.accountType === 'BUSINESS' ? '#e8f0fe' : '#e6f4ea',
                        color: sub.accountType === 'BUSINESS' ? '#1a73e8' : '#137333'
                      }}>
                        {sub.accountType}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      {/* Placeholder for future delete/edit actions */}
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5f6368' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Create New Sub-ID</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Account Type</label>
                <select 
                  style={{ width: '100%', padding: '12px', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '16px' }}
                  value={formData.accountType}
                  onChange={e => setFormData({...formData, accountType: e.target.value})}
                >
                  <option value="BUSINESS">Business (Employee / Team)</option>
                  <option value="PERSONAL">Personal (Assistant / Family)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Username Prefix</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="text" required
                    style={{ flex: 1, padding: '12px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '16px' }}
                    placeholder="e.g. hr"
                    value={formData.prefix}
                    onChange={e => setFormData({...formData, prefix: e.target.value.toLowerCase()})}
                  />
                  <div style={{ padding: '12px', backgroundColor: '#f1f3f4', border: '1px solid #dadce0', borderRadius: '0 8px 8px 0', color: '#5f6368', fontSize: '16px' }}>
                    .{user?.username || 'parent'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>First Name</label>
                  <input 
                    type="text" required
                    style={{ width: '100%', padding: '12px', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '16px' }}
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Last Name</label>
                  <input 
                    type="text"
                    style={{ width: '100%', padding: '12px', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '16px' }}
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Temporary Password</label>
                <input 
                  type="text" required minLength="8"
                  style={{ width: '100%', padding: '12px', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '16px' }}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 24px', background: 'none', border: 'none', color: '#5f6368', fontWeight: '500', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={creating} style={{ padding: '10px 24px', backgroundColor: '#0b57d0', color: 'white', border: 'none', borderRadius: '24px', fontWeight: '500', cursor: creating ? 'not-allowed' : 'pointer' }}>
                  {creating ? 'Creating...' : 'Create Sub-ID'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
