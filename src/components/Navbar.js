import './Navbar.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('isDarkMode') === 'true';
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('isDarkMode', newMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    window.location.reload();
  };

  const username = localStorage.getItem('email');
  const userId = localStorage.getItem('userId');
  console.log("Stored navbar email:", username); // debug

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <button className="nav-button">Home</button>
        </Link>
        <Link to={`/profile/${userId}`}>
          <button className="nav-button">Profile</button>
        </Link>
        <button className="dark-mode-button" onClick={toggleDarkMode}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <span>
            Logged in as: {username} <button onClick={handleLogout}>Logout</button>
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
