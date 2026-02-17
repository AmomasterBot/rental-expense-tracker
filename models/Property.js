const { db } = require('../config/database');

class Property {
  // Create a new property
  static create(propertyData) {
    return new Promise((resolve, reject) => {
      const { address, city, state, zip_code, property_type, acquisition_date, notes } = propertyData;

      db.run(
        `INSERT INTO properties (address, city, state, zip_code, property_type, acquisition_date, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [address, city, state, zip_code, property_type || null, acquisition_date || null, notes || null],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, ...propertyData });
          }
        }
      );
    });
  }

  // Get all properties
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM properties ORDER BY address ASC`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  // Get property by ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM properties WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  // Update property
  static update(id, propertyData) {
    return new Promise((resolve, reject) => {
      const { address, city, state, zip_code, property_type, acquisition_date, notes } = propertyData;

      db.run(
        `UPDATE properties 
         SET address = ?, city = ?, state = ?, zip_code = ?, property_type = ?, acquisition_date = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [address, city, state, zip_code, property_type || null, acquisition_date || null, notes || null, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, ...propertyData });
          }
        }
      );
    });
  }

  // Delete property
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM properties WHERE id = ?`,
        [id],
        function (err) {
          if (err) reject(err);
          else resolve({ deleted: this.changes > 0 });
        }
      );
    });
  }

  // Get property with expense summary
  static getWithSummary(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT p.*, 
                COUNT(e.id) as expense_count,
                COALESCE(SUM(e.amount), 0) as total_expenses
         FROM properties p
         LEFT JOIN expenses e ON p.id = e.property_id
         WHERE p.id = ?
         GROUP BY p.id`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }
}

module.exports = Property;
