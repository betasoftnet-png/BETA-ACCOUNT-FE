import React from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, Shield, ShieldCheck, Globe, HardDrive } from 'lucide-react';

function HomeTab({ user, storagePercentage, formatStorage, setActiveTab }) {
  return (
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
  );
}

export default HomeTab;
