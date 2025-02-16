const imageService = require('./imageService');
const videoService = require('./videoService');

class MediaService {
    async getAllMedia(query = {}) {
        try {
            const { search, ...otherQuery } = query;

            // Get both images and videos with search
            const [imagesResult, videosResult] = await Promise.all([
                imageService.getAllImages({ ...otherQuery, search }),
                videoService.getAllVideos({ ...otherQuery, search })
            ]);

            // Combine and sort by createdAt
            const allMedia = [
                ...imagesResult.images.map(img => ({
                    ...this.sanitizeMedia(img.toObject()),
                    type: 'image'
                })),
                ...videosResult.videos.map(vid => ({
                    ...this.sanitizeMedia(vid.toObject()),
                    type: 'video'
                }))
            ].sort((a, b) => b.createdAt - a.createdAt);

            return {
                media: allMedia,
                pagination: {
                    total: allMedia.length,
                    page: 1,
                    pages: 1
                }
            };
        } catch (err) {
            console.error('Error getting all media:', err);
            throw err;
        }
    }

    async getStarredMedia(query = {}) {
        try {
            // Get starred items from both collections
            const [imagesResult, videosResult] = await Promise.all([
                imageService.getStarredImages(query),
                videoService.getStarredVideos(query)
            ]);

            // Combine and sort by createdAt
            const allMedia = [
                ...imagesResult.images.map(img => ({
                    ...this.sanitizeMedia(img.toObject()),
                    type: 'image'
                })),
                ...videosResult.videos.map(vid => ({
                    ...this.sanitizeMedia(vid.toObject()),
                    type: 'video'
                }))
            ].sort((a, b) => b.createdAt - a.createdAt);

            return {
                media: allMedia,
                pagination: {
                    total: allMedia.length,
                    page: 1,
                    pages: 1
                }
            };
        } catch (err) {
            console.error('Error getting starred media:', err);
            throw err;
        }
    }

    // Sanitize media object to remove unnecessary fields
    sanitizeMedia(media) {
        const { __v, ...sanitized } = media;
        return sanitized;
    }
}

module.exports = new MediaService(); 