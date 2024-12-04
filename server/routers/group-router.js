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

        const groupResult = await pool.query(
            'SELECT * FROM "Groups" WHERE "gr_id" = $1 AND "owner" = $2',
            [id, ac_id]
        );

        if (groupResult.rows.length === 0) {
            return res.status(403).json({ error: 'You are not authorized to delete this group.' });
        }

        await pool.query('DELETE FROM "Groups" WHERE "gr_id" = $1', [id]);

        res.status(200).json({ message: 'Group deleted successfully.' });
    } catch (error) {
        console.error('Error deleting group:', error.message);
        res.status(500).json({ error: 'Failed to delete group.' });
    }
});
  
  router.get('/group/:id', async (req, res) => {
    const { id } = req.params; 
    const token = req.headers.authorization?.split(' ')[1]; 
    try {
      const decoded = jwt.verify(token, 'your_secret_key'); 
      const userId = decoded.id; 
      const groupId = parseInt(id, 10);
      const groupResult = await pool.query(
        `SELECT 1 
         FROM "Groups" 
         WHERE gr_id = $1 AND owner = $2
         UNION
         SELECT 1 
         FROM "Members" 
         WHERE "group" = $1 AND member = $2 AND is_pending = FALSE`,
        [groupId, userId]
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

  router.post('/invite/:id', async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        const userId = decoded.id;

        const memberCheck = await pool.query(
            'SELECT 1 FROM "Members" WHERE "group" = $1 AND member = $2 UNION SELECT 1 FROM "Groups" WHERE gr_id = $1 AND owner = $2',
            [id, userId]
        );

        if (memberCheck.rows.length > 0) {
            return res.status(400).json({ error: "You have already send request." });
        }

        await pool.query(
            'INSERT INTO "Members" ("group", member) VALUES ($1, $2)',
            [id, userId]
        );
        res.status(200).json({ message: "Invite request sent successfully!" });
    } catch (error) {
        console.error("Error sending invite:", error);
        res.status(500).json({ error: "Failed to send invite." });
    }
});

router.post('/group/:id/respond', async (req, res) => {
  const { id } = req.params;
  const { memberId, action } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        const userId = decoded.id;

        const groupOwner = await pool.query(
          'SELECT 1 FROM "Groups" WHERE gr_id = $1 AND owner = $2',
          [id, userId]
        );
    
        if (groupOwner.rows.length === 0) {
          return res.status(403).json({ error: "Only the owner of the group can Delete/Accept" });
        }

        if (action === 'accept') {
          const result = await pool.query(
            'UPDATE "Members" SET is_pending = FALSE WHERE "group" = $1 AND member = $2 RETURNING *',
            [id, memberId]
          );
          res.json({ message: "Request accepted" });
        } else if (action === 'reject') {
            const result = await pool.query(
              'DELETE FROM "Members" WHERE "group" = $1 AND member = $2 AND is_pending = TRUE',
              [id, memberId]
            );
            res.json({ message: "Request denied" });
          } else {
            res.status(400).json({ error: "---." });
          } 
        } catch (error) {
            console.error("Virhe pyynnön käsittelyssä:", error);
            res.status(500).json({ error: "Palvelinvirhe." });
          }
});

router.get('/group/:id/pending', async (req, res) => {
  const { id } = req.params;
  try {

    const pendingMembers = await pool.query(
      'SELECT m.*, a.email FROM "Members" m INNER JOIN "Accounts" a ON m.member = a.ac_id WHERE m."group" = $1 AND m.is_pending = TRUE',
      [id]
    );

    res.json({ pendingMembers: pendingMembers.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch pending members.' });
  }
});

export default router; 