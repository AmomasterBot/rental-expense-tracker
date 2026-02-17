const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { upload, convertHeicToJpeg, handleMulterError } = require('../middleware/fileUpload');
const { db } = require('../config/database');

// POST /api/upload - Upload a file
router.post(
  '/',
  upload.single('file'),
  handleMulterError,
  convertHeicToJpeg,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const { expense_id } = req.body;

      // Insert file metadata into database
      const fileRecord = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO files (original_filename, stored_filename, file_type, file_size, file_path, mime_type, expense_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            req.file.originalname,
            req.file.filename,
            path.extname(req.file.originalname).substring(1),
            req.file.size,
            req.file.path,
            req.file.mimetype,
            expense_id || null
          ],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({
                id: this.lastID,
                original_filename: req.file.originalname,
                stored_filename: req.file.filename,
                file_size: req.file.size,
                mime_type: req.file.mimetype
              });
            }
          }
        );
      });

      res.status(201).json({
        message: 'File uploaded successfully',
        file: fileRecord
      });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: error.message });
    }
  }
);

// GET /api/files/:id - Download a file
router.get('/:id', async (req, res) => {
  try {
    const fileRecord = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM files WHERE id = ?`,
        [req.params.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!fileRecord) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = fileRecord.file_path;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    // Send file
    res.download(filePath, fileRecord.original_filename);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/files/:id - Delete a file
router.delete('/:id', async (req, res) => {
  try {
    const fileRecord = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM files WHERE id = ?`,
        [req.params.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!fileRecord) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete file from disk
    const filePath = fileRecord.file_path;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete file record from database
    await new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM files WHERE id = ?`,
        [req.params.id],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.status(200).json({
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/files - Get all files (optional: filter by expense_id)
router.get('/', async (req, res) => {
  try {
    let query = `SELECT * FROM files WHERE 1=1`;
    const params = [];

    if (req.query.expense_id) {
      query += ` AND expense_id = ?`;
      params.push(req.query.expense_id);
    }

    query += ` ORDER BY created_at DESC`;

    const files = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    res.status(200).json({
      count: files.length,
      files
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
