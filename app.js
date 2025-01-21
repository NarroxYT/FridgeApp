// 🚀 Main Application Entry Point
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');

// 🎯 Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// 💫 Middleware Setup
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// 🔐 Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// 📚 Routes Import
const authRoutes = require('./src/routes/auth');
const drinkRoutes = require('./src/routes/drinks');
const userRoutes = require('./src/routes/users');
const adminRoutes = require('./src/routes/admin');

// 🛣️ Route Setup
app.use('/auth', authRoutes);
app.use('/drinks', drinkRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// 🏠 Home Route
app.get('/', (req, res) => {
    res.render('index');
});

// 🚦 Start Server
app.listen(PORT, () => {
    console.log(`🌟 Server running on http://localhost:${PORT}`);
});
