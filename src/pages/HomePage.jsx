import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { productAPI } from '../services/api';
import heroImg from '../assets/images/img2.jpg';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [usedProducts, setUsedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let allProducts = [];
        
        // Always try backend first to get latest products
        try {
          const response = await productAPI.getAll();
          if (response.products && response.products.length > 0) {
            allProducts = response.products;
            // Update localStorage with latest products from backend
            localStorage.setItem('products', JSON.stringify(allProducts));
          } else if (Array.isArray(response)) {
            allProducts = response;
            localStorage.setItem('products', JSON.stringify(allProducts));
          }
        } catch (error) {
          // Fallback to localStorage if backend is down
          const savedProducts = localStorage.getItem('products');
          if (savedProducts) {
            try {
              allProducts = JSON.parse(savedProducts);
            } catch (e) {
              // Continue without products if parsing fails
            }
          }
        }

        // Set all products
        setAllProducts(allProducts);

        // Filter products by type
        const featured = allProducts.filter(p => p.isFeatured === true);
        const newArrivals = allProducts.filter(p => p.isNewArrival === true);
        const used = allProducts.filter(p => p.isUsed === true);

        setFeaturedProducts(featured.slice(0, 4));
        setNewProducts(newArrivals.slice(0, 4));
        setUsedProducts(used.slice(0, 4));
        
      } catch (error) {
        console.error('[HomePage] Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
    // Listen for localStorage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'products') {
        console.log('🔄 [HomePage] localStorage changed from another tab, reloading...');
        fetchProducts();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1> GN SONS </h1>
          <p className="hero-subtitle">Luxury E-Commerce Platform</p>
          <p className="hero-description">Discover premium products curated just for you</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Shop Now
          </button>
        </div>
      </section>

      {/* Exclusive Offer Box */}
      {/* <section className="exclusive-offer">
        <div className="offer-box">
          <div className="offer-header">
            <span className="offer-badge">🎁 EXCLUSIVE OFFER</span>
          </div>
          <div className="offer-content">
            <h2>Get Special Discount</h2>
            <p className="offer-description">Use our exclusive coupon code to get amazing discounts on your purchases</p>
            <div className="coupon-code">
              <span className="code-label">Code:</span>
              <span className="code-value">GNSONS20</span>
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText('GNSONS20');
                  const notification = document.createElement('div');
                  notification.textContent = '✅ Code copied to clipboard!';
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
                }}
              >
                📋 Copy
              </button>
            </div>
            <p className="offer-terms">*Apply this code at checkout to get 20% off on your order</p>
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3 className="text-gold">500+</h3>
              <p>Premium Products</p>
            </div>
            <div className="stat-item">
              <h3 className="text-gold">10K+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-item">
              <h3 className="text-gold">24/7</h3>
              <p>Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {!loading && featuredProducts.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <h2>✨ Featured Products</h2>
            <div className="products-grid">
              {featuredProducts.map(product => (
                <div key={product.id} className="product-card card">
                  <div className="product-image-wrapper">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/250x250'}
                      alt={product.name}
                      className="product-image"
                    />
                    {/* Product Badges */}
                    <div className="product-badges">
                      {product.isFeatured && <span className="badge featured">⭐ Featured</span>}
                      {product.isNewArrival && <span className="badge new">🆕 New</span>}
                      {product.isUsed && <span className="badge used">♻️ Used</span>}
                    </div>
                  </div>
                  <h4>{product.name}</h4>
                  <p className="text-light">{product.category}</p>
                  {product.shortDescription && (
                    <p className="product-description">{product.shortDescription}</p>
                  )}
                  <span className="price text-gold">Rs. {product.price.toFixed(2)}</span>
                  <div className="product-actions">
                    <Link to={`/product/${product.id}`} className="btn btn-secondary btn-small">
                      View
                    </Link>
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => {
                        addToCart(product, 1);
                        setIsCartOpen(true);
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
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {!loading && newProducts.length > 0 && (
        <section className="new-section">
          <div className="container">
            <h2>🆕 New Arrivals</h2>
            <div className="products-grid">
              {newProducts.map(product => (
                <div key={product.id} className="product-card card">
                  <div className="product-image-wrapper">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/250x250'}
                      alt={product.name}
                      className="product-image"
                    />
                    {/* Product Badges */}
                    <div className="product-badges">
                      {product.isFeatured && <span className="badge featured">⭐ Featured</span>}
                      {product.isNewArrival && <span className="badge new">🆕 New</span>}
                      {product.isUsed && <span className="badge used">♻️ Used</span>}
                    </div>
                  </div>
                  <h4>{product.name}</h4>
                  <p className="text-light">{product.category}</p>
                  {product.shortDescription && (
                    <p className="product-description">{product.shortDescription}</p>
                  )}
                  <span className="price text-gold">Rs. {product.price.toFixed(2)}</span>
                  <div className="product-actions">
                    <Link to={`/product/${product.id}`} className="btn btn-secondary btn-small">
                      View
                    </Link>
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => {
                        addToCart(product, 1);
                        setIsCartOpen(true);
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
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Used Products */}
      {!loading && usedProducts.length > 0 && (
        <section className="used-section">
          <div className="container">
            <h2>♻️ Used Products</h2>
            <div className="products-grid">
              {usedProducts.map(product => (
                <div key={product.id} className="product-card card">
                  <div className="product-image-wrapper">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/250x250'}
                      alt={product.name}
                      className="product-image"
                    />
                    {/* Product Badges */}
                    <div className="product-badges">
                      {product.isFeatured && <span className="badge featured">⭐ Featured</span>}
                      {product.isNewArrival && <span className="badge new">🆕 New</span>}
                      {product.isUsed && <span className="badge used">♻️ Used</span>}
                    </div>
                  </div>
                  <h4>{product.name}</h4>
                  <p className="text-light">{product.category}</p>
                  {product.shortDescription && (
                    <p className="product-description">{product.shortDescription}</p>
                  )}
                  <span className="price text-gold">Rs. {product.price.toFixed(2)}</span>
                  <div className="product-actions">
                    <Link to={`/product/${product.id}`} className="btn btn-secondary btn-small">
                      View
                    </Link>
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => {
                        addToCart(product, 1);
                        setIsCartOpen(true);
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
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products */}
      {!loading && allProducts.length > 0 && (
        <section className="all-products-section">
          <div className="container">
            <h2>🛍️ All Products</h2>
            <div className="products-grid">
              {allProducts.map(product => (
                <div key={product.id} className="product-card card">
                  <div className="product-image-wrapper">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/250x250'}
                      alt={product.name}
                      className="product-image"
                    />
                    {/* Product Badges */}
                    <div className="product-badges">
                      {product.isFeatured && <span className="badge featured">⭐ Featured</span>}
                      {product.isNewArrival && <span className="badge new">🆕 New</span>}
                      {product.isUsed && <span className="badge used">♻️ Used</span>}
                    </div>
                  </div>
                  <h4>{product.name}</h4>
                  <p className="text-light">{product.category}</p>
                  {product.shortDescription && (
                    <p className="product-description">{product.shortDescription}</p>
                  )}
                  <span className="price text-gold">Rs. {product.price.toFixed(2)}</span>
                  <div className="product-actions">
                    <Link to={`/product/${product.id}`} className="btn btn-secondary btn-small">
                      View
                    </Link>
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => {
                        addToCart(product, 1);
                        setIsCartOpen(true);
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
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Exclusive Offer: GNSONS20</h2>
          <p>Get 20% discount on your first order</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Shop Now
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <h3>🚚 Free Shipping</h3>
              <p>Nationwide delivery on all orders</p>
            </div>
            <div className="feature-item">
              <h3>💯 Authentic</h3>
              <p>100% genuine luxury products</p>
            </div>
            <div className="feature-item">
              <h3>🔒 Secure</h3>
              <p>Safe payments and data protection</p>
            </div>
            <div className="feature-item">
              <h3>💬 Support</h3>
              <p>24/7 customer assistance</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
