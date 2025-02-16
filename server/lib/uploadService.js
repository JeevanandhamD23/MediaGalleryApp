const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const createUploadsDir = () => {
    const uploadPath = path.join(__dirname, '..', process.env.UPLOAD_PATH || 'uploads');
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
    return uploadPath;
};

// Configure storage with absolute path
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = createUploadsDir();
        console.log('Upload destination:', uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        console.log('Incoming file:', file);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        console.log('Generated filename:', filename);
        cb(null, filename);
    }
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
    console.log('Filtering file:', file);
    // Accept images and videos only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|mp4|MP4)$/) && !file.mimetype.startsWith('video/')) {
        const error = new Error('Only image and video files are allowed!');
        console.error('File filter error:', error.message);
        req.fileValidationError = error.message;
        return cb(error, false);
    }
    cb(null, true);
};

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({
            message: 'File upload error',
            error: err.message
        });
    }
    next(err);
};

// Configure multer with storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB file size limit
    }
});

module.exports = upload; 