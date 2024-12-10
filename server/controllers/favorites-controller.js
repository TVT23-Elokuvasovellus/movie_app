import { pool } from '../db.js';

export const getFavoritesByUserId = async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const result = await pool.query('SELECT * FROM "Favorites" WHERE ac_id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No favorites found for this user' });
    }
    res.json(result.rows);
    console.log('Fetching favorites for user ID:', userId);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'An error occurred while fetching favorites' });
  }
};

export const addFavorite = async (req, res) => {
  const { ac_id, mo_id, movie } = req.body;

  if (!ac_id || !mo_id || !movie) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO "Favorites" (ac_id, mo_id, movie) VALUES ($1, $2, $3) RETURNING *',
      [ac_id, mo_id, movie]
    );
    res.status(201).json(result.rows[0]);
    console.log(`Inserting movie "${movie}" (mo_id: ${mo_id}) into the favorite list of user (ac_id: ${ac_id})`);
  } catch (err) {
    console.error('Error adding favorite:', err);
    res.status(500).json({ error: 'An error occurred while adding favorite' });
  }
};

export const removeFavorite = async (req, res) => {
  const { ac_id, mo_id } = req.body;
  console.log('Incoming request to remove favorite:', { ac_id, mo_id });

  if (!ac_id || !mo_id) {
    return res.status(400).json({ error: 'Account ID and Movie ID are required' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM "Favorites" WHERE ac_id = $1 AND mo_id = $2 RETURNING *',
      [ac_id, mo_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    res.status(200).json({ message: 'Favorite removed successfully' });
    console.log(`Removed movie (mo_id: ${mo_id}) from the favorite list of user (ac_id: ${ac_id})`);
  } catch (err) {
    console.error('Error removing favorite:', err);
    res.status(500).json({ error: 'An error occurred while removing favorite' });
  }
};

export const getUsersWithPublicFavorites = async (req, res) => {
  try {
    const users = await pool.query('SELECT ac_id, email FROM public."Accounts" WHERE public_favorites = true');
    res.json(users.rows);
  } catch (error) {
    console.error('Error fetching public favorites', error);
    res.status(500).send('Server error');
  }
};

export const setPublicFavorites = async (req, res) => {
  const { userId, publicFavorites } = req.body;

  if (typeof publicFavorites !== 'boolean') {
    return res.status(400).json({ error: 'publicFavorites must be a boolean' });
  }

  try {
    const result = await pool.query(
      'UPDATE public."Accounts" SET public_favorites = $1 WHERE ac_id = $2 RETURNING *',
      [publicFavorites, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Public favorites updated successfully' });
    console.log(`Set public favorites for user ID: ${userId} to ${publicFavorites}`);
  } catch (err) {
    console.error('Error setting public favorites:', err);
    res.status(500).json({ error: 'An error occurred while setting public favorites' });
  }
};

export const checkPublicFavorites = async (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const result = await pool.query('SELECT public_favorites FROM public."Accounts" WHERE ac_id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ publicFavorites: result.rows[0].public_favorites });
  } catch (err) {
    console.error('Error checking public favorites:', err);
    res.status(500).json({ error: 'An error occurred while checking public favorites' });
  }
};
