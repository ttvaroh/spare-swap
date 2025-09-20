import React from 'react';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <h1 className="app-title">SpareSwap</h1>
          <p className="app-subtitle">Share parts. Build together.</p>
          
          <div className="login-form">
            <button className="btn-primary login-btn">
              Sign in with Purdue Email
            </button>
            
            <p className="login-help">
              Use your Purdue email address to access SpareSwap
            </p>
          </div>
        </div>
        
        <div className="skyline-footer">
          <svg viewBox="0 0 400 80" className="skyline-svg">
            <path 
              d="M0,80 L0,40 L20,40 L20,25 L35,25 L35,40 L55,40 L55,30 L70,30 L70,40 L85,40 L85,20 L100,20 L100,40 L120,40 L120,35 L140,35 L140,40 L160,40 L160,25 L175,25 L175,40 L195,40 L195,30 L210,30 L210,40 L230,40 L230,20 L245,20 L245,40 L265,40 L265,35 L285,35 L285,40 L300,40 L300,25 L315,25 L315,40 L335,40 L335,30 L350,30 L350,40 L370,40 L370,25 L385,25 L385,40 L400,40 L400,80 Z"
              fill="var(--purdue-gray)"
              opacity="0.3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;