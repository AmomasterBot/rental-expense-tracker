const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept specific file types
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/heic',
    'image/heif',
    'application/pdf'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: JPEG, PNG, HEIC, PDF`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// Middleware to convert HEIC to JPEG
async function convertHeicToJpeg(req, res, next) {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  const mimeType = req.file.mimetype;

  // Check if file is HEIC/HEIF format
  if (mimeType === 'image/heic' || mimeType === 'image/heif') {
    try {
      if (!process.env.ENABLE_HEIC_CONVERSION || process.env.ENABLE_HEIC_CONVERSION !== 'true') {
        return res.status(400).json({ error: 'HEIC conversion is disabled' });
      }

      const newFilePath = filePath.replace(/\.[^.]+$/, '.jpg');

      // Convert HEIC to JPEG using sharp
      await sharp(filePath)
        .jpeg({ quality: 90 })
        .toFile(newFilePath);

      // Delete original HEIC file
      fs.unlinkSync(filePath);

      // Update file info
      req.file.path = newFilePath;
      req.file.filename = path.basename(newFilePath);
      req.file.mimetype = 'image/jpeg';
      req.file.originalname = req.file.originalname.replace(/\.[^.]+$/, '.jpg');
    } catch (error) {
      // Clean up failed conversion
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(500).json({ error: 'Failed to convert HEIC file: ' + error.message });
    }
  }

  next();
}

// Error handling middleware for multer
function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    // Multer error codes: LIMIT_FILE_SIZE, FILE_TOO_LARGE (different versions)
    if (err.code === 'FILE_TOO_LARGE' || err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File size exceeds maximum limit of 10MB' });
    }
    if (err.code === 'LIMIT_PART_COUNT') {
      return res.status(400).json({ error: 'Too many parts' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
}

module.exports = {
  upload,
  convertHeicToJpeg,
  handleMulterError
};
