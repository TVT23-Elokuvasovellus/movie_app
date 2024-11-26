import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";

const url = 'http://localhost:3001'
const token = process.env.REACT_APP_API_TOKEN;

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
};

function Review() {
    const location = useLocation();
    const movieId = (location.pathname.toString()).slice(8);
    console.log("Location: " + location.pathname);
    console.log("movie id is: " + movieId);
    const [reviews, setReviews] = useState([])
    const [movieData, setMovieData] = useState([])
    const getReviews = () =>{
        console.log("Getreview wohoo!")
        axios.get(url + '/movie/'+ movieId)
        .then(response => {
            setReviews(response.data)
            console.log(response.data)
        })
    }
    const getMovieDetails = ()=> {
        const searchUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=API_KEY`
        fetch(searchUrl, options)
        .then(res => res.json())
        .then(json => {
            setMovieData(json);
            console.log(json);
        })
        .catch(err => {
            console.error('Movie details error:', err);
        });
    }
    const addReview = () =>{
        console.log("Addreview wohoo!");
        axios.post(url + '/movie/' + movieId +'/create', {
            stars: "stars",
            text: "text",
            time: "time",
            account: "account"
        })
        
    }
    useEffect(() => {
        getMovieDetails();
        getReviews();
    },[movieId])

    return (
        <div>
            <div>
                <h2>{movieData.title}</h2>
                <img src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`} alt={movieData.title} onError={(e) => { e.target.onError = null; e.target.src = "img/default.JPG"; }} />
                <p>{movieData.overview}</p>
            </div>
            <div className="reviews">
                {reviews?.map((item, index) => (
                    <div className="" key={index}>
                        <h2>{item.email}</h2>
                        <p>{item.stars}</p>
                        <p>{item.text}</p>
                        <p>{item.time}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={addReview}>
                <label for="stars">Stars: </label>
                <input type='number' id="stars" name="stars" min="0" max="5"></input>
                <br/>
                <label for="review">Review: </label>
                <input type="text" id="review" name='review'/>
                <br/>
                <input type='submit'/>
            </form>
        </div>
    )
}

export default Review;