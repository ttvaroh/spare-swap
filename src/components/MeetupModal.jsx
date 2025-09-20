import React, { useState } from 'react';
import './MeetupModal.css';

const MeetupModal = ({ isOpen, onClose, itemTitle, otherPersonName }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Mock meetup suggestions
  const meetupSuggestions = [
    {
      id: 1,
      name: "MSEE Lobby",
      fullName: "Electrical Engineering Building Lobby",
      hours: "Mon-Fri 6:00 AM - 10:00 PM",
      walkingDistance: "2 min from campus center",
      accessibility: "Wheelchair accessible",
      features: ["Indoor seating", "Good lighting", "Security cameras"],
      icon: "building"
    },
    {
      id: 2,
      name: "ARMS Makerspace",
      fullName: "ARMS Research Makerspace",
      hours: "Mon-Fri 8:00 AM - 8:00 PM",
      walkingDistance: "5 min from MSEE",
      accessibility: "Wheelchair accessible",
      features: ["Technical environment", "Workbenches available", "Tool access"],
      icon: "tools"
    },
    {
      id: 3,
      name: "PMU Ground Floor",
      fullName: "Purdue Memorial Union Ground Floor",
      hours: "Daily 7:00 AM - 11:00 PM",
      walkingDistance: "8 min from engineering quad",
      accessibility: "Wheelchair accessible",
      features: ["Central location", "Food court nearby", "High traffic area"],
      icon: "location"
    }
  ];

  const aiMessage = `Based on your exchange of the ${itemTitle}, I recommend meeting at one of these convenient campus locations. ${otherPersonName} should be able to easily find you at any of these spots during their operating hours.`;

  const getIcon = (iconType) => {
    switch(iconType) {
      case 'building':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l8 4v14H4V6l8-4zm6 16V7.5L12 4.5 6 7.5V18h4v-3h4v3h4z"/>
          </svg>
        );
      case 'tools':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
          </svg>
        );
      case 'location':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const handleConfirmMeetup = () => {
    if (selectedLocation) {
      // Handle meetup confirmation logic here
      console.log('Confirmed meetup at:', selectedLocation);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="meetup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Meetup Suggestions</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="modal-content">
          <div className="suggestions-grid">
            {meetupSuggestions.map((location) => (
              <div 
                key={location.id}
                className={`suggestion-card ${selectedLocation?.id === location.id ? 'selected' : ''}`}
                onClick={() => setSelectedLocation(location)}
              >
                <div className="suggestion-header">
                  <div className="suggestion-icon">
                    {getIcon(location.icon)}
                  </div>
                  <div className="suggestion-info">
                    <h3>{location.name}</h3>
                    <p className="full-name">{location.fullName}</p>
                  </div>
                </div>
                
                <div className="suggestion-details">
                  <div className="detail-item">
                    <span className="detail-label">Hours:</span>
                    <span className="detail-value">{location.hours}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Distance:</span>
                    <span className="detail-value">{location.walkingDistance}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Access:</span>
                    <span className="detail-value">{location.accessibility}</span>
                  </div>
                </div>
                
                <div className="suggestion-features">
                  {location.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="ai-message">
            <div className="ai-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <p>{aiMessage}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-outline cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-primary confirm-btn" 
            onClick={handleConfirmMeetup}
            disabled={!selectedLocation}
          >
            Confirm Meetup at {selectedLocation?.name || 'Selected Location'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetupModal;