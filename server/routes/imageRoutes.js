const imageService = require('../lib/imageService');
const binService = require('../lib/binService');
const { AppError } = require('../utils/errorHandler');

// Route handler functions
const getAllImages = async (req, res) => {
    const images = await imageService.getAllImages(req.query);
    res.json(images);
};

const getFilteredImages = async (req, res) => {
    const query = {
        ...req.query,
        mediaType: 'image'
    };
    const images = await imageService.getAllImages(query);
    res.json(images);
};

const uploadImage = async (req, res) => {
    if (!req.file) {
        throw new AppError('No file uploaded', 400);
    }
    const newImage = await imageService.createImage(req.file, req.body);
    res.status(201).json(newImage);
};

const toggleStar = async (req, res) => {
    const image = await imageService.toggleStar(req.params.id);
    if (!image) {
        throw new AppError('Image not found', 404);
    }
    res.json(image);
};

const moveToTrash = async (req, res) => {
    const trashedItem = await binService.moveToTrash(req.params.id, 'image');
    if (!trashedItem) {
        throw new AppError('Image not found', 404);
    }
    res.json(trashedItem);
};

const getTrashItems = async (req, res) => {
    const query = { originalCollection: 'images' };
    const trashItems = await binService.getTrashItems(query);
    res.json(trashItems);
};

const restoreFromTrash = async (req, res) => {
    const restoredItem = await binService.restoreFromTrash(req.params.id);
    if (!restoredItem) {
        throw new AppError('Image not found', 404);
    }
    res.json(restoredItem);
};

const permanentDelete = async (req, res) => {
    await binService.permanentDelete(req.params.id);
    res.json({ code: 200, message: 'Image permanently deleted' });
};

const updateDescription = async (req, res) => {
    const { description } = req.body;
    const image = await imageService.updateDescription(req.params.id, description);
    if (!image) {
        throw new AppError('Image not found', 404);
    }
    res.json(image);
};

module.exports = {
    getAllImages,
    getFilteredImages,
    uploadImage,
    toggleStar,
    moveToTrash,
    getTrashItems,
    restoreFromTrash,
    permanentDelete,
    updateDescription
}; 