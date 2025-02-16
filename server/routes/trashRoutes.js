const binService = require('../lib/binService');
const { AppError } = require('../utils/errorHandler');

const getAllTrashItems = async (req, res) => {
    const trashItems = await binService.getTrashItems(req.query);

    // Format the response
    const formattedItems = trashItems.map(item => ({
        ...item.toObject(),
        originalCollection: item.mimetype.startsWith('video/') ? 'videos' : 'images'
    }));

    res.json({
        items: formattedItems,
        pagination: {
            total: trashItems.length,
            page: 1,
            pages: 1
        }
    });
};

const restoreItem = async (req, res) => {
    const restoredItem = await binService.restoreFromTrash(req.params.id);
    if (!restoredItem) {
        throw new AppError('Item not found in trash', 404);
    }
    res.json(restoredItem);
};

const deleteItem = async (req, res) => {
    await binService.permanentDelete(req.params.id);
    res.json({ code: 200, message: 'Item permanently deleted' });
};

const emptyTrash = async (req, res) => {
    await binService.emptyTrash();
    res.json({ code: 200, message: 'Trash emptied successfully' });
};

module.exports = {
    getAllTrashItems,
    restoreItem,
    deleteItem,
    emptyTrash
}; 