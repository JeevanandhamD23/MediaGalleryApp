const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();
const { handleError } = require('./utils/errorHandler');
const errorHandler = require('./middleware/errorMiddleware');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, process.env.UPLOAD_PATH || 'uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
        // Add test query to verify connection
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        // After successful connection
        mongoose.connection.on('connected', async () => {
            try {
                const db = mongoose.connection.db;
                const collections = await db.listCollections().toArray();
                console.log('Connected to database:', mongoose.connection.name);
                console.log('Collections:', collections.map(c => c.name));

                // Check if we have any documents
                if (collections.find(c => c.name === 'images')) {
                    const count = await db.collection('images').countDocuments();
                    console.log('Number of documents in images collection:', count);
                }
            } catch (err) {
                console.error('Error checking database:', err);
            }
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Routes
const imageController = require('./controller/imageController');
const videoController = require('./controller/videoController');
const mediaController = require('./controller/mediaController');
const trashController = require('./controller/trashController');

// Media routes
app.use('/api/media', mediaController);     // For getting all media
app.use('/api/images', imageController);    // For image-specific operations
app.use('/api/videos', videoController);    // For video-specific operations
app.use('/api/trash', trashController);     // For trash operations

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer().catch(console.error);

module.exports = app; // For testing purposes 