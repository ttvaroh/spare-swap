import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/login', label: 'Login' },
    { path: '/', label: 'Home' },
    { path: '/item/1', label: 'Item Detail' },
    { path: '/post', label: 'Post Item' },
    { path: '/requests', label: 'Requests' }
  ];

  return (
    <nav className="wireframe-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-logo">SpareSwap</span>
          <span className="nav-subtitle">Wireframe Demo</span>
        </div>
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;