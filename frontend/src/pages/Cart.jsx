import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { getFallbackImage } from '../utils/imageFallback';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const deliveryFee = 30; // Static frontend delivery fee
  const total = cartSubtotal > 0 ? cartSubtotal + deliveryFee : 0;

  return (
    <>
      <Header />
      <main className="container" style={{ margin: '40px auto', minHeight: '60vh' }}>
        <h1 className="section-title">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
            <h2>Your cart is empty</h2>
            <p style={{ color: 'var(--text-light)', margin: '16px 0 24px' }}>Add some fresh groceries to get started.</p>
            <Link to="/" className="btn btn-primary" style={{ padding: '12px 32px' }}>Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item-card">
                  <img 
                    src={item.imageUrl || getFallbackImage(item.category, item.name)} 
                    alt={item.name} 
                    className="cart-item-image"
                    onError={(e) => { e.target.src = getFallbackImage(item.category, item.name) }}
                  />
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <div className="cart-item-price">₹{item.price}</div>
                  </div>
                  
                  <div className="cart-quantity-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(item._id, -1)}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item._id, 1)}>+</button>
                  </div>
                  
                  <div className="cart-item-subtotal">₹{item.price * item.quantity}</div>
                  
                  <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '24px' }}>
                Proceed to Checkout
              </Link>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Link to="/" style={{ color: 'var(--primary)', fontWeight: '600' }}>Continue Shopping</Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Cart;
