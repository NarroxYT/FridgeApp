// 🔐 Admin Account Initialization Script
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../fridge.db'));

async function initializeAdmin() {
    try {
        // Default admin credentials
        const username = 'admin';
        const password = 'admin123';
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        // Create admin table if not exists
        db.run(`
            CREATE TABLE IF NOT EXISTS admin (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `, async function(err) {
            if (err) {
                console.error('Error creating admin table:', err);
                process.exit(1);
            }
            
            // Insert admin user
            db.run(
                'INSERT OR REPLACE INTO admin (username, password_hash) VALUES (?, ?)',
                [username, passwordHash],
                function(err) {
                    if (err) {
                        console.error('Error creating admin user:', err);
                        process.exit(1);
                    }
                    
                    console.log('✅ Admin account created successfully!');
                    console.log('Username:', username);
                    console.log('Password:', password);
                    console.log('⚠️  Please change these credentials after first login!');
                    
                    db.close();
                }
            );
        });
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

initializeAdmin();
