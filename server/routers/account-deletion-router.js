import { pool } from '../db.js';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.delete('/deleteAccount', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.error("Token not provided");
    return res.status(401).json({ success: false, message: 'Authorization token missing' });
  }

  jwt.verify(token, 'your_secret_key', async (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const { userId, email } = req.body;
    const ac_id = decoded.id;

    try {
      console.log("Delete Account Request:", { userId, email });

      const result = await pool.query('SELECT * FROM "Accounts" WHERE ac_id = $1 AND email = $2', [ac_id, email]);
      const account = result.rows[0];

      if (!account) {
        console.error("Account not found for email:", email);
        return res.status(400).json({ success: false, message: 'Invalid email address.' });
      }

      await pool.query('DELETE FROM "Accounts" WHERE ac_id = $1', [ac_id]);
      console.log("Account deleted for userId:", ac_id);
      res.status(200).json({ success: true, message: 'Account deleted successfully.' });
    } catch (err) {
      console.error("Error deleting account:", err);
      res.status(500).json({ success: false, message: 'An error occurred while deleting the account.' });
    }
  });
});

export default router;