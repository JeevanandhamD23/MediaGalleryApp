const Bin = require('../presentator/binModel');
const Image = require('../presentator/imageModel');
const Video = require('../presentator/videoModel');
const fs = require('fs').promises;
const path = require('path');
const { AppError } = require('../utils/errorHandler');

class BinService {
    async moveToTrash(id, type) {
        try {
            // Determine the correct collection based on mimetype
            const originalItem = type === 'video'
                ? await Video.findById(id)
                : await Image.findById(id);

            if (!originalItem) {
                throw new AppError(`${type} not found`, 404);
            }

            // Set the correct originalCollection based on mimetype
            const originalCollection = originalItem.mimetype.startsWith('video/')
                ? 'videos'
                : 'images';

            const trashItem = new Bin({
                originalId: id,
                originalCollection,
                ...originalItem.toObject(),
                _id: undefined,  // Don't copy the original _id
                deletedAt: new Date()
            });

            await trashItem.save();

            // Update the original item's isDeleted status
            originalItem.isDeleted = true;
            originalItem.deletedAt = new Date();
            await originalItem.save();

            return trashItem;
        } catch (err) {
            throw new AppError(`Failed to move ${type} to trash`, 500);
        }
    }

    async restoreFromTrash(id) {
        try {
            const binItem = await Bin.findById(id);
            if (!binItem) {
                throw new AppError('Item not found in trash', 404);
            }

            // Determine the original model
            const Model = binItem.originalCollection === 'videos' ? Video : Image;

            // Create new document in original collection
            const restoredItem = new Model({
                _id: binItem.originalId,
                title: binItem.title,
                description: binItem.description,
                url: binItem.url,
                filename: binItem.filename,
                mimetype: binItem.mimetype,
                size: binItem.size,
                isStarred: binItem.isStarred
            });

            // Save to original collection
            await restoredItem.save();

            // Remove from bin
            await Bin.findByIdAndDelete(id);

            return restoredItem;
        } catch (err) {
            throw new AppError('Failed to restore item from trash', 500);
        }
    }

    async permanentDelete(id) {
        try {
            const binItem = await Bin.findById(id);
            if (!binItem) {
                throw new AppError('Item not found in trash', 404);
            }

            // Delete the actual file
            const filePath = path.join(__dirname, '..', 'uploads', binItem.filename);
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error('Error deleting file:', err);
            }

            // Remove from bin
            await Bin.findByIdAndDelete(id);

            return { message: 'Item permanently deleted' };
        } catch (err) {
            throw new AppError('Failed to permanently delete item', 500);
        }
    }

    async getTrashItems(query = {}) {
        try {
            const items = await Bin.find(query).sort({ deletedAt: -1 });

            // Return just the items array, let the route handler format the response
            return items;

        } catch (err) {
            throw new AppError('Failed to fetch trash items', 500);
        }
    }
}

module.exports = new BinService(); 