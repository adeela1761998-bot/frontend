import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const applyCoupon = () => {
    if (couponCode === 'GNSONS20') {
      const discountAmount = cart.total * 0.20;
      setDiscount(discountAmount);
      alert('Coupon applied! 20% discount');
    } else {
      alert('Invalid coupon code');
      setDiscount(0);
    }
  };

  const finalTotal = cart.total - discount;

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Shopping Cart</h1>
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <main className="cart-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map(item => (
                  <tr key={item.productId} className="cart-item">
                    <td className="item-name">
                      <div className="item-with-badge">
                        <img src={item.image || 'https://via.placeholder.com/50'} alt={item.productName} />
                        <div className="item-info">
                          <span>{item.productName}</span>
                          <div className="item-badges-inline">
                            {item.isFeatured && <span className="badge-small featured">⭐ Featured</span>}
                            {item.isNewArrival && <span className="badge-small new">🆕 New</span>}
                            {item.isUsed && <span className="badge-small used">♻️ Used</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>Rs. {item.price.toFixed(2)}</td>
                    <td>
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                          min="1"
                        />
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td className="item-total text-gold">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="btn-remove"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </main>

          {/* Order Summary */}
          <aside className="order-summary card">
            <h3>Order Summary</h3>

            {/* Coupon */}
            <div className="coupon-section">
              <label>Coupon Code</label>
              <div className="coupon-input">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button className="btn btn-small" onClick={applyCoupon}>
                  Apply
                </button>
              </div>
              <p className="text-light" style={{ fontSize: '0.85rem' }}>
                Try: GNSONS20 (20% off)
              </p>
            </div>

            <hr style={{ borderColor: '#333333', margin: '15px 0' }} />

            {/* Pricing */}
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>Rs. {cart.total.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="price-row discount">
                  <span>Discount:</span>
                  <span>-Rs. {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="price-row shipping">
                <span>Shipping:</span>
                <span className="text-gold">FREE</span>
              </div>
              <div className="price-row total">
                <span>Total:</span>
                <span className="text-gold">Rs. {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <hr style={{ borderColor: '#333333', margin: '15px 0' }} />

            {/* Actions */}
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '10px' }}
              onClick={() => navigate('/checkout', { state: { total: finalTotal, discount } })}
            >
              Proceed to Checkout
            </button>

            <button
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>

            <button
              className="btn-clear"
              onClick={() => {
                if (confirm('Clear entire cart?')) clearCart();
              }}
            >
              Clear Cart
            </button>

            {/* Support */}
            <div className="support-info">
              <p className="text-light" style={{ fontSize: '0.85rem', marginTop: '20px' }}>
                <strong>Need help?</strong>
              </p>
              <p className="text-light" style={{ fontSize: '0.85rem' }}>
                📞 0302-0060496
              </p>
              <p className="text-light" style={{ fontSize: '0.85rem' }}>
                📧 fysal3377@gmail.com
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
