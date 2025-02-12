const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const health = {
            uptime: process.uptime(),
            timestamp: Date.now(),
            status: 'OK',
            services: {
                database: 'NOT CHECKED',
                fileSystem: 'NOT CHECKED'
            }
        };

        // Check MongoDB connection
        if (mongoose.connection.readyState === 1) {
            health.services.database = 'OK';
        } else {
            health.services.database = 'DOWN';
            health.status = 'ERROR';
        }

        // Check uploads directory access
        try {
            const uploadsPath = path.join(__dirname, '..', 'uploads');
            await fs.access(uploadsPath, fs.constants.R_OK | fs.constants.W_OK);
            health.services.fileSystem = 'OK';
        } catch (err) {
            health.services.fileSystem = 'DOWN';
            health.status = 'ERROR';
        }

        // Add memory usage
        health.memory = {
            total: process.memoryUsage().heapTotal,
            used: process.memoryUsage().heapUsed,
            external: process.memoryUsage().external
        };

        const statusCode = health.status === 'OK' ? 200 : 503;
        res.status(statusCode).json(health);
    } catch (err) {
        res.status(500).json({
            status: 'ERROR',
            error: err.message
        });
    }
});

module.exports = router; 