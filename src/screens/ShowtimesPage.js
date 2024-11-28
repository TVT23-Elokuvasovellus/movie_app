import React from 'react';
import Navbar from '../components/Navbar';
import CinemaSchedule from '../components/CinemaSchedule';
import './ShowtimesPage.css';

const Showtimes = ({ isLoggedIn }) => {
  return (
    <div>
        <Navbar isLoggedIn={isLoggedIn} />
        <div className="showtimes-page container mt-5">
        <h1>Näytösajat - Finnkino</h1>
        <div className="cinema-schedule-container">
            <CinemaSchedule />
        </div>
        </div>
    </div>
  );
};

export default Showtimes;
