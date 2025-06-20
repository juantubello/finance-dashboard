import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard';  // Adjusted path
import CardExpensesPage from '../components/CardExpensesPage';  // Adjusted path

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* Updated route without required cardType parameter */}
        <Route path="/card-expenses" element={<CardExpensesPage />} />
        {/* Optional: Keep this if you want to support direct card type access */}
        <Route path="/card-expenses/:cardType" element={<CardExpensesPage />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;