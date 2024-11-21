import { pool } from '../db.js'
import { Router } from "express"
import jwt from 'jsonwebtoken';

const router = Router()

router.get('/', (req, res) => {
    pool.query('SELECT * FROM "Groups"', (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to fetch groups' });
      }
      return res.status(200).json(result.rows);
    });
  });
  
  router.post('/create', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    jwt.verify(token, 'your_secret_key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
  
      const { name } = req.body;
      const ac_id = decoded.id;  
  
      try {
        const result = await pool.query(
          'INSERT INTO "Groups" (owner, name) VALUES ($1, $2) RETURNING *',
          [ac_id, name]
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create group' });
      }
    });
  });
  
  router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
      try {
        const decoded = jwt.verify(token, 'your_secret_key');
        const ac_id = decoded.id; 

        console.log(`Decoded User ID: ${ac_id}, Group ID: ${id}`); //debug 

        const groupResult = await pool.query(
            'SELECT * FROM "Groups" WHERE "gr_id" = $1 AND "owner" = $2',
            [id, ac_id]
        );

        if (groupResult.rows.length === 0) {
            return res.status(403).json({ error: 'You are not authorized to delete this group.' });
        }

        await pool.query('DELETE FROM "Groups" WHERE "gr_id" = $1', [id]);

        console.log(`Group ${id} deleted by user ${ac_id}`);
        res.status(200).json({ message: 'Group deleted successfully.' });
    } catch (error) {
        console.error('Error deleting group:', error.message);
        res.status(500).json({ error: 'Failed to delete group.' });
    }
});
  
  router.get('/group/:id', async (req, res) => {
    const { id } = req.params; 
    console.log(`Group ID (gr_id): ${id}`);

    const token = req.headers.authorization?.split(' ')[1]; 
    try {
      const decoded = jwt.verify(token, 'your_secret_key'); 
      const ac_id = decoded.id; 
      console.log(`Decoded User ID (ac_id): ${ac_id}`); // testing 
      const groupResult = await pool.query(
        'SELECT * FROM "Groups" WHERE "gr_id" = $1 AND (owner = $2 OR EXISTS (SELECT 1 FROM "Members" WHERE "group" = $1 AND me_id = $2))'
        ,[id, ac_id]
      );
  
      if (groupResult.rows.length === 0) {
        return res.status(403).json({ error: "You are not authorized to view this group." });
      }
  
      const group = groupResult.rows[0];
      res.status(200).json(group);
    } catch (error) {
      console.error("Error fetching group:", error);
      res.status(500).json({ error: 'Failed to fetch group' });
    }
  });

export default router; 