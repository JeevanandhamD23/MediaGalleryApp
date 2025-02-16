const mediaService = require('../lib/mediaService');
const { AppError } = require('../utils/errorHandler');

const getAllMedia = async (req, res) => {
    const media = await mediaService.getAllMedia(req.query);
    res.json(media);
};

const getStarredMedia = async (req, res) => {
    const starredMedia = await mediaService.getStarredMedia(req.query);
    res.json(starredMedia);
};

const getStorageStats = async (req, res) => {
    const stats = await mediaService.getStorageStats();
    if (!stats) {
        throw new AppError('Failed to get storage stats', 500);
    }
    res.json(stats);
};

module.exports = {
    getAllMedia,
    getStarredMedia,
    getStorageStats
}; 