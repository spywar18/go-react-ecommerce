import React, { useState, useEffect, useCallback } from 'react';
import { ordersAPI } from '../services/api';

const OrderHistory = ({ user, onBack, onLogout, notification, showNotification }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await ordersAPI.get();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showNotification('Error loading order history', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <p>Loading your order history...</p>
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

      {/* Order History Content */}
      <div className="items-container">
        <div className="items-header">
          <h1>📋 Order History</h1>
          <p>Track your purchase history</p>
        </div>

        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order, index) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <h3>Order #{order.id}</h3>
                    <span className="order-status">✅ Completed</span>
                  </div>
                  <div className="order-date">
                    {formatDate(order.created_at)}
                  </div>
                </div>
                <div className="order-details">
                  <div className="order-info">
                    <p><strong>Cart ID:</strong> {order.cart_id}</p>
                    <p><strong>Total Amount:</strong> <span className="order-total">${order.total}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-orders">
            <div className="empty-orders-icon">📋</div>
            <h3>No orders yet</h3>
            <p>Your order history will appear here once you make your first purchase!</p>
            <button onClick={onBack} className="btn btn-primary">
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
