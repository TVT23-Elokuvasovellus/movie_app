import './Home.css';
import Navbar from '../components/Navbar';
import CinemaSchedule from '../components/CinemaSchedule';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
//import GroupCreator from '../components/groupCreator';
import Search from '../components/search';

function Home() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('isDarkMode') === 'true';
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  return (
    <div>
      <Navbar />
      <div className="home">
        
        <div className="search-container">
          <Search />
        </div>
        <div className="cinema-schedule-container">
          <CinemaSchedule />
        </div>
      </div>
    </div>
  );
}

export default Home;
