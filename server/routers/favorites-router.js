import express from 'express';
import { getFavoritesByUserId, addFavorite, removeFavorite, getUsersWithPublicFavorites, setPublicFavorites, checkPublicFavorites } from '../controllers/favorites-controller.js';

const router = express.Router();

router.get('/favorites', getFavoritesByUserId);
router.post('/favorites', addFavorite);

router.delete('/removeFavorite', (req, res, next) => {
  console.log('Received request to /removeFavorite');
  next();
}, removeFavorite);

router.get('/public-favorites', getUsersWithPublicFavorites);
router.put('/setPublic', setPublicFavorites);
router.get('/checkPublic', checkPublicFavorites);

export default router;