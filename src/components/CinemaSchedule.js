import React, { useEffect, useState } from 'react';
import { fetchSchedule } from './FinnkinoApi.js';
import Movie from "./Movie.js";
import './CinemaSchedule.css';

function CinemaSchedule() {
  const [shows, setShows] = useState([]);
  const [theatres, setTheatres] = useState([
    // List of theatres
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDay, setSelectedDay] = useState('today');
  const [selectedTheatre, setSelectedTheatre] = useState('1014');
  const [selectedMovies, setSelectedMovies] = useState([]);
  const showsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let date = new Date();
        if (selectedDay === 'tomorrow') date.setDate(date.getDate() + 1);
        if (selectedDay === 'dayAfterTomorrow') date.setDate(date.getDate() + 2);

        const formattedDate = date.toLocaleDateString('fi-FI');
        const scheduleData = await fetchSchedule(selectedTheatre, formattedDate);
        const currentTime = new Date();
        const upcomingShows = scheduleData.filter(show => new Date(show.dttmShowStart) > currentTime);
        const sortedShows = upcomingShows.sort((a, b) => new Date(a.dttmShowStart) - new Date(b.dttmShowStart));
        setShows(sortedShows);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedDay, selectedTheatre]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
    setCurrentPage(1);
  };

  const handleTheatreChange = (event) => {
    setSelectedTheatre(event.target.value);
    setCurrentPage(1);
  };

  const handleSelectMovie = (movie, isChecked) => {
    setSelectedMovies(prevSelectedMovies => 
      isChecked 
      ? [...prevSelectedMovies, movie] 
      : prevSelectedMovies.filter(m => m.timestamp !== movie.timestamp)
    );
  };

  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = shows.slice(indexOfFirstShow, indexOfLastShow);
  const totalPages = Math.ceil(shows.length / showsPerPage);

  return (
    <div className="container">
      <div className="dropdown-container-left">
        <div className="select-menu">
          <select value={selectedDay} onChange={handleDayChange}>
            <option value="today">Ohjelmistossa tänään</option>
            <option value="tomorrow">Ohjelmistossa huomenna</option>
            <option value="dayAfterTomorrow">Ohjelmistossa ylihuomenna</option>
          </select>
        </div>
        <div className="select-menu">
          <select value={selectedTheatre} onChange={handleTheatreChange}>
            {theatres.map(theatre => (
              <option key={theatre.ID} value={theatre.ID}>
                {theatre.Name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="dropdown-container-right">
        <div className="select-group">
          <select>
            <option value="group1">Group 1</option>
            <option value="group2">Group 2</option>
            <option value="group3">Group 3</option>
          </select>
          <button>Share Selected</button>
        </div>
      </div>
      <div className="movies-container-wrapper">
        <button
          className={`pagination-button left ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous Page"
        >
          &lt;
        </button>
        <div className="movies-container">
          {currentShows.map((show, index) => (
            <Movie
              key={index}
              show={show}
              onSelectMovie={handleSelectMovie}
              selectedMovies={selectedMovies}
            />
          ))}
        </div>
        <button
          className={`pagination-button right ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
        >
          &gt;
        </button>
      </div>
      <div className="pagination-numbers">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => paginate(index + 1)}
            aria-label={`Page ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );  
}

const Dropdown = ({ value, onChange, options }) => (
  <select value={value} onChange={onChange} aria-label="Dropdown">
    {options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
);

export default CinemaSchedule;
