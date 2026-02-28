import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FrontendCategories.css';

const FrontendCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError('');
      try {
        const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
        const url = base.endsWith('/api') ? `${base}/categories` : `${base}/api/categories`;
        const response = await axios.get(url);

        if (response.data && response.data.success) {
          setCategories(response.data.data || []);
        } else {
          setError('Failed to load categories');
        }
      } catch (err) {
        console.error('Category fetch error:', err);
        setError('Unable to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="categories-spinner">Loading</div>;
  }

  if (error) {
    return <div className="categories-error">{error}</div>;
  }

  if (categories.length === 0) {
    return <div className="categories-none">No categories found.</div>;
  }

  return (
    <div className="categories-grid">
      {categories.map((cat, idx) => (
        <div key={idx} className="category-card">
          <div className="category-name">{cat.name}</div>
        </div>
      ))}
    </div>
  );
};

export default FrontendCategories;
