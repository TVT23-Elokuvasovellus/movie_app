import { pool } from '../db.js'
import { Router } from "express"
import jwt from 'jsonwebtoken';

const router = Router()

router.get('/group/:id/shows', async (req, res) => {
    const { id } = req.params; 
    try {
      const sharedShows = await pool.query(
       `SELECT sh_id, s.ac_id, title, location, time, date, shared_at, a.email
         FROM "Shared" s
         JOIN "Accounts" a ON s.ac_id = a.ac_id
         WHERE s.gr_id = $1
         ORDER BY shared_at DESC`,
        [id]
      );
  
      res.status(200).json({ success: true, shows: sharedShows.rows });
    } catch (error) {
      console.error('Error fetching shared shows:', error);
      res.status(500).json({ error: 'Failed to fetch shared shows' });
    }
  });

router.post('/group/:id/addShow', async (req, res) => {
    const { id } = req.params; 
    const { sharedShow } = req.body; 
    const token = req.headers.authorization?.split(' ')[1];
    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        const userId = decoded.id;
        const result = await pool.query(
            `INSERT INTO "Shared" (ac_id, gr_id, title, location, time, date)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [userId, id, sharedShow.title, sharedShow.location, sharedShow.time, sharedShow.date]
          );
        console.log("Inserted Show:", result.rows[0]);
        res.status(201).json({ success: true, sharedShow: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add show to group' });
      }
    });
export default router; 