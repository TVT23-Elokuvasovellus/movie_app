import './Navbar.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('isDarkMode') === 'true';
  });

  const [isOnline, setIsOnline] = useState(false);
  const [username] = useState("testuser@mail.com");

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('isDarkMode', newMode);
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <button className="nav-button">Home</button>
        </Link>
        <Link to="/profile">
          <button className="nav-button">Profile</button>
        </Link>
        <button className="dark-mode-button" onClick={toggleDarkMode}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <Link to="#" onClick={toggleOnlineStatus} className="status-link">
          {isOnline ? 'Go Offline' : 'Go Online'}
        </Link>
      </div>
      <div className="navbar-right">
        {isOnline ? (
          <span>
            Logged in as: {username} <Link to="/logout">Log out</Link>
          </span>
        ) : (
          <>
            <span>You are offline. </span>
            <Link to="/login">Log in</Link>. No account? <Link to="/signup">Sign up</Link>.
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

