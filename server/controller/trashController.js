const express = require('express');
const router = express.Router();
const routeWrapper = require('../utils/routeWrapper');
const trashRoutes = require('../routes/trashRoutes');

// Get all trash items
router.get('/', routeWrapper(trashRoutes.getAllTrashItems));

// Restore item from trash
router.patch('/:id/restore', routeWrapper(trashRoutes.restoreItem));

// Permanently delete item
router.delete('/:id', routeWrapper(trashRoutes.deleteItem));

// Empty trash
router.delete('/', routeWrapper(trashRoutes.emptyTrash));

module.exports = router; 