const fs = require('fs');
const cartCSS = [
  '\n/* Cart Styles */',
  '.cart-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }',
  '.cart-items { display: flex; flex-direction: column; gap: 16px; }',
  '.cart-item-card { display: flex; align-items: center; gap: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; }',
  '.cart-item-image { width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); background: var(--background); }',
  '.cart-item-details { flex: 1; }',
  '.cart-item-name { font-size: 1.1rem; font-weight: 600; margin-bottom: 4px; }',
  '.cart-item-price { color: var(--text-light); }',
  '.cart-quantity-controls { display: flex; align-items: center; border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; }',
  '.qty-btn { background: var(--background); border: none; width: 32px; height: 32px; font-size: 1.2rem; font-weight: 700; cursor: pointer; color: var(--text-dark); transition: background 0.2s; }',
  '.qty-btn:hover { background: #e0e0e0; }',
  '.qty-value { width: 40px; text-align: center; font-weight: 600; }',
  '.cart-item-subtotal { font-weight: 700; font-size: 1.1rem; width: 80px; text-align: right; }',
  '.cart-remove-btn { background: transparent; border: none; color: #d32f2f; font-weight: 600; cursor: pointer; padding: 8px; margin-left: 8px; }',
  '.cart-remove-btn:hover { text-decoration: underline; }',
  '.cart-summary { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; height: fit-content; position: sticky; top: 100px; }',
  '.cart-summary h3 { margin-bottom: 24px; font-size: 1.4rem; }',
  '.summary-row { display: flex; justify-content: space-between; margin-bottom: 16px; color: var(--text-dark); }',
  '.summary-divider { height: 1px; background: var(--border); margin: 16px 0; }',
  '.summary-total { font-weight: 800; font-size: 1.2rem; }',
  '@media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } .cart-summary { position: static; } }',
  '@media (max-width: 600px) { .cart-item-card { flex-wrap: wrap; } .cart-item-details { min-width: 100%; } .cart-item-subtotal { flex: 1; text-align: left; } }',
].join('\n');

fs.appendFileSync('src/index.css', cartCSS, 'utf8');
console.log('Cart CSS appended successfully');
