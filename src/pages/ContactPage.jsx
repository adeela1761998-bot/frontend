import React, { useState } from 'react';
import { contactAPI } from '../services/api';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Always update the value, no restrictions
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await contactAPI.submit(formData);
      if (result.success) {
        setMessage('✓ Message sent! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      setMessage('✕ Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p className="text-light">Get in touch with our team</p>
        </div>

        <div className="contact-layout">
          {/* Contact Info */}
          <aside className="contact-info">
            <div className="info-card card">
              <h3>📞 Phone</h3>
              <p className="text-gold">0302-0060496</p>
              <p className="text-light">Available 24/7</p>
            </div>

            <div className="info-card card">
              <h3>📧 Email</h3>
              <p className="text-gold">fysal3377@gmail.com</p>
              <p className="text-light">Response within 24 hours</p>
            </div>

            <div className="info-card card">
              <h3>🌍 Location</h3>
              <p className="text-light">Pakistan</p>
              <p className="text-light">Serving nationwide</p>
            </div>

            <div className="info-card card">
              <h3>🕐 Hours</h3>
              <p className="text-light">Monday - Friday: 9 AM - 6 PM</p>
              <p className="text-light">Saturday - Sunday: 10 AM - 5 PM</p>
            </div>
          </aside>

          {/* Contact Form */}
          <main className="contact-form-section">
            <div className="card">
              <h2>Send us a Message</h2>

              {message && (
                <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={handleBlur}
                    required
                    placeholder="John Doe"
                    autoComplete="name"
                    minLength="2"
                    className={focusedField === 'name' ? 'focused' : ''}
                  />
                  {formData.name && <span className="char-count">{formData.name.length} characters</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    required
                    placeholder="john@example.com"
                    autoComplete="email"
                    className={focusedField === 'email' ? 'focused' : ''}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => handleFocus('phone')}
                    onBlur={handleBlur}
                    placeholder="0300-1234567"
                    autoComplete="tel"
                    className={focusedField === 'phone' ? 'focused' : ''}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => handleFocus('subject')}
                    onBlur={handleBlur}
                    required
                    placeholder="Order Inquiry"
                    className={focusedField === 'subject' ? 'focused' : ''}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus('message')}
                    onBlur={handleBlur}
                    required
                    rows="6"
                    placeholder="Your message here..."
                    className={focusedField === 'message' ? 'focused' : ''}
                  ></textarea>
                  {formData.message && <span className="char-count">{formData.message.length} characters</span>}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
