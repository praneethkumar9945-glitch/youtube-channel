const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file in the current directory
const dbPath = path.join(__dirname, 'internshiphub.db');
const db = new sqlite3.Database(dbPath);

// Initialize tables
db.serialize(() => {
  // Users table for authentication
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Interns table for applications
  db.run(`
    CREATE TABLE IF NOT EXISTS interns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      college TEXT NOT NULL,
      domain TEXT NOT NULL,
      start_date TEXT NOT NULL,
      note TEXT,
      resume_name TEXT,
      resume_data TEXT,
      status TEXT DEFAULT 'pending',
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Testimonials table (for future expansion)
  db.run(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      domain TEXT NOT NULL,
      batch TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default admin user if not exists
  db.get("SELECT * FROM users WHERE email = ?", ['admin@example.com'], (err, row) => {
    if (!row) {
      const bcrypt = require('bcrypt');
      bcrypt.hash('admin123', 10, (err, hash) => {
        if (!err) {
          db.run("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
            ['admin@example.com', hash, 'Admin', 'admin']);
        }
      });
    }
  });
});

module.exports = db;
