const multer = require('multer');
const path = require('path');

// Configure storage with absolute path
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', process.env.UPLOAD_PATH || 'uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Create unique filename with timestamp and original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
    // Accept images and videos only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|mp4|MP4)$/) && !file.mimetype.startsWith('video/')) {
        req.fileValidationError = 'Only image and video files are allowed!';
        return cb(new Error('Only image and video files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

module.exports = upload; 