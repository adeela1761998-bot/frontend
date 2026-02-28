import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { orderAPI } from '../services/api';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [selectedPaymentTab, setSelectedPaymentTab] = useState('BANK');

  const total = location.state?.total || cart.total;
  const discount = location.state?.discount || 0;

  const paymentAccounts = {
    BANK: { name: 'Bank Account', number: '0302-0060496' },
    EASYPAISA: { name: 'EasyPaisa', number: '0302-0060496' },
    JAZZCASH: { name: 'JazzCash', number: '0302-0060496' }
  };

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    paymentMethod: 'COD',
    paymentScreenshot: null,
    paymentScreenshotPreview: null
  });
  const [screenshotError, setScreenshotError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Update payment method when user selects a payment option
  const updatePaymentMethod = (method) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    setScreenshotError('');
    
    if (!file) {
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setScreenshotError('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setScreenshotError('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        paymentScreenshot: file,
        paymentScreenshotPreview: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    setFormData(prev => ({
      ...prev,
      paymentScreenshot: null,
      paymentScreenshotPreview: null
    }));
    setScreenshotError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        userId: 'guest',
        customerName: formData.customerName,
        items: cart.items,
        totalPrice: cart.total,
        discountAmount: discount,
        couponCode: discount > 0 ? 'GNSONS20' : null,
        shippingAddress: formData.shippingAddress,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        paymentMethod: formData.paymentMethod || 'ONLINE_TRANSFER',
        paymentScreenshot: formData.paymentScreenshotPreview || null
      };

      console.log('📤 Sending order data:', orderData);
      const result = await orderAPI.create(orderData);
      
      console.log('📥 Order response:', result);

      if (result.success) {
        clearCart();
        navigate('/order-confirmation', { 
          state: { orderId: result.orderId, order: result.order } 
        });
      } else {
        alert(`Error: ${result.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('❌ Order creation error:', error);
      const errorMsg = error?.message || 'Unknown error';
      alert(`Error creating order: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mt-4">
        <h1>Checkout</h1>
        <p>Your cart is empty. <a href="/products">Shop now</a></p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          {/* Order Summary */}
          <aside className="order-summary-section card">
            <h3>Order Summary</h3>
            <div className="order-items">
              {cart.items.map(item => (
                <div key={item.productId} className="order-item">
                  <span>{item.productName} × {item.quantity}</span>
                  <span className="text-gold">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>Rs. {cart.total.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="total-row discount">
                  <span>Discount:</span>
                  <span>-Rs. {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="total-row shipping">
                <span>Shipping:</span>
                <span className="text-gold">FREE</span>
              </div>
              <div className="total-row final">
                <span>Total:</span>
                <span className="text-gold">Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          </aside>

          {/* Checkout Form */}
          <main className="checkout-form">
            <form onSubmit={handleSubmit}>
              <fieldset>
                <legend>Contact Information</legend>
                <div className="form-group">
                  <label htmlFor="customerName">Full Name *</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerEmail">Email *</label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerPhone">Phone Number *</label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                    placeholder="0300-1234567"
                  />
                </div>
              </fieldset>

              <fieldset>
                <legend>Shipping Address</legend>
                <div className="form-group">
                  <label htmlFor="shippingAddress">Address *</label>
                  <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Enter your complete shipping address (Street, City, Postal Code)"
                  ></textarea>
                </div>
              </fieldset>

              <fieldset>
                <legend>💳 Payment Method</legend>
                
                {/* COD Option */}
                <div className="payment-options">
                  <button
                    type="button"
                    className={`payment-option-btn ${formData.paymentMethod === 'COD' ? 'selected' : ''}`}
                    onClick={() => {
                      updatePaymentMethod('COD');
                      setSelectedPaymentTab(null);
                    }}
                    title="Cash on Delivery"
                  >
                    <span className="payment-icon">💵</span>
                    <span className="payment-label">Cash on Delivery (COD)</span>
                  </button>
                </div>

                {/* Account Details for Payment Methods */}
                <div className="account-details-box">
                  <h4>💳 Online Transfer Account Details</h4>
                  <div className="account-tabs">
                    {Object.entries(paymentAccounts).map(([key, account]) => (
                      <button
                        key={key}
                        type="button"
                        className={`account-tab ${
                          selectedPaymentTab === key && formData.paymentMethod !== 'COD' ? 'active' : ''
                        }`}
                        onClick={() => {
                          setSelectedPaymentTab(key);
                          // Save payment method when tab is clicked
                          const methodMap = {
                            'BANK': 'ONLINE_TRANSFER',
                            'EASYPAISA': 'EASYPAISA',
                            'JAZZCASH': 'JAZZCASH'
                          };
                          updatePaymentMethod(methodMap[key]);
                        }}
                        title={`Pay via ${account.name}`}
                      >
                        {account.name}
                      </button>
                    ))}
                  </div>
                  <div className="account-info">
                    <p className="account-label">Account Number:</p>
                    <div className="account-number-display">
                      <span className="account-number">{paymentAccounts[selectedPaymentTab]?.number || '0302-0060496'}</span>
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() => {
                          const accountNum = paymentAccounts[selectedPaymentTab]?.number || '0302-0060496';
                          navigator.clipboard.writeText(accountNum);
                          alert('✅ Account number copied to clipboard!');
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payment Screenshot Upload */}
                <div className="payment-screenshot-section">
                  <h4>📸 Payment Receipt Screenshot</h4>
                  <p className="screenshot-info">Upload a screenshot of your payment confirmation (Optional but recommended)</p>
                  
                  {!formData.paymentScreenshotPreview ? (
                    <div className="screenshot-upload-area">
                      <input
                        type="file"
                        id="paymentScreenshot"
                        name="paymentScreenshot"
                        onChange={handleScreenshotUpload}
                        accept="image/*"
                        className="screenshot-input"
                      />
                      <label htmlFor="paymentScreenshot" className="screenshot-label">
                        <div className="upload-icon">📷</div>
                        <p className="upload-text">Click to upload or drag and drop</p>
                        <p className="upload-hint">JPG, PNG or WebP (Max 5MB)</p>
                      </label>
                    </div>
                  ) : (
                    <div className="screenshot-preview-container">
                      <div className="screenshot-preview">
                        <img src={formData.paymentScreenshotPreview} alt="Payment screenshot preview" />
                        <button
                          type="button"
                          className="remove-screenshot-btn"
                          onClick={removeScreenshot}
                          title="Remove screenshot"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="screenshot-info-display">
                        <p className="success-text">✓ Screenshot uploaded successfully!</p>
                        <p className="file-name">{formData.paymentScreenshot.name}</p>
                        <p className="file-size">Size: {(formData.paymentScreenshot.size / 1024).toFixed(2)} KB</p>
                        <button
                          type="button"
                          className="change-screenshot-btn"
                          onClick={() => document.getElementById('paymentScreenshot').click()}
                        >
                          Change Screenshot
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {screenshotError && (
                    <div className="screenshot-error">
                      <span>⚠️ {screenshotError}</span>
                    </div>
                  )}
                </div>
              </fieldset>

              <div className="terms">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to the terms and conditions
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Processing Order...' : `Place Order - Rs. ${total.toFixed(2)}`}
              </button>

              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/cart')}
              >
                Back to Cart
              </button>
            </form>
          </main>
        </div>

        {/* Support */}
        <div className="checkout-support">
          <p><strong>Need help?</strong> Contact us at <strong className="text-gold">0302-0060496</strong> or <strong className="text-gold">fysal3377@gmail.com</strong></p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
