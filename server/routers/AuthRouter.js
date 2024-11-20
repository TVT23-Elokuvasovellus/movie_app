import { pool } from '../db.js'
import bcrypt from 'bcryptjs'
import { Router } from "express"
import jwt from 'jsonwebtoken';

const router = Router()

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const result = await pool.query('SELECT * FROM "Accounts" WHERE email = $1', [email]);
        const account = result.rows[0];

        if (account && await bcrypt.compare(password, account.password)) { 
            const token = jwt.sign({ id: account.ac_id }, 'your_secret_key', { expiresIn: '1h' });
            res.json({ success: true, message: 'Login successful', token });
        } else {
          res.json({success: false, message: 'Invalid email or password'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 8);

        await pool.query('INSERT INTO "Accounts" (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        res.json({success: true, message: 'User registered successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

export default router; 