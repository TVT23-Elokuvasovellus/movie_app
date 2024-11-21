import { useState, useEffect } from 'react';
import axios from 'axios';

const url = 'http://localhost:3001'

function Review() {
    const [reviews, setReviews] = useState([])
    const getReviews = (movie) =>{
        axios.get(url + '/movie/'+movie)
        .then(response => {
            setReviews(response.data)
        })
    }
    const addReview = () =>{
        axios.post(url + '/movie/' + movie +'/create', {
            stars: stars,
            text: text,
            time: time,
            account: account
        })
        
    }
    useEffect((movie) => {
        getReviews(movie);
    },[])
    return (
        <div>
            <form>
                <label for="stars">Stars: </label>
                <br/>
                <label for="review">Review: </label>
                <input type="text" id="review" name='review' value={text}/>
            </form>
        </div>
    )
}

export default Review;