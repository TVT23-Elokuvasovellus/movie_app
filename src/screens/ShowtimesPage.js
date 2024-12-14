import React from 'react';
import Navbar from '../components/Navbar';
import CinemaSchedule from '../components/CinemaSchedule';
import '../styles/ShowtimesPage.css';

const Showtimes = ({ isLoggedIn }) => {
  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <h1 className="showtimes-header">Showtimes - Finnkino</h1>
      <div className="cinema-schedule-container">
        <CinemaSchedule />
      </div>
    </div>
  );
};

export default Showtimes;
