import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import PopularProducts from '../components/PopularProducts';
import QuickDelivery from '../components/QuickDelivery';
import Footer from '../components/Footer';
import { api } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.get('/products');
      // In case the backend returns { success: true, products: [...] } or just [...]
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      setError('Unable to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  // View All: reset filters and scroll to products
  const handleViewAll = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || 
      (product.category && product.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      
    const matchesSearch = searchQuery === '' || 
      (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <main>
        <Hero />
        <CategorySection selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
        <PopularProducts 
          products={filteredProducts} 
          loading={loading} 
          error={error} 
          onRetry={fetchProducts}
          searchQuery={searchQuery}
          onViewAll={handleViewAll}
        />
        
        <section className="container">
          <div className="promo-banner">
            <div>
              <h3>Fresh deals every day</h3>
              <p>Save more on your everyday essentials with our exclusive offers.</p>
            </div>
            <button className="btn" style={{ backgroundColor: '#ff9800', color: 'white', padding: '12px 24px' }}>
              Explore Deals
            </button>
          </div>
        </section>

        <QuickDelivery />
      </main>
      <Footer />
    </>
  );
};

export default Home;
