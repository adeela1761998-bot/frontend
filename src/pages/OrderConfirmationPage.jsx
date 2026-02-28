import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = location.state?.orderId;
    const orderData = location.state?.order;

    if (orderId && orderData) {
      setOrder(orderData);
      setLoading(false);
    } else {
      // If no order data in state, redirect to home
      navigate('/');
    }
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="container mt-4">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mt-4">
        <h1>Order not found</h1>
        <p><a href="/">Back to Home</a></p>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-wrapper">
          {/* Success Icon */}
          <div className="success-icon-wrapper">
            <div className="success-icon">✓</div>
          </div>

          {/* Success Message */}
          <div className="success-message">
            <h1>Order Confirmed!</h1>
            <p>Thank you for your order. We'll send you a confirmation email shortly.</p>
          </div>

          {/* Order Details Card */}
          <div className="order-details-card card">
            <h2>Order Details</h2>

            {/* Order ID */}
            <div className="detail-section">
              <h3>Order Number</h3>
              <p className="order-id">{order._id}</p>
              <p className="detail-hint">Save this for your records</p>
            </div>

            {/* Tracking Number */}
            <div className="detail-section">
              <h3>Tracking Number</h3>
              <p className="tracking-number">{order.trackingNumber}</p>
            </div>

            {/* Customer Info */}
            <div className="detail-section">
              <h3>Delivery Information</h3>
              <div className="info-box">
                <p><strong>Email:</strong> {order.customerEmail}</p>
                <p><strong>Phone:</strong> {order.customerPhone}</p>
                <p><strong>Address:</strong> {order.shippingAddress}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="detail-section">
              <h3>Items Ordered</h3>
              <div className="items-list">
                {order.items.map((item, idx) => (
                  <div key={idx} className="confirmation-item">
                    <span className="item-name">{item.productName}</span>
                    <span className="item-qty">Qty: {item.quantity}</span>
                    <span className="item-price text-gold">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="detail-section">
              <h3>Payment Summary</h3>
              <div className="price-summary">
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>Rs. {order.totalPrice.toFixed(2)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="price-row discount">
                    <span>Discount:</span>
                    <span>-Rs. {order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="price-row total">
                  <span>Total:</span>
                  <span className="text-gold">Rs. {order.finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="detail-section">
              <h3>Payment Method</h3>
              <p className="payment-method">{order.paymentMethod}</p>
            </div>

            {/* Order Status */}
            <div className="detail-section">
              <h3>Order Status</h3>
              <div className="status-badge" data-status={order.status.toLowerCase()}>
                {order.status}
              </div>
              <p className="status-hint">We'll update you when your order ships</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps-card card">
            <h2>What's Next?</h2>
            <ol className="steps-list">
              <li>
                <span className="step-number">1</span>
                <div>
                  <strong>Order Confirmation</strong>
                  <p>You'll receive a confirmation email with your order details</p>
                </div>
              </li>
              <li>
                <span className="step-number">2</span>
                <div>
                  <strong>Processing</strong>
                  <p>We'll prepare your order for shipment (1-2 business days)</p>
                </div>
              </li>
              <li>
                <span className="step-number">3</span>
                <div>
                  <strong>Shipment</strong>
                  <p>Your order will be shipped with tracking number</p>
                </div>
              </li>
              <li>
                <span className="step-number">4</span>
                <div>
                  <strong>Delivery</strong>
                  <p>Receive your order at your doorstep</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="confirmation-actions">
            <button 
              className="btn-primary"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/contact')}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
