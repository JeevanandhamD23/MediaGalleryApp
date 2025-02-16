const Video = require('../presentator/videoModel');

class VideoRepository {
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
                filter.description = { $regex: search, $options: 'i' };
            }

            console.log('MongoDB filter:', filter);
            const sort = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

            const videos = await Video.find(filter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit > 0 ? limit : 0);

            const total = await Video.countDocuments(filter);

            return {
                videos,
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

    async create(videoData) {
        const video = new Video(videoData);
        return await video.save();
    }

    async findById(id) {
        return await Video.findById(id);
    }

    async update(id, videoData) {
        try {
            console.log('Updating video:', id, videoData);
            const updatedVideo = await Video.findByIdAndUpdate(
                id,
                videoData,
                { new: true }
            );
            console.log('Updated video:', updatedVideo);
            return updatedVideo;
        } catch (err) {
            console.error('Error updating video:', err);
            throw err;
        }
    }

    async delete(id) {
        try {
            console.log('Deleting video:', id);
            const result = await Video.findByIdAndDelete(id);
            console.log('Delete result:', result);
            return result;
        } catch (err) {
            console.error('Error deleting video:', err);
            throw err;
        }
    }

    async updateDescription(id, description) {
        try {
            const video = await Video.findByIdAndUpdate(
                id,
                { description },
                { new: true }
            );

            if (!video) {
                throw new Error('Video not found');
            }

            return video;
        } catch (err) {
            console.error('Error in video repository - updateDescription:', err);
            throw err;
        }
    }
}

module.exports = new VideoRepository(); 