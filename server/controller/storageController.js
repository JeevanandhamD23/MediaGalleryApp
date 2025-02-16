const express = require('express');
const router = express.Router();
const storageService = require('../lib/storageService');
const { catchAsync, AppError } = require('../utils/errorHandler');

// Get storage stats
router.get('/stats', catchAsync(async (req, res) => {
    const stats = await storageService.getStats();
    if (!stats) {
        throw new AppError('Failed to get storage stats', 500);
    }
    res.json(stats);
}));

module.exports = router; 