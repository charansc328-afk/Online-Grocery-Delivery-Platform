import React from 'react';

const QuickDelivery = () => {
  return (
    <section className="container">
      <div className="quick-delivery">
        <h2>Everything you need, delivered quickly.</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div className="feature-title">Fast Delivery</div>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', fontSize: '0.95rem' }}>
              We deliver your groceries in minutes, not days.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏪</div>
            <div className="feature-title">Nearby Dark Stores</div>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', fontSize: '0.95rem' }}>
              Orders are fulfilled from hyper-local micro-fulfillment centers.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <div className="feature-title">Live Order Tracking</div>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', fontSize: '0.95rem' }}>
              Know exactly where your order is at all times.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickDelivery;
