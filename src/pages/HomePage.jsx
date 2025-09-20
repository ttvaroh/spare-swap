import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('recent');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock data for demonstration with more realistic data
  const mockItems = [
    {
      id: 1,
      title: "Arduino Uno R3 Development Board",
      image: "/api/placeholder/300/200",
      tags: ["Microcontroller", "Arduino", "Electronics"],
      category: "electronics",
      owner: "Sarah Chen",
      ownerProfile: "ECE Senior",
      description: "Barely used Arduino Uno R3 with original packaging. Perfect for prototyping and learning embedded systems. Includes USB cable.",
      condition: "Excellent",
      availability: "Available Now",
      location: "MSEE Building",
      rating: 4.9,
      borrowCount: 12,
      timePosted: "2 hours ago"
    },
    {
      id: 2,
      title: "Breadboard Set with Jumper Wires",
      image: "/api/placeholder/300/200",
      tags: ["Prototyping", "Electronics", "Beginner"],
      category: "electronics",
      owner: "Mike Johnson",
      ownerProfile: "ME Junior",
      description: "Full and half-size breadboards with complete jumper wire kit. Great for circuit prototyping and experiments.",
      condition: "Good",
      availability: "Available Soon",
      location: "Arms Makerspace",
      rating: 4.7,
      borrowCount: 8,
      timePosted: "5 hours ago"
    },
    {
      id: 3,
      title: "Servo Motors Set (5x SG90)",
      image: "/api/placeholder/300/200",
      tags: ["Motors", "Robotics", "Actuators"],
      category: "mechanical",
      owner: "Alex Rodriguez",
      ownerProfile: "AAE Sophomore",
      description: "Set of 5 SG90 servo motors in excellent condition. Perfect for robotics projects, RC applications, and automation.",
      condition: "Excellent",
      availability: "Available Now",
      location: "ARMS Building",
      rating: 4.8,
      borrowCount: 15,
      timePosted: "1 day ago"
    },
    {
      id: 4,
      title: "3D Printed Custom Gears",
      image: "/api/placeholder/300/200",
      tags: ["3D Print", "Mechanical", "Gears"],
      category: "materials",
      owner: "Emily Watson",
      ownerProfile: "ME Senior",
      description: "Various sized PLA printed gears with high precision. Perfect for mechanical prototypes and gear train experiments.",
      condition: "Excellent",
      availability: "Available Now",
      location: "FLEX Lab",
      rating: 4.6,
      borrowCount: 6,
      timePosted: "3 hours ago"
    },
    {
      id: 5,
      title: "Raspberry Pi 4 (4GB) Complete Kit",
      image: "/api/placeholder/300/200",
      tags: ["Computer", "IoT", "Linux"],
      category: "electronics",
      owner: "David Park",
      ownerProfile: "CS Junior",
      description: "Raspberry Pi 4 with 4GB RAM, case, SD card (32GB), and power supply. Ready for IoT and embedded Linux projects.",
      condition: "Excellent",
      availability: "Available Now",
      location: "Lawson Building",
      rating: 5.0,
      borrowCount: 20,
      timePosted: "4 hours ago"
    },
    {
      id: 6,
      title: "Digital Multimeter with Probes",
      image: "/api/placeholder/300/200",
      tags: ["Testing", "Electronics", "Tools"],
      category: "tools",
      owner: "Lisa Zhang",
      ownerProfile: "EE Senior",
      description: "Professional digital multimeter with test probes and leads. Perfect for circuit debugging and electrical measurements.",
      condition: "Good",
      availability: "Available Now",
      location: "EE Labs",
      rating: 4.5,
      borrowCount: 18,
      timePosted: "6 hours ago"
    },
    {
      id: 7,
      title: "Soldering Iron Station",
      image: "/api/placeholder/300/200",
      tags: ["Soldering", "Tools", "Electronics"],
      category: "tools",
      owner: "James Wilson",
      ownerProfile: "ECE Graduate",
      description: "Temperature-controlled soldering station with tips and accessories. Perfect for PCB work and electronic assembly.",
      condition: "Good",
      availability: "Available Soon",
      location: "Graduate Lab",
      rating: 4.4,
      borrowCount: 9,
      timePosted: "8 hours ago"
    },
    {
      id: 8,
      title: "Stepper Motor with Driver",
      image: "/api/placeholder/300/200",
      tags: ["Motors", "Precision", "Automation"],
      category: "mechanical",
      owner: "Maria Garcia",
      ownerProfile: "ME Junior",
      description: "NEMA 17 stepper motor with driver board. Ideal for precise positioning in robotics and CNC applications.",
      condition: "Excellent",
      availability: "Available Now",
      location: "MARS Lab",
      rating: 4.9,
      borrowCount: 11,
      timePosted: "12 hours ago"
    }
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Items', icon: '🔍', count: mockItems.length },
    { id: 'electronics', name: 'Electronics', icon: '⚡', count: mockItems.filter(item => item.category === 'electronics').length },
    { id: 'mechanical', name: 'Mechanical', icon: '⚙️', count: mockItems.filter(item => item.category === 'mechanical').length },
    { id: 'tools', name: 'Tools', icon: '🔧', count: mockItems.filter(item => item.category === 'tools').length },
    { id: 'materials', name: 'Materials', icon: '📦', count: mockItems.filter(item => item.category === 'materials').length }
  ];

  // Popular search terms for suggestions
  const popularSearches = [
    'Arduino', 'Raspberry Pi', 'Breadboard', 'Multimeter', 'Servo Motor',
    '3D Print', 'Soldering', 'Sensors', 'Motors', 'PCB'
  ];

  // Filter and sort items
  const filteredItems = mockItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.timePosted) - new Date(a.timePosted);
      case 'popular':
        return b.borrowCount - a.borrowCount;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 0) {
      const suggestions = popularSearches.filter(term => 
        term.toLowerCase().includes(value.toLowerCase())
      );
      setSearchSuggestions(suggestions.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle search suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="home-page">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">SpareSwap</h1>
            <div className="search-container">
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="Search for parts, components, tools..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                  onClick={(e) => e.stopPropagation()}
                />
                <button className="search-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </button>
                
                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="search-suggestions">
                    {searchSuggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Categories and Controls */}
      <div className="controls-section">
        <div className="container">
          {/* Category Filter */}
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">({category.count})</span>
              </button>
            ))}
          </div>
          
          {/* Sort and View Controls */}
          <div className="view-controls">
            <div className="sort-controls">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 4H4c-1.11 0-2 .89-2 2v4c0 1.11.89 2 2 2h6c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm10 0h-6c-1.11 0-2 .89-2 2v4c0 1.11.89 2 2 2h6c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM10 14H4c-1.11 0-2 .89-2 2v4c0 1.11.89 2 2 2h6c1.11 0 2-.89 2-2v-4c0-1.11-.89-2-2-2zm10 0h-6c-1.11 0-2 .89-2 2v4c0 1.11.89 2 2 2h6c1.11 0 2-.89 2-2v-4c0-1.11-.89-2-2-2z"/>
                </svg>
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="main-content">
        <div className="container">
          {/* Results Header */}
          <div className="results-header">
            <h2>
              {searchQuery ? `Results for "${searchQuery}"` : `${activeCategory === 'all' ? 'All Items' : categories.find(c => c.id === activeCategory)?.name}`}
            </h2>
            <span className="results-count">{sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''} found</span>
          </div>
          
          {/* Items Grid */}
          <div className={`items-container ${viewMode}`}>
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <div key={item.id} className="item-card">
                  <div className="item-image">
                    <div className="placeholder-image">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                    </div>
                    <div className="item-status">
                      <span className={`availability-badge ${item.availability.toLowerCase().replace(' ', '-')}`}>
                        {item.availability}
                      </span>
                    </div>
                  </div>
                  
                  <div className="item-content">
                    <div className="item-header">
                      <h3 className="item-title">{item.title}</h3>
                      <div className="item-rating">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span>{item.rating}</span>
                      </div>
                    </div>
                    
                    <div className="item-tags">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                    
                    <p className="item-description">{item.description}</p>
                    
                    <div className="item-meta">
                      <div className="item-location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        {item.location}
                      </div>
                      <div className="item-condition">
                        <span className={`condition-indicator ${item.condition.toLowerCase()}`}></span>
                        {item.condition}
                      </div>
                    </div>
                    
                    <div className="item-footer">
                      <div className="owner-info">
                        <div className="owner-avatar">
                          {item.owner.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="owner-details">
                          <span className="owner-name">{item.owner}</span>
                          <span className="owner-profile">{item.ownerProfile}</span>
                        </div>
                      </div>
                      <div className="item-actions">
                        <span className="time-posted">{item.timePosted}</span>
                        <button className="btn-primary btn-small">Request</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
                <h3>No items found</h3>
                <p>Try adjusting your search terms or browse different categories.</p>
                <button 
                  className="btn-outline"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;