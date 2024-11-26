import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CinemaSchedule from '../components/CinemaSchedule';
import GroupCreator from '../components/GroupCreator';
import Search from '../components/Search';
import ReviewList from '../components/ReviewList';
import { useAuth } from '../hooks/useAuth';
import './HomePage.css';

function Home() {
  const { isLoggedIn } = useAuth();
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('isDarkMode') === 'true';
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={`home ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar isLoggedIn={isLoggedIn}/>
      <div className="main-content container mt-5">
        <div className="row">
          <div className="col-12 col-md-6 group-creator-container">
            <GroupCreator isLoggedIn={isLoggedIn} />
          </div>
          <div className="col-12 col-md-6">
            <div className="search-container">
              <Search />
            </div>
            <div className="cinema-schedule-container">
              <CinemaSchedule />
            </div>
            <div className="review-list-container">
              <ReviewList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
