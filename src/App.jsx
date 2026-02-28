/**
 * App Component - Main entry point for GN SONS Frontend
 * 
 * Provides routing for:
 * - Homepage with featured products
 * - Products listing with filters and search
 * - Product details page
 * - Shopping cart and checkout
 * - Contact page
 * 
 * Layout includes Header, Footer, Chat widget, and Cart widget
 */

import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import CartWidget from './components/CartWidget';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AboutPage from './pages/AboutPage';

// Styles
import './styles/global.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Header isAdmin={false} />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<div className="container mt-4"><h1>404 - Page Not Found</h1></div>} />
            </Routes>
          </main>

          <ChatWidget />
          <CartWidget />
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
