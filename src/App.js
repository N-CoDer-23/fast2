// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FastFoodTable from './components/Foodtable/food';
import OrderSummary from './components/Foodtable2/foodtable2'; // Yangi sahifa komponenti

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FastFoodTable />} />
        <Route path="/order-summary" element={<OrderSummary />} />
      </Routes>
    </Router>
  );
}

export default App;
