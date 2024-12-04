import express from 'express';
import { getFavoritesByUserId } from '../controllers/favoritesController.js';

const router = express.Router();

router.get('/favorites', getFavoritesByUserId);

export default router;
