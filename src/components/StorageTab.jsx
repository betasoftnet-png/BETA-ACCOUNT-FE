import React from 'react';
import { motion } from 'framer-motion';
import { HardDrive } from 'lucide-react';

function StorageTab({ user, storagePercentage, formatStorage }) {
  return (
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
  );
}

export default StorageTab;
