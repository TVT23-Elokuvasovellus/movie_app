import './Home.css';
import CinemaSchedule from '../components/CinemaSchedule';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  return (
    <div className="home">
      <Link to="/login">
        <button className="login-button">Log In</button>
      </Link>
      <button className="dark-mode-button" onClick={toggleDarkMode}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <CinemaSchedule />
    </div>
  );
}

export default Home;
