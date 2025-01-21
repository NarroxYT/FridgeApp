// 🔐 Authentication Routes
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/database');

// 🔑 Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// 🔓 Login Process
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM admin WHERE username = ?', [username], async (err, admin) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, admin.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        req.session.isAdmin = true;
        res.json({ success: true });
    });
});

// 🚪 Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
