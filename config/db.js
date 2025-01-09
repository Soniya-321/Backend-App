const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the SQLite database file
const dbPath = path.resolve(__dirname, '../db/database.db');

// Connect to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create the `users` table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      mobile_number TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_date TEXT DEFAULT (datetime('now')),
      created_by TEXT DEFAULT 'system',
      updated_date TEXT DEFAULT (datetime('now')),
      updated_by TEXT DEFAULT 'system'
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Users table created or already exists.');
    }
  });
});

// Export the database connection
module.exports = db;
