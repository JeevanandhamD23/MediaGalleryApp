const express = require('express');
const router = express.Router();
const routeWrapper = require('../utils/routeWrapper');
const mediaRoutes = require('../routes/mediaRoutes');

// GET all media
router.get('/', routeWrapper(mediaRoutes.getAllMedia));

// GET starred items
router.get('/starred', routeWrapper(mediaRoutes.getStarredMedia));

// Get storage stats
router.get('/storage/stats', routeWrapper(mediaRoutes.getStorageStats));

module.exports = router; 