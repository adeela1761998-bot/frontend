import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-text">
          <h1>About GNSONS</h1>
          <p className="hero-subtitle">Our Journey from Beginning to Today</p>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                GNSONS was founded on the principles of love, quality, and customer service. We are a family business proud to provide our customers with the finest products and exceptional service.
              </p>
              <p>
                Our team works every day to ensure you get exactly what you need. We believe that quality and integrity are the keys to success. With years of experience and dedication, we have become a trusted name in the industry.
              </p>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                  <rect width="400" height="300" fill="#f0f0f0"/>
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#999" fontSize="24">
                    GNSONS Logo
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To provide every customer with premium quality products and exceptional service so they remain satisfied and happy.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>
                To become a brand known for quality, reliability, innovation, and excellence in everything we do.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">💚</div>
              <h3>Our Values</h3>
              <p>
                Integrity, quality, innovation, and customer service are the core values that guide our business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose">
        <div className="container">
          <h2>Why Choose GNSONS?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <h4>Premium Quality Products</h4>
              <p>We provide only the highest quality products to our customers</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <h4>Fast Delivery</h4>
              <p>Quick and reliable delivery to your doorstep</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <h4>Reliable Service</h4>
              <p>Always ready to help you with any questions</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <h4>Fair Pricing</h4>
              <p>Best prices for premium quality products</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <h4>Easy Return Policy</h4>
              <p>If you're not satisfied, returns are simple and hassle-free</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <h4>24/7 Support</h4>
              <p>Always available to answer your questions and concerns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Our Team</h2>
          <p className="team-intro">
            Every member of our team is passionate about their work and committed to providing you with exceptional service.
          </p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta">
        <div className="container">
          <h2>Get In Touch</h2>
          <p>Have any questions or suggestions? Please feel free to contact us</p>
          <Link to="/contact" className="cta-button">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
