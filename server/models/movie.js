import { pool } from "../helpers/db.js";

const selectMovieReviewsById = async (movie) => {
    return await pool.query('select "Accounts".email,"Ratings".ac_id, "Ratings".stars, "Ratings".text, "Ratings".time from "Ratings" inner join "Accounts" on "Ratings".ac_id="Accounts".ac_id where mo_id=$1', [movie])
}

const insertReview = async (movie, movieName, stars, text, account) => {
    return await pool.query(`insert into "Ratings" (mo_id, movie, stars, text, time, ac_id) values ($1,$2,$3,$4,(SELECT CURRENT_TIMESTAMP AT TIME ZONE 'UTC+5'),$5) returning *`, [movie, movieName, stars, text, account])
}

const removeReview = async (movie, account) => {
    return await pool.query('delete from "Ratings" where movie =$1 and ac_id = $2', [movie, account])
}

export {selectMovieReviewsById, insertReview, removeReview};