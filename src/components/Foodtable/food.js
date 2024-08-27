import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './food.css';

const FastFoodTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/food/getFastFood')
      .then(response => {
        setData(response.data.innerData || []);
      })
      .catch(error => {
        setError(error);
      });
  }, []);

  useEffect(() => {
    const savedItems = localStorage.getItem('selectedItems');
    if (savedItems) {
      setSelectedItems(JSON.parse(savedItems));
    }
  }, []);

  const handleAddClick = (id) => {
    setData(prevData => {
      const updatedData = prevData.map(item =>
        item._id === id ? { ...item, showControls: true, quantity: (item.quantity || 0) } : item
      );
      const selected = updatedData.find(item => item._id === id);
      if (selected) {
        setSelectedItems(prev => {
          const updatedSelected = [...prev, selected];
          localStorage.setItem('selectedItems', JSON.stringify(updatedSelected));
          return updatedSelected;
        });
      }
      return updatedData;
    });
  };

  const handleIncrement = (id) => {
    setData(prevData => 
      prevData.map(item => 
        item._id === id ? { ...item, quantity: (item.quantity || 0) + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setData(prevData => 
      prevData.map(item => {
        if (item._id === id) {
          const newQuantity = Math.max((item.quantity || 0) - 1, 0);
          return { 
            ...item, 
            quantity: newQuantity,
            showControls: newQuantity > 0
          };
        }
        return item;
      })
    );
  };

  const handleDeleteClick = (id) => {
    axios.delete(`http://localhost:5000/food/deleteFastFood/${id}`)
      .then(() => {
        setData(prevData => prevData.filter(item => item._id !== id));
        setSelectedItems(prevItems => {
          const updatedSelected = prevItems.filter(item => item._id !== id);
          localStorage.setItem('selectedItems', JSON.stringify(updatedSelected));
          return updatedSelected;
        });
      })
      .catch(error => {
        setError(error);
      });
  };

  const handleOrderClick = () => {
    const selectedItemsData = data.filter(item => item.quantity > 0);
    localStorage.setItem('selectedItems', JSON.stringify(selectedItemsData));
    navigate('/order-summary');
  };

  if (error) return <p>Error: {error.message}</p>;
  if (!Array.isArray(data)) return <p>Data is not an array</p>;

  return (
    <div className="fast-food-menu">
      <h1>Fast Food Items</h1>
      <div className="menu-grid">
        {data.map((item) => (
          <div className="menu-item" key={item._id}>
            <div className="item-details">
              <div className="item-img">
                <img src={item.image} alt={item.name} />
              </div>
              {item.showControls && (
                <div className="item-quantity-display">
                  {item.quantity || 0}
                </div>
              )}
              <div className="item-name">{item.name} - ${item.price.replace(/^\$/, '')}</div>
              {!item.showControls ? (
                <button 
                  className="item-add-btn" 
                  onClick={() => handleAddClick(item._id)}
                >
                  ADD
                </button>
              ) : (
                <div className="quantity-controls">
                  <button 
                    className="control-btn increment" 
                    onClick={() => handleIncrement(item._id)}
                  >
                    +
                  </button>
                  <button 
                    className="control-btn decrement" 
                    onClick={() => handleDecrement(item._id)}
                  >
                    -
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <button className='view-order-btn' onClick={handleOrderClick}>View Order</button>
    </div>
  );
};

export default FastFoodTable;
