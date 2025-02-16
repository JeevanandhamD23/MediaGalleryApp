const imageRepository = require('../db/imageRepository');
const { AppError } = require('../utils/errorHandler');
const fs = require('fs').promises;
const path = require('path');

class ImageService {
    async getAllImages(query = {}) {
        try {
            return await imageRepository.findAll(query);
        } catch (err) {
            throw new AppError('Failed to fetch images', 500);
        }
    }

    async createImage(file, body) {
        if (!file) {
            throw new AppError('No file uploaded', 400);
        }

        const imageData = {
            title: body.title || file.originalname,
            url: `/uploads/${file.filename}`,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size
        };

        try {
            return await imageRepository.create(imageData);
        } catch (err) {
            // Cleanup file if database operation fails
            await fs.unlink(path.join(__dirname, '..', 'uploads', file.filename))
                .catch(() => { });
            throw new AppError('Failed to create image', 500);
        }
    }

    async toggleStar(id) {
        const image = await imageRepository.findById(id);
        if (!image) {
            throw new AppError('Image not found', 404);
        }

        try {
            image.isStarred = !image.isStarred;
            return await imageRepository.update(id, image);
        } catch (err) {
            throw new AppError('Failed to update star status', 500);
        }
    }

    async moveToTrash(id) {
        const image = await imageRepository.findById(id);
        if (!image) {
            throw new AppError('Image not found', 404);
        }

        try {
            image.isDeleted = true;
            image.deletedAt = new Date();
            return await imageRepository.update(id, image);
        } catch (err) {
            throw new AppError('Failed to move image to trash', 500);
        }
    }

    async restoreFromTrash(id) {
        const image = await imageRepository.findById(id);
        if (!image) {
            throw new Error('Image not found');
        }

        image.isDeleted = false;
        image.deletedAt = null;
        return await imageRepository.update(id, image);
    }

    async getTrashImages(query) {
        // Override any existing filter to only get trashed images
        query.mimetypePrefix = 'image/';
        query.isTrash = true;
        return await imageRepository.findAll(query);
    }

    async permanentDelete(id) {
        const image = await imageRepository.findById(id);
        if (!image) {
            throw new Error('Image not found');
        }

        // Delete the file from the filesystem
        try {
            const filePath = path.join(__dirname, '..', 'uploads', image.filename);
            await fs.unlink(filePath);
        } catch (err) {
            console.error('Error deleting file:', err);
            // Continue with DB deletion even if file deletion fails
        }

        // Delete from database
        return await imageRepository.delete(id);
    }

    async getStarredImages(query = {}) {
        try {
            const images = await imageRepository.findAll({
                ...query,
                isStarred: true,
                isDeleted: { $ne: true }
            });

            return {
                images: images.images || [],
                pagination: {
                    total: images.total || 0,
                    page: images.page || 1,
                    pages: images.pages || 1
                }
            };
        } catch (err) {
            console.error('Error getting starred images:', err);
            throw err;
        }
    }

    async updateDescription(id, description) {
        const image = await imageRepository.findById(id);
        if (!image) {
            throw new AppError('Image not found', 404);
        }

        try {
            return await imageRepository.update(id, { description });
        } catch (err) {
            throw new AppError('Failed to update description', 500);
        }
    }
}

module.exports = new ImageService(); 