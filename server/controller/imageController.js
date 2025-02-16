const express = require('express');
const router = express.Router();
const upload = require('../lib/uploadService');
const routeWrapper = require('../utils/routeWrapper');
const imageRoutes = require('../routes/imageRoutes');

// GET all images
router.get('/', routeWrapper(imageRoutes.getAllImages));

// GET all images (non-video files)
router.get('/images', routeWrapper(imageRoutes.getFilteredImages));

// POST - Upload a new image
router.post('/', upload.single('photo'), routeWrapper(imageRoutes.uploadImage));

// Toggle star status
router.patch('/:id/star', routeWrapper(imageRoutes.toggleStar));

// Move to trash
router.patch('/:id/trash', routeWrapper(imageRoutes.moveToTrash));

// Get trash items
router.get('/trash', routeWrapper(imageRoutes.getTrashItems));

// Restore from trash
router.patch('/:id/restore', routeWrapper(imageRoutes.restoreFromTrash));

// Permanent delete
router.delete('/:id/permanent', routeWrapper(imageRoutes.permanentDelete));

// Update image description
router.patch('/:id/description', routeWrapper(imageRoutes.updateDescription));

module.exports = router; 