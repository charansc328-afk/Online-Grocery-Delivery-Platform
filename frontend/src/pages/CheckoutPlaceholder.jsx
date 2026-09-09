import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const CheckoutPlaceholder = () => {
  return (
    <>
      <Header />
      <main className="container" style={{ margin: '80px auto', minHeight: '50vh', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '24px' }}>🚧</h1>
        <h2>Checkout coming next</h2>
        <p style={{ color: 'var(--text-light)', marginTop: '16px', marginBottom: '32px' }}>
          This functionality will be built in the next phase.
        </p>
        <Link to="/cart" className="btn btn-primary">Back to Cart</Link>
      </main>
      <Footer />
    </>
  );
};

export default CheckoutPlaceholder;
