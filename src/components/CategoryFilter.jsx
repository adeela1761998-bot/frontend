import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./CategoryFilter.css";

/**
 * CategoryFilter Component
 * Props:
 * - categories: array of category names from API
 */

const CategoryFilter = ({ categories = [] }) => {
  const location = useLocation();

  // Get current category from URL
  const queryParams = new URLSearchParams(location.search);
  const currentCategory = queryParams.get("category");

  // Remove duplicates & normalize
  const uniqueCategories = [...new Set(categories)];

  return (
    <div className="filter-group">
      <h4>Category</h4>

      <ul>
        {/* All Products */}
        <li>
          <Link
            to="/products"
            className={!currentCategory ? "active" : ""}
          >
            All Products
          </Link>
        </li>

        {/* Dynamic Categories */}
        {uniqueCategories.map((cat, index) => (
          <li key={index}>
            <Link
              to={`/products?category=${encodeURIComponent(cat)}`}
              className={currentCategory === cat ? "active" : ""}
            >
              {cat}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;