import { pool } from '../db.js'
import { Router } from "express"

const router = Router();

router.get('/reviews', async (req, res) => {
    try {
        const { movie } = req.query;
        let result;
        if (movie) {
            result = await pool.query('SELECT * FROM "Ratings" WHERE movie = $1', [movie]);
        } else {
            result = await pool.query('select "Accounts".email,"Ratings".stars, "Ratings".text, "Ratings".time, "Ratings".mo_id, "Ratings".movie from "Ratings" inner join "Accounts" on "Ratings".ac_id="Accounts".ac_id');
        }
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Server error');
    }
});

export default router;