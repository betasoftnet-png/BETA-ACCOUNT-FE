import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, Clock, CheckCircle } from 'lucide-react';

function BillingTab({ user }) {
  const [subData, setSubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch(`https://cliks.beta-softnet.com/api/v1/business/subscription/${user.email}`);
        const result = await response.json();
        
        if (result.success) {
          setSubData(result.data);
        } else {
          setError('Failed to load subscription details.');
        }
      } catch (err) {
        setError('Error fetching subscription details.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchSubscription();
    }
  }, [user]);

  // As per requirements: "if subscription_days_remaining is 0 or Free Plan, display no subscription"
  const hasSubscription = subData && subData.subscription_days_remaining > 0 && subData.plan_name !== 'Free Plan';

  return (
    <motion.div 
      key="billing"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="content-card mb-24">
        <h2>Cliks Business Subscription</h2>
        <p className="card-desc">Manage your active Cliks Business subscriptions and billing details.</p>
        
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading subscription details...
          </div>
        ) : error ? (
          <div style={{ padding: '20px', color: '#d93025', background: '#fce8e6', borderRadius: '8px', marginTop: '16px' }}>
            {error}
          </div>
        ) : !hasSubscription ? (
          <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '12px', marginTop: '24px' }}>
            <h3 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>No active subscription for this account</h3>
            <p style={{ color: 'var(--text-secondary)' }}>You are currently on the {subData?.plan_name || 'Free Plan'}. Upgrade to access premium Cliks Business features.</p>
            <button className="setup-btn" style={{ marginTop: '16px' }} onClick={() => window.open('https://cliks.business', '_blank')}>
              Explore Plans
            </button>
          </div>
        ) : (
          <div style={{ marginTop: '24px', background: '#f8f9fa', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-soft)' }}>
            <div style={{ padding: '24px', background: 'var(--primary-soft)', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>Active Plan</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: 'var(--text-main)' }}>{subData.plan_name}</h3>
              </div>
              <div style={{ background: '#fff', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-sm)' }}>
                <CheckCircle size={16} color="#188038" />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#188038' }}>Active</span>
              </div>
            </div>
            
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Calendar size={20} color="var(--text-secondary)" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>SUBSCRIBED ON</div>
                  <div style={{ fontSize: '15px', fontWeight: '500' }}>{new Date(subData.when_subscribed).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Clock size={20} color="var(--text-secondary)" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>NEXT DUE DATE</div>
                  <div style={{ fontSize: '15px', fontWeight: '500' }}>{new Date(subData.next_due_date).toLocaleDateString()}</div>
                  <div style={{ fontSize: '13px', color: '#d93025', marginTop: '4px' }}>{subData.subscription_days_remaining} days remaining</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CreditCard size={20} color="var(--text-secondary)" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>BILLED TO</div>
                  <div style={{ fontSize: '15px', fontWeight: '500' }}>{subData.email}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default BillingTab;
