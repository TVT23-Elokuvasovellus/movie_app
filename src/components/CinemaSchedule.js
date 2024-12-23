import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSchedule } from './utils/finnkinoApi.js';
import Movie from './Movie.js';
import FetchGroups from './FetchGroups.js';
import ConfirmShare from './ConfirmShare.js';
import '../styles/CinemaSchedule.css';


function CinemaSchedule() {
  const [shows, setShows] = useState([]);
  const [groups, setGroups] = useState([]);
  const [theatres] = useState([
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
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const showsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let date = new Date();
        console.log(`Initial date: ${date}`);
  
        if (selectedDay === 'tomorrow') {
          date.setDate(date.getDate() + 1);
        } else if (selectedDay === 'dayAfterTomorrow') {
          date.setDate(date.getDate() + 2);
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;

        const scheduleData = await fetchSchedule(selectedTheatre, formattedDate);
        console.log(`Fetched data:`, scheduleData);
        
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


  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const groupsData = await FetchGroups();
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroupData();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
    setCurrentPage(1);
  };

  const handleTheatreChange = (event) => {
    setSelectedTheatre(event.target.value);
    setCurrentPage(1);
  };

  const handleSelectMovie = (id) => {
    setSelectedMovieId(id);
  };

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
    const group = groups.find(group => group.ID === event.target.value);
    setSelectedGroupName(group ? group.name : '');
  };

  const handleShare = () => {
    setModalVisible(true);
  };

  const handleConfirmShare = async () => {
    if (selectedMovieId && selectedGroup) {
      const selectedMovie = shows.find(show => show.ID === selectedMovieId);
      const postData = [
        {
          title: selectedMovie.Title,
          time: selectedMovie.dttmShowStart,
          date: new Date(selectedMovie.dttmShowStart).toLocaleDateString('fi-FI'),
          location: selectedMovie.TheatreAndAuditorium,
          type : 'show',
        },
      ];

      const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:3001/group/${selectedGroup}/addShow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, 
                },
                body: JSON.stringify({ sharedShow: postData[0] }), 
            });
            const data = await response.json();
              if (response.ok && data.success) {
                console.log('Movie shared successfully:', data.movie);

                navigate(`/group/${selectedGroup}`, { 
                    state: { id: selectedGroup, name: selectedGroupName, sharedMovie: postData[0] } 
                });
            } else {
                console.error('Failed to share movie:', data.error || 'Unknown error');
            }
        } catch (err) {
            console.error('Error while sharing the movie:', err); 
        }
      
      setSelectedMovieId(null);
      setModalVisible(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
    setModalVisible(false);
  };

  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = shows.slice(indexOfFirstShow, indexOfLastShow);
  const totalPages = Math.ceil(shows.length / showsPerPage);

  const selectedMovie = shows.find(show => show.ID === selectedMovieId);

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
          <select value={selectedGroup} onChange={handleGroupChange}>
          <option value="">Select a group</option>
            {groups.map(group => (
              <option key={group.gr_id} value={group.gr_id}>
                {group.name}
              </option>
            ))}
          </select>
          <button 
            onClick={handleShare} 
            disabled={!selectedMovieId || !selectedGroup} 
            className={!selectedMovieId || !selectedGroup ? 'disabled-button' : ''}
          >
            Share Selected
          </button>
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
              key={`${show.ID}-${index}`}
              show={show}
              onSelectMovie={handleSelectMovie}
              selectedMovieId={selectedMovieId}
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
      <ConfirmShare
        show={modalVisible}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmShare}
        movieTitle={selectedMovie?.Title || ''}
        groupName={selectedGroup}
      />
    </div>
  );  
}

export default CinemaSchedule;