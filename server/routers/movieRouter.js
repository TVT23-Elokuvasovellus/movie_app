import { Router } from "express";
import { getReview, postReview, deleteReview } from "../controllers/movieController";

const router = Router()

router.get('/movie/:movie', getReview)
router.post('/movie/:movie/create', postReview)
router.delete('/movie/:movie/delete', deleteReview)

export default router