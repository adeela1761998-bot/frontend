import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { productAPI } from '../services/api';
import { sanitizeHTML, sanitizeText } from '../utils/sanitizer';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getById(id);
        setProduct(data.product);
      } catch (error) {
        // Handle error silently - show in UI
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setIsCartOpen(true);
      // Show notification
      const notification = document.createElement('div');
      notification.textContent = `✅ ${quantity}x ${product.name} added to cart!`;
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
    }
  };

  if (loading) return <div className="container mt-4"><p>Loading...</p></div>;
  if (!product) return <div className="container mt-4"><p>Product not found</p></div>;

  return (
    <div className="product-detail">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/products')}>
          ← Back to Products
        </button>

        <div className="detail-layout">
          {/* Images */}
          <aside className="detail-images">
            <div className="main-image">
              <img
                src={product.images?.[selectedImage] || 'https://via.placeholder.com/400x400'}
                alt={product.name}
              />
            </div>
            <div className="thumbnail-images">
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className={selectedImage === idx ? 'active' : ''}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          </aside>

          {/* Details */}
          <main className="detail-info">
            <div className="badges-section">
              {product.isFeatured && <span className="badge featured">⭐ Featured Product</span>}
              {product.isNewArrival && <span className="badge new">🆕 New Arrival</span>}
              {product.isUsed && <span className="badge used">♻️ Used Product</span>}
            </div>

            <h1>{product.name}</h1>
            <p className="category text-light">{product.category}</p>

            {/* Pricing */}
            <div className="pricing">
              <span className="price text-gold">Rs. {product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="original-price">Rs. {product.originalPrice.toFixed(2)}</span>
                  <span className="discount">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">✕ Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="description">
              <h3>About This Product</h3>
              <p>{sanitizeText(product.fullDescription || product.shortDescription)}</p>
            </div>

            {/* Add to Cart */}
            {product.stock > 0 && (
              <div className="add-to-cart-section">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-control">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.stock}
                    />
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                  </div>
                </div>

                <button className="btn btn-primary" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            )}

            {/* Additional Info */}
            <div className="additional-info card">
              <div className="info-item">
                <h4>🚚 Free Shipping</h4>
                <p>Enjoy free shipping on all orders across Pakistan</p>
              </div>
              <div className="info-item">
                <h4>💯 Authentic Products</h4>
                <p>100% genuine luxury products guaranteed</p>
              </div>
              <div className="info-item">
                <h4>🔄 Easy Returns</h4>
                <p>30-day money-back guarantee</p>
              </div>
            </div>

            {/* Contact */}
            <div className="contact-section">
              <p className="text-light">Have questions? Contact us:</p>
              <p>
                <strong className="text-gold">📞 0302-0060496</strong>
              </p>
              <p>
                <strong className="text-gold">📧 fysal3377@gmail.com</strong>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
