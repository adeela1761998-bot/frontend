import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
    const apiCategories = API_BASE.endsWith('/api') ? `${API_BASE}/categories` : `${API_BASE}/api/categories`;
    const fetchCats = async () => {
      try {
        const res = await fetch(apiCategories);
        if (!res.ok) return;
        const data = await res.json();
        setCategories((data.categories || []).map(c => c.name));
      } catch (err) {
        console.error('Footer categories fetch failed', err);
      }
    };
    fetchCats();
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h4>🔥 GN SONS</h4>
            <p>Premium luxury e-commerce platform delivering excellence.</p>
            <div className="social-links">
              <a href="#" title="Facebook">f</a>
              <a href="#" title="Instagram">📷</a>
              <a href="#" title="Twitter">𝕏</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              {categories.length > 0 && (
                <>
                  <li className="footer-section-title">Categories</li>
                  {categories.map(cat => (
                    <li key={cat}><Link to={`/products?category=${encodeURIComponent(cat)}`}>{cat}</Link></li>
                  ))}
                </>
              )}
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>📞 <strong>0302-0060496</strong></p>
            <p>📧 <strong>fysal3377@gmail.com</strong></p>
            <p>🕐 24/7 Support</p>
          </div>

          {/* Payment Methods */}
          <div className="footer-section">
            <h4>Payment Methods</h4>
            <ul>
              <li>💳 Cash on Delivery</li>
              <li>🏦 EasyPaisa</li>
              <li>📱 JazzCash</li>
            </ul>
          </div>
        </div>

        <hr style={{ borderColor: '#333333', margin: '30px 0' }} />

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <p>&copy; 2026 GN SONS. All rights reserved.</p>
          <p>Made with <span className="text-gold">❤️</span> for luxury lovers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
