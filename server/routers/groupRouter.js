import { pool } from '../db.js'
import { Router } from "express"

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
    const { ac_id, name } = req.body;
    if (!ac_id) {
      return res.status(401).json({ error: "You must be logged in to create a group." });
    }
    try {
      const result = await pool.query(
        'INSERT INTO "Groups" (gr_id, owner, name) VALUES (DEFAULT, $1, $2) RETURNING *',
        [ac_id, name]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create group' });
    }
  });
  
  router.delete('/delete/:gr_id', async (req, res) => {
    const { gr_id } = req.params;
    const { ac_id } = req.body; 
    try {
      const result = await pool.query(
        'SELECT owner FROM "Groups" WHERE gr_id = $1',[gr_id]
      );
  
      const ownerId = result.rows[0].owner; 
  
      if (ac_id !== ownerId) {
        return res.status(403).json({ error: 'You are not the owner of this group' });
      }
      await pool.query('DELETE FROM "Members" WHERE group = $1', [gr_id]);
      await pool.query('DELETE FROM "Groups" WHERE gr_id = $1', [gr_id]);
      res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete group' });
    }
  });
  
  router.get('/group/:id', async (req, res) => {
    const { gr_id } = req.params;
    const { ac_id } = req.body; 

    try {
      const groupResult = await pool.query(
        'SELECT * FROM "Groups" WHERE gr_id = $1 AND (owner = $2 OR EXISTS (SELECT 1 FROM "Members" WHERE gr_id = $1))',//AND ac_id = $2
        [gr_id, ac_id]
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