import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ItemDetailPage from './pages/ItemDetailPage';
import PostItemPage from './pages/PostItemPage';
import RequestsPage from './pages/RequestsPage';
import MeetupModal from './components/MeetupModal';
import './App.css';

function App() {
  const [showMeetupModal, setShowMeetupModal] = useState(false);

  return (
    <Router>
      <div className="app">
        <Navigation />
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route path="/post" element={<PostItemPage />} />
          <Route path="/requests" element={<RequestsPage />} />
        </Routes>

        {/* Demo button to show meetup modal */}
        <div className="demo-controls">
          <button 
            className="btn-primary demo-btn"
            onClick={() => setShowMeetupModal(true)}
          >
            🎯 Demo Meetup Modal
          </button>
        </div>

        {/* Meetup Modal */}
        <MeetupModal
          isOpen={showMeetupModal}
          onClose={() => setShowMeetupModal(false)}
          itemTitle="Arduino Uno R3"
          otherPersonName="Sarah Chen"
        />

        {/* Wireframe Info Footer */}
        <div className="wireframe-info">
          <div className="container">
            <h3>🎨 Purdue SpareSwap Wireframes</h3>
            <p>
              This is a wireframe demonstration of the Purdue-themed engineering parts sharing app. 
              Navigate between pages using the top navigation to explore all the different screens and components.
            </p>
            <div className="wireframe-features">
              <div className="feature-item">
                <span className="feature-icon">🔐</span>
                <span>Purdue Email Authentication</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <span>Browse & Search Parts</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📝</span>
                <span>Post Items with AI Assistance</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💬</span>
                <span>Request & Message System</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📍</span>
                <span>Smart Meetup Suggestions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
