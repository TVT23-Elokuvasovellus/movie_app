import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './MovieInfoPage.css';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

const token = process.env.REACT_APP_API_TOKEN;

function MovieInfo() {
  const location = useLocation();
  const movieId = location.pathname.split('/').pop();
  const [movieInfo, setMovieInfo] = useState(null);
  const [error, setError] = useState(null);
  const [actors, setActors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedSort, setSelectedSort] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const castListRef = useRef(null);
  const { isLoggedIn } = useAuth();
  const reviewsPerPage = 9;

  const handleSortChange = (event) => {
    const sortType = event.target.value;
    setSelectedSort(sortType);

    let sortedReviews = [...reviews];
    switch (sortType) {
      case 'newest':
        sortedReviews.sort((a,b) => new Date(b.time) - new Date(a.time));
        break;
      case 'oldest':
        sortedReviews.sort((a,b) => new Date(a.time) - new Date(b.time));
        break;
      case 'most_stars':
        sortedReviews.sort((a,b) => b.stars - a.stars);
        break;
      case 'least_stars':
        sortedReviews.sort((a,b) => a.stars - b.stars);
        break;
    }
    setReviews(sortedReviews)
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, endIndex);

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

        // Fetch actors
        const actorsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${token}`);
        if (!actorsResponse.ok) {
          throw new Error('Failed to fetch movie actors');
        }
        const actorsData = await actorsResponse.json();
        setActors(actorsData.cast);

        // Fetch possible reviews of the movie
        const reviewsResponse = await fetch(`http://localhost:3001/reviews?movie=${data.title}`);
        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch movie reviews');
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchMovieInfo();
  }, [movieId]);

  if (error) {
    return (error.message);
  }

  const scrollLeft = () => {
    if (castListRef.current) {
      castListRef.current.scrollBy({left: -800, behavior: 'smooth'});
    }
  };
  const scrollRight = () => {
    if (castListRef.current) {
      castListRef.current.scrollBy({left: 800, behavior: 'smooth'});
    }
  };

  return (
    <div className='movie-info-page'>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className='main-content'>
        <h2>{movieInfo?.title}</h2>
        <div className='movie-info-container'>
          <div className='movie-poster'>
            <img className='poster' src={`https://image.tmdb.org/t/p/w342${movieInfo?.poster_path}`} alt={movieInfo?.title}/>
          </div>
          <div className="movie-text-info">
            <p><strong>Overview:</strong> {movieInfo?.overview}</p>
            <p><strong>Release Date:</strong> {movieInfo?.release_date}</p>
            <p><strong>Genres:</strong> {movieInfo?.genres.map(genre => genre.name).join(', ')}</p>
            <p><strong>Runtime:</strong> {movieInfo?.runtime} minutes</p>
            <p><strong>Audience Rating:</strong> {movieInfo?.vote_average}</p>
            <p><strong>Language:</strong> {movieInfo?.original_language}</p>
            <p><strong>Production Companies:</strong> {movieInfo?.production_companies.map(company => company.name).join(', ')}</p>
            {movieInfo?.homepage && (
              <p><strong>Official Website:</strong> <a href={movieInfo?.homepage} target="_blank" rel="noopener noreferrer">{movieInfo?.homepage}</a></p>
            )}
          </div>
        </div>
          
        <div className="cast-section">
          <h3>Cast</h3>
          <div className="cast-scroller">
            <button onClick={scrollLeft} className="scroll-button">{'<'}</button>
            <div className="cast-list" ref={castListRef}>
              {actors.map(actor => (
                <div key={actor.cast_id} className="actor">
                  <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} />
                  <p><strong>{actor.name}</strong></p>
                  <p>{actor.character}</p>
                </div>
              ))}
            </div>
            <button onClick={scrollRight} className="scroll-button">{'>'}</button>
          </div>
        </div>
        <div className = 'reviews'>
          <h3>User Reviews</h3>
          <div className = 'sortBy'>
            <label htmlFor="sortBy">Sort by: </label>
            <select id="sortBy" name="sortBy" value={selectedSort} onChange={handleSortChange}>
              <option value=""></option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="most_stars">Most stars</option>
              <option value="least_stars">Least stars</option>
            </select>
          </div>
          <div className = 'reviews-grid'>
            {currentReviews.length > 0 ? (
              currentReviews.map(review => (
                <div key={review.ra_id} className = 'review'>
                  <p><strong>{review.author}</strong></p>
                  <p>{review.text}</p>
                  <p>{review.stars} stars</p>
                  <p>{new Date(review.time).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No reviews available.</p>
            )}
        </div>
        </div>
        <div className="pagination">
          <button onClick={() => handlePageChange (currentPage - 1)} disabled={currentPage === 1}>Back</button>
          <span>Page {currentPage} / {totalPages}</span>
          <button onClick={() => handlePageChange (currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default MovieInfo;
