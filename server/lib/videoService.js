const videoRepository = require('../db/videoRepository');
const fs = require('fs').promises;
const path = require('path');

class VideoService {
    async getAllVideos(query) {
        // Always filter for videos only
        query.mimetypePrefix = 'video/';
        return await videoRepository.findAll(query);
    }

    async createVideo(file, body) {
        if (!file) {
            throw new Error('No file uploaded');
        }

        const videoData = {
            title: body.title || file.originalname,
            url: `/uploads/${file.filename}`,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size
        };

        try {
            return await videoRepository.create(videoData);
        } catch (err) {
            // Cleanup file if database operation fails
            await fs.unlink(path.join(__dirname, '..', 'uploads', file.filename))
                .catch(console.error);
            throw err;
        }
    }

    async toggleStar(id) {
        const video = await videoRepository.findById(id);
        if (!video) {
            throw new Error('Video not found');
        }

        video.isStarred = !video.isStarred;
        return await videoRepository.update(id, video);
    }

    async moveToTrash(id) {
        const video = await videoRepository.findById(id);
        if (!video) {
            throw new Error('Video not found');
        }

        video.isDeleted = true;
        video.deletedAt = new Date();
        return await videoRepository.update(id, video);
    }

    async restoreFromTrash(id) {
        const video = await videoRepository.findById(id);
        if (!video) {
            throw new Error('Video not found');
        }

        video.isDeleted = false;
        video.deletedAt = null;
        return await videoRepository.update(id, video);
    }

    async getTrashVideos(query) {
        // Override any existing filter to only get trashed videos
        query.mimetypePrefix = 'video/';
        query.isTrash = true;
        return await videoRepository.findAll(query);
    }

    async permanentDelete(id) {
        const video = await videoRepository.findById(id);
        if (!video) {
            throw new Error('Video not found');
        }

        // Delete the file from the filesystem
        try {
            const filePath = path.join(__dirname, '..', 'uploads', video.filename);
            await fs.unlink(filePath);
        } catch (err) {
            console.error('Error deleting file:', err);
            // Continue with DB deletion even if file deletion fails
        }

        // Delete from database
        return await videoRepository.delete(id);
    }

    async getStarredVideos(query = {}) {
        try {
            // Use videoRepository instead of direct Video model
            const videos = await videoRepository.findAll({
                ...query,
                isStarred: true,
                isDeleted: { $ne: true }
            });

            return {
                videos: videos.videos || [], // Access the videos from the repository response
                pagination: {
                    total: videos.total || 0,
                    page: videos.page || 1,
                    pages: videos.pages || 1
                }
            };
        } catch (err) {
            console.error('Error getting starred videos:', err);
            throw err;
        }
    }

    async updateDescription(id, description) {
        try {
            console.log('Updating video description:', { id, description });
            const video = await videoRepository.findById(id);

            if (!video) {
                throw new Error('Video not found');
            }

            const updatedVideo = await videoRepository.update(id, { description });
            console.log('Video description updated:', updatedVideo);

            return updatedVideo;
        } catch (err) {
            console.error('Error updating video description:', err);
            throw err;
        }
    }
}

module.exports = new VideoService(); 