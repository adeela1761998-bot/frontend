import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Header.css";

const Header = ({ isAdmin = false }) => {
  const { cart, isCartOpen, setIsCartOpen } = useContext(CartContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Scroll Shrink
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close Mobile Menu on Resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container header-container">

        {/* LOGO */}
        <div className="logo">
          <a href={isAdmin ? "/admin" : "/"}>
            <span className="logo-text">🔥 GN SONS 🔥</span>
          </a>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="nav desktop-nav">
          {!isAdmin ? (
            <>
              <a href="/">Home</a>
              <a href="/products">Products</a>
              <a href="/contact">Contact</a>
              <a href="/about">About</a>
            </>
          ) : (
            <>
              <a href="/admin">Dashboard</a>
              <a href="/admin/products">Products</a>
              <a href="/admin/orders">Orders</a>
              <a href="/admin/chats">Messages</a>
            </>
          )}
        </nav>

        {/* RIGHT SIDE */}
        <div className="header-right">
          {!isAdmin && (
            <button
              className="cart-btn"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              🛒 Cart
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
          )}

          {/* HAMBURGER */}
          <button
            className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {isMobileMenuOpen && (
        <nav className="mobile-nav">
          {!isAdmin ? (
            <>
              <a href="/">Home</a>
              <a href="/products">Products</a>
              <a href="/contact">Contact</a>
              <a href="/about">About</a>
              <a href="/cart" className="mobile-cart">
                🛒 Cart ({cartCount})
              </a>
            </>
          ) : (
            <>
              <a href="/admin">Dashboard</a>
              <a href="/admin/products">Products</a>
              <a href="/admin/orders">Orders</a>
              <a href="/admin/chats">Messages</a>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;