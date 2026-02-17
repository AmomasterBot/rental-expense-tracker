const { db } = require('../config/database');

class Expense {
  // Create a new expense
  static create(expenseData) {
    return new Promise((resolve, reject) => {
      const { property_id, category, description, amount, expense_date, receipt_file_id, notes } = expenseData;

      db.run(
        `INSERT INTO expenses (property_id, category, description, amount, expense_date, receipt_file_id, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [property_id, category, description || null, amount, expense_date, receipt_file_id || null, notes || null],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, ...expenseData });
          }
        }
      );
    });
  }

  // Get all expenses
  static getAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM expenses WHERE 1=1`;
      const params = [];

      if (filters.property_id) {
        query += ` AND property_id = ?`;
        params.push(filters.property_id);
      }

      if (filters.category) {
        query += ` AND category = ?`;
        params.push(filters.category);
      }

      if (filters.start_date) {
        query += ` AND expense_date >= ?`;
        params.push(filters.start_date);
      }

      if (filters.end_date) {
        query += ` AND expense_date <= ?`;
        params.push(filters.end_date);
      }

      query += ` ORDER BY expense_date DESC`;

      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  // Get expense by ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM expenses WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  // Update expense
  static update(id, expenseData) {
    return new Promise((resolve, reject) => {
      const { property_id, category, description, amount, expense_date, receipt_file_id, notes } = expenseData;

      db.run(
        `UPDATE expenses 
         SET property_id = ?, category = ?, description = ?, amount = ?, expense_date = ?, receipt_file_id = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [property_id, category, description || null, amount, expense_date, receipt_file_id || null, notes || null, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, ...expenseData });
          }
        }
      );
    });
  }

  // Delete expense
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM expenses WHERE id = ?`,
        [id],
        function (err) {
          if (err) reject(err);
          else resolve({ deleted: this.changes > 0 });
        }
      );
    });
  }

  // Get expenses by property
  static getByPropertyId(propertyId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM expenses WHERE property_id = ? ORDER BY expense_date DESC`,
        [propertyId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  // Get expense summary by category for a property
  static getCategorySum(propertyId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT category, COUNT(*) as count, SUM(amount) as total
         FROM expenses
         WHERE property_id = ?
         GROUP BY category
         ORDER BY total DESC`,
        [propertyId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }
}

module.exports = Expense;
