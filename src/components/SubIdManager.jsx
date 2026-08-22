import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Shield, User as UserIcon, Loader, ChevronRight, ChevronDown, DollarSign, ShoppingCart, Package, Users, FileText, Monitor, Tag } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE;

const PERMISSIONS_HIERARCHY = [
  {
    label: 'Finance',
    children: [
      {
        label: 'Accounting',
        children: [
          { id: 110, label: 'Finance Accounting All' },
          { id: 111, label: 'Finance P&L' },
          { id: 112, label: 'Finance Balance Sheet' },
          { id: 113, label: 'Finance Receivables & Payables' },
          { id: 114, label: 'Finance Expenses' },
          { id: 115, label: 'Finance Cash & Bank' }
        ]
      },
      {
        label: 'Expenses',
        children: [
          { id: 120, label: 'Finance Expenses All' },
          { id: 121, label: 'Finance Exp Registry ITC' },
          { id: 122, label: 'Finance Exp Recurring' },
          { id: 123, label: 'Finance Exp Dept Budgets' },
          { id: 124, label: 'Finance Exp Staff Reimburse' }
        ]
      },
      {
        label: 'Tax',
        children: [
          { id: 130, label: 'Finance Tax All' },
          { id: 131, label: 'Finance Tax GSTR1' },
          { id: 132, label: 'Finance Tax GSTR2' },
          { id: 133, label: 'Finance Tax GSTR3B' },
          { id: 134, label: 'Finance Tax GSTR9' },
          { id: 135, label: 'Finance Tax E-Invoice' },
          { id: 136, label: 'Finance Tax E-Way' }
        ]
      }
    ]
  },
  {
    label: 'Sales',
    children: [
      {
        label: 'Sales Invoice',
        children: [
          { id: 210, label: 'Sales Section All' },
          { id: 211, label: 'Sales Invoice' },
          { id: 212, label: 'Sales Orders List' },
          { id: 213, label: 'Sales Returns' },
          { id: 214, label: 'Sales Warranty Claims' }
        ]
      },
      {
        label: 'Customers',
        children: [
          { id: 220, label: 'Sales Cust All' },
          { id: 221, label: 'Sales Cust List' },
          { id: 222, label: 'Sales Cust Aging Reports' },
          { id: 223, label: 'Sales Cust Points Rules' }
        ]
      }
    ]
  },
  {
    label: 'Purchases',
    children: [
      {
        label: 'Purchase Invoice',
        children: [
          { id: 310, label: 'Purchases Section All' },
          { id: 311, label: 'Purchases Invoice' },
          { id: 312, label: 'Purchases Orders PO' },
          { id: 313, label: 'Purchases Bills Invoices' },
          { id: 314, label: 'Purchases Returns' }
        ]
      },
      {
        label: 'Suppliers',
        children: [
          { id: 320, label: 'Purchases Supp All' },
          { id: 321, label: 'Purchases Supp List' },
          { id: 322, label: 'Purchases Supp Ledger' },
          { id: 323, label: 'Purchases Supp Aging Reminders' }
        ]
      }
    ]
  },
  {
    label: 'Inventory',
    children: [
      {
        label: 'Products',
        children: [
          { id: 411, label: 'Inventory Products' }
        ]
      },
      {
        label: 'Stock',
        children: [
          { id: 410, label: 'Inventory Section All' },
          { id: 412, label: 'Inventory Stock' },
          { id: 413, label: 'Inventory Stock Registry' },
          { id: 414, label: 'Inventory Inward Outward' },
          { id: 415, label: 'Inventory Transfers' },
          { id: 416, label: 'Inventory Batches Expiry' }
        ]
      },
      {
        label: 'Warehouse',
        children: [
          { id: 420, label: 'Inventory WH All' },
          { id: 421, label: 'Inventory WH Godowns' },
          { id: 422, label: 'Inventory WH Stock Registry' },
          { id: 423, label: 'Inventory WH Goods Logs' },
          { id: 424, label: 'Inventory WH Inter Transfers' }
        ]
      }
    ]
  },
  {
    label: 'HR',
    children: [
      {
        label: 'Staff',
        children: [
          { id: 510, label: 'HR Staff All' },
          { id: 511, label: 'HR Staff Profiles' },
          { id: 512, label: 'HR Staff Leave Rosters' },
          { id: 513, label: 'HR Staff Appraisals' },
          { id: 514, label: 'HR Staff Reimbursements' }
        ]
      },
      {
        label: 'Attendance',
        children: [
          { id: 520, label: 'HR Att All' },
          { id: 521, label: 'HR Att Today Logs' },
          { id: 522, label: 'HR Att History Ledgers' },
          { id: 523, label: 'HR Att Shift Configs' },
          { id: 524, label: 'HR Att GPS Fencing' },
          { id: 525, label: 'HR Att Correction Verify' },
          { id: 526, label: 'HR Att Calendar' }
        ]
      },
      {
        label: 'Payroll',
        children: [
          { id: 530, label: 'HR Pay All' },
          { id: 531, label: 'HR Pay Monthly Register' },
          { id: 532, label: 'HR Pay Salary Structures' },
          { id: 533, label: 'HR Pay Compliance' },
          { id: 534, label: 'HR Pay Loans Advances' }
        ]
      }
    ]
  },
  {
    label: 'POS Billing',
    children: [
      { id: 600, label: 'POS Billing' }
    ]
  },
  {
    label: 'Reports',
    children: [
      { id: 700, label: 'Reports' }
    ]
  },
  {
    label: 'Barcode Gen',
    children: [
      { id: 800, label: 'Barcode Gen' }
    ]
  },
  {
    label: 'Marketing',
    children: [
      { id: 900, label: 'Marketing' }
    ]
  }
];

const getAllIds = (node) => {
  let ids = [];
  if (node.id) ids.push(node.id);
  if (node.children) {
    node.children.forEach(child => {
      ids = ids.concat(getAllIds(child));
    });
  }
  return ids;
};

const CATEGORY_ICONS = {
  'Finance': DollarSign,
  'Sales': ShoppingCart,
  'Purchases': ShoppingCart,
  'Inventory': Package,
  'HR': Users,
  'POS Billing': Monitor,
  'Reports': FileText,
  'Barcode Gen': Tag,
  'Marketing': Tag
};

const PermissionNode = ({ node, selectedIds, onChange, depth = 0 }) => {
  const allIds = getAllIds(node);
  const isAllSelected = allIds.length > 0 && allIds.every(id => selectedIds.includes(id));
  const isSomeSelected = allIds.some(id => selectedIds.includes(id)) && !isAllSelected;
  const [expanded, setExpanded] = useState(depth === 0);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation();
    const checked = e.target.checked;
    onChange(allIds, checked);
  };

  const Icon = depth === 0 ? CATEGORY_ICONS[node.label] : null;

  return (
    <div style={{ paddingLeft: depth > 0 ? '28px' : '0', marginBottom: '2px' }}>
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => node.children && setExpanded(!expanded)}
        style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: depth === 0 ? '12px 16px' : '10px 12px',
          backgroundColor: isHovered ? '#f1f3f4' : (depth === 0 && expanded ? '#f8f9fa' : 'transparent'),
          borderRadius: '8px',
          cursor: node.children ? 'pointer' : 'default',
          transition: 'background-color 0.2s',
          borderBottom: depth === 0 && !expanded && !isHovered ? '1px solid #f1f3f4' : '1px solid transparent'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <input 
            type="checkbox"
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0b57d0', margin: 0 }}
            checked={isAllSelected}
            ref={input => { if (input) input.indeterminate = isSomeSelected; }}
            onChange={handleToggle}
            onClick={e => e.stopPropagation()}
          />
          {Icon && <Icon size={20} color={isAllSelected ? '#0b57d0' : '#5f6368'} />}
          <span style={{ 
            fontSize: depth === 0 ? '16px' : '15px', 
            fontWeight: depth === 0 ? '600' : (isAllSelected ? '500' : '400'),
            color: isAllSelected && depth === 0 ? '#0b57d0' : '#202124'
          }}>
            {node.label}
          </span>
        </div>
        
        {node.children && (
          <div style={{ color: '#5f6368', display: 'flex', alignItems: 'center' }}>
            {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
        )}
      </div>
      
      {expanded && node.children && (
        <div style={{ marginTop: '4px', marginBottom: depth === 0 ? '16px' : '4px' }}>
          {node.children.map((child, idx) => (
            <PermissionNode 
              key={idx} 
              node={child} 
              selectedIds={selectedIds} 
              onChange={onChange}
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

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
    accountType: 'BUSINESS', // default
    permissions: []
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
      setFormData({ prefix: '', password: '', firstName: '', lastName: '', accountType: 'BUSINESS', permissions: [] });
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
          {/* <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: formData.accountType === 'BUSINESS' ? '960px' : '480px', transition: 'max-width 0.3s ease' }}> */}
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '480px', transition: 'max-width 0.3s ease' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Create New Sub-ID</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* <div style={{ display: 'flex', gap: '32px', flexDirection: formData.accountType === 'BUSINESS' ? 'row' : 'column' }}> */}
              <div style={{ display: 'flex', gap: '32px', flexDirection: 'column' }}>
                
                {/* Left Side: Form Fields */}
                {/* <div style={{ flex: formData.accountType === 'BUSINESS' ? '0 0 400px' : '1', display: 'flex', flexDirection: 'column', gap: '16px' }}> */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                        .{user?.email || user?.username || 'parent'}
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
                </div>

                {/* Right Side: Permissions (Temporarily Commented Out) */}
                {/* 
                {formData.accountType === 'BUSINESS' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Access Permissions</label>
                    <div style={{ flex: 1, minHeight: '340px', maxHeight: '380px', overflowY: 'auto', border: '1px solid #dadce0', borderRadius: '12px', padding: '12px', backgroundColor: '#ffffff' }}>
                      {PERMISSIONS_HIERARCHY.map((node, idx) => (
                        <PermissionNode 
                          key={idx} 
                          node={node} 
                          selectedIds={formData.permissions} 
                          onChange={(ids, checked) => {
                            setFormData(prev => {
                              let newPermissions = new Set(prev.permissions);
                              if (checked) {
                                ids.forEach(id => newPermissions.add(id));
                              } else {
                                ids.forEach(id => newPermissions.delete(id));
                              }
                              return { ...prev, permissions: Array.from(newPermissions) };
                            });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                */}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '8px' }}>
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
