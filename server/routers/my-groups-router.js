import { pool } from '../db.js';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/myGroups', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        const userId = decoded.id;

        const myGroups = await pool.query(
            `SELECT g.gr_id, g.name
            FROM "Groups" g
            WHERE g.owner = $1
            UNION
            SELECT g.gr_id, g.name
            FROM "Members" m
            JOIN "Groups" g ON m."group" = g.gr_id
            WHERE m.member = $1 AND m.is_pending = FALSE;`,
            [userId]
        );

        res.json({ myGroups: myGroups.rows });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch groups.' });
    }
});

export default router;
