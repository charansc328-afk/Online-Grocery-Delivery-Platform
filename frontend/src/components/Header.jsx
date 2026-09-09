import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = ({ searchQuery, onSearchChange }) => {
  const { cartCount } = useCart();

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="brand">QUICKCART</Link>
        
        <div className="location-selector">
          Deliver to:
          <span>📍 Select location</span>
        </div>

        <div className="search-bar">
          <span style={{ marginRight: '8px' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search for products..." 
            value={searchQuery || ''}
            onChange={onSearchChange}
          />
        </div>

        <div className="header-actions">
          <div className="action-item">
            <span style={{ fontSize: '1.2rem', marginBottom: '4px' }}>👤</span>
            Account
          </div>
          <Link to="/cart" className="action-item">
            <div className="cart-icon">
              🛒
              {cartCount > 0 && <div className="cart-badge">{cartCount}</div>}
            </div>
            Cart
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
