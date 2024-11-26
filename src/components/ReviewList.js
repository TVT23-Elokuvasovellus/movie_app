import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import './ReviewList.css'

function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:3001/reviews');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);
        console.log(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div>
      <h2>User reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.ra_id}>
            <Link to={`/movieinfo/${review.mo_id}`} className="movie-title">
              <h4>{review.movie}</h4>
            </Link>
            <p>{review.text}</p>
            <p>{review.stars} stars</p>
            <p>{new Date(review.time).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default ReviewList;
