import { pool } from "../helpers/db.js";

const selectMovieReviewsById = async (movie) => {
    return await pool.query('select * from "Ratings" where movie=$1', [movie])
}

const insertReview = async (movie, stars, text, time, account) => {
    return await pool.query('insert into "Ratings" (movie, stars, text, time, ac_id) values ($1,$2,$3,$4,$5) returning *', [movie, stars, text, time, account])
}

const removeReview = async (movie, account) => {
    return await pool.query('delete from "Ratings" where movie =$1 and ac_id = $2', [movie, account])
}

export {selectMovieReviewsById, insertReview, removeReview};