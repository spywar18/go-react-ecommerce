import React, { useState, useEffect } from 'react';
import { productsAPI, cartAPI, ordersAPI } from '../services/api';

const ItemsList = ({ user, onLogout }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await productsAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId) => {
    try {
      await cartAPI.add({ item_id: itemId, quantity: 1 });
      window.alert('Item added to cart!');
    } catch (error) {
      window.alert('Error adding item to cart');
    }
  };

  const showCart = async () => {
    try {
      const response = await cartAPI.get();
      const cartItems = response.data.cart_items || [];
      if (cartItems.length === 0) {
        window.alert('Cart is empty');
      } else {
        const cartInfo = cartItems.map(item => 
          `Cart ID: ${item.cart_id}, Item: ${item.item.name} (ID: ${item.item_id})`
        ).join('\n');
        window.alert(`Cart Items:\n${cartInfo}`);
      }
    } catch (error) {
      window.alert('Error fetching cart or cart is empty');
    }
  };

  const showOrderHistory = async () => {
    try {
      const response = await ordersAPI.get();
      const orders = response.data || [];
      if (orders.length === 0) {
        window.alert('No orders found');
      } else {
        const orderInfo = orders.map(order => 
          `Order ID: ${order.id}, Total: $${order.total}`
        ).join('\n');
        window.alert(`Order History:\n${orderInfo}`);
      }
    } catch (error) {
      window.alert('Error fetching order history');
    }
  };

  const checkout = async () => {
    try {
      await ordersAPI.create();
      window.alert('Order successful!');
    } catch (error) {
      window.alert('Error creating order. Make sure you have items in your cart.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Welcome, {user.username}!</h2>
        <div>
          <button onClick={checkout} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            Checkout
          </button>
          <button onClick={showCart} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}>
            Cart
          </button>
          <button onClick={showOrderHistory} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
            Order History
          </button>
          <button onClick={onLogout} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
            Logout
          </button>
        </div>
      </div>

      <h3>Available Items</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {items.map(item => (
          <div key={item.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h4>{item.name}</h4>
            <p>{item.description}</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>${item.price}</p>
            <button 
              onClick={() => addToCart(item.id)}
              style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;