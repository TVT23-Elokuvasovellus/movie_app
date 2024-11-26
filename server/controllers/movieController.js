import { insertReview, selectMovieReviewsById, removeReview } from "../models/movie.js";

const postReview = async (req,res,next) => {
    try {
        const movie = parseString(req.params.movie)
        const result = await insertReview(movie, req.body.stars, req.body.text, req.body.account)

    } catch(error) {
        return next(error)
    }
}

const getReview = async (req,res,next) => {
    try {
        const movie = req.params.movie;
        const result = await selectMovieReviewsById(movie)
        return res.status(200).json(result.rows)
    } catch(error) {
        return next(error)
    }
}

const deleteReview = async (req,res,next) => {
    try {
        const movie = req.params.movie;
        const result = await removeReview(movie, req.body.account)
    } catch(error) {
        return next(error)
    }
}

export { getReview, postReview, deleteReview }