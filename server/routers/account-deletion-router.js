import { pool } from '../db.js';
import { Router } from 'express';

const router = Router();

router.delete('/deleteAccount', async (req, res) => {
  const { userId, email } = req.body;

  try {
    console.log("Delete Account Request:", { userId, email });

    const result = await pool.query('SELECT * FROM "Accounts" WHERE ac_id = $1 AND email = $2', [userId, email]);
    const account = result.rows[0];

    if (!account) {
      console.error("Account not found for email:", email);
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    await pool.query('DELETE FROM "Accounts" WHERE ac_id = $1', [userId]);
    console.log("Account deleted for userId:", userId);
    res.status(200).json({ success: true, message: 'Account deleted successfully.' });
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ success: false, message: 'An error occurred while deleting the account.' });
  }
});

export default router;