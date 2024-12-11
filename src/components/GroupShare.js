import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import '../styles/GroupPage.css';
const GroupShare = () => {
    const location = useLocation();
    const { id, sharedMovie } = location.state || {}; 
    const [sharedShows, setSharedShows] = useState([]);
    const [sharedMovies, setSharedMovies] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSharedShows = async () => {
          const token = localStorage.getItem('authToken'); 
    
          try {
            const response = await fetch(`http://localhost:3001/group/${id}/shows`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            const data = await response.json();
            if (data.success) {
              setSharedShows(data.shows);
            } else {
              setError(data.error || 'Failed to fetch shared shows.');
            }
          } catch (err) {
            setError('An error occurred while fetching shared shows.');
            console.error(err);
          }
        };
    
        if (id) {
          fetchSharedShows();
        }
      }, [id]);

    useEffect(() => {
      const fetchSharedMovies = async () => {
        const token = localStorage.getItem('authToken'); 
  
        try {
          const response = await fetch(`http://localhost:3001/group/${id}/movies`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const data = await response.json();
          if (data.success) {
            setSharedMovies(data.movies);
          } else {
            setError(data.error || 'Failed to fetch shared shows.');
          }
        } catch (err) {
          setError('An error occurred while fetching shared shows.');
          console.error(err);
        }
      };
  
      if (id) {
        fetchSharedMovies();
      }
    }, [id]);

    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0'); 
      const year = d.getFullYear();
      return `${day}.${month}.${year}`;
    };
    const formatTime = (date) => {
      const d = new Date(date);
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };

      return (
<div className="shared-content">
    <div className="section">
      <h3>Shared Shows:</h3>
      {error && <p className="text-danger">{error}</p>}
      <div className="row">
        {sharedShows.length > 0 ? (
          sharedShows.map((show) => (
            <div key={show.sh_id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{show.title}</h5>
                  <p className="card-text">
                    Location: {show.location}
                    <br />
                    Date: {formatDate(show.date)} <br /> Time: {formatTime(show.time)}
                  </p>
                  <p>Shared by: {show.email} <br /> {formatDate(show.shared_at)} - {formatTime(show.shared_at)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No shows shared yet.</p>
        )}
      </div>
    </div>
    <div className="section">
      <h3>Shared Movies:</h3>
      {error && <p className="text-danger">{error}</p>}
      <div className="row">
        {sharedMovies.length > 0 ? (
          sharedMovies.map((movie) => (
            <div key={movie.sh_id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                {movie.img && (
                  <img
                    src={movie.img}
                    className="card-img-top"
                    alt={movie.title}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="text-muted">
                    Shared by: {movie.email} on {movie.shared_at}
                  </p> 
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No movies shared yet.</p>
        )}
      </div>
    </div>
  </div>  
      );
    };
  
  export default GroupShare;