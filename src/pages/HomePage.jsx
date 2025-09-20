import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const mockItems = [
    {
      id: 1,
      title: "Arduino Uno R3",
      image: "/api/placeholder/300/200",
      tags: ["Microcontroller", "Arduino", "Electronics"],
      owner: "Sarah Chen",
      description: "Barely used Arduino Uno, perfect for prototyping"
    },
    {
      id: 2,
      title: "Breadboard Set",
      image: "/api/placeholder/300/200",
      tags: ["Prototyping", "Electronics", "Beginner"],
      owner: "Mike Johnson",
      description: "Full and half-size breadboards with jumper wires"
    },
    {
      id: 3,
      title: "Servo Motors (5x)",
      image: "/api/placeholder/300/200",
      tags: ["Motors", "Robotics", "Actuators"],
      owner: "Alex Rodriguez",
      description: "Set of 5 SG90 servo motors, great for robotics projects"
    },
    {
      id: 4,
      title: "3D Printed Gears",
      image: "/api/placeholder/300/200",
      tags: ["3D Print", "Mechanical", "Gears"],
      owner: "Emily Watson",
      description: "Various sized PLA printed gears, high quality"
    },
    {
      id: 5,
      title: "Raspberry Pi 4",
      image: "/api/placeholder/300/200",
      tags: ["Computer", "IoT", "Linux"],
      owner: "David Park",
      description: "4GB RAM model with case and SD card included"
    },
    {
      id: 6,
      title: "Multimeter",
      image: "/api/placeholder/300/200",
      tags: ["Testing", "Electronics", "Tools"],
      owner: "Lisa Zhang",
      description: "Digital multimeter with probes, perfect for debugging"
    }
  ];

  return (
    <div className="home-page">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">SpareSwap</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for parts, components, tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="items-grid">
            {mockItems.map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-image">
                  <div className="placeholder-image">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                </div>
                <div className="item-content">
                  <h3 className="item-title">{item.title}</h3>
                  <div className="item-tags">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  <p className="item-description">{item.description}</p>
                  <div className="item-footer">
                    <span className="item-owner">by {item.owner}</span>
                    <button className="btn-outline btn-small">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;