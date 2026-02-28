import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import { productAPI } from '../services/api';
import { CartContext } from '../context/CartContext';
import './ProductsPage.css';

// Category Options (fetched from backend)

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, setIsCartOpen } = useContext(CartContext);

  // Local state for price inputs to prevent constant refetching
  const [localMinPrice, setLocalMinPrice] = useState('');
  const [localMaxPrice, setLocalMaxPrice] = useState('');

  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const search = searchParams.get('search');

  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories for sidebar from backend
      try {
        const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
        const apiCategories = API_BASE.endsWith('/api') ? `${API_BASE}/categories` : `${API_BASE}/api/categories`;
        const catRes = await fetch(apiCategories);
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories((catData.categories || []).map(c => c.name));
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
        setCategories([]);
      }

      try {
        setLoading(true);
        
        let allProducts = [];
        
        // Try backend first to get latest products
        try {
          const productsData = await productAPI.getAll();
          if (productsData.products && productsData.products.length > 0) {
            allProducts = productsData.products;
            // Update localStorage with latest products
            localStorage.setItem('products', JSON.stringify(allProducts));
          } else if (Array.isArray(productsData)) {
            allProducts = productsData;
            localStorage.setItem('products', JSON.stringify(allProducts));
          }
        } catch (error) {
          // Fallback to localStorage if backend is down
          const savedProducts = localStorage.getItem('products');
          if (savedProducts) {
            try {
              allProducts = JSON.parse(savedProducts);
            } catch (e) {
              allProducts = [];
            }
          }
        }

        // Apply filters
        let filteredProducts = [...allProducts];
        
        if (category && category !== 'all') {
          filteredProducts = filteredProducts.filter(p => p.category === category);
        }
        if (search) {
          const searchLower = search.toLowerCase();
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) || 
            p.category.toLowerCase().includes(searchLower) ||
            (p.description && p.description.toLowerCase().includes(searchLower))
          );
        }
        if (minPrice) {
          filteredProducts = filteredProducts.filter(p => parseFloat(p.price) >= parseFloat(minPrice));
        }
        if (maxPrice) {
          filteredProducts = filteredProducts.filter(p => parseFloat(p.price) <= parseFloat(maxPrice));
        }
        
        // Sort by price if price filter is applied
        if (minPrice || maxPrice) {
          filteredProducts = filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        }
        
        setAllProducts([...allProducts]); // Store all products
        setProducts(filteredProducts);

        // If categories not loaded from API, fallback to empty or previous state
        if (!categories || categories.length === 0) {
          setCategories([]);
        }
        
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Listen for localStorage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'products') {
        console.log('🔄 localStorage changed from another tab, reloading...');
        fetchData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [category, minPrice, maxPrice, search]);

  // Sync local price state with URL params
  useEffect(() => {
    setLocalMinPrice(minPrice || '');
    setLocalMaxPrice(maxPrice || '');
  }, [minPrice, maxPrice]);

  // Real-time price filtering
  const handlePriceChange = (minVal, maxVal) => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    // Apply all existing filters
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply real-time price filters
    if (minVal) {
      filtered = filtered.filter(p => parseFloat(p.price) >= parseFloat(minVal));
    }
    if (maxVal) {
      filtered = filtered.filter(p => parseFloat(p.price) <= parseFloat(maxVal));
    }

    // Sort by price
    if (minVal || maxVal) {
      filtered = filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }

    setProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setIsCartOpen(true);
    // Show brief notification
    const notification = document.createElement('div');
    notification.textContent = `✅ ${product.name} added to cart!`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #d4af37;
      color: #1a1a1a;
      padding: 15px 20px;
      border-radius: 6px;
      font-weight: 500;
      z-index: 999;
      animation: slideInRight 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  if (loading) {
    return <div className="container mt-4 text-center"><p>Loading products...</p></div>;
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1>Our Products</h1>
          <p className="text-light">Explore our luxury collection</p>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="sidebar">
            <h3 className="sidebar-title">Filters</h3>

            {/* Categories */}
            <CategoryFilter
              categories={categories}
              currentCategory={category}
            />

            {/* Price Range */}
            <div className="filter-group">
              <h4>Price Range (PKR)</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min PKR"
                  value={localMinPrice}
                  onChange={(e) => {
                    setLocalMinPrice(e.target.value);
                    handlePriceChange(e.target.value, localMaxPrice);
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      setSearchParams({ ...Object.fromEntries(searchParams), minPrice: e.target.value });
                    } else {
                      const params = Object.fromEntries(searchParams);
                      delete params.minPrice;
                      setSearchParams(params);
                    }
                  }}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max PKR"
                  value={localMaxPrice}
                  onChange={(e) => {
                    setLocalMaxPrice(e.target.value);
                    handlePriceChange(localMinPrice, e.target.value);
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      setSearchParams({ ...Object.fromEntries(searchParams), maxPrice: e.target.value });
                    } else {
                      const params = Object.fromEntries(searchParams);
                      delete params.maxPrice;
                      setSearchParams(params);
                    }
                  }}
                />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="products-main">
            {products.length > 0 && (
              <>
                {/* Active Filters Display */}
                {(minPrice || maxPrice || category || search) && (
                  <div className="active-filters">
                    <p className="filter-title">🔍 Active Filters:</p>
                    <div className="filter-tags">
                      {category && category !== 'all' && (
                        <span className="filter-tag">
                          📁 {category} 
                          <button onClick={() => setSearchParams(prev => {
                            const newParams = new URLSearchParams(prev);
                            newParams.delete('category');
                            return newParams;
                          })}>✕</button>
                        </span>
                      )}
                      {minPrice && (
                        <span className="filter-tag">
                          💰 Min: {minPrice} PKR
                          <button onClick={() => setSearchParams(prev => {
                            const newParams = new URLSearchParams(prev);
                            newParams.delete('minPrice');
                            return newParams;
                          })}>✕</button>
                        </span>
                      )}
                      {maxPrice && (
                        <span className="filter-tag">
                          💰 Max: {maxPrice} PKR
                          <button onClick={() => setSearchParams(prev => {
                            const newParams = new URLSearchParams(prev);
                            newParams.delete('maxPrice');
                            return newParams;
                          })}>✕</button>
                        </span>
                      )}
                      {search && (
                        <span className="filter-tag">
                          🔎 "{search}"
                          <button onClick={() => setSearchParams(prev => {
                            const newParams = new URLSearchParams(prev);
                            newParams.delete('search');
                            return newParams;
                          })}>✕</button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="products-toolbar">
                  <p className="products-count">✅ Found {products.length} products</p>
                <div className="sort-options">
                  <label htmlFor="sort">Sort by:</label>
                  <select
                    id="sort"
                    onChange={(e) => {
                      let sorted = [...products];
                      if (e.target.value === 'price-low') {
                        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                      } else if (e.target.value === 'price-high') {
                        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                      } else if (e.target.value === 'newest') {
                        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                      } else if (e.target.value === 'rating') {
                        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                      }
                      setProducts(sorted);
                    }}
                  >
                    <option value="">Default</option>
                    <option value="price-low">💰 Price: Low to High</option>
                    <option value="price-high">💰 Price: High to Low</option>
                    <option value="newest">⭐ Newest First</option>
                    <option value="rating">⭐ Top Rated</option>
                  </select>
                </div>
              </div>
              </>
            )}
            
            {products.length === 0 ? (
              <div className="no-products">
                <p>No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <div key={product.id} className="product-card card">
                    <Link to={`/product/${product.id}`} className="product-image">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/250x250?text=Product'}
                        alt={product.name}
                      />
                      <div className="badges-overlay">
                        {product.isFeatured && <span className="badge featured">⭐ Featured</span>}
                        {product.isNewArrival && <span className="badge new">🆕 New</span>}
                        {product.isUsed && <span className="badge used">♻️ Used</span>}
                      </div>
                    </Link>

                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="category text-light">{product.category}</p>
                      <p className="description text-light">{product.shortDescription}</p>

                      <div className="price-section">
                        <span className="price text-gold">Rs. {product.price.toFixed(2)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="original-price">Rs. {product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>

                      <div className="product-actions">
                        <Link to={`/product/${product.id}`} className="btn btn-secondary btn-small">
                          View Details
                        </Link>
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

















