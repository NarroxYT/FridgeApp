// 👥 Users Routes
const express = require('express');
const router = express.Router();
const db = require('../models/database');

// 📋 Get all users
router.get('/', (req, res) => {
    db.all('SELECT * FROM users WHERE active = 1', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// 📊 Get user statistics
router.get('/:id/stats', (req, res) => {
    const userId = req.params.id;
    
    const query = `
        SELECT 
            t.id,
            d.name as drink_name,
            t.quantity,
            t.total_price,
            t.created_at
        FROM transactions t
        JOIN drinks d ON t.drink_id = d.id
        WHERE t.user_id = ?
        ORDER BY t.created_at DESC
        LIMIT 50
    `;
    
    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        // Calculate total spent
        const totalSpent = rows.reduce((sum, row) => sum + row.total_price, 0);
        
        res.json({
            transactions: rows,
            totalSpent
        });
    });
});

module.exports = router;
