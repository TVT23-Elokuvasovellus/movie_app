import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";

const url = 'http://localhost:3001'

function Review() {
    const location = useLocation();
    const movieId = location.state?.id;
    console.log("Location: " + location.pathname);
    console.log("movie id is: " + movieId);
    const [reviews, setReviews] = useState([])
    const getReviews = () =>{
        axios.get(url + '/movie/'+ movieId)
        .then(response => {
            setReviews(response.data)
        })
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
        getReviews();
    },[movieId])

    return (
        <div>
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