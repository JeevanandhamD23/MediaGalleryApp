const express = require('express');
const router = express.Router();
const upload = require('../lib/uploadService');
const routeWrapper = require('../utils/routeWrapper');
const videoRoutes = require('../routes/videoRoutes');

// GET all videos
router.get('/', routeWrapper(videoRoutes.getAllVideos));

// POST - Upload a new video
router.post('/', upload.single('video'), routeWrapper(videoRoutes.uploadVideo));

// Star/unstar video
router.patch('/:id/star', routeWrapper(videoRoutes.toggleStar));

// Move to trash
router.patch('/:id/trash', routeWrapper(videoRoutes.moveToTrash));

// Get trash items
router.get('/trash', routeWrapper(videoRoutes.getTrashItems));

// Restore from trash
router.patch('/:id/restore', routeWrapper(videoRoutes.restoreFromTrash));

// Permanent delete
router.delete('/:id/permanent', routeWrapper(videoRoutes.permanentDelete));

// Update video description
router.patch('/:id/description', routeWrapper(videoRoutes.updateDescription));

module.exports = router; 