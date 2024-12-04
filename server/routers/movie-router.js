import { Router } from "express";
import { getReview, postReview, deleteReview } from "../controllers/movie-controller.js";

const router = Router()

router.get('/:movie', getReview)
router.post('/:movie/create', postReview)
router.delete('/:movie/delete', deleteReview)

export default router