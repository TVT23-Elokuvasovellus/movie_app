import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/MovieList.css';

const apiKey = process.env.REACT_APP_API_TOKEN;
const fetchPosterUrl = (mo_id) => `https://api.themoviedb.org/3/movie/${mo_id}?api_key=${apiKey}`;

function MovieList({ movies, fetchFavorites, isOwnProfile }) {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;

  const fetchMovieData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await Promise.all(
        movies.map(async (movie) => {
          const res = await axios.get(fetchPosterUrl(movie.mo_id));
          return { ...movie, poster_path: res.data.poster_path };
        })
      );
      const sortedData = data.sort((a, b) => a.movie.localeCompare(b.movie));
      setMovieData(sortedData);
    } catch (err) {
      setError('Error fetching movie data');
      console.error('Error fetching movie data:', err);
    } finally {
      setLoading(false);
    }
  }, [movies]);

  useEffect(() => {
    fetchMovieData();
  }, [movies, fetchMovieData]);

  const handleRemoveFavorite = async (movieId) => {
    console.log(`Attempting to remove movie with id: ${movieId} for user: ${user.id}`);
    try {
      const response = await axios.delete('http://localhost:3001/removeFavorite', {
        data: { ac_id: user.id, mo_id: movieId }
      });
      console.log('Server response:', response.data);
      if (response.status === 200) {
        fetchFavorites(user.id);
      } else {
        console.error('Failed to remove favorite:', response.data.message || 'Failed to remove favorite');
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const handleAddFavorite = async (movie) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const payload = {
      ac_id: user.id,
      mo_id: movie.mo_id,
      movie: movie.movie
    };

    console.log('Payload being sent:', payload);

    if (!payload.ac_id || !payload.mo_id || !payload.movie) {
      console.error('All fields are required:', payload);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/favorites', payload);
      console.log(`Added ${response.data.movie} to favorites`);
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response);
        if (error.response.status === 409) {
          console.error('Conflict: Movie might already be in favorites:', error.response.data);
        } else if (error.response.status === 400) {
          console.error('Bad Request: The request was not formatted correctly or missing required fields:', error.response.data);
        } else {
          console.error('Error adding to favorites:', error.response.status, error.response.data);
        }
      } else {
        console.error('Network or server error:', error.message);
      }
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movieData.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movieData.length / moviesPerPage);

  return (
    <div className="container">
      <div className="movie-list results">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && currentMovies.length > 0 ? (
          currentMovies.map((movie, index) => (
            <div key={index} className="result-card">
              <Link to={`/movie/${movie.mo_id}`} className="movie-title">
                <h2>{movie.movie}</h2>
              </Link>
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.movie} 
                onError={(e) => { 
                  if (!e.target.src.includes('default.JPG')) {
                    e.target.onerror = null;
                    e.target.src = "/img/default.JPG";
                    e.target.classList.add('default-img');
                  }
                }} 
              />
              {isOwnProfile ? (
                <button 
                  className="remove-favorite-button" 
                  onClick={() => handleRemoveFavorite(movie.mo_id)}
                >
                  Remove Favorite
                </button>
              ) : (
                <button 
                  className="add-favorite-button" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddFavorite(movie);
                  }}
                >
                  Add to Favorites
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MovieList;
