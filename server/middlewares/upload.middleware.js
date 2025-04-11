/**
 * File upload middleware for Tracer App
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ApiError } = require('../utils/apiResponse');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  // Accept images, documents, and archives
  const allowedFileTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|zip|rar/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new ApiError(400, 'Only images, documents, and archives are allowed'));
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

/**
 * Handle single file upload
 * @param {String} fieldName - Name of the form field for the file
 * @returns {Function} Express middleware function
 */
const uploadSingleFile = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError(400, 'File too large. Maximum size is 10MB'));
        }
        return next(new ApiError(400, `Upload error: ${err.message}`));
      } else if (err) {
        // An unknown error occurred
        return next(err);
      }
      
      // File upload successful
      next();
    });
  };
};

/**
 * Handle multiple file upload
 * @param {String} fieldName - Name of the form field for the files
 * @param {Number} maxCount - Maximum number of files
 * @returns {Function} Express middleware function
 */
const uploadMultipleFiles = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError(400, 'File too large. Maximum size is 10MB'));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new ApiError(400, `Too many files. Maximum is ${maxCount}`));
        }
        return next(new ApiError(400, `Upload error: ${err.message}`));
      } else if (err) {
        // An unknown error occurred
        return next(err);
      }
      
      // File upload successful
      next();
    });
  };
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles
};