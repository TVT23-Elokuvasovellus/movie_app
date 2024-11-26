import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const token = process.env.REACT_APP_API_TOKEN;

function MovieInfo() {
  const location = useLocation();
  const movieId = location.pathname.split('/').pop();
  const [movieInfo, setMovieInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieInfo = async () => {
      try {
        if (!movieId) {
          throw new Error('Movie ID is missing');
        }
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${token}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }

        const data = await response.json();
        setMovieInfo(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMovieInfo();
  }, [movieId]);

  if (error) {
    return (error.message);
  }


  return (
    <div className="movie-info">
      <h2>{movieInfo?.title}</h2>
      <img src={`https://image.tmdb.org/t/p/w185${movieInfo?.poster_path}`} alt={movieInfo?.title} />
      <p><strong>Overview:</strong> {movieInfo?.overview}</p>
      <p><strong>Release Date:</strong> {movieInfo?.release_date}</p>
      <p><strong>Language:</strong> {movieInfo?.original_language}</p>
      <p><strong>Genres:</strong> {movieInfo?.genres.map(genre => genre.name).join(', ')}</p>
      <p><strong>Runtime:</strong> {movieInfo?.runtime} minutes</p>
      <p><strong>Audience Rating:</strong> {movieInfo?.vote_average}</p>
      <p><strong>Production Companies:</strong> {movieInfo?.production_companies.map(company => company.name).join(', ')}</p>
      {movieInfo?.homepage && (
        <p><strong>Official Website:</strong> <a href={movieInfo?.homepage} target="_blank" rel="noopener noreferrer">{movieInfo?.homepage}</a></p>
      )}
    </div>
  );
}

export default MovieInfo;
