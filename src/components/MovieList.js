import React from 'react';

function MovieList({ movies }) {
  return (
    <div className="movie-list">
      <h2>Favorite Movies</h2>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>{movie}</li>
        ))}
      </ul>
    </div>
  );
}

export default MovieList;
