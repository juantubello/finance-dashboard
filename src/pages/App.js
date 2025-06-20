import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import CardExpensesPage from '../components/CardExpensesPage';
import SyncDataPage from '../components/SyncDataPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/card-expenses" element={<Layout><CardExpensesPage /></Layout>} />
        <Route path="/sync-data" element={<Layout><SyncDataPage /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;