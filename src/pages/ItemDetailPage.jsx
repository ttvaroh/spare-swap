import React from 'react';
import './ItemDetailPage.css';

const ItemDetailPage = () => {
  // Mock data for demonstration
  const mockItem = {
    id: 1,
    title: "Arduino Uno R3",
    owner: "Sarah Chen",
    description: "This Arduino Uno R3 is in excellent condition and barely used. Perfect for any prototyping or learning electronics. Includes the original USB cable and has all pins in working condition. Great for beginners getting started with microcontrollers or experienced makers who need a reliable board for their next project.",
    tags: ["Microcontroller", "Arduino", "Electronics", "Beginner-Friendly"],
    condition: "Excellent",
    availability: "Available Now",
    location: "Electrical Engineering Building",
    specifications: [
      "ATmega328P microcontroller",
      "14 digital I/O pins",
      "6 analog inputs", 
      "16 MHz crystal oscillator",
      "USB connection",
      "Power jack"
    ],
    aiNote: "This Arduino Uno is perfect for beginners and compatible with most Arduino tutorials and projects. Great for learning programming and electronics fundamentals."
  };

  return (
    <div className="item-detail-page">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <button className="back-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
              </svg>
              Back to Browse
            </button>
            <h1 className="logo">SpareSwap</h1>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="item-detail">
            <div className="item-image-large">
              <div className="placeholder-image-large">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </div>
            </div>

            <div className="item-info">
              <h1 className="item-title">{mockItem.title}</h1>
              
              <div className="item-tags">
                {mockItem.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>

              <div className="ai-note">
                <div className="ai-note-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <p>{mockItem.aiNote}</p>
              </div>

              <div className="item-details">
                <div className="detail-section">
                  <h3>Description</h3>
                  <p>{mockItem.description}</p>
                </div>

                <div className="detail-section">
                  <h3>Specifications</h3>
                  <ul>
                    {mockItem.specifications.map((spec, index) => (
                      <li key={index}>{spec}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <h4>Condition</h4>
                    <p>{mockItem.condition}</p>
                  </div>
                  <div className="detail-item">
                    <h4>Availability</h4>
                    <p>{mockItem.availability}</p>
                  </div>
                  <div className="detail-item">
                    <h4>Owner</h4>
                    <p>{mockItem.owner}</p>
                  </div>
                  <div className="detail-item">
                    <h4>Pickup Location</h4>
                    <p>{mockItem.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="sticky-footer">
        <div className="container">
          <button className="btn-primary request-btn">
            Request to Borrow
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;