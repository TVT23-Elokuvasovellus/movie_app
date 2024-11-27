import { pool } from '../db.js'
import { Router } from "express"
import jwt from 'jsonwebtoken';

const router = Router()

router.get('/group/:id/members', async (req, res) => {
    const { id } = req.params;
    try {
      const members = await pool.query(
        'SELECT m.member AS member_id, a.email FROM "Members" m JOIN "Accounts" a ON m.member = a.ac_id WHERE m."group" = $1 AND m.is_pending = FALSE',
        [id]
      );
      res.json({ members: members.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch members.' });
      }
    });
  
  router.delete('/group/:id/member/:memberId', async (req, res) => {
    const { id, memberId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, 'your_secret_key');
      const userId = decoded.id;
  
      const ownerCheck = await pool.query(
        'SELECT 1 FROM "Groups" WHERE gr_id = $1 AND owner = $2',
        [id, userId]
      );
  
      if (ownerCheck.rows.length === 0) {
        return res.status(403).json({ error: "Unauthorized. Only the owner can remove members." });
      }
  
      const deleteResult = await pool.query(
        'DELETE FROM "Members" WHERE "group" = $1 AND member = $2',
        [id, memberId]
      );
  
      if (deleteResult.rowCount === 0) {
        return res.status(404).json({ error: "Member not found." });
      }
  
      res.json({ message: "Member removed successfully." });
    } catch (error) {
      console.error("Error deleting member:", error);
      res.status(500).json({ error: 'Failed to remove member.' });
    }
  });

export default router; 