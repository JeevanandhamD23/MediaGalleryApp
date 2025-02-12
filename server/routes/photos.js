const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');
const upload = require('../utils/upload');
const path = require('path');
const fs = require('fs').promises;

// GET all photos
router.get('/', async (req, res) => {
    try {
        const {
            startDate,
            endDate,
            search,
            mimetype,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            limit = 0,  // 0 means no limit
            page = 1
        } = req.query;

        // Build filter object
        const filter = {
            isDeleted: { $ne: true }  // Changed this line to use $ne operator
        };

        if (search) {
            filter.description = { $regex: search, $options: 'i' };
        }

        if (mimetype) {
            filter.mimetype = mimetype;
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        console.log('Filter:', filter); // Add logging

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Only apply limit and skip if limit is specified
        let query = Photo.find(filter).sort(sort);

        if (limit > 0) {
            const skip = (page - 1) * limit;
            query = query.limit(Number(limit)).skip(skip);
        }

        // Execute query
        const photos = await query;

        console.log('Found photos:', photos.length); // Add logging

        // Get total count for pagination
        const total = await Photo.countDocuments(filter);

        res.json({
            photos,
            pagination: {
                total,
                page: Number(page),
                pages: limit > 0 ? Math.ceil(total / limit) : 1
            }
        });
    } catch (err) {
        console.error('Error in GET /:', err); // Add error logging
        res.status(500).json({ message: err.message });
    }
});

// GET - Fetch starred photos
router.get('/starred', async (req, res) => {
    try {
        const filter = {
            isStarred: true,
            isDeleted: { $ne: true }  // Changed this line to use $ne operator
        };

        console.log('Starred filter:', filter); // Add logging

        const photos = await Photo.find(filter).sort({ createdAt: -1 });

        console.log('Found starred photos:', photos.length); // Add logging

        res.json({ photos });
    } catch (err) {
        console.error('Error in GET /starred:', err); // Add error logging
        res.status(500).json({ message: err.message });
    }
});


// GET - Fetch trash photos
router.get('/trash', async (req, res) => {
    try {
        const photos = await Photo.find({ isDeleted: true })
            .sort({ deletedAt: -1 });
        res.json({ photos });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST - Upload a new photo
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const photo = new Photo({
            title: req.body.title || req.file.originalname,
            url: `/uploads/${req.file.filename}`,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        const newPhoto = await photo.save();
        res.status(201).json(newPhoto);

    } catch (err) {
        // If there's an error, clean up the uploaded file
        if (req.file) {
            const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
            await fs.unlink(filePath).catch(console.error);
        }
        res.status(400).json({ message: err.message });
    }
});


// GET - Fetch images only
router.get('/images', async (req, res) => {
    try {
        const { search } = req.query;
        const filter = {
            isDeleted: { $ne: true },
            mimetype: { $regex: '^image/' }
        };

        if (search) {
            filter.description = { $regex: search, $options: 'i' };
        }

        const images = await Photo.find(filter).sort({ createdAt: -1 });
        res.json({ photos: images });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET - Fetch videos only
router.get('/videos', async (req, res) => {
    try {
        const { search } = req.query;
        const filter = {
            isDeleted: { $ne: true },
            mimetype: { $regex: '^video/' }
        };

        if (search) {
            filter.description = { $regex: search, $options: 'i' };
        }

        const videos = await Photo.find(filter).sort({ createdAt: -1 });
        res.json({ photos: videos });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET - Get a single photo by ID
router.get('/:id', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        // Add full URL to the response
        const fullUrl = `${req.protocol}://${req.get('host')}${photo.url}`;
        const photoWithFullUrl = {
            ...photo.toObject(),
            fullUrl
        };

        res.json(photoWithFullUrl);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET - Stream the actual photo file
router.get('/file/:filename', async (req, res) => {
    try {
        const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Send file
        res.sendFile(filePath);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE - Delete a photo
router.delete('/:id', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        // Delete file from uploads directory
        const filePath = path.join(__dirname, '..', 'uploads', photo.filename);
        await fs.unlink(filePath);

        // Delete from database
        await Photo.deleteOne({ _id: req.params.id });

        res.json({ message: 'Photo deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH - Toggle star status
router.patch('/:id/star', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        photo.isStarred = !photo.isStarred;
        await photo.save();

        res.json(photo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// PATCH - Move to trash
router.patch('/:id/trash', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        photo.isDeleted = true;
        photo.deletedAt = new Date();
        await photo.save();

        res.json(photo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH - Restore from trash
router.patch('/:id/restore', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        photo.isDeleted = false;
        photo.deletedAt = null;
        await photo.save();

        res.json(photo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH - Update photo description
router.patch('/:id/description', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        photo.description = req.body.description;
        await photo.save();

        res.json(photo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE - Permanently delete a photo
router.delete('/:id/permanent', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        // Delete file from uploads directory
        const filePath = path.join(__dirname, '..', 'uploads', photo.filename);
        await fs.unlink(filePath);

        // Delete from database
        await Photo.deleteOne({ _id: req.params.id });

        res.json({ message: 'Photo permanently deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET - Storage statistics
router.get('/storage/stats', async (req, res) => {
    try {
        const photos = await Photo.find({ isDeleted: { $ne: true } });

        const stats = {
            totalSize: 0,
            imageSize: 0,
            videoSize: 0,
            limit: 1000 * 1024 * 1024, // 1000MB in bytes
            files: {
                images: 0,
                videos: 0
            }
        };

        photos.forEach(photo => {
            if (photo.mimetype.startsWith('video/')) {
                stats.videoSize += photo.size;
                stats.files.videos++;
            } else if (photo.mimetype.startsWith('image/')) {
                stats.imageSize += photo.size;
                stats.files.images++;
            }
            stats.totalSize += photo.size;
        });

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router; 