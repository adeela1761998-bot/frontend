/**
 * Frontend API Service
 * 
 * Centralized HTTP client for all backend API calls
 * Handles authentication with JWT tokens
 * Provides methods for:
 * - Product browsing and filtering
 * - Shopping cart management
 * - Order placement and tracking
 * - User authentication and profile
 * - Chat/messaging functionality
 * - Contact form submissions
 * 
 * Base URL: comes from `VITE_API_BASE_URL` environment variable
 * (fallback: http://localhost:5000/api)
 *
 * Note: Set `VITE_API_BASE_URL` in `.env` (copy `.env.example`).
 */

// 🌍 API Service
// Centralized API calls to backend 


const API_BASE = import.meta.env.VITE_API_BASE_URL ;
console.log(`API Base URL: ${API_BASE}`);

// ============================================
// PRODUCTS
// ============================================

export const productAPI = {
  // Get all products with filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE}/products?${params}`);
    return response.json();
  },

  // Get single product
  getById: async (id) => {
    const response = await fetch(`${API_BASE}/products/${id}`);
    return response.json();
  },

  // Get by category
  getByCategory: async (category) => {
    const response = await fetch(`${API_BASE}/products/category/${category}`);
    return response.json();
  },

  // Get categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE}/products/list/categories`);
    return response.json();
  }
};

// ============================================
// CART
// ============================================

export const cartAPI = {
  // Get cart
  get: async (userId) => {
    const response = await fetch(`${API_BASE}/cart/${userId}`);
    return response.json();
  },

  // Add to cart
  add: async (data, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Remove from cart
  remove: async (data, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}/cart/remove`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Update quantity
  update: async (data, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}/cart/update`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Clear cart
  clear: async (userId) => {
    const response = await fetch(`${API_BASE}/cart/clear/${userId}`, {
      method: 'POST'
    });
    return response.json();
  }
};

// ============================================
// ORDERS
// ============================================

export const orderAPI = {
  // Create order
  create: async (data) => {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Get order by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE}/orders/${id}`);
    return response.json();
  },

  // Get user orders
  getUserOrders: async (userId) => {
    const response = await fetch(`${API_BASE}/orders/user/${userId}`);
    return response.json();
  }
};

// ============================================
// AUTH
// ============================================

export const authAPI = {
  // Register
  register: async (data) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Get profile
  getProfile: async (token) => {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  // Update profile
  updateProfile: async (data, token) => {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

// ============================================
// CHAT
// ============================================

export const chatAPI = {
  // Send message
  sendMessage: async (data, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}/chat/send`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send message');
    }

    return response.json();
  },

  // Get conversation
  getConversation: async (conversationId) => {
    const response = await fetch(`${API_BASE}/chat/conversation/${conversationId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch conversation');
    }

    return response.json();
  }
};

// ============================================
// CONTACT
// ============================================

export const contactAPI = {
  // Submit form
  submit: async (data) => {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
