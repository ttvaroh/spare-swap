import React, { useState } from 'react';
import './RequestsPage.css';

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState('incoming');

  // Mock data for demonstration
  const incomingRequests = [
    {
      id: 1,
      itemTitle: "Arduino Uno R3",
      itemImage: "/api/placeholder/80/80",
      requesterName: "Mike Johnson",
      requesterEmail: "mjohnson@purdue.edu",
      message: "Hi! I'd love to borrow your Arduino for my ECE 368 project. I need it for about 2 weeks to build a temperature monitoring system. I'm experienced with Arduino and will take great care of it!",
      aiDraftedMessage: "Thanks for your interest! The Arduino is available. Let's meet at MSEE lobby tomorrow at 2 PM?",
      requestDate: "2 hours ago",
      urgency: "medium"
    },
    {
      id: 2,
      itemTitle: "Breadboard Set",
      itemImage: "/api/placeholder/80/80",
      requesterName: "Sarah Chen",
      requesterEmail: "schen@purdue.edu",
      message: "I'm working on a circuits lab and could really use your breadboard set. Would only need it for the weekend!",
      aiDraftedMessage: "Sure! The breadboard set is yours for the weekend. How about meeting at the ECE shop Friday afternoon?",
      requestDate: "1 day ago",
      urgency: "low"
    },
    {
      id: 3,
      itemTitle: "Multimeter",
      itemImage: "/api/placeholder/80/80",
      requesterName: "Alex Rodriguez",
      requesterEmail: "arodriguez@purdue.edu",
      message: "Hey! I'm debugging a circuit for my senior design project and really need a good multimeter. Could I borrow yours for a few days?",
      aiDraftedMessage: "Absolutely! I know how important senior design is. Let's meet at ARMS tomorrow at 1 PM.",
      requestDate: "3 hours ago",
      urgency: "high"
    }
  ];

  const outgoingRequests = [
    {
      id: 4,
      itemTitle: "Raspberry Pi 4",
      itemImage: "/api/placeholder/80/80",
      ownerName: "Emily Watson",
      ownerEmail: "ewatson@purdue.edu",
      myMessage: "Hi Emily! I'm working on a IoT project for ECE 477 and would love to borrow your Raspberry Pi 4. I'll only need it for about 2 weeks and will take excellent care of it. Let me know if it's available!",
      responseReceived: false,
      requestDate: "1 hour ago",
      status: "pending"
    },
    {
      id: 5,
      itemTitle: "3D Printed Gears",
      itemImage: "/api/placeholder/80/80",
      ownerName: "David Park",
      ownerEmail: "dpark@purdue.edu",
      myMessage: "Hi! I saw your 3D printed gears and they'd be perfect for my ME 352 project. Could I borrow them for a week?",
      responseReceived: true,
      ownerResponse: "Sure! They're available. Meet me at the ME shop tomorrow at 3 PM?",
      requestDate: "2 days ago",
      status: "approved"
    },
    {
      id: 6,
      itemTitle: "Servo Motors",
      itemImage: "/api/placeholder/80/80",
      ownerName: "Lisa Zhang",
      ownerEmail: "lzhang@purdue.edu",
      myMessage: "Could I borrow your servo motors for my robotics competition? I promise to return them in perfect condition!",
      responseReceived: true,
      ownerResponse: "Sorry, I'm using them for my own project this week. Maybe next week?",
      requestDate: "3 days ago",
      status: "declined"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'var(--purdue-gold)';
      case 'declined': return '#dc3545';
      case 'pending': return 'var(--purdue-gray)';
      default: return 'var(--purdue-gray)';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'high': return '#dc3545';
      case 'medium': return 'var(--purdue-gold)';
      case 'low': return 'var(--purdue-gray)';
      default: return 'var(--purdue-gray)';
    }
  };

  return (
    <div className="requests-page">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">SpareSwap</h1>
            <div className="tab-navigation">
              <button 
                className={`tab-btn ${activeTab === 'incoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('incoming')}
              >
                Incoming Requests ({incomingRequests.length})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'outgoing' ? 'active' : ''}`}
                onClick={() => setActiveTab('outgoing')}
              >
                My Requests ({outgoingRequests.length})
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {activeTab === 'incoming' ? (
            <div className="requests-section">
              <h2>Requests for Your Items</h2>
              <div className="requests-list">
                {incomingRequests.map((request) => (
                  <div key={request.id} className="request-card incoming">
                    <div className="request-header">
                      <div className="item-info">
                        <div className="item-image">
                          <div className="placeholder-image">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="item-details">
                          <h3>{request.itemTitle}</h3>
                          <p className="requester-name">Requested by {request.requesterName}</p>
                          <span className="request-time">{request.requestDate}</span>
                        </div>
                      </div>
                      <div className="urgency-indicator" style={{backgroundColor: getUrgencyColor(request.urgency)}}></div>
                    </div>
                    
                    <div className="request-message">
                      <h4>Their Message:</h4>
                      <p>{request.message}</p>
                    </div>
                    
                    <div className="ai-response">
                      <h4>AI Suggested Response:</h4>
                      <div className="ai-message">
                        <div className="ai-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                        <p>{request.aiDraftedMessage}</p>
                      </div>
                    </div>
                    
                    <div className="request-actions">
                      <button className="btn-secondary accept-btn">Accept Request</button>
                      <button className="btn-outline reject-btn">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="requests-section">
              <h2>Your Requests</h2>
              <div className="requests-list">
                {outgoingRequests.map((request) => (
                  <div key={request.id} className="request-card outgoing">
                    <div className="request-header">
                      <div className="item-info">
                        <div className="item-image">
                          <div className="placeholder-image">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="item-details">
                          <h3>{request.itemTitle}</h3>
                          <p className="owner-name">Owner: {request.ownerName}</p>
                          <span className="request-time">{request.requestDate}</span>
                        </div>
                      </div>
                      <div className="status-indicator" style={{backgroundColor: getStatusColor(request.status)}}></div>
                    </div>
                    
                    <div className="request-message">
                      <h4>Your Message:</h4>
                      <p>{request.myMessage}</p>
                    </div>
                    
                    {request.responseReceived && (
                      <div className="owner-response">
                        <h4>Their Response:</h4>
                        <p>{request.ownerResponse}</p>
                      </div>
                    )}
                    
                    <div className="request-status">
                      <span className={`status-badge ${request.status}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      {request.status === 'approved' && (
                        <button className="btn-primary arrange-meetup">Arrange Meetup</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RequestsPage;