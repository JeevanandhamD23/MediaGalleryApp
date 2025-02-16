const videoService = require('../lib/videoService');
const binService = require('../lib/binService');
const { AppError } = require('../utils/errorHandler');

const getAllVideos = async (req, res) => {
    const videos = await videoService.getAllVideos(req.query);
    res.json(videos);
};

const uploadVideo = async (req, res) => {
    if (!req.file) {
        throw new AppError('No file uploaded', 400);
    }
    const newVideo = await videoService.createVideo(req.file, req.body);
    res.status(201).json(newVideo);
};

const toggleStar = async (req, res) => {
    const video = await videoService.toggleStar(req.params.id);
    if (!video) {
        throw new AppError('Video not found', 404);
    }
    res.json(video);
};

const moveToTrash = async (req, res) => {
    const trashedItem = await binService.moveToTrash(req.params.id, 'video');
    if (!trashedItem) {
        throw new AppError('Video not found', 404);
    }
    res.json(trashedItem);
};

const getTrashItems = async (req, res) => {
    const query = { originalCollection: 'videos' };
    const trashItems = await binService.getTrashItems(query);
    res.json(trashItems);
};

const restoreFromTrash = async (req, res) => {
    const restoredItem = await binService.restoreFromTrash(req.params.id);
    if (!restoredItem) {
        throw new AppError('Video not found', 404);
    }
    res.json(restoredItem);
};

const permanentDelete = async (req, res) => {
    await binService.permanentDelete(req.params.id);
    res.json({ code: 200, message: 'Video permanently deleted' });
};

const updateDescription = async (req, res) => {
    const { description } = req.body;
    const video = await videoService.updateDescription(req.params.id, description);
    if (!video) {
        throw new AppError('Video not found', 404);
    }
    res.json(video);
};

module.exports = {
    getAllVideos,
    uploadVideo,
    toggleStar,
    moveToTrash,
    getTrashItems,
    restoreFromTrash,
    permanentDelete,
    updateDescription
}; 