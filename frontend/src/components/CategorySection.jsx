import React from 'react';

const categories = [
  { id: 'all', name: 'All', icon: '🛒' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥦' },
  { id: 'fruits', name: 'Fruits', icon: '🍎' },
  { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛' },
  { id: 'bakery', name: 'Bakery', icon: '🍞' },
  { id: 'snacks', name: 'Snacks', icon: '🍪' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' },
  { id: 'rice', name: 'Rice & Grains', icon: '🍚' },
  { id: 'household', name: 'Household', icon: '🧼' },
  { id: 'personal', name: 'Personal Care', icon: '🧴' },
];

const CategorySection = ({ selectedCategory, onSelectCategory }) => {
  return (
    <section className="categories container">
      <h2 className="section-title">Shop by Category</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className={`category-card ${selectedCategory === category.name ? 'active' : ''}`}
            onClick={() => onSelectCategory(category.name)}
            style={{ 
              borderColor: selectedCategory === category.name ? 'var(--primary)' : 'var(--border)',
              backgroundColor: selectedCategory === category.name ? '#e3f2fd' : 'var(--surface)'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>
              {category.icon}
            </div>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
