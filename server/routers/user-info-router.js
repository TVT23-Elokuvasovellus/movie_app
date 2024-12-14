import { pool } from '../db.js';
import { Router } from 'express';

const router = Router();

router.get('/email', async (req, res) => {
    const { user_id } = req.query;

    try {
      console.log("Fetching email for user: ", user_id);
      const result = await pool.query('SELECT email FROM public."Accounts" WHERE ac_id = $1', [user_id]);
      if (result.rows.length > 0) {
        res.json({ email: result.rows[0].email });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      console.error('Error fetching email:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
