import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import { Router } from "express";
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM "Accounts" WHERE email = $1', [email]);
        const account = result.rows[0];

        if (account && await bcrypt.compare(password, account.password)) {
            const token = jwt.sign({ id: account.ac_id }, 'your_secret_key');
            console.log(`User ${account.ac_id} (${account.email}) logged in successfully`);
            res.json({
                success: true,
                token,
                userId: account.ac_id,
                email: account.email,
            });
        } else {
            console.log(`Login attempt failed for email: ${email}`);
            res.json({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/logout', (req, res) => {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token;
    if (!token) {
        console.log('Logout attempt without token');
        return res.status(400).json({ success: false, message: 'No token provided' });
    }
    console.log('User logged out with token:', token);
    res.json({ success: true, message: 'Logged out successfully' });
});

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password || password.length < 6) {
        console.log('Signup failed: Invalid email or password');
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 8);

        await pool.query('INSERT INTO "Accounts" (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        console.log(`New user registered: ${email}`);
        res.json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;