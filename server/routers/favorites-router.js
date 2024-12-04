import express from 'express';
import { getFavoritesByUserId, addFavorite } from '../controllers/favorites-controller.js';

const router = express.Router();

router.get('/favorites', getFavoritesByUserId);
router.post('/favorites', addFavorite);

export default router;
