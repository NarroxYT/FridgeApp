# 🥤 Smart Fridge Drink Tracker

A modern web application for tracking drinks taken from a shared fridge. Perfect for offices, shared spaces, or any environment with a communal fridge.

## ✨ Features

- 📱 Modern, responsive interface
- 👥 User management
- 🥤 Drink tracking
- 💰 Price tracking
- 👑 Admin dashboard
- 📊 Transaction history
- 🔐 Secure authentication

## 🛠️ Tech Stack

- Frontend: HTML, JavaScript, Bootstrap 5
- Backend: Node.js, Express
- Database: SQLite3
- Template Engine: EJS

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd fridge-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   PORT=3000
   SESSION_SECRET=your-secret-key
   ```

4. Initialize the admin account:
   ```bash
   node scripts/init-admin.js
   ```
   This will create an admin account with the following credentials:
   - Username: admin
   - Password: admin123
   (Make sure to change these credentials after first login)

5. Start the application:
   ```bash
   npm start
   ```

6. Visit `http://localhost:3000` in your browser

## 📱 Usage

1. **Taking Drinks**
   - Select a drink from the main page
   - Enter the quantity
   - Select your user
   - Confirm the transaction

2. **Viewing History**
   - Click the Information button in the sidebar
   - Select your user to view your drink history

3. **Admin Portal**
   - Click the Admin Portal button in the sidebar
   - Login with admin credentials
   - Manage users, drinks, and view transactions

## 🔒 Security

- Admin portal is password protected
- Session-based authentication
- Password hashing using bcrypt
- SQL injection protection

## 🔧 Maintenance

The SQLite database file (`fridge.db`) is located in the root directory. Regular backups are recommended.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
