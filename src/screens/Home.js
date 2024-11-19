import './Home.css';
import CinemaSchedule from '../components/CinemaSchedule';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import GroupCreator from '../components/groupCreator';
import axios from 'axios';
import { useUser } from '../context/useUser.js';

const url = 'http://localhost:3000';

function Home() {
  const { user } = useUser();

  useEffect(() => {
    axios.get(url, { headers: { Authorization: `Bearer ${user.token}` } })
      .catch(error => {
        alert(error.response?.data?.error ? error.response.data.error : error.message);
      });
  }, [user.token]);

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
      <CinemaSchedule />
    </div>
  );
}

export default Home;
