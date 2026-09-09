import React from 'react';
import { getFallbackImage } from '../utils/imageFallback';
import { useCart } from '../context/CartContext';

const PopularProducts = ({ products, loading, error, onRetry, searchQuery, onViewAll }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();

  const getProductQuantity = (id) => {
    const item = cartItems.find(item => item._id === id);
    return item ? item.quantity : 0;
  };

  // Prevent infinite onError loop: once a fallback image itself fails, stop retrying
  const handleImgError = (e, category, name) => {
    const fallback = getFallbackImage(category, name);
    if (e.target.src !== fallback) {
      e.target.src = fallback;
    } else {
      e.target.style.display = 'none'; // give up gracefully
    }
  };

  return (
    <section id="products" className="products container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Fresh Picks</h2>
        <button
          className="btn btn-outline"
          style={{ padding: '6px 16px', fontSize: '0.9rem' }}
          onClick={onViewAll}
          title="Clear filters and show all products"
        >
          View All
        </button>
      </div>
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🛒</div>
          <h3>Loading fresh groceries...</h3>
        </div>
      )}

      {!loading && error && (
        <div style={{ textAlign: 'center', padding: '40px 0', background: '#ffebee', borderRadius: 'var(--radius-md)', color: '#c62828', padding: '40px' }}>
          <p style={{ marginBottom: '16px' }}>{error}</p>
          <button className="btn btn-primary" onClick={onRetry}>Retry</button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔍</div>
          <h3>{searchQuery ? `No products found for "${searchQuery}".` : 'No products available right now.'}</h3>
          {(searchQuery || true) && (
            <button className="btn btn-outline" style={{ marginTop: '16px' }} onClick={onViewAll}>Show All Products</button>
          )}
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => {
            const qty = getProductQuantity(product._id);
            return (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={product.imageUrl || getFallbackImage(product.category, product.name)} 
                    alt={product.name}
                    onError={(e) => handleImgError(e, product.category, product.name)}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
                <div className="product-name" title={product.name}>{product.name}</div>
                <div className="product-unit" style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{product.category || 'Grocery'}</div>
                <div className="product-footer">
                  <div className="product-price">₹{product.price}</div>
                  {qty > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <button onClick={() => updateQuantity(product._id, -1)} style={{ background: 'transparent', border: 'none', color: 'white', padding: '6px 10px', cursor: 'pointer', fontWeight: 'bold' }}>−</button>
                      <span style={{ fontSize: '0.9rem', fontWeight: 'bold', padding: '0 4px', minWidth: '20px', textAlign: 'center' }}>{qty}</span>
                      <button onClick={() => updateQuantity(product._id, 1)} style={{ background: 'transparent', border: 'none', color: 'white', padding: '6px 10px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                    </div>
                  ) : (
                    <button className="btn-add" onClick={() => addToCart(product)}>+ Add</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PopularProducts;
