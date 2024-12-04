import { pool } from "../helpers/db.js";

const selectMovieReviewsById = async (movie) => {
    return await pool.query('select "Accounts".email,"Ratings".stars, "Ratings".text, "Ratings".time from "Ratings" inner join "Accounts" on "Ratings".ac_id="Accounts".ac_id where movie=$1', [movie])
}

const insertReview = async (movie, stars, text, account) => {
    return await pool.query('insert into "Ratings" (movie, stars, text, time, ac_id) values ($1,$2,$3,SELECT CURRENT_TIMESTAMP AT TIME ZONE "UTC+5"),$4) returning *', [movie, stars, text, account])
}

const removeReview = async (movie, account) => {
    return await pool.query('delete from "Ratings" where movie =$1 and ac_id = $2', [movie, account])
}

export {selectMovieReviewsById, insertReview, removeReview};