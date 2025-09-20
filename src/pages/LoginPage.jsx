import React, { useState, useEffect } from 'react';
import './LoginPage.css';

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: "🔧",
      title: "Share Engineering Parts",
      description: "Lend and borrow Arduino boards, sensors, tools, and more from fellow students"
    },
    {
      icon: "🤝",
      title: "Build Community",
      description: "Connect with engineering peers and collaborate on exciting projects"
    },
    {
      icon: "💰",
      title: "Save Money",
      description: "Access expensive components without breaking your student budget"
    },
    {
      icon: "🚀",
      title: "Learn Faster",
      description: "Get hands-on experience with more tools and accelerate your learning"
    }
  ];

  const stats = [
    { number: "500+", label: "Active Students" },
    { number: "1,200+", label: "Parts Shared" },
    { number: "50+", label: "Daily Exchanges" }
  ];

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Hero Section */}
        <div className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
          <div className="hero-content">
            <div className="brand-section">
              <div className="logo-container">
                <div className="logo-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h1 className="app-title">SpareSwap</h1>
              </div>
              <p className="app-tagline">The Purdue Engineering Parts Exchange</p>
              <p className="app-subtitle">
                Share components, build connections, and accelerate innovation together
              </p>
            </div>
            
            <div className="auth-section">
              <button className="btn-primary login-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 21H5V3H13V9H19V21Z"/>
                </svg>
                Sign in with Purdue Email
              </button>
              
              <p className="login-help">
                🎓 Exclusive to Purdue engineering students
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="stats-section">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2>Why SpareSwap?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="testimonial-section">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"SpareSwap saved my senior design project! I got access to a $200 sensor for free and met an amazing teammate in the process."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <span>AS</span>
              </div>
              <div className="author-info">
                <div className="author-name">Alex Smith</div>
                <div className="author-title">ECE Senior</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="skyline-footer">
          <svg viewBox="0 0 400 80" className="skyline-svg">
            <path 
              d="M0,80 L0,40 L20,40 L20,25 L35,25 L35,40 L55,40 L55,30 L70,30 L70,40 L85,40 L85,20 L100,20 L100,40 L120,40 L120,35 L140,35 L140,40 L160,40 L160,25 L175,25 L175,40 L195,40 L195,30 L210,30 L210,40 L230,40 L230,20 L245,20 L245,40 L265,40 L265,35 L285,35 L285,40 L300,40 L300,25 L315,25 L315,40 L335,40 L335,30 L350,30 L350,40 L370,40 L370,25 L385,25 L385,40 L400,40 L400,80 Z"
              fill="var(--purdue-gold)"
              opacity="0.2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;