import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import User from './pages/User';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/User" element={<User />} />
    </Routes>
  </Router>
);

export default App;