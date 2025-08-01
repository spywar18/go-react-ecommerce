import React, { useState, useEffect, useCallback } from 'react';
import { cartAPI, ordersAPI } from '../services/api';

const Cart = ({ user, onBack, onCheckout, onLogout, notification, showNotification }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      showNotification('Error loading cart', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const calculateTotal = () => {
    if (!cart || !cart.cart_items) return 0;
    return cart.cart_items.reduce((total, item) => total + item.item.price, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
      showNotification('Your cart is empty', 'error');
      return;
    }

    try {
      await ordersAPI.create();
      showNotification('Order placed!');
      setTimeout(() => {
        onBack();
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error creating order';
      showNotification(errorMessage, 'error');
    }
  };

  if (loading) {
    return (
      <div className="main-container">
        <nav className="navbar">
          <div className="navbar-content">
            <div className="navbar-brand">🛒 ShopEasy</div>
            <div className="navbar-user">
              <span className="user-info">Welcome, {user.username}!</span>
              <div className="navbar-buttons">
                <button onClick={onBack} className="btn btn-secondary">
                  ← Back to Shop
                </button>
                <button onClick={onLogout} className="btn btn-danger">
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="items-loading">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">🛒 ShopEasy</div>
          <div className="navbar-user">
            <span className="user-info">Welcome, {user.username}!</span>
            <div className="navbar-buttons">
              <button onClick={onBack} className="btn btn-secondary">
                ← Back to Shop
              </button>
              <button onClick={onLogout} className="btn btn-danger">
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

      {/* Cart Content */}
      <div className="items-container">
        <div className="items-header">
          <h1>🛍️ Shopping Cart</h1>
          <p>Review your items</p>
        </div>

        {cart && cart.cart_items && cart.cart_items.length > 0 ? (
          <div className="cart-content">
            <div className="cart-items">
              {cart.cart_items.map((cartItem, index) => (
                <div key={cartItem.id} className="cart-item">
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{cartItem.item.name}</h3>
                    <p className="cart-item-description">{cartItem.item.description}</p>
                  </div>
                  <div className="cart-item-price">
                    ${cartItem.item.price}
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Items ({cart.cart_items.length}):</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <hr />
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="checkout-button"
                >
                  🛒 Checkout Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started!</p>
            <button onClick={onBack} className="btn btn-primary">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
