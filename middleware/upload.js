const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// Check file type (images and videos)
function checkFileType(file, cb) {
  // Allowed types: images (jpeg, jpg, png, gif, webp) and videos (mp4, mov, avi, mkv, webm, etc.)
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv|webm/;

  const extnameMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetypeMatch = allowedTypes.test(file.mimetype.toLowerCase());

  if (extnameMatch && mimetypeMatch) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) and videos (mp4, mov, avi, mkv, webm) are allowed!'));
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max file size
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
});

module.exports = upload;