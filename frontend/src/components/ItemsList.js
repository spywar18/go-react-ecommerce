import React, { useState, useEffect } from 'react';
import { productsAPI, cartAPI, ordersAPI } from '../services/api';
import Cart from './Cart';
import OrderHistory from './OrderHistory';

const ItemsList = ({ user, onLogout }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await productsAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      showNotification('Error loading items. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(''), 3000);
  };

  const addToCart = async (itemId) => {
    try {
      await cartAPI.add({ item_id: itemId });
      showNotification('Item added to cart successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error adding item to cart';
      showNotification(errorMessage, 'error');
    }
  };

  const handleCheckout = async () => {
    try {
      await ordersAPI.create();
      showNotification('Order placed successfully!');
      setShowCart(false);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error creating order. Make sure you have items in your cart.';
      showNotification(errorMessage, 'error');
    }
  };

  if (loading) {
    return (
      <div className="items-loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  if (showCart) {
    return (
      <Cart 
        user={user} 
        onBack={() => setShowCart(false)} 
        onCheckout={handleCheckout}
        onLogout={onLogout}
        notification={notification}
        showNotification={showNotification}
      />
    );
  }

  if (showOrders) {
    return (
      <OrderHistory 
        user={user} 
        onBack={() => setShowOrders(false)}
        onLogout={onLogout}
        notification={notification}
        showNotification={showNotification}
      />
    );
  }

  return (
    <div className="main-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            🛒 ShopEasy
          </div>
          <div className="navbar-user">
            <span className="user-info">Welcome, {user.username}!</span>
            <div className="navbar-buttons">
              <button 
                onClick={() => setShowCart(true)} 
                className="btn btn-primary"
              >
                🛍️ Cart
              </button>
              <button 
                onClick={() => setShowOrders(true)} 
                className="btn btn-secondary"
              >
                📋 Orders
              </button>
              <button 
                onClick={onLogout} 
                className="btn btn-danger"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      <div className="items-container">
        <div className="items-header">
          <h1>🛍️ Our Amazing Products</h1>
          <p>Discover our carefully curated collection of premium items</p>
        </div>

        <div className="items-grid">
          {items.map((item, index) => (
            <div key={item.id} className="item-card" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="item-name">{item.name}</div>
              <div className="item-description">{item.description}</div>
              <div className="item-price">${item.price}</div>
              <div className="item-actions">
                <button 
                  onClick={() => addToCart(item.id)}
                  className="btn-add-to-cart"
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="empty-state">
            <h3>No items available</h3>
            <p>Check back later for new products!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsList;