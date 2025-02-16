const Image = require('../presentator/imageModel');

class ImageRepository {
    async findAll(query = {}) {
        try {
            console.log('Repository query:', query);
            const {
                search,
                mimetypePrefix,
                isTrash,
                isStarred,
                sortBy = 'createdAt',
                sortOrder = 'desc',
                limit = 0,
                page = 1
            } = query;

            const filter = {
                isDeleted: isTrash === true
            };

            if (mimetypePrefix) {
                filter.mimetype = { $regex: `^${mimetypePrefix}` };
            }

            if (isStarred !== undefined) {
                filter.isStarred = isStarred;
            }

            if (search) {
                filter.$or = [
                    { description: { $regex: search, $options: 'i' } },
                    { title: { $regex: search, $options: 'i' } }
                ];
            }

            console.log('MongoDB filter:', filter);
            const sort = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

            const images = await Image.find(filter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit > 0 ? limit : 0);

            const total = await Image.countDocuments(filter);

            return {
                images,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: limit > 0 ? Math.ceil(total / limit) : 1
                }
            };
        } catch (err) {
            console.error('Error in findAll:', err);
            throw err;
        }
    }

    async create(imageData) {
        const image = new Image(imageData);
        return await image.save();
    }

    async findById(id) {
        return await Image.findById(id);
    }

    async update(id, imageData) {
        try {
            console.log('Updating image:', id, imageData);
            const updatedImage = await Image.findByIdAndUpdate(
                id,
                imageData,
                { new: true }
            );
            console.log('Updated image:', updatedImage);
            return updatedImage;
        } catch (err) {
            console.error('Error updating image:', err);
            throw err;
        }
    }

    async delete(id) {
        try {
            console.log('Deleting image:', id);
            const result = await Image.findByIdAndDelete(id);
            console.log('Delete result:', result);
            return result;
        } catch (err) {
            console.error('Error deleting image:', err);
            throw err;
        }
    }
}

module.exports = new ImageRepository(); 