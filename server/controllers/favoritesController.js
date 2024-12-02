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
    } catch (err) {
        console.error('Error fetching favorites:', err);
        res.status(500).json({ error: 'An error occurred while fetching favorites' });
    }
};
