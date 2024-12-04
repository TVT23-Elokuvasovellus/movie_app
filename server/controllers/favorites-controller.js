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
