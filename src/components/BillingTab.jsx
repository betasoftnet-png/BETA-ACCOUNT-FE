import React from 'react';
import { motion } from 'framer-motion';

function BillingTab({ user }) {
  return (
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
  );
}

export default BillingTab;
