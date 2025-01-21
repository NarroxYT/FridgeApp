// 🗄️ Database Configuration and Schema
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 📁 Create database connection
const db = new sqlite3.Database(path.join(__dirname, '../../fridge.db'));

// 🏗️ Initialize Database Schema
const initDb = () => {
    db.serialize(() => {
        // 👥 Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // 🥤 Drinks Table
        db.run(`CREATE TABLE IF NOT EXISTS drinks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            price DECIMAL(10,2) NOT NULL,
            active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // 📝 Transactions Table
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            drink_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            total_price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (drink_id) REFERENCES drinks(id)
        )`);

        // 👮 Admin Table
        db.run(`CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    });
};

// 🚀 Initialize Database
initDb();

module.exports = db;
