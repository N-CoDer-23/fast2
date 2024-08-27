// OrderSummary.js
import React, { useEffect, useState } from 'react';
import './food2.css';

const OrderSummary = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const savedItems = localStorage.getItem('selectedItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  if (!items || items.length === 0) {
    return (
      <div className="order-summary">
        <div className="order-header">
          <h2>Order Summary</h2>
        </div>
        <div className="order-items">
          <p>No items selected.</p>
        </div>
        <div className="order-footer">
          <p>Please select items to view your order.</p>
        </div>
        <button>Pay</button>
      </div>
    );
  }

  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.price.replace(/^\$/, '')) * (item.quantity || 0)), 0);

  return (
    <div className="order-summary">
      <div className="order-header">
        <h2>Order Summary</h2>
      </div>
      <div className="order-items">
        {items.map(item => (
          <div className="order-item" key={item._id}>
            <div className="order-item-name">
              <img src="path/to/your/image.png" alt="item icon" />
              {item.name}
            </div>
            <div className="order-item-price">
              ${item.price.replace(/^\$/, '')} x {item.quantity}
            </div>
          </div>
        ))}
      </div>
      <div className="order-total">
        <span>Total</span>
        <span>${totalAmount.toFixed(2)}</span>
      </div>
      <div className="order-footer">
        Thank you for your order!
      </div>
    </div>
  );
};

export default OrderSummary;
