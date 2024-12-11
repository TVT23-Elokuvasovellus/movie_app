import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import '../styles/MovieInfoPage.css';
import { eventWrapper } from '@testing-library/user-event/dist/utils';
import FetchGroups from '../components/FetchGroups';
import { useNavigate } from 'react-router-dom';


const url = 'http://localhost:3001'
const token = process.env.REACT_APP_API_TOKEN;

const options = {
  method: 'GET',
  headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
  }
};

function MovieInfo() {
  const location = useLocation();
  const movieId = (location.pathname.toString()).slice(7);
  console.log(movieId);
  const [movieInfo, setMovieInfo] = useState(null);
  const [error, setError] = useState(null);
  const [actors, setActors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedSort, setSelectedSort] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const castListRef = useRef(null);
  const { isLoggedIn, user } = useAuth();
  const reviewsPerPage = 9;

  const getReviews = () =>{
    console.log("Get Reviews: ");
    axios.get(url + '/movie/'+ movieId)
    .then(response => {
        setReviews(response.data)
        console.log(response.data)
    }).catch(err => {
      console.error('Error trying to get reviews: ', err);
    })
  }

  const addReview = (event) =>{
    event.preventDefault();
    console.log("Addreview wohoo!", movieInfo?.title);
    axios.post(url + '/movie/' + movieId +'/create', {
        movieName: movieInfo?.title,
        stars: event.currentTarget.elements.stars.value,
        text: event.currentTarget.elements.review.value,
        account: user?.id
    }).catch(err => {
      console.error('Error trying to add a review: ', err);
    })
  }

const deleteReview = () =>{
    axios.delete(url + '/movie/' + movieId + '/delete', {
        account: user?.id
    }).catch(err => {
      console.error('Error trying to delete review: ', err);
    })
  }

  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate ();

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
    const fetchGroupData = async () => {
      try {
        const groupsData = await FetchGroups();
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroupData();
  }, []);

  useEffect(() => {
    const fetchMovieInfo = async () => {
      try {
        if (!movieId) {
          throw new Error('Movie ID is missing');
        }
        const searchUrlMovie = `https://api.themoviedb.org/3/movie/${movieId}?api_key=API_KEY`
        fetch(searchUrlMovie, options)
        .then(res => res.json())
        .then(json => {
            setMovieInfo(json);
            console.log(json);
        })
        .catch(err => {
            console.error('Movie details error:', err);
        });

        // Fetch actors
        const searchUrlActors = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=API_KEY`
        fetch(searchUrlActors, options)
        .then(res => res.json())
        .then(json => {
            setActors(json.cast);
            console.log(json.cast);
        })
        .catch(err => {
            console.error('Movie details error:', err);
        });

        // Fetch possible reviews of the movie
        getReviews();
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

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
    const group = groups.find(group => group.ID === event.target.value);
    setSelectedGroupName(group ? group.name : '');
  };

  const handleShare = async () => {
    if (!selectedGroup) {
      console.error("Please select a group before sharing.");
      alert("Select a group.");
      return;
    }
      const postData = [
        {
          title: movieInfo?.title,
          img: `https://image.tmdb.org/t/p/w342${movieInfo?.poster_path}`,
          type : 'movie',
        },
      ];

      const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:3001/group/${selectedGroup}/addMovie`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, 
                },
                body: JSON.stringify({ sharedMovie: postData[0] }), 
            });
            const data = await response.json();
              if (response.ok && data.success) {
                navigate(`/group/${selectedGroup}`, { 
                    state: { id: selectedGroup, name: selectedGroupName, sharedMovie: postData[0] } 
                });
            } else {
                console.error('Failed to share movie:', data.error || 'Unknown error');
            }
        } catch (err) {
            console.error('Error while sharing the movie:', err); 
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
        {isLoggedIn ? (
        <div>
          <select value={selectedGroup} onChange={handleGroupChange}>
            <option value="">Select a group</option>
            {groups !== null && typeof groups !== 'undefined' ? (
              groups.map(group => (
                <option key={group.gr_id} value={group.gr_id}>
                  {group.name}
                </option>
              ))) : (
                <p>Groups could no be loaded.</p>
              )}
          </select>
          <button onClick={handleShare}>Share to group</button>
        </div>
        ) : (
          <p>Login to share this movie.</p>
        )}
        <div className="cast-section">
          <h3>Cast</h3>
          <div className="cast-scroller">
            <button onClick={scrollLeft} className="scroll-button">{'<'}</button>
            <div className="cast-list" ref={castListRef}>
              {actors !== null && typeof actors !== 'undefined' ? (
              actors.map(actor => (
                <div key={actor.cast_id} className="actor">
                  <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} />
                  <p><strong>{actor.name}</strong></p>
                  <p>{actor.character}</p>
                </div>
              ))
            ) :  (
              <p>Actors not found.</p>
            )}
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
            {currentReviews.length > 0 && typeof currentReviews !== 'undefined' && currentReviews !== null ? (
              currentReviews.map(review => (
                <div key={review.ra_id} className = 'review'>
                  <p><strong>{review.email}</strong></p>
                  <p>{review.text}</p>
                  <p>{review.stars} stars</p>
                  <p>{new Date(review.time).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No reviews available.</p>
            )}
        </div>
            {isLoggedIn ? (
            <form onSubmit={addReview}>
                <label for="stars">Stars: </label>
                <input type='number' id="stars" name="stars" min="0" max="5"></input>
                <br/>
                <label for="review">Review: </label>
                <input type="text" id="review" name='review'/>
                <br/>
                <input type='submit'/>
            </form>
            ) : (
                <p>Log in to write a review.</p>
            )}
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
