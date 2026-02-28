import React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './CartWidget.css';

const CartWidget = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen } = useContext(CartContext);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  const handleClose = () => {
    setIsCartOpen(false);
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-widget">
        <div className="cart-widget-overlay" onClick={handleClose}></div>
        <div className="cart-widget-panel">
          <div className="cart-widget-header">
            <h3>Shopping Cart</h3>
            <button className="close-btn" onClick={handleClose}>✕</button>
          </div>
          <div className="cart-widget-empty">
            <p>Your cart is empty</p>
            <button className="btn btn-primary" onClick={() => { setIsCartOpen(false); navigate('/products'); }}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-widget">
      <div className="cart-widget-overlay" onClick={handleClose}></div>
      <div className="cart-widget-panel">
        {/* Header */}
        <div className="cart-widget-header">
          <h3>Shopping Cart ({cart.items.length} items)</h3>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>

        {/* Items */}
        <div className="cart-widget-items">
          {cart.items.map(item => (
            <div key={item.productId} className="cart-widget-item">
              <div className="item-image-wrapper">
                <img 
                  src={item.image || 'https://via.placeholder.com/60'} 
                  alt={item.productName}
                  className="item-image"
                />
                {/* Product Type Badges */}
                <div className="item-badges">
                  {item.isFeatured && <span className="badge featured" title="Featured Product">⭐</span>}
                  {item.isNewArrival && <span className="badge new" title="New Arrival">🆕</span>}
                  {item.isUsed && <span className="badge used" title="Used Product">♻️</span>}
                </div>
              </div>
              <div className="item-details">
                <h4>{item.productName}</h4>
                <p className="item-price">Rs. {item.price.toFixed(2)}</p>
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div className="item-total">
                <p>Rs. {(item.price * item.quantity).toFixed(2)}</p>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.productId)}
                  title="Remove from cart"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="cart-widget-divider"></div>

        {/* Summary */}
        <div className="cart-widget-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>Rs. {cart.total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span className="text-primary">FREE</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span className="text-gold">Rs. {cart.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="cart-widget-actions">
          <button className="btn btn-secondary" onClick={handleViewCart}>
            View Cart
          </button>
          <button className="btn btn-primary" onClick={handleCheckout}>
            Checkout
          </button>
        </div>

        {/* Clear Cart */}
        <button 
          className="clear-cart-btn"
          onClick={() => {
            if (window.confirm('Clear entire cart?')) {
              clearCart();
              setIsCartOpen(false);
            }
          }}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default CartWidget;
