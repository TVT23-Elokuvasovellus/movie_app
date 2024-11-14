import React, { useEffect, useState } from 'react';
import { fetchSchedule } from './FinnkinoApi.js';
import Movie from "./Movie.js";
import './CinemaSchedule.css';

function CinemaSchedule() {
  const [shows, setShows] = useState([]);
  const [theatres, setTheatres] = useState([
    { ID: '1014', Name: 'Pääkaupunkiseutu' },
    { ID: '1012', Name: 'Espoo' },
    { ID: '1039', Name: 'Espoo: OMENA' },
    { ID: '1038', Name: 'Espoo: SELLO' },
    { ID: '1002', Name: 'Helsinki' },
    { ID: '1045', Name: 'Helsinki: ITIS' },
    { ID: '1031', Name: 'Helsinki: KINOPALATSI' },
    { ID: '1032', Name: 'Helsinki: MAXIM' },
    { ID: '1033', Name: 'Helsinki: TENNISPALATSI' },
    { ID: '1013', Name: 'Vantaa: FLAMINGO' },
    { ID: '1015', Name: 'Jyväskylä: FANTASIA' },
    { ID: '1016', Name: 'Kuopio: SCALA' },
    { ID: '1017', Name: 'Lahti: KUVAPALATSI' },
    { ID: '1041', Name: 'Lappeenranta: STRAND' },
    { ID: '1018', Name: 'Oulu: PLAZA' },
    { ID: '1019', Name: 'Pori: PROMENADI' },
    { ID: '1021', Name: 'Tampere' },
    { ID: '1034', Name: 'Tampere: CINE ATLAS' },
    { ID: '1035', Name: 'Tampere: PLEVNA' },
    { ID: '1047', Name: 'Turku ja Raisio' },
    { ID: '1022', Name: 'Turku: KINOPALATSI' },
    { ID: '1046', Name: 'Raisio: LUXE MYLLY' },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDay, setSelectedDay] = useState('today');
  const [selectedTheatre, setSelectedTheatre] = useState('1014');
  const showsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Determine the date based on the selected day
        let date = new Date();
        if (selectedDay === 'tomorrow') {
          date.setDate(date.getDate() + 1);
        } else if (selectedDay === 'dayAfterTomorrow') {
          date.setDate(date.getDate() + 2);
        }
        const formattedDate = date.toLocaleDateString('fi-FI');

        // Fetch schedule
        const scheduleData = await fetchSchedule(selectedTheatre, formattedDate);
        console.log("Fetched Data:", scheduleData);

        // Filter out events that have already started
        const currentTime = new Date();
        const upcomingShows = scheduleData.filter(show => new Date(show.dttmShowStart) > currentTime);

        const sortedShows = upcomingShows.sort((a, b) => new Date(a.dttmShowStart) - new Date(b.dttmShowStart));
        setShows(sortedShows);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedDay, selectedTheatre]); // Re-fetch data whenever the selected day or theatre changes

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle day selection change
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
    setCurrentPage(1); // Reset to first page on day change
  };

  // Handle theatre selection change
  const handleTheatreChange = (event) => {
    setSelectedTheatre(event.target.value);
    setCurrentPage(1); // Reset to first page on theatre change
  };

  // Calculate current shows
  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = shows.slice(indexOfFirstShow, indexOfLastShow);

  // Calculate total pages
  const totalPages = Math.ceil(shows.length / showsPerPage);

  return (
    <div className="container">
      <h1>Finnkino - Näytösajat</h1>
      <div className="dropdown-container">
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
      <div className="movies-container-wrapper">
        <button
          className={`pagination-button left ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <div className="movies-container">
          {currentShows.map((show, index) => (
            <Movie key={index} show={show} />
          ))}
        </div>
        <button
          className={`pagination-button right ${currentPage === Math.ceil(shows.length / showsPerPage) ? 'disabled' : ''}`}
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(shows.length / showsPerPage)}
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
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CinemaSchedule;