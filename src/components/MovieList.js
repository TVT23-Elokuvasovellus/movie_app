import React from 'react';
import axios from 'axios';

function MovieList({ movies, fetchFavorites, user, isOwnProfile }) {
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

  return (
    <div className="movie-list">
      {movies && movies.length > 0 ? (
        movies.map((movie) => (
          <div key={movie.mo_id} className="movie-item">
            <h3>{movie.movie}</h3>
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
  );
}

export default MovieList;
