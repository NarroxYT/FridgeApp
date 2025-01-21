// 🥤 Drinks Routes
const express = require('express');
const router = express.Router();
const db = require('../models/database');

// 📋 Get all drinks
router.get('/', (req, res) => {
    db.all('SELECT * FROM drinks WHERE active = 1', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// 📝 Record drink taken
router.post('/take', (req, res) => {
    const { userId, drinkId, quantity } = req.body;
    
    // Get drink price
    db.get('SELECT price FROM drinks WHERE id = ?', [drinkId], (err, drink) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!drink) {
            return res.status(404).json({ error: 'Drink not found' });
        }
        
        const totalPrice = drink.price * quantity;
        
        // Record transaction
        db.run(
            'INSERT INTO transactions (user_id, drink_id, quantity, total_price) VALUES (?, ?, ?, ?)',
            [userId, drinkId, quantity, totalPrice],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.json({ success: true });
            }
        );
    });
});

module.exports = router;
