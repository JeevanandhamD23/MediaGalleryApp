const { AppError } = require('../utils/errorHandler');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }

    // Handle specific error types
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            code: err.statusCode,
            message: err.message
        });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            code: 400,
            message: Object.values(err.errors).map(e => e.message).join(', ')
        });
    }

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            code: 400,
            message: 'Invalid ID format'
        });
    }

    // Handle file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            code: 400,
            message: 'File too large'
        });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
        return res.status(409).json({
            code: 409,
            message: 'Duplicate entry found'
        });
    }

    // Default error
    return res.status(500).json({
        code: 500,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler; 