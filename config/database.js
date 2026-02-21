const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || './database.sqlite';

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create and configure database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    // Enable foreign key constraints for cascading deletes
    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (err) {
        console.error('Error enabling foreign keys:', err);
      } else {
        console.log('Foreign key constraints enabled');
      }
    });
  }
});

// Initialize tables
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Properties table
      db.run(`
        CREATE TABLE IF NOT EXISTS properties (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          address TEXT NOT NULL UNIQUE,
          city TEXT NOT NULL,
          state TEXT NOT NULL,
          zip_code TEXT NOT NULL,
          property_type TEXT,
          acquisition_date TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating properties table:', err);
      });

      // Expenses table
      db.run(`
        CREATE TABLE IF NOT EXISTS expenses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          property_id INTEGER NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          amount REAL NOT NULL,
          expense_date TEXT NOT NULL,
          receipt_file_id INTEGER,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
          FOREIGN KEY (receipt_file_id) REFERENCES files(id) ON DELETE SET NULL
        )
      `, (err) => {
        if (err) console.error('Error creating expenses table:', err);
      });

      // Files table
      db.run(`
        CREATE TABLE IF NOT EXISTS files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          original_filename TEXT NOT NULL,
          stored_filename TEXT NOT NULL,
          file_type TEXT,
          file_size INTEGER,
          file_path TEXT NOT NULL,
          mime_type TEXT,
          expense_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.error('Error creating files table:', err);
      });

      // Categories lookup table
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating categories table:', err);
      });

      // Insert default categories
      const defaultCategories = [
        { name: 'Mortgage/Rent', description: 'Mortgage payments or rent' },
        { name: 'Property Tax', description: 'Annual property taxes' },
        { name: 'Insurance', description: 'Homeowners or property insurance' },
        { name: 'Maintenance', description: 'Repairs and maintenance' },
        { name: 'Utilities', description: 'Electricity, water, gas' },
        { name: 'Management Fees', description: 'Property management fees' },
        { name: 'HOA Fees', description: 'Homeowners association fees' },
        { name: 'Advertising', description: 'Advertising for tenants' },
        { name: 'Legal/Professional', description: 'Legal and professional fees' },
        { name: 'Supplies', description: 'Office and general supplies' }
      ];

      defaultCategories.forEach(cat => {
        db.run(
          `INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)`,
          [cat.name, cat.description],
          (err) => {
            if (err && !err.message.includes('UNIQUE')) {
              console.error('Error inserting category:', err);
            }
          }
        );
      });

      db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database initialized successfully. Tables:', tables.map(t => t.name).join(', '));
          resolve();
        }
      });
    });
  });
}

module.exports = {
  db,
  initializeDatabase
};
