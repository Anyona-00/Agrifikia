import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-light">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ChatInterface />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;