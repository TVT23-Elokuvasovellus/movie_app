import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const apiKey = process.env.REACT_APP_API_TOKEN;
const fetchPosterUrl = (mo_id) => `https://api.themoviedb.org/3/movie/${mo_id}?api_key=${apiKey}`;

function MovieList({ movies, fetchFavorites, user, isOwnProfile }) {
  const [movieData, setMovieData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 5;

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

  const fetchMovieData = async () => {
    try {
      const data = await Promise.all(
        movies.map(async (movie) => {
          const res = await axios.get(fetchPosterUrl(movie.mo_id));
          return { ...movie, poster_path: res.data.poster_path };
        })
      );
      setMovieData(data);
    } catch (err) {
      console.error('Error fetching movie data:', err);
    }
  };

  useEffect(() => {
    fetchMovieData();
  }, [movies]);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movieData.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <div className="container">
      <div className="movie-list">
        {currentMovies && currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <div key={movie.mo_id} className="movie-item">
              <Link to={`/movie/${movie.mo_id}`} className="movie-title">
                <h3>{movie.movie}</h3>
              </Link>
              <img 
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                alt={movie.movie} 
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = "/img/default.JPG"; 
                  e.target.classList.add('default-img');
                }} 
              />
              {isOwnProfile && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveFavorite(movie.mo_id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(movieData.length / moviesPerPage)}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(movieData.length / moviesPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MovieList;
