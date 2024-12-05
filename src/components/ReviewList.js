import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import '../styles/ReviewList.css';

function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [movieIdMap, setMovieIdMap] = useState({});
  const [selectedSort, setSelectedSort] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const token = process.env.REACT_APP_API_TOKEN;
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
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:3001/reviews');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);

        const movieIds = await fetchMovieIds(data);
        setMovieIdMap(movieIds);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchReviews();
  }, []);

  const fetchMovieIds = async (reviews) => {
    const movieIds = {};
    const promises = reviews.map(async (review) => {
      const movieId = await fetchMovieId(review.movie);
      if (movieId) {
        movieIds[review.movie] = movieId;
      }
    });
    await Promise.all(promises);
    return movieIds;
  };

  const fetchMovieId = async (movieTitle) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${token}&query=${movieTitle}&language=en-US`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].id;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch ID for movie: ${movieTitle}`, error);
      return null;
    }
  };

  return (
    <div className = 'container'>
      <div>
        <h2>User reviews</h2>
        <div className = 'sortBy'>
            <label htmlFor="sortBy">Sort by:</label>
            <select id="sortBy" name="sortBy" value={selectedSort} onChange={handleSortChange}>
              <option value=""></option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="most_stars">Most stars</option>
              <option value="least_stars">Least stars</option>
            </select>
          </div>
        <ul className = 'reviews-grid'>
          {currentReviews.map((review) => (
            <li key={review.ra_id} className = 'review-item'>
              <Link to={`/movie/${review.mo_id}`} className="movie-title">
                <h4>{review.movie}</h4>
              </Link>
              <p>{review.text}</p>
              <p>{review.stars} stars</p>
              <p>{new Date(review.time).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
        <div className="pagination">
          <button onClick={() => handlePageChange (currentPage - 1)} disabled={currentPage === 1}>Back</button>
          <span>Page {currentPage} / {totalPages}</span>
          <button onClick={() => handlePageChange (currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}


export default ReviewList;
