import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const GroupShare = () => {
    const location = useLocation();
    const { id, sharedMovie } = location.state || {}; 
    const [sharedShows, setSharedShows] = useState([]);
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
    
      return (
        <div>
          <h3>Shared Shows:</h3>
          {error && <p>{error}</p>}
          <ul>
            {sharedShows.length > 0 ? (
              sharedShows.map(show => (
                <li key={show.sh_id}>
                  <strong>{show.title}</strong>
                  <p>{show.location}</p>
                  <p>Date: {show.date} Time: {show.time}</p>
                  <p>Shared by: {show.email} - {show.shared_at}</p>
                </li>
              ))
            ) : (
              <p>No shows shared yet.</p>
            )}
          </ul>
        </div>
      );
    };
  
  export default GroupShare;