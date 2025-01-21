// 👑 Admin Routes
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/database');
const { isAdmin, isAdminAPI } = require('../middleware/auth');

// 🔐 Admin Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// 🔑 Admin Login
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

// 📊 Admin Dashboard
router.get('/', isAdmin, (req, res) => {
    res.render('admin');
});

// 👥 Users Management
router.get('/users', isAdminAPI, (req, res) => {
    db.all('SELECT * FROM users ORDER BY name', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

router.post('/users', isAdminAPI, (req, res) => {
    const { name } = req.body;
    
    db.run('INSERT INTO users (name) VALUES (?)', [name], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ id: this.lastID });
    });
});

router.delete('/users/:id', isAdminAPI, (req, res) => {
    const userId = req.params.id;
    
    db.run('UPDATE users SET active = 0 WHERE id = ?', [userId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true });
    });
});

// 🥤 Drinks Management
router.get('/drinks', isAdminAPI, (req, res) => {
    db.all('SELECT * FROM drinks ORDER BY name', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

router.post('/drinks', isAdminAPI, (req, res) => {
    const { name, price } = req.body;
    
    db.run('INSERT INTO drinks (name, price) VALUES (?, ?)', [name, price], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ id: this.lastID });
    });
});

//toggle user activation status
router.patch('/users/:id/toggle', isAdminAPI, (req, res) => {
    const userId = req.params.id;

    db.run(
        'UPDATE users SET active = NOT active WHERE id = ?',
        [userId],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error'});
            }
            res.json({ success: true });
        }
    );
});

//toggle drink activation status
router.patch('/drinks/:id/toggle', isAdminAPI, (req, res) => {
    const drinkId = req.params.id;

    db.run(
        'UPDATE drinks SET active = NOT active WHERE id = ?',
        [drinkId],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error'});
            }
            res.json({ success: true });
        }
    );
});

router.delete('/drinks/:id', isAdminAPI, (req, res) => {
    const drinkId = req.params.id;
    
    db.run('UPDATE drinks SET active = 0 WHERE id = ?', [drinkId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true });
    });
});

// 📝 Transactions
router.get('/transactions', isAdminAPI, (req, res) => {
    const query = `
        SELECT 
            u.id as user_id,
            u.name as user_name,
            u.active as user_active,
            d.id as drink_id,
            d.name as drink_name,
            COUNT(*) as drink_count,
            SUM(t.quantity) as total_quantity,
            SUM(t.total_price) as total_spent,
            MAX(t.created_at) as last_purchase
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        JOIN drinks d ON t.drink_id = d.id
        GROUP BY u.id, u.name, d.id, d.name
        ORDER BY u.name, d.name
    `;
    
    db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Reorganize data by user
        const userTransactions = {};
        rows.forEach(row => {
            if (!userTransactions[row.user_id]) {
                userTransactions[row.user_id] = {
                    user_name: row.user_name,
                    user_active: row.user_active === 1,
                    total_spent: 0,
                    drinks: []
                };
            }
            
            userTransactions[row.user_id].drinks.push({
                drink_name: row.drink_name,
                quantity: row.total_quantity,
                total_spent: row.total_spent,
                last_purchase: row.last_purchase,
            });
            
            userTransactions[row.user_id].total_spent += row.total_spent;
        });

        res.json(Object.values(userTransactions));
    });
});

module.exports = router;
