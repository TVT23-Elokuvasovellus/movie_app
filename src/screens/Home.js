import './Home.css';
import CinemaSchedule from '../components/CinemaSchedule';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import GroupCreator from '../components/groupCreator';
import Search from '../components/search';

function Home() {
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

  return (
    <div className="home">
      <Link to="/login">
        <button className="login-button">Log In</button>
      </Link>
      <button className="dark-mode-button" onClick={toggleDarkMode}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <GroupCreator />
      <div className="search-container">
        <Search />
      </div>
      <div className="cinema-schedule-container">
        <CinemaSchedule />
      </div>
    </div>
  );
}

export default Home;
