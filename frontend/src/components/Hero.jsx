import React from 'react';

const Hero = () => {
  const handleShopNow = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero container">
      <div className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Fresh groceries.<br/>Delivered fast.</h1>
          <p className="hero-subtitle">Shop everyday essentials from your favorite local stores.</p>
          <button
            className="btn btn-primary"
            style={{ padding: '14px 32px', fontSize: '1.1rem', backgroundColor: '#2e7d32' }}
            onClick={handleShopNow}
          >
            Shop Now
          </button>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
            alt="Fresh groceries basket"
            style={{ borderRadius: 'var(--radius-lg)' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
